// ============================================================
// ping-zero — React Context & Provider
// Provides the PingZeroClient instance to all child components.
// ============================================================

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  PingZeroClient,
  createPingZeroClient,
  type PingZeroClientOptions,
  type PZUser,
  type PZMessage,
} from "@ping-zero/client";

// ── Context Types ──────────────────────────────────────────

interface PingZeroContextValue {
  /** The client instance */
  client: PingZeroClient | null;
  /** Current authenticated user */
  user: PZUser | null;
  /** Connection status */
  isConnected: boolean;
  /** Connection error if any */
  error: string | null;
}

const PingZeroContext = createContext<PingZeroContextValue>({
  client: null,
  user: null,
  isConnected: false,
  error: null,
});

// ── Provider Component ─────────────────────────────────────

interface PingZeroProviderProps {
  /** Client configuration */
  config: PingZeroClientOptions;
  /** Child components */
  children: ReactNode;
}

/**
 * PingZeroProvider wraps your app and provides the chat client
 * to all child components via React context.
 *
 * @example
 * ```tsx
 * <PingZeroProvider config={{
 *   url: "http://localhost:3000",
 *   auth: { userId: "user1", userName: "Alice" },
 * }}>
 *   <ChatBox room="general" />
 * </PingZeroProvider>
 * ```
 */
export function PingZeroProvider({ config, children }: PingZeroProviderProps) {
  const [client, setClient] = useState<PingZeroClient | null>(null);
  const [user, setUser] = useState<PZUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<PingZeroClient | null>(null);

  useEffect(() => {
    // Create and connect client
    const pzClient = createPingZeroClient(config);
    clientRef.current = pzClient;
    setClient(pzClient);

    pzClient
      .connect()
      .then((connectedUser) => {
        setUser(connectedUser);
        setIsConnected(true);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsConnected(false);
      });

    // Cleanup on unmount
    return () => {
      pzClient.disconnect();
      clientRef.current = null;
    };
  }, [config.url, config.auth.userId]);

  return (
    <PingZeroContext.Provider value={{ client, user, isConnected, error }}>
      {children}
    </PingZeroContext.Provider>
  );
}

// ── Hooks ──────────────────────────────────────────────────

/**
 * Get the ping-zero context (client, user, connection status).
 * Must be used inside a <PingZeroProvider>.
 */
export function usePingZeroContext(): PingZeroContextValue {
  const context = useContext(PingZeroContext);
  if (!context.client && !context.error) {
    // Context exists but no client yet — still initializing
  }
  return context;
}

/**
 * Hook to manage a chat room.
 * Handles joining, messages, typing, and cleanup.
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, typingUsers } = useChatRoom("general");
 * ```
 */
export function useChatRoom(roomId: string) {
  const { client, user } = usePingZeroContext();
  const [messages, setMessages] = useState<PZMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [isJoined, setIsJoined] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Join room and load history
  useEffect(() => {
    if (!client || !roomId) return;

    let cancelled = false;

    const join = async () => {
      try {
        setIsLoading(true);
        const { messages: history } = await client.joinRoom(roomId);
        if (!cancelled) {
          setMessages(history);
          setIsJoined(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[ping-zero] Failed to join room:", err);
        if (!cancelled) setIsLoading(false);
      }
    };

    join();

    return () => {
      cancelled = true;
      client.leaveRoom(roomId);
      setIsJoined(false);
      setMessages([]);
      setTypingUsers(new Map());
    };
  }, [client, roomId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!client || !roomId) return;

    const unsub = client.onMessage(roomId, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return unsub;
  }, [client, roomId]);

  // Subscribe to typing indicators
  useEffect(() => {
    if (!client || !roomId) return;

    const unsub = client.onTyping(roomId, (data) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (data.isTyping) {
          next.set(data.userId, data.userName);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    return unsub;
  }, [client, roomId]);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!client || !content.trim()) return;

      try {
        await client.sendMessage(roomId, content.trim());
      } catch (err) {
        console.error("[ping-zero] Failed to send message:", err);
      }
    },
    [client, roomId]
  );

  // Handle typing with debounce
  const handleTyping = useCallback(() => {
    if (!client) return;

    client.startTyping(roomId);

    // Auto-stop after 2 seconds of no typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      client.stopTyping(roomId);
    }, 2000);
  }, [client, roomId]);

  // Load older messages
  const loadMore = useCallback(async () => {
    if (!client || messages.length === 0) return;

    const oldest = messages[0];
    if (!oldest) return;

    const { messages: older, hasMore: more } = await client.fetchHistory(roomId, {
      before: oldest.id,
      limit: 50,
    });

    setMessages((prev) => [...older, ...prev]);
    setHasMore(more);
  }, [client, roomId, messages]);

  return {
    messages,
    sendMessage,
    handleTyping,
    typingUsers: Array.from(typingUsers.values()),
    isJoined,
    isLoading,
    hasMore,
    loadMore,
    currentUserId: user?.id ?? null,
  };
}

/**
 * Hook to track online/offline presence.
 */
export function usePresence() {
  const { client } = usePingZeroContext();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!client) return;

    const unsub = client.onPresence((data) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (data.isOnline) {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    return unsub;
  }, [client]);

  return {
    onlineUsers,
    isOnline: (userId: string) => onlineUsers.has(userId),
  };
}

/**
 * Hook to track unread message counts.
 */
export function useUnreadCounts() {
  const { client } = usePingZeroContext();
  const [counts, setCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!client) return;

    const unsub = client.onUnread((data) => {
      setCounts((prev) => {
        const next = new Map(prev);
        next.set(data.roomId, data.count);
        return next;
      });
    });

    return unsub;
  }, [client]);

  return {
    counts,
    getCount: (roomId: string) => counts.get(roomId) ?? 0,
    totalUnread: Array.from(counts.values()).reduce((a, b) => a + b, 0),
  };
}
