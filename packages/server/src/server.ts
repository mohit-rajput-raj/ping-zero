// ============================================================
// ping-zero — Server Core
// The main entry point. Creates a fully configured realtime
// messaging server with a single function call.
// ============================================================

import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";
import {
  PingZeroDatabase,
  runMigrations,
  type PrismaClientLike,
  type ServerToClientEvents,
  type ClientToServerEvents,
  type SocketData,
  type AuthPayload,
} from "@ping-zero/prisma";
import { RoomManager } from "./room-manager.js";
import { PresenceManager } from "./presence-manager.js";
import { TypingManager } from "./typing-manager.js";
import { MessageHandler } from "./message-handler.js";

// ── Configuration ──────────────────────────────────────────

export interface PingZeroServerOptions {
  /** Prisma client instance (any version >= 5) */
  database: PrismaClientLike;

  /** HTTP server to attach Socket.IO to (optional — creates standalone if omitted) */
  httpServer?: HttpServer;

  /** Socket.IO CORS configuration */
  cors?: {
    origin: string | string[];
    credentials?: boolean;
  };

  /** Auto-create database tables on startup (default: true) */
  autoMigrate?: boolean;

  /** Custom authentication function (optional) */
  authenticate?: (payload: AuthPayload) => Promise<boolean> | boolean;

  /** Socket.IO path (default: "/ping-zero") */
  path?: string;
}

export interface PingZeroServer {
  /** The underlying Socket.IO server instance */
  io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
  /** Database adapter for direct queries */
  db: PingZeroDatabase;
  /** Room manager instance */
  rooms: RoomManager;
  /** Presence manager instance */
  presence: PresenceManager;
  /** Shut down the server gracefully */
  close: () => Promise<void>;
}

// ── Main Factory ───────────────────────────────────────────

/**
 * Create a ping-zero realtime messaging server.
 *
 * @example
 * ```ts
 * import { createPingZero } from "@ping-zero/server";
 * import { PrismaClient } from "@prisma/client";
 *
 * const prisma = new PrismaClient();
 *
 * const chat = await createPingZero({
 *   database: prisma,
 *   cors: { origin: "http://localhost:3000" },
 * });
 *
 * // Attach to your Express/Next.js server:
 * // const chat = await createPingZero({
 * //   database: prisma,
 * //   httpServer: server,
 * // });
 * ```
 */
export async function createPingZero(
  options: PingZeroServerOptions
): Promise<PingZeroServer> {
  const {
    database,
    httpServer,
    cors = { origin: "*" },
    autoMigrate = true,
    authenticate,
    path = "/ping-zero",
  } = options;

  // ── Step 1: Auto-migrate database ──────────────────────
  if (autoMigrate) {
    await runMigrations(database);
  }

  // ── Step 2: Create database adapter ────────────────────
  const db = new PingZeroDatabase(database);

  // ── Step 3: Create Socket.IO server ────────────────────
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
  >(httpServer ?? undefined, {
    cors: {
      origin: cors.origin,
      credentials: cors.credentials ?? true,
    },
    path,
    // Enable connection state recovery for reconnect handling
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true,
    },
  });

  // ── Step 4: Create managers ────────────────────────────
  const roomManager = new RoomManager(io, db);
  const presenceManager = new PresenceManager(io, db);
  const typingManager = new TypingManager(io);
  const messageHandler = new MessageHandler(io, db);

  // ── Step 5: Authentication middleware ──────────────────
  io.use(async (socket, next) => {
    try {
      const auth = socket.handshake.auth as AuthPayload;

      if (!auth.userId || !auth.userName) {
        return next(new Error("Missing userId or userName in auth"));
      }

      // Run custom authentication if provided
      if (authenticate) {
        const isValid = await authenticate(auth);
        if (!isValid) {
          return next(new Error("Authentication failed"));
        }
      }

      // Attach user data to socket
      socket.data.userId = auth.userId;
      socket.data.userName = auth.userName;
      socket.data.userAvatar = auth.userAvatar;

      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // ── Step 6: Connection handler ─────────────────────────
  io.on("connection", async (socket) => {
    console.log(`[ping-zero] ⚡ Connected: ${socket.data.userName} (${socket.data.userId})`);

    try {
      // Upsert user in database
      const user = await db.upsertUser({
        id: socket.data.userId,
        name: socket.data.userName,
        avatar: socket.data.userAvatar,
      });

      // Track presence
      await presenceManager.userConnected(socket);

      // Register event handlers
      roomManager.registerHandlers(socket);
      typingManager.registerHandlers(socket);
      messageHandler.registerHandlers(socket);

      // Send connection confirmation
      socket.emit("connected", {
        user,
        rooms: [],
      });

      // ── Disconnect handler ──────────────────────────
      socket.on("disconnect", async (reason) => {
        console.log(`[ping-zero] 💔 Disconnected: ${socket.data.userName} (${reason})`);

        // Clear typing indicators
        const rooms = roomManager.getSocketRooms(socket.id);
        typingManager.clearAllForSocket(socket, rooms);

        // Leave all rooms
        await roomManager.leaveAllRooms(socket);

        // Update presence
        await presenceManager.userDisconnected(socket);
      });
    } catch (error) {
      console.error("[ping-zero] ❌ Connection setup failed:", error);
      socket.emit("error", {
        message: "Connection setup failed",
        code: "CONNECTION_FAILED",
      });
      socket.disconnect(true);
    }
  });

  // ── Step 7: Log startup ────────────────────────────────
  console.log("[ping-zero] 🚀 Server started!");
  console.log(`[ping-zero] 📡 WebSocket path: ${path}`);

  // ── Return public API ──────────────────────────────────
  return {
    io,
    db,
    rooms: roomManager,
    presence: presenceManager,
    close: async () => {
      io.close();
      console.log("[ping-zero] 🛑 Server stopped");
    },
  };
}
