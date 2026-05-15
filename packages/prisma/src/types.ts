// ============================================================
// ping-zero — Shared Types
// These types are used across all ping-zero packages.
// ============================================================

/** Message types supported by ping-zero */
export type MessageType = "TEXT" | "IMAGE" | "SYSTEM";

/** A ping-zero user record */
export interface PZUser {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  lastSeen: Date;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

/** A ping-zero message record */
export interface PZMessage {
  id: string;
  content: string;
  roomId: string;
  senderId: string;
  type: MessageType;
  readBy: string[];
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Options for creating a ping-zero instance */
export interface PingZeroOptions {
  /** Prisma client instance */
  database: PrismaClientLike;
  /** Enable auto-migration of tables on startup (default: true) */
  autoMigrate?: boolean;
}

/** Minimal Prisma client interface (so we don't require a specific Prisma version) */
export interface PrismaClientLike {
  $executeRawUnsafe: (query: string, ...values: unknown[]) => Promise<number>;
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
}

/** Server-to-Client events */
export interface ServerToClientEvents {
  "connected": (data: { user: PZUser; rooms: string[] }) => void;
  "message:new": (data: { message: PZMessage }) => void;
  "message:sent": (data: { messageId: string; message: PZMessage }) => void;
  "message:history": (data: { roomId: string; messages: PZMessage[]; hasMore: boolean }) => void;
  "room:joined": (data: { roomId: string; messages: PZMessage[]; members: PZUser[] }) => void;
  "room:user-joined": (data: { roomId: string; userId: string; user: PZUser }) => void;
  "room:user-left": (data: { roomId: string; userId: string }) => void;
  "typing:update": (data: { roomId: string; userId: string; userName: string; isTyping: boolean }) => void;
  "user:online": (data: { userId: string }) => void;
  "user:offline": (data: { userId: string }) => void;
  "unread:update": (data: { roomId: string; count: number }) => void;
  "error": (data: { message: string; code?: string }) => void;
}

/** Client-to-Server events */
export interface ClientToServerEvents {
  "message:send": (data: { roomId: string; content: string; type?: MessageType }, callback?: (response: { messageId: string }) => void) => void;
  "room:join": (data: { roomId: string }) => void;
  "room:leave": (data: { roomId: string }) => void;
  "typing:start": (data: { roomId: string }) => void;
  "typing:stop": (data: { roomId: string }) => void;
  "message:read": (data: { roomId: string; messageId: string }) => void;
  "message:fetch-history": (data: { roomId: string; before?: string; limit?: number }) => void;
}

/** Socket data attached to each connection */
export interface SocketData {
  userId: string;
  userName: string;
  userAvatar?: string;
}

/** Connection auth payload */
export interface AuthPayload {
  userId: string;
  userName: string;
  userAvatar?: string;
}
