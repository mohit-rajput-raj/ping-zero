// ============================================================
// @ping-zero/server — Entry Point
// Realtime messaging server for Node.js applications.
// ============================================================

export { createPingZero } from "./server.js";
export type { PingZeroServerOptions, PingZeroServer } from "./server.js";
export { RoomManager } from "./room-manager.js";
export { PresenceManager } from "./presence-manager.js";
export { TypingManager } from "./typing-manager.js";
export { MessageHandler } from "./message-handler.js";

// Re-export types from prisma package for convenience
export type {
  PZUser,
  PZMessage,
  MessageType,
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  AuthPayload,
} from "@ping-zero/prisma";
