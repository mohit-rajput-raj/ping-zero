// ============================================================
// ping-zero — Database Operations
// Provides typed database operations over raw SQL.
// Works with any Prisma client instance.
// ============================================================

import type { PrismaClientLike, PZUser, PZMessage, MessageType } from "./types.js";

/**
 * Generate a simple unique ID (cuid-like).
 * Uses timestamp + random characters for uniqueness.
 */
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `pz_${timestamp}${random}`;
}

/**
 * Database adapter for ping-zero.
 * Wraps raw Prisma queries with typed methods for users and messages.
 */
export class PingZeroDatabase {
  constructor(private prisma: PrismaClientLike) {}

  // ── User Operations ──────────────────────────────────────

  /**
   * Create or update a user. If the user exists, update their info.
   * Called on every connection to keep user data fresh.
   */
  async upsertUser(data: {
    id: string;
    name: string;
    avatar?: string;
  }): Promise<PZUser> {
    const now = new Date().toISOString();

    // Try to find existing user
    const existing = await this.prisma.$queryRawUnsafe<PZUser[]>(
      `SELECT * FROM "pz_user" WHERE "id" = $1 LIMIT 1`,
      data.id
    );

    if (existing.length > 0) {
      // Update existing user
      await this.prisma.$executeRawUnsafe(
        `UPDATE "pz_user" SET "name" = $1, "avatar" = $2, "isOnline" = true, "lastSeen" = $3, "updatedAt" = $3 WHERE "id" = $4`,
        data.name,
        data.avatar ?? null,
        now,
        data.id
      );
    } else {
      // Create new user
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO "pz_user" ("id", "name", "avatar", "isOnline", "lastSeen", "createdAt", "updatedAt") VALUES ($1, $2, $3, true, $4, $4, $4)`,
        data.id,
        data.name,
        data.avatar ?? null,
        now
      );
    }

    const result = await this.prisma.$queryRawUnsafe<PZUser[]>(
      `SELECT * FROM "pz_user" WHERE "id" = $1 LIMIT 1`,
      data.id
    );

    return result[0]!;
  }

  /**
   * Set user online/offline status.
   */
  async setUserOnline(userId: string, isOnline: boolean): Promise<void> {
    const now = new Date().toISOString();
    await this.prisma.$executeRawUnsafe(
      `UPDATE "pz_user" SET "isOnline" = $1, "lastSeen" = $2, "updatedAt" = $2 WHERE "id" = $3`,
      isOnline,
      now,
      userId
    );
  }

  /**
   * Get a user by ID.
   */
  async getUser(userId: string): Promise<PZUser | null> {
    const result = await this.prisma.$queryRawUnsafe<PZUser[]>(
      `SELECT * FROM "pz_user" WHERE "id" = $1 LIMIT 1`,
      userId
    );
    return result[0] ?? null;
  }

  /**
   * Get all online users.
   */
  async getOnlineUsers(): Promise<PZUser[]> {
    return this.prisma.$queryRawUnsafe<PZUser[]>(
      `SELECT * FROM "pz_user" WHERE "isOnline" = true ORDER BY "name" ASC`
    );
  }

  // ── Message Operations ───────────────────────────────────

  /**
   * Save a new message to the database.
   * Returns the saved message with generated ID and timestamps.
   */
  async createMessage(data: {
    content: string;
    roomId: string;
    senderId: string;
    type?: MessageType;
  }): Promise<PZMessage> {
    const id = generateId();
    const now = new Date().toISOString();
    const type = data.type ?? "TEXT";

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO "pz_message" ("id", "content", "roomId", "senderId", "type", "readBy", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, '[]'::jsonb, $6, $6)`,
      id,
      data.content,
      data.roomId,
      data.senderId,
      type,
      now
    );

    const result = await this.prisma.$queryRawUnsafe<PZMessage[]>(
      `SELECT * FROM "pz_message" WHERE "id" = $1 LIMIT 1`,
      id
    );

    return result[0]!;
  }

  /**
   * Get messages for a room, ordered by newest first.
   * Supports cursor-based pagination for loading history.
   *
   * @param roomId - The room to fetch messages for
   * @param limit - Max messages to return (default 50)
   * @param before - Cursor: fetch messages before this message ID
   */
  async getMessages(
    roomId: string,
    limit: number = 50,
    before?: string
  ): Promise<{ messages: PZMessage[]; hasMore: boolean }> {
    let messages: PZMessage[];

    if (before) {
      // Get the createdAt of the cursor message
      const cursor = await this.prisma.$queryRawUnsafe<PZMessage[]>(
        `SELECT "createdAt" FROM "pz_message" WHERE "id" = $1 LIMIT 1`,
        before
      );

      if (cursor.length === 0) {
        return { messages: [], hasMore: false };
      }

      messages = await this.prisma.$queryRawUnsafe<PZMessage[]>(
        `SELECT * FROM "pz_message" WHERE "roomId" = $1 AND "createdAt" < $2 ORDER BY "createdAt" DESC LIMIT $3`,
        roomId,
        cursor[0]!.createdAt,
        limit + 1
      );
    } else {
      messages = await this.prisma.$queryRawUnsafe<PZMessage[]>(
        `SELECT * FROM "pz_message" WHERE "roomId" = $1 ORDER BY "createdAt" DESC LIMIT $2`,
        roomId,
        limit + 1
      );
    }

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    // Return in chronological order (oldest first)
    return { messages: messages.reverse(), hasMore };
  }

  /**
   * Mark a message as read by a user.
   * Appends the userId to the readBy JSON array.
   */
  async markAsRead(messageId: string, userId: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `UPDATE "pz_message" SET "readBy" = "readBy" || $1::jsonb, "updatedAt" = $2 WHERE "id" = $3 AND NOT ("readBy" @> $1::jsonb)`,
      JSON.stringify([userId]),
      new Date().toISOString(),
      messageId
    );
  }

  /**
   * Get unread message count for a user in a room.
   * Counts messages where the user's ID is not in the readBy array.
   */
  async getUnreadCount(roomId: string, userId: string): Promise<number> {
    const result = await this.prisma.$queryRawUnsafe<Array<{ count: string }>>(
      `SELECT COUNT(*) as count FROM "pz_message" WHERE "roomId" = $1 AND "senderId" != $2 AND NOT ("readBy" @> $3::jsonb)`,
      roomId,
      userId,
      JSON.stringify([userId])
    );
    return parseInt(result[0]?.count ?? "0", 10);
  }

  /**
   * Get users who are members of a room (have sent messages there).
   */
  async getRoomMembers(roomId: string): Promise<PZUser[]> {
    return this.prisma.$queryRawUnsafe<PZUser[]>(
      `SELECT DISTINCT u.* FROM "pz_user" u INNER JOIN "pz_message" m ON u."id" = m."senderId" WHERE m."roomId" = $1 ORDER BY u."name" ASC`,
      roomId
    );
  }
}
