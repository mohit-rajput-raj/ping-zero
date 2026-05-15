// ============================================================
// ping-zero — Typing Manager
// Handles typing indicators with automatic timeout cleanup.
// ============================================================

import type { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
} from "@ping-zero/prisma";

type PZSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type PZServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

/** How long before a typing indicator auto-clears (in ms) */
const TYPING_TIMEOUT = 3000;

/**
 * TypingManager handles typing indicators.
 *
 * How it works:
 * - Client sends "typing:start" when they begin typing
 * - Server broadcasts to the room
 * - After 3 seconds of no activity, typing auto-clears
 * - Client can also explicitly send "typing:stop"
 */
export class TypingManager {
  /** Map of `${roomId}:${userId}` -> timeout handle */
  private typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(private io: PZServer) {}

  /**
   * Register typing event handlers on a socket.
   */
  registerHandlers(socket: PZSocket): void {
    socket.on("typing:start", (data) => {
      this.startTyping(socket, data.roomId);
    });

    socket.on("typing:stop", (data) => {
      this.stopTyping(socket, data.roomId);
    });
  }

  /**
   * Handle a user starting to type.
   * Broadcasts to the room and sets an auto-clear timeout.
   */
  private startTyping(socket: PZSocket, roomId: string): void {
    const key = `${roomId}:${socket.data.userId}`;

    // Clear any existing timeout
    const existing = this.typingTimeouts.get(key);
    if (existing) clearTimeout(existing);

    // Broadcast typing indicator to room
    socket.to(roomId).emit("typing:update", {
      roomId,
      userId: socket.data.userId,
      userName: socket.data.userName,
      isTyping: true,
    });

    // Auto-clear after timeout
    const timeout = setTimeout(() => {
      this.clearTyping(socket, roomId);
    }, TYPING_TIMEOUT);

    this.typingTimeouts.set(key, timeout);
  }

  /**
   * Handle a user stopping typing.
   */
  private stopTyping(socket: PZSocket, roomId: string): void {
    this.clearTyping(socket, roomId);
  }

  /**
   * Clear typing indicator for a user in a room.
   */
  private clearTyping(socket: PZSocket, roomId: string): void {
    const key = `${roomId}:${socket.data.userId}`;

    // Clear timeout
    const existing = this.typingTimeouts.get(key);
    if (existing) {
      clearTimeout(existing);
      this.typingTimeouts.delete(key);
    }

    // Broadcast stop typing
    socket.to(roomId).emit("typing:update", {
      roomId,
      userId: socket.data.userId,
      userName: socket.data.userName,
      isTyping: false,
    });
  }

  /**
   * Clear all typing indicators for a socket (called on disconnect).
   */
  clearAllForSocket(socket: PZSocket, roomIds: Set<string>): void {
    for (const roomId of roomIds) {
      this.clearTyping(socket, roomId);
    }
  }
}
