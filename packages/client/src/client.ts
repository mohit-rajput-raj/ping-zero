// ============================================================
// ping-zero — Client SDK
// Browser/Node.js client for connecting to a ping-zero server.
// Handles reconnection, message queuing, and event subscriptions.
// ============================================================

import { io, type Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  PZUser,
  PZMessage,
  MessageType,
} from "@ping-zero/prisma";

// ── Configuration ──────────────────────────────────────────

export interface PingZeroClientOptions {
  /** Server URL (e.g., "http://localhost:3000") */
  url: string;
  /** User authentication */
  auth: {
    userId: string;
    userName: string;
    userAvatar?: string;
  };
  /** Socket.IO path (must match server, default: "/ping-zero") */
  path?: string;
  /** Auto-reconnect (default: true) */
  autoReconnect?: boolean;
}

// ── Event Callback Types ───────────────────────────────────

export type MessageCallback = (message: PZMessage) => void;
export type TypingCallback = (data: { userId: string; userName: string; isTyping: boolean }) => void;
export type PresenceCallback = (data: { userId: string; isOnline: boolean }) => void;
export type UnreadCallback = (data: { roomId: string; count: number }) => void;

// ── Client Class ───────────────────────────────────────────

/**
 * PingZeroClient provides a high-level API for realtime messaging.
 *
 * @example
 * ```ts
 * import { createPingZeroClient } from "@ping-zero/client";
 *
 * const client = createPingZeroClient({
 *   url: "http://localhost:3000",
 *   auth: { userId: "user1", userName: "Alice" },
 * });
 *
 * await client.connect();
 * await client.joinRoom("general");
 *
 * client.onMessage("general", (message) => {
 *   console.log(`${message.senderId}: ${message.content}`);
 * });
 *
 * client.sendMessage("general", "Hello world!");
 * ```
 */
export class PingZeroClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private joinedRooms = new Set<string>();
  private pendingMessages: Array<{ roomId: string; content: string; type?: MessageType }> = [];
  private messageCallbacks = new Map<string, Set<MessageCallback>>();
  private typingCallbacks = new Map<string, Set<TypingCallback>>();
  private presenceCallbacks = new Set<PresenceCallback>();
  private unreadCallbacks = new Set<UnreadCallback>();
  private connectedUser: PZUser | null = null;
  private isConnected = false;

  constructor(private options: PingZeroClientOptions) {
    this.socket = io(options.url, {
      path: options.path ?? "/ping-zero",
      auth: options.auth,
      autoConnect: false,
      reconnection: options.autoReconnect ?? true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();
  }

  // ── Connection ───────────────────────────────────────────

  /**
   * Connect to the ping-zero server.
   * Returns a promise that resolves when connected.
   */
  connect(): Promise<PZUser> {
    return new Promise((resolve, reject) => {
      // Listen for successful connection
      this.socket.once("connected", (data) => {
        this.connectedUser = data.user;
        this.isConnected = true;
        resolve(data.user);
      });

      // Listen for connection errors
      this.socket.once("connect_error", (err) => {
        reject(new Error(`Connection failed: ${err.message}`));
      });

      this.socket.connect();
    });
  }

  /**
   * Disconnect from the server.
   */
  disconnect(): void {
    this.socket.disconnect();
    this.isConnected = false;
    this.joinedRooms.clear();
  }

  /**
   * Get the connected user profile.
   */
  getUser(): PZUser | null {
    return this.connectedUser;
  }

  /**
   * Check if currently connected.
   */
  get connected(): boolean {
    return this.isConnected;
  }

  // ── Rooms ────────────────────────────────────────────────

  /**
   * Join a chat room.
   * Returns the room's message history and current members.
   */
  joinRoom(roomId: string): Promise<{ messages: PZMessage[]; members: PZUser[] }> {
    return new Promise((resolve) => {
      this.socket.once("room:joined", (data) => {
        if (data.roomId === roomId) {
          this.joinedRooms.add(roomId);
          resolve({ messages: data.messages, members: data.members });
        }
      });

      this.socket.emit("room:join", { roomId });
    });
  }

  /**
   * Leave a chat room.
   */
  leaveRoom(roomId: string): void {
    this.socket.emit("room:leave", { roomId });
    this.joinedRooms.delete(roomId);
    this.messageCallbacks.delete(roomId);
    this.typingCallbacks.delete(roomId);
  }

  /**
   * Get all currently joined rooms.
   */
  getJoinedRooms(): string[] {
    return Array.from(this.joinedRooms);
  }

  // ── Messaging ────────────────────────────────────────────

  /**
   * Send a message to a room.
   * Messages are queued if disconnected and sent on reconnect.
   */
  sendMessage(
    roomId: string,
    content: string,
    type?: MessageType
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        // Queue for later
        this.pendingMessages.push({ roomId, content, type });
        reject(new Error("Not connected — message queued for retry"));
        return;
      }

      this.socket.emit(
        "message:send",
        { roomId, content, type },
        (response) => {
          resolve(response.messageId);
        }
      );
    });
  }

  /**
   * Load older messages (pagination).
   */
  fetchHistory(
    roomId: string,
    options?: { before?: string; limit?: number }
  ): Promise<{ messages: PZMessage[]; hasMore: boolean }> {
    return new Promise((resolve) => {
      this.socket.once("message:history", (data) => {
        if (data.roomId === roomId) {
          resolve({ messages: data.messages, hasMore: data.hasMore });
        }
      });

      this.socket.emit("message:fetch-history", {
        roomId,
        before: options?.before,
        limit: options?.limit,
      });
    });
  }

  /**
   * Mark a message as read.
   */
  markAsRead(roomId: string, messageId: string): void {
    this.socket.emit("message:read", { roomId, messageId });
  }

  // ── Typing ───────────────────────────────────────────────

  /**
   * Signal that the current user started typing.
   */
  startTyping(roomId: string): void {
    this.socket.emit("typing:start", { roomId });
  }

  /**
   * Signal that the current user stopped typing.
   */
  stopTyping(roomId: string): void {
    this.socket.emit("typing:stop", { roomId });
  }

  // ── Subscriptions (Event Listeners) ──────────────────────

  /**
   * Subscribe to new messages in a specific room.
   * Returns an unsubscribe function.
   */
  onMessage(roomId: string, callback: MessageCallback): () => void {
    if (!this.messageCallbacks.has(roomId)) {
      this.messageCallbacks.set(roomId, new Set());
    }
    this.messageCallbacks.get(roomId)!.add(callback);

    return () => {
      this.messageCallbacks.get(roomId)?.delete(callback);
    };
  }

  /**
   * Subscribe to typing indicators in a specific room.
   * Returns an unsubscribe function.
   */
  onTyping(roomId: string, callback: TypingCallback): () => void {
    if (!this.typingCallbacks.has(roomId)) {
      this.typingCallbacks.set(roomId, new Set());
    }
    this.typingCallbacks.get(roomId)!.add(callback);

    return () => {
      this.typingCallbacks.get(roomId)?.delete(callback);
    };
  }

  /**
   * Subscribe to user online/offline events.
   * Returns an unsubscribe function.
   */
  onPresence(callback: PresenceCallback): () => void {
    this.presenceCallbacks.add(callback);
    return () => {
      this.presenceCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to unread count updates.
   * Returns an unsubscribe function.
   */
  onUnread(callback: UnreadCallback): () => void {
    this.unreadCallbacks.add(callback);
    return () => {
      this.unreadCallbacks.delete(callback);
    };
  }

  // ── Internal Event Wiring ────────────────────────────────

  private setupEventListeners(): void {
    // Route incoming messages to room-specific callbacks
    this.socket.on("message:new", (data) => {
      const callbacks = this.messageCallbacks.get(data.message.roomId);
      if (callbacks) {
        for (const cb of callbacks) cb(data.message);
      }
    });

    // Also handle messages we sent (for local display)
    this.socket.on("message:sent", (data) => {
      const callbacks = this.messageCallbacks.get(data.message.roomId);
      if (callbacks) {
        for (const cb of callbacks) cb(data.message);
      }
    });

    // Route typing events
    this.socket.on("typing:update", (data) => {
      const callbacks = this.typingCallbacks.get(data.roomId);
      if (callbacks) {
        for (const cb of callbacks) cb({
          userId: data.userId,
          userName: data.userName,
          isTyping: data.isTyping,
        });
      }
    });

    // Presence events
    this.socket.on("user:online", (data) => {
      for (const cb of this.presenceCallbacks) {
        cb({ userId: data.userId, isOnline: true });
      }
    });

    this.socket.on("user:offline", (data) => {
      for (const cb of this.presenceCallbacks) {
        cb({ userId: data.userId, isOnline: false });
      }
    });

    // Unread events
    this.socket.on("unread:update", (data) => {
      for (const cb of this.unreadCallbacks) cb(data);
    });

    // ── Reconnect Handling ─────────────────────────────────
    this.socket.on("connect", () => {
      if (this.joinedRooms.size > 0) {
        console.log("[ping-zero] 🔄 Reconnected — re-joining rooms...");

        // Re-join all rooms
        for (const roomId of this.joinedRooms) {
          this.socket.emit("room:join", { roomId });
        }

        // Flush pending messages
        const pending = [...this.pendingMessages];
        this.pendingMessages = [];
        for (const msg of pending) {
          this.socket.emit("message:send", msg);
        }
      }

      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });
  }

  /**
   * Get the raw Socket.IO socket (for advanced use).
   */
  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
    return this.socket;
  }
}

// ── Factory Function ───────────────────────────────────────

/**
 * Create a ping-zero client instance.
 *
 * @example
 * ```ts
 * const client = createPingZeroClient({
 *   url: "http://localhost:3000",
 *   auth: { userId: "user1", userName: "Alice" },
 * });
 * ```
 */
export function createPingZeroClient(
  options: PingZeroClientOptions
): PingZeroClient {
  return new PingZeroClient(options);
}
