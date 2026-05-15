// ============================================================
// ping-zero — MessageList Component
// Scrollable list of messages with auto-scroll and load-more.
// ============================================================

"use client";

import { useEffect, useRef, useCallback } from "react";
import type { PZMessage } from "@ping-zero/prisma";
import { cn } from "../utils.js";
import { MessageBubble } from "./message-bubble.js";
import { ChevronUp, Loader2 } from "lucide-react";

interface MessageListProps {
  messages: PZMessage[];
  currentUserId: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * MessageList renders the scrollable message area.
 * - Auto-scrolls to bottom on new messages
 * - Shows a "Load more" button for history
 * - Groups consecutive messages from same sender
 */
export function MessageList({
  messages,
  currentUserId,
  hasMore = false,
  onLoadMore,
  isLoading = false,
  className,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  // Track if user is near the bottom
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const threshold = 100;
    isNearBottom.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Auto-scroll to bottom on new messages (only if already near bottom)
  useEffect(() => {
    if (isNearBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      bottomRef.current?.scrollIntoView();
    }
  }, [isLoading]);

  // Determine if we should show avatar (first message in a group from same sender)
  const shouldShowAvatar = (index: number): boolean => {
    if (index === 0) return true;
    const prev = messages[index - 1];
    const curr = messages[index];
    if (!prev || !curr) return true;
    return prev.senderId !== curr.senderId;
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        "flex-1 overflow-y-auto px-4 py-3 space-y-1",
        "scrollbar-thin scrollbar-thumb-[var(--pz-border)] scrollbar-track-transparent",
        className
      )}
    >
      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center py-2">
          <button
            onClick={onLoadMore}
            className="flex items-center gap-1.5 text-xs text-[var(--pz-primary)] hover:text-[var(--pz-primary-hover)] bg-[var(--pz-primary-light)] px-3 py-1.5 rounded-full transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Load older messages
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[var(--pz-primary)] animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-[var(--pz-primary-light)] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-sm font-medium text-[var(--pz-text-secondary)]">
            No messages yet
          </p>
          <p className="text-xs text-[var(--pz-text-muted)] mt-1">
            Be the first to send a message!
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
          showAvatar={shouldShowAvatar(index)}
          senderName={message.senderId}
        />
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
