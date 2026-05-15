// ============================================================
// ping-zero — TypingIndicator Component
// Shows animated dots when other users are typing.
// ============================================================

"use client";

import { cn } from "../utils.js";

interface TypingIndicatorProps {
  /** List of user names currently typing */
  typingUsers: string[];
  className?: string;
}

/**
 * TypingIndicator displays who is currently typing.
 * Shows animated bouncing dots alongside user names.
 */
export function TypingIndicator({ typingUsers, className }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing`
      : typingUsers.length === 2
        ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
        : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 text-xs text-[var(--pz-text-muted)]",
        className
      )}
    >
      {/* Animated dots */}
      <span className="flex gap-0.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--pz-text-muted)]"
          style={{
            animation: "pz-bounce 1.4s infinite ease-in-out both",
            animationDelay: "0s",
          }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--pz-text-muted)]"
          style={{
            animation: "pz-bounce 1.4s infinite ease-in-out both",
            animationDelay: "0.2s",
          }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--pz-text-muted)]"
          style={{
            animation: "pz-bounce 1.4s infinite ease-in-out both",
            animationDelay: "0.4s",
          }}
        />
      </span>

      <span>{text}</span>

      {/* Inline keyframes */}
      <style>{`
        @keyframes pz-bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
