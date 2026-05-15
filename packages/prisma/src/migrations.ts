// ============================================================
// ping-zero — Auto-Migration
// Creates the pz_user and pz_message tables automatically.
// Uses CREATE TABLE IF NOT EXISTS so it's safe to call on every startup.
// ============================================================

import type { PrismaClientLike } from "./types.js";

/**
 * SQL to create the pz_user table.
 * Stores user profiles and presence information.
 */
const CREATE_USER_TABLE = `
CREATE TABLE IF NOT EXISTS "pz_user" (
  "id"         TEXT        NOT NULL PRIMARY KEY,
  "name"       TEXT        NOT NULL,
  "avatar"     TEXT,
  "isOnline"   BOOLEAN     NOT NULL DEFAULT false,
  "lastSeen"   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata"   JSONB,
  "createdAt"  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * SQL to create the pz_message table.
 * Stores all chat messages with room scoping.
 */
const CREATE_MESSAGE_TABLE = `
CREATE TABLE IF NOT EXISTS "pz_message" (
  "id"         TEXT        NOT NULL PRIMARY KEY,
  "content"    TEXT        NOT NULL,
  "roomId"     TEXT        NOT NULL,
  "senderId"   TEXT        NOT NULL REFERENCES "pz_user"("id") ON DELETE CASCADE,
  "type"       TEXT        NOT NULL DEFAULT 'TEXT',
  "readBy"     JSONB       NOT NULL DEFAULT '[]',
  "metadata"   JSONB,
  "createdAt"  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Create indexes for common query patterns.
 */
const CREATE_INDEXES = `
CREATE INDEX IF NOT EXISTS "pz_message_roomId_idx" ON "pz_message"("roomId");
CREATE INDEX IF NOT EXISTS "pz_message_senderId_idx" ON "pz_message"("senderId");
CREATE INDEX IF NOT EXISTS "pz_message_createdAt_idx" ON "pz_message"("createdAt");
CREATE INDEX IF NOT EXISTS "pz_user_isOnline_idx" ON "pz_user"("isOnline");
`;

/**
 * Run auto-migration: creates tables and indexes if they don't exist.
 * Safe to call on every server startup (idempotent).
 *
 * @param prisma - Prisma client instance
 */
export async function runMigrations(prisma: PrismaClientLike): Promise<void> {
  console.log("[ping-zero] 🔄 Running auto-migration...");

  try {
    await prisma.$executeRawUnsafe(CREATE_USER_TABLE);
    console.log("[ping-zero] ✅ pz_user table ready");

    await prisma.$executeRawUnsafe(CREATE_MESSAGE_TABLE);
    console.log("[ping-zero] ✅ pz_message table ready");

    await prisma.$executeRawUnsafe(CREATE_INDEXES);
    console.log("[ping-zero] ✅ Indexes ready");

    console.log("[ping-zero] 🎉 Auto-migration complete!");
  } catch (error) {
    console.error("[ping-zero] ❌ Migration failed:", error);
    throw error;
  }
}
