// ============================================================
// ping-zero — Room Manager
// Handles room join/leave, member tracking, and room-scoped
// message broadcasting using Socket.IO rooms.
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
 * RoomManager handles all room/channel logic:
 * - Joining and leaving rooms
 * - Loading message history on join
 * - Tracking which rooms each socket is in
 * - Notifying room members of joins/leaves
 */
export class RoomManager {
  /** Map of socketId -> Set of roomIds they've joined */
  private socketRooms = new Map<string, Set<string>>();

  constructor(
    private io: PZServer,
    private db: PingZeroDatabase
  ) {}

  /**
   * Register room event handlers on a socket.
   * Called once per new connection.
   */
  registerHandlers(socket: PZSocket): void {
    socket.on("room:join", async (data) => {
      await this.joinRoom(socket, data.roomId);
    });

    socket.on("room:leave", async (data) => {
      await this.leaveRoom(socket, data.roomId);
    });

    socket.on("message:fetch-history", async (data) => {
      await this.fetchHistory(socket, data.roomId, data.limit, data.before);
    });
  }

  /**
   * Join a socket to a room.
   * - Adds socket to the Socket.IO room
   * - Loads recent messages from database
   * - Gets current room members
   * - Notifies other members
   */
  async joinRoom(socket: PZSocket, roomId: string): Promise<void> {
    // Add to Socket.IO room
    await socket.join(roomId);

    // Track locally
    if (!this.socketRooms.has(socket.id)) {
      this.socketRooms.set(socket.id, new Set());
    }
    this.socketRooms.get(socket.id)!.add(roomId);

    // Load recent messages
    const { messages } = await this.db.getMessages(roomId, 50);

    // Get current room members
    const members = await this.db.getRoomMembers(roomId);

    // Get the user who joined
    const user = await this.db.getUser(socket.data.userId);

    // Send room data to the joiner
    socket.emit("room:joined", {
      roomId,
      messages,
      members,
    });

    // Notify other room members
    if (user) {
      socket.to(roomId).emit("room:user-joined", {
        roomId,
        userId: socket.data.userId,
        user,
      });
    }

    console.log(`[ping-zero] 🚪 ${socket.data.userName} joined room: ${roomId}`);
  }

  /**
   * Remove a socket from a room.
   * - Leaves the Socket.IO room
   * - Notifies other members
   */
  async leaveRoom(socket: PZSocket, roomId: string): Promise<void> {
    await socket.leave(roomId);

    // Update local tracking
    this.socketRooms.get(socket.id)?.delete(roomId);

    // Notify other room members
    socket.to(roomId).emit("room:user-left", {
      roomId,
      userId: socket.data.userId,
    });

    console.log(`[ping-zero] 👋 ${socket.data.userName} left room: ${roomId}`);
  }

  /**
   * Fetch paginated message history for a room.
   */
  async fetchHistory(
    socket: PZSocket,
    roomId: string,
    limit?: number,
    before?: string
  ): Promise<void> {
    const { messages, hasMore } = await this.db.getMessages(
      roomId,
      limit ?? 50,
      before
    );

    socket.emit("message:history", { roomId, messages, hasMore });
  }

  /**
   * Leave all rooms for a socket (called on disconnect).
   */
  async leaveAllRooms(socket: PZSocket): Promise<void> {
    const rooms = this.socketRooms.get(socket.id);
    if (!rooms) return;

    for (const roomId of rooms) {
      socket.to(roomId).emit("room:user-left", {
        roomId,
        userId: socket.data.userId,
      });
    }

    this.socketRooms.delete(socket.id);
  }

  /**
   * Get all rooms a socket has joined.
   */
  getSocketRooms(socketId: string): Set<string> {
    return this.socketRooms.get(socketId) ?? new Set();
  }
}
