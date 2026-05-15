// ============================================================
// ping-zero — Utility Functions
// Shared helpers for the React components.
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (shadcn/ui pattern) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a timestamp for display in the chat.
 * Shows time for today, "Yesterday" for yesterday, date for older.
 */
export function formatMessageTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  // Today
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return time;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth()) {
    return `Yesterday ${time}`;
  }

  // Older
  const month = d.toLocaleString("default", { month: "short" });
  return `${month} ${d.getDate()} ${time}`;
}

/**
 * Get initials from a name (for avatar fallbacks).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Generate a consistent color from a string (for avatar backgrounds).
 */
export function stringToColor(str: string): string {
  const colors = [
    "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#ef4444", "#f97316",
    "#eab308", "#84cc16", "#22c55e", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]!;
}
