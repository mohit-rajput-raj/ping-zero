// ============================================================
// ping-zero — ChatBox Component
// The main all-in-one chat widget. Drop this into your app
// and you get a fully working chat room.
// ============================================================

"use client";

import { cn } from "../utils.js";
import { useChatRoom } from "../hooks.js";
import { MessageList } from "./message-list.js";
import { MessageInput } from "./message-input.js";
import { TypingIndicator } from "./typing-indicator.js";
import { Hash, Users, Wifi, WifiOff } from "lucide-react";
import { usePingZeroContext } from "../hooks.js";

interface ChatBoxProps {
  /** The room/channel ID to connect to */
  room: string;
  /** Custom title for the header (defaults to room name) */
  title?: string;
  /** Show the header bar */
  showHeader?: boolean;
  /** Height of the chat box */
  height?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ChatBox is the main all-in-one chat component.
 * Drop it into your app with a room ID and it just works.
 *
 * @example
 * ```tsx
 * <PingZeroProvider config={config}>
 *   <ChatBox room="general" />
 * </PingZeroProvider>
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <ChatBox
 *   room="support"
 *   title="Customer Support"
 *   height="500px"
 *   className="rounded-2xl shadow-xl"
 * />
 * ```
 */
export function ChatBox({
  room,
  title,
  showHeader = true,
  height = "600px",
  className,
}: ChatBoxProps) {
  const { isConnected } = usePingZeroContext();
  const {
    messages,
    sendMessage,
    handleTyping,
    typingUsers,
    isJoined,
    isLoading,
    hasMore,
    loadMore,
    currentUserId,
  } = useChatRoom(room);

  return (
    <div
      className={cn(
        "flex flex-col bg-[var(--pz-bg)] border border-[var(--pz-border)] overflow-hidden",
        "rounded-xl shadow-[var(--pz-shadow-lg)]",
        className
      )}
      style={{ height }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--pz-border)] bg-[var(--pz-bg)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--pz-primary-light)] rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-[var(--pz-primary)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--pz-text)] leading-tight">
                {title ?? room}
              </h3>
              <p className="text-[11px] text-[var(--pz-text-muted)]">
                {isConnected ? "Connected" : "Connecting..."}
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-[var(--pz-online)]" />
            ) : (
              <WifiOff className="w-4 h-4 text-[var(--pz-offline)] animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* ── Message List ──────────────────────────────────── */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        hasMore={hasMore}
        onLoadMore={loadMore}
        isLoading={isLoading}
      />

      {/* ── Typing Indicator ──────────────────────────────── */}
      <TypingIndicator typingUsers={typingUsers} />

      {/* ── Input ─────────────────────────────────────────── */}
      <MessageInput
        onSend={sendMessage}
        onTyping={handleTyping}
        disabled={!isConnected || !isJoined}
        placeholder={isConnected ? "Type a message..." : "Connecting..."}
      />
    </div>
  );
}
