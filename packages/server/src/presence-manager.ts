// ============================================================
// ping-zero — Presence Manager
// Tracks user online/offline status and notifies subscribers.
// ============================================================

import type { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
} from "@ping-zero/prisma";
import type { PingZeroDatabase } from "@ping-zero/prisma";

type PZSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type PZServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

/**
 * PresenceManager tracks which users are online.
 *
 * How it works:
 * - On connect: set user online in DB, broadcast to all
 * - On disconnect: set user offline in DB, broadcast to all
 * - Handles multiple tabs/windows per user (reference counting)
 */
export class PresenceManager {
  /** Map of userId -> number of active connections (for multi-tab support) */
  private connectionCount = new Map<string, number>();

  constructor(
    private io: PZServer,
    private db: PingZeroDatabase
  ) {}

  /**
   * Mark a user as online.
   * Only broadcasts the event on the first connection (not per-tab).
   */
  async userConnected(socket: PZSocket): Promise<void> {
    const userId = socket.data.userId;

    // Increment connection count
    const current = this.connectionCount.get(userId) ?? 0;
    this.connectionCount.set(userId, current + 1);

    // Only set online if this is the first connection
    if (current === 0) {
      await this.db.setUserOnline(userId, true);

      // Broadcast to all connected clients
      socket.broadcast.emit("user:online", { userId });

      console.log(`[ping-zero] 🟢 ${socket.data.userName} is online`);
    }
  }

  /**
   * Mark a user as offline.
   * Only broadcasts when the last connection closes (all tabs closed).
   */
  async userDisconnected(socket: PZSocket): Promise<void> {
    const userId = socket.data.userId;

    // Decrement connection count
    const current = this.connectionCount.get(userId) ?? 1;
    const newCount = Math.max(0, current - 1);
    this.connectionCount.set(userId, newCount);

    // Only set offline if all connections are gone
    if (newCount === 0) {
      await this.db.setUserOnline(userId, false);
      this.connectionCount.delete(userId);

      // Broadcast to all connected clients
      socket.broadcast.emit("user:offline", { userId });

      console.log(`[ping-zero] 🔴 ${socket.data.userName} is offline`);
    }
  }

  /**
   * Get count of active connections for a user.
   */
  getConnectionCount(userId: string): number {
    return this.connectionCount.get(userId) ?? 0;
  }

  /**
   * Check if a user is currently online.
   */
  isOnline(userId: string): boolean {
    return (this.connectionCount.get(userId) ?? 0) > 0;
  }
}
