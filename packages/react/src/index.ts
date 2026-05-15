// ============================================================
// @ping-zero/react — Entry Point
// React components and hooks for ping-zero realtime messaging.
// ============================================================

// ── Components ─────────────────────────────────────────────
export { ChatBox } from "./components/chat-box.js";
export { MessageList } from "./components/message-list.js";
export { MessageBubble } from "./components/message-bubble.js";
export { MessageInput } from "./components/message-input.js";
export { TypingIndicator } from "./components/typing-indicator.js";
export { ChatAvatar } from "./components/chat-avatar.js";

// ── Hooks & Provider ───────────────────────────────────────
export {
  PingZeroProvider,
  usePingZeroContext,
  useChatRoom,
  usePresence,
  useUnreadCounts,
} from "./hooks.js";

// ── Utilities ──────────────────────────────────────────────
export { cn, formatMessageTime, getInitials, stringToColor } from "./utils.js";

// ── Re-export types ────────────────────────────────────────
export type { PZUser, PZMessage, MessageType } from "@ping-zero/prisma";
export type { PingZeroClientOptions } from "@ping-zero/client";
