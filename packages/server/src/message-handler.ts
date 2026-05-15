// ============================================================
// ping-zero — Message Handler
// Handles message sending, persistence, and broadcasting.
// ============================================================

import type { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  MessageType,
} from "@ping-zero/prisma";
import type { PingZeroDatabase } from "@ping-zero/prisma";

type PZSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type PZServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

/**
 * MessageHandler processes incoming messages:
 * 1. Saves to database (persistence)
 * 2. Broadcasts to the room (fanout)
 * 3. Sends confirmation to the sender
 * 4. Handles read receipts
 */
export class MessageHandler {
  constructor(
    private io: PZServer,
    private db: PingZeroDatabase
  ) {}

  /**
   * Register message event handlers on a socket.
   */
  registerHandlers(socket: PZSocket): void {
    socket.on("message:send", async (data, callback) => {
      await this.handleSend(socket, data, callback);
    });

    socket.on("message:read", async (data) => {
      await this.handleRead(socket, data);
    });
  }

  /**
   * Handle an incoming message.
   *
   * Flow:
   * 1. Save message to database
   * 2. Broadcast to all room members (except sender)
   * 3. Send confirmation back to sender
   */
  private async handleSend(
    socket: PZSocket,
    data: { roomId: string; content: string; type?: MessageType },
    callback?: (response: { messageId: string }) => void
  ): Promise<void> {
    try {
      // 1. Persist to database
      const message = await this.db.createMessage({
        content: data.content,
        roomId: data.roomId,
        senderId: socket.data.userId,
        type: data.type,
      });

      // 2. Broadcast to room (everyone except sender)
      socket.to(data.roomId).emit("message:new", { message });

      // 3. Send confirmation to sender (with full message object)
      socket.emit("message:sent", {
        messageId: message.id,
        message,
      });

      // 4. If callback provided (for acknowledgement pattern)
      if (callback) {
        callback({ messageId: message.id });
      }

      // 5. Update unread counts for other users in the room
      // This is done asynchronously to not block the response
      this.updateUnreadCounts(data.roomId, socket.data.userId).catch(
        (err) => console.error("[ping-zero] Unread count update failed:", err)
      );

    } catch (error) {
      console.error("[ping-zero] ❌ Message send failed:", error);
      socket.emit("error", {
        message: "Failed to send message",
        code: "MESSAGE_SEND_FAILED",
      });
    }
  }

  /**
   * Handle marking a message as read.
   */
  private async handleRead(
    socket: PZSocket,
    data: { roomId: string; messageId: string }
  ): Promise<void> {
    try {
      await this.db.markAsRead(data.messageId, socket.data.userId);

      // Send updated unread count back to the reader
      const count = await this.db.getUnreadCount(data.roomId, socket.data.userId);
      socket.emit("unread:update", {
        roomId: data.roomId,
        count,
      });
    } catch (error) {
      console.error("[ping-zero] ❌ Mark read failed:", error);
    }
  }

  /**
   * Update unread counts for all connected users in a room.
   * Runs in the background after each message.
   */
  private async updateUnreadCounts(
    roomId: string,
    senderUserId: string
  ): Promise<void> {
    // Get all sockets in the room
    const sockets = await this.io.in(roomId).fetchSockets();

    for (const s of sockets) {
      // Skip the sender
      if (s.data.userId === senderUserId) continue;

      const count = await this.db.getUnreadCount(roomId, s.data.userId);
      s.emit("unread:update", { roomId, count });
    }
  }
}
