// ============================================================
// @ping-zero/prisma — Entry Point
// Database adapter for ping-zero realtime messaging.
// ============================================================

export { PingZeroDatabase } from "./database.js";
export { runMigrations } from "./migrations.js";
export type {
  PZUser,
  PZMessage,
  MessageType,
  PingZeroOptions,
  PrismaClientLike,
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  AuthPayload,
} from "./types.js";
