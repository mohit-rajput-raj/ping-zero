// ============================================================
// ping-zero — MessageBubble Component
// Renders a single chat message with sender info and timestamp.
// ============================================================

"use client";

import type { PZMessage } from "@ping-zero/prisma";
import { cn, formatMessageTime } from "../utils.js";
import { ChatAvatar } from "./chat-avatar.js";

interface MessageBubbleProps {
  message: PZMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
  className?: string;
}

/**
 * MessageBubble renders a single message.
 * - Own messages: right-aligned, primary color
 * - Others' messages: left-aligned, neutral color
 * - System messages: centered, muted
 */
export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  senderName,
  className,
}: MessageBubbleProps) {
  // System messages
  if (message.type === "SYSTEM") {
    return (
      <div className={cn("flex justify-center py-2", className)}>
        <span className="text-xs text-[var(--pz-text-muted)] bg-[var(--pz-bg-secondary)] px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 max-w-[80%] group",
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto",
        className
      )}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <ChatAvatar
          name={senderName ?? message.senderId}
          size="sm"
          className="mt-1"
        />
      )}

      {/* Spacer when no avatar but others have one */}
      {!showAvatar && !isOwn && <div className="w-7 shrink-0" />}

      {/* Message content */}
      <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
        {/* Sender name (for received messages) */}
        {showAvatar && !isOwn && senderName && (
          <span className="text-[11px] font-medium text-[var(--pz-text-secondary)] mb-0.5 px-1">
            {senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap transition-shadow",
            isOwn
              ? "bg-[var(--pz-sent)] text-[var(--pz-sent-text)] rounded-br-md"
              : "bg-[var(--pz-received)] text-[var(--pz-received-text)] rounded-bl-md",
            "hover:shadow-md"
          )}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[var(--pz-text-muted)] mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
