// ============================================================
// ping-zero — ChatAvatar Component
// Displays user avatars with online status indicator.
// ============================================================

"use client";

import { cn, getInitials, stringToColor } from "../utils.js";

interface ChatAvatarProps {
  name: string;
  avatar?: string | null;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
};

const dotSizeMap = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
};

/**
 * ChatAvatar displays a user's avatar image or colored initials fallback.
 * Optionally shows an online/offline status dot.
 */
export function ChatAvatar({
  name,
  avatar,
  isOnline,
  size = "md",
  className,
}: ChatAvatarProps) {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className={cn(
            sizeMap[size],
            "rounded-full object-cover ring-2 ring-[var(--pz-bg)]"
          )}
        />
      ) : (
        <div
          className={cn(
            sizeMap[size],
            "rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-[var(--pz-bg)]"
          )}
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>
      )}

      {/* Online status dot */}
      {isOnline !== undefined && (
        <span
          className={cn(
            dotSizeMap[size],
            "absolute bottom-0 right-0 rounded-full border-2 border-[var(--pz-bg)]",
            isOnline
              ? "bg-[var(--pz-online)]"
              : "bg-[var(--pz-offline)]"
          )}
        />
      )}
    </div>
  );
}
