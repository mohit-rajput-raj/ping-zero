# ping-zero

## The Instant Realtime Messaging Framework

> Drop-in chat infrastructure for Node.js apps. Install, configure, chat. Like **better-auth** but for messaging.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-black)](https://socket.io/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)

---

## 🚀 Quick Start

### 1. Install

```bash
# Server (Node.js backend)
npm install @ping-zero/server @prisma/client

# React frontend
npm install @ping-zero/react
```

### 2. Backend Setup (3 lines of code)

```ts
import { createPingZero } from "@ping-zero/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const chat = await createPingZero({
  database: prisma,
  cors: { origin: "http://localhost:3000" },
});
```

That's it. ping-zero will:
- ✅ Auto-create `pz_user` and `pz_message` tables in your database
- ✅ Start a Socket.IO WebSocket server
- ✅ Handle rooms, messages, typing, presence — everything

### 3. Frontend Setup (2 components)

```tsx
import { PingZeroProvider, ChatBox } from "@ping-zero/react";

function App() {
  return (
    <PingZeroProvider
      config={{
        url: "http://localhost:3000",
        auth: { userId: "user1", userName: "Alice" },
      }}
    >
      <ChatBox room="general" />
    </PingZeroProvider>
  );
}
```

You now have a fully working realtime chat. 🎉

---

## 📦 Packages

| Package | Description |
|---------|-------------|
| `@ping-zero/server` | Socket.IO server, room management, message persistence |
| `@ping-zero/client` | Browser/Node client with reconnection and message queuing |
| `@ping-zero/react` | React hooks + shadcn/ui components |
| `@ping-zero/prisma` | Database adapter with auto-migration |

---

## 🗄️ Auto-Migration (like better-auth)

When you call `createPingZero()`, it automatically creates two tables in your database:

### `pz_user`
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | User identifier |
| name | TEXT | Display name |
| avatar | TEXT | Avatar URL (optional) |
| isOnline | BOOLEAN | Online status |
| lastSeen | TIMESTAMP | Last activity |
| metadata | JSONB | Custom data |

### `pz_message`
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Message ID (auto-generated) |
| content | TEXT | Message text |
| roomId | TEXT | Room/channel |
| senderId | TEXT FK | User who sent it |
| type | TEXT | TEXT, IMAGE, or SYSTEM |
| readBy | JSONB | Array of user IDs who read it |
| metadata | JSONB | Custom data |

Tables are prefixed with `pz_` to avoid conflicts with your existing tables.

Uses `CREATE TABLE IF NOT EXISTS` — safe to call on every server start.

---

## 🔌 Server API

### `createPingZero(options)`

```ts
const chat = await createPingZero({
  // Required: Prisma client
  database: prisma,

  // Optional: Attach to existing HTTP server (Express, Fastify, etc.)
  httpServer: server,

  // Optional: CORS config (default: allow all)
  cors: {
    origin: ["http://localhost:3000", "https://myapp.com"],
    credentials: true,
  },

  // Optional: Auto-create tables (default: true)
  autoMigrate: true,

  // Optional: Custom auth validation
  authenticate: async (payload) => {
    // Verify the user exists in your system
    const user = await myDb.findUser(payload.userId);
    return !!user;
  },

  // Optional: WebSocket path (default: "/ping-zero")
  path: "/ping-zero",
});
```

### Server Instance

```ts
// Access the Socket.IO server directly
chat.io.on("connection", (socket) => {
  console.log("Custom handler!");
});

// Query the database
const messages = await chat.db.getMessages("general", 50);
const user = await chat.db.getUser("user1");

// Check presence
chat.presence.isOnline("user1"); // true/false

// Graceful shutdown
await chat.close();
```

### With Express

```ts
import express from "express";
import { createServer } from "http";
import { createPingZero } from "@ping-zero/server";
import { PrismaClient } from "@prisma/client";

const app = express();
const server = createServer(app);
const prisma = new PrismaClient();

const chat = await createPingZero({
  database: prisma,
  httpServer: server,
  cors: { origin: "http://localhost:3000" },
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
```

### With Next.js API Route

```ts
// app/api/chat/route.ts
import { createPingZero } from "@ping-zero/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initialize once
let chat: Awaited<ReturnType<typeof createPingZero>> | null = null;

async function getChat() {
  if (!chat) {
    chat = await createPingZero({
      database: prisma,
      cors: { origin: "*" },
    });
  }
  return chat;
}
```

---

## ⚛️ React API

### `<PingZeroProvider>`

Wraps your app and provides the chat connection:

```tsx
<PingZeroProvider
  config={{
    url: "http://localhost:3001",
    auth: {
      userId: "user-123",
      userName: "Alice",
      userAvatar: "https://example.com/alice.jpg", // optional
    },
    path: "/ping-zero", // optional, must match server
  }}
>
  {children}
</PingZeroProvider>
```

### `<ChatBox>`

All-in-one chat component:

```tsx
<ChatBox
  room="general"            // Room ID (required)
  title="General Chat"      // Header title (optional)
  showHeader={true}         // Show/hide header (optional)
  height="600px"            // Container height (optional)
  className="rounded-2xl"   // CSS classes (optional)
/>
```

### Individual Components

Build a custom chat UI with individual components:

```tsx
import {
  MessageList,
  MessageInput,
  MessageBubble,
  TypingIndicator,
  ChatAvatar,
} from "@ping-zero/react";
```

### Hooks

```tsx
import {
  useChatRoom,
  usePresence,
  useUnreadCounts,
  usePingZeroContext,
} from "@ping-zero/react";

function MyChat() {
  // Full room management
  const {
    messages,         // PZMessage[]
    sendMessage,      // (content: string) => Promise<void>
    handleTyping,     // () => void — call on input change
    typingUsers,      // string[] — names of typing users
    isJoined,         // boolean
    isLoading,        // boolean
    hasMore,          // boolean — more history available
    loadMore,         // () => Promise<void>
    currentUserId,    // string | null
  } = useChatRoom("general");

  // Online/offline tracking
  const { isOnline, onlineUsers } = usePresence();

  // Unread message counts
  const { getCount, totalUnread } = useUnreadCounts();

  // Raw context access
  const { client, user, isConnected } = usePingZeroContext();
}
```

---

## 📡 Client API (Standalone)

Use the client directly without React:

```ts
import { createPingZeroClient } from "@ping-zero/client";

const client = createPingZeroClient({
  url: "http://localhost:3001",
  auth: { userId: "user1", userName: "Alice" },
});

// Connect
const user = await client.connect();

// Join a room
const { messages, members } = await client.joinRoom("general");

// Send messages
await client.sendMessage("general", "Hello!");

// Listen for messages
const unsub = client.onMessage("general", (msg) => {
  console.log(`${msg.senderId}: ${msg.content}`);
});

// Typing indicators
client.startTyping("general");
client.stopTyping("general");
client.onTyping("general", ({ userName, isTyping }) => {
  console.log(`${userName} ${isTyping ? "is" : "stopped"} typing`);
});

// Presence
client.onPresence(({ userId, isOnline }) => {
  console.log(`${userId} is ${isOnline ? "online" : "offline"}`);
});

// Load history
const { messages: older, hasMore } = await client.fetchHistory("general", {
  before: messages[0].id,
  limit: 50,
});

// Cleanup
unsub();
client.disconnect();
```

---

## 🔄 How It Works

### WebSocket Event Flow

```
Client                      Server                     Database
  │                           │                           │
  │── connect(auth) ─────────>│                           │
  │                           │── UPSERT user ──────────>│
  │<── connected(user) ──────│                           │
  │                           │                           │
  │── room:join("general") ──>│                           │
  │                           │── SELECT messages ──────>│
  │<── room:joined(msgs) ────│                           │
  │                           │                           │
  │── message:send(data) ────>│                           │
  │                           │── INSERT message ───────>│
  │                           │── broadcast to room ──────│
  │<── message:sent(id) ─────│                           │
```

### Reconnection

1. Socket.IO auto-reconnects with exponential backoff
2. On reconnect, the client re-joins all previously joined rooms
3. Unsent messages (queued offline) are flushed automatically
4. Presence updates: user goes back online

### Broadcasting

When a message is sent:
1. Client emits `message:send` → Server
2. Server saves to database (persistence first!)
3. Server calls `io.to(roomId).emit()` → all room members get the message
4. Sender gets a `message:sent` confirmation

### Rooms/Channels

- Rooms are virtual (no pre-creation needed)
- Identified by string IDs (`"general"`, `"support-123"`, etc.)
- Socket.IO manages the member sets internally
- Messages are scoped to rooms via `roomId` column
- Join a room → get last 50 messages + member list

---

## 🏗️ Project Structure

```
ping-zero/
├── packages/
│   ├── prisma/          # Database adapter + auto-migration
│   │   └── src/
│   │       ├── types.ts        # Shared TypeScript types
│   │       ├── migrations.ts   # CREATE TABLE IF NOT EXISTS
│   │       ├── database.ts     # CRUD operations
│   │       └── index.ts        # Barrel export
│   │
│   ├── server/          # Socket.IO server
│   │   └── src/
│   │       ├── server.ts          # createPingZero() factory
│   │       ├── room-manager.ts    # Join/leave/history
│   │       ├── message-handler.ts # Send/read/broadcast
│   │       ├── presence-manager.ts # Online/offline tracking
│   │       ├── typing-manager.ts  # Typing indicators
│   │       └── index.ts
│   │
│   ├── client/          # Browser/Node client
│   │   └── src/
│   │       ├── client.ts  # PingZeroClient class
│   │       └── index.ts
│   │
│   └── react/           # React components
│       └── src/
│           ├── hooks.tsx         # Provider + hooks
│           ├── utils.ts          # cn(), formatTime, etc.
│           ├── styles.css        # CSS variables for theming
│           └── components/
│               ├── chat-box.tsx
│               ├── message-list.tsx
│               ├── message-bubble.tsx
│               ├── message-input.tsx
│               ├── typing-indicator.tsx
│               └── chat-avatar.tsx
│
└── apps/
    └── web/             # Demo application
```

---

## 🎨 Theming

ping-zero uses CSS custom properties for theming. Override them in your CSS:

```css
:root {
  --pz-primary: #6366f1;        /* Primary/accent color */
  --pz-sent: #6366f1;           /* Sent message bubble */
  --pz-sent-text: #ffffff;      /* Sent message text */
  --pz-received: #f1f5f9;       /* Received message bubble */
  --pz-bg: #ffffff;             /* Background */
  --pz-border: #e2e8f0;         /* Border color */
  --pz-online: #22c55e;         /* Online indicator */
  --pz-radius: 0.75rem;         /* Border radius */
}
```

Dark mode is automatic — add `.dark` or `[data-theme="dark"]` to your root element.

---

## 📋 Roadmap

- [x] Core WebSocket server (Socket.IO)
- [x] Auto-migration (like better-auth)
- [x] Message persistence (Prisma)
- [x] Room/channel management
- [x] Typing indicators
- [x] Online/offline presence
- [x] Unread message counts
- [x] Reconnect handling
- [x] React components (shadcn/ui style)
- [x] Dark mode support
- [ ] Redis adapter (horizontal scaling)
- [ ] File/image uploads
- [ ] Message reactions
- [ ] Thread/reply support
- [ ] E2E encryption
- [ ] Rate limiting
- [ ] Admin dashboard
- [ ] Vue.js components
- [ ] React Native components

---

## 📄 License

MIT © ping-zero

---

<p align="center">
  <strong>Built with ❤️ for developers who just want chat to work.</strong>
</p>

///halted mode =>production is halted due to a techinical issue
