// ============================================================
// ping-zero — MessageInput Component
// Text input with send button for composing messages.
// ============================================================

"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Send, Smile } from "lucide-react";
import { cn } from "../utils.js";

interface MessageInputProps {
  /** Called when the user sends a message */
  onSend: (content: string) => void;
  /** Called when the user is typing */
  onTyping?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disable the input */
  disabled?: boolean;
  className?: string;
}

/**
 * MessageInput is the chat text input with send button.
 * - Enter to send, Shift+Enter for newline
 * - Fires onTyping events as the user types
 * - Auto-resizing textarea
 */
export function MessageInput({
  onSend,
  onTyping,
  placeholder = "Type a message...",
  disabled = false,
  className,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Send on Enter (without Shift)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);

      // Auto-resize
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;

      // Fire typing event
      if (onTyping) onTyping();
    },
    [onTyping]
  );

  return (
    <div
      className={cn(
        "flex items-end gap-2 p-3 border-t border-[var(--pz-border)] bg-[var(--pz-bg)]",
        className
      )}
    >
      {/* Input area */}
      <div className="flex-1 flex items-end gap-2 bg-[var(--pz-bg-secondary)] rounded-2xl px-4 py-2 border border-[var(--pz-border)] focus-within:border-[var(--pz-primary)] focus-within:ring-1 focus-within:ring-[var(--pz-primary)] transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-[var(--pz-text)] placeholder:text-[var(--pz-text-muted)] focus:outline-none max-h-[120px] leading-relaxed"
        />
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={cn(
          "shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
          value.trim()
            ? "bg-[var(--pz-primary)] text-white hover:bg-[var(--pz-primary-hover)] hover:scale-105 active:scale-95 shadow-md"
            : "bg-[var(--pz-bg-secondary)] text-[var(--pz-text-muted)] cursor-not-allowed"
        )}
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
