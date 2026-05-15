// ============================================================
// @ping-zero/client — Entry Point
// Realtime messaging client for browser and Node.js.
// ============================================================

export { PingZeroClient, createPingZeroClient } from "./client.js";
export type {
  PingZeroClientOptions,
  MessageCallback,
  TypingCallback,
  PresenceCallback,
  UnreadCallback,
} from "./client.js";

// Re-export types for convenience
export type {
  PZUser,
  PZMessage,
  MessageType,
  ServerToClientEvents,
  ClientToServerEvents,
} from "@ping-zero/prisma";
