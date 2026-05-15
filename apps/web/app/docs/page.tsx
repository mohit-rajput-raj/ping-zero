import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const SIDEBAR = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "#introduction", active: true },
      { label: "Installation", href: "#installation" },
      { label: "Quick Start", href: "#quickstart" },
    ],
  },
  {
    title: "Server",
    items: [
      { label: "createPingZero()", href: "#create-ping-zero" },
      { label: "Configuration", href: "#server-config" },
      { label: "Authentication", href: "#authentication" },
      { label: "Express Integration", href: "#express" },
      { label: "Next.js Integration", href: "#nextjs" },
    ],
  },
  {
    title: "Client",
    items: [
      { label: "Client SDK", href: "#client-sdk" },
      { label: "Rooms", href: "#rooms" },
      { label: "Messages", href: "#messages" },
      { label: "Typing Indicators", href: "#typing" },
      { label: "Presence", href: "#presence" },
    ],
  },
  {
    title: "React",
    items: [
      { label: "PingZeroProvider", href: "#provider" },
      { label: "ChatBox", href: "#chatbox" },
      { label: "useChatRoom", href: "#use-chat-room" },
      { label: "usePresence", href: "#use-presence" },
      { label: "Theming", href: "#theming" },
    ],
  },
  {
    title: "Database",
    items: [
      { label: "Auto-Migration", href: "#auto-migration" },
      { label: "Schema", href: "#schema" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto max-w-7xl flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-6">
        <nav className="space-y-8">
          {SIDEBAR.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-foreground mb-3 tracking-tight">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={`block px-3 py-1.5 text-[14px] rounded-md transition-colors ${
                        item.active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 px-6 lg:px-12 py-12 max-w-3xl">
        {/* Introduction */}
        <section id="introduction" className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Introduction
          </h1>
          <p className="text-muted-foreground leading-relaxed text-[15px] mb-6">
            ping-zero is an open-source realtime messaging framework for Node.js applications.
            Install it, connect your database, and get a fully working chat system with
            WebSocket communication, message persistence, typing indicators, presence tracking,
            and React UI components.
          </p>
          <div className="rounded-xl border bg-muted/30 p-5 text-[14px] text-muted-foreground leading-relaxed border-l-4 border-l-foreground">
            <span className="font-bold text-foreground">Think of it like better-auth, but for chat.</span>{" "}
            Connect your Prisma client, and ping-zero auto-creates the necessary database tables,
            starts a WebSocket server, and gives you React components to drop into your frontend.
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Installation
          </h2>
          <p className="text-muted-foreground text-[15px] mb-6">
            Install the packages you need based on your stack:
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mb-3">Full-stack (recommended)</h3>
          <div className="rounded-lg border bg-card overflow-hidden mb-6">
            <div className="px-4 py-2 border-b bg-muted/50 text-[12px] font-medium text-muted-foreground font-mono">Terminal</div>
            <pre className="p-4 text-[13px] text-muted-foreground overflow-x-auto">
              <code>npm install @ping-zero/server @ping-zero/react @prisma/client</code>
            </pre>
          </div>

          <h3 className="text-[15px] font-semibold text-foreground mb-3">Backend only</h3>
          <div className="rounded-lg border bg-card overflow-hidden mb-6">
            <div className="px-4 py-2 border-b bg-muted/50 text-[12px] font-medium text-muted-foreground font-mono">Terminal</div>
            <pre className="p-4 text-[13px] text-muted-foreground overflow-x-auto">
              <code>npm install @ping-zero/server @prisma/client</code>
            </pre>
          </div>

          <h3 className="text-[15px] font-semibold text-foreground mb-3">Frontend only</h3>
          <div className="rounded-lg border bg-card overflow-hidden mb-8">
            <div className="px-4 py-2 border-b bg-muted/50 text-[12px] font-medium text-muted-foreground font-mono">Terminal</div>
            <pre className="p-4 text-[13px] text-muted-foreground overflow-x-auto">
              <code>npm install @ping-zero/react</code>
            </pre>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="mb-16 border-t pt-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Quick Start
          </h2>

          <h3 className="text-[15px] font-semibold text-foreground mb-3">1. Start the server</h3>
          <div className="rounded-lg border bg-card overflow-hidden mb-8">
            <div className="px-4 py-2 border-b bg-muted/50 text-[12px] font-medium text-muted-foreground font-mono">server.ts</div>
            <pre className="p-4 text-[13px] text-muted-foreground leading-relaxed overflow-x-auto">
              {`import { createPingZero } from "@ping-zero/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const chat = await createPingZero({
  database: prisma,
  cors: { origin: "http://localhost:3000" },
})`}
            </pre>
          </div>

          <h3 className="text-[15px] font-semibold text-foreground mb-3">2. Add the React components</h3>
          <div className="rounded-lg border bg-card overflow-hidden mb-6">
            <div className="px-4 py-2 border-b bg-muted/50 text-[12px] font-medium text-muted-foreground font-mono">app.tsx</div>
            <pre className="p-4 text-[13px] text-muted-foreground leading-relaxed overflow-x-auto">
              {`import { PingZeroProvider, ChatBox } from "@ping-zero/react"

function App() {
  return (
    <PingZeroProvider config={{
      url: "http://localhost:3001",
      auth: { userId: "user1", userName: "Alice" },
    }}>
      <ChatBox room="general" />
    </PingZeroProvider>
  )
}`}
            </pre>
          </div>
        </section>

        {/* Server API */}
        <section id="create-ping-zero" className="mb-16 border-t pt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            createPingZero()
          </h2>
          <p className="text-muted-foreground text-[15px] mb-6">
            The main factory function. Creates a fully configured realtime messaging server.
          </p>
          <div className="rounded-lg border bg-card overflow-hidden mb-8">
            <div className="px-4 py-2 border-b bg-muted/50 text-[12px] font-medium text-muted-foreground font-mono">Options</div>
            <pre className="p-4 text-[13px] text-muted-foreground leading-relaxed overflow-x-auto">
              {`const chat = await createPingZero({
  database: prisma,           // Required: Prisma client
  httpServer: server,         // Optional: Attach to HTTP server
  cors: {                     // Optional: CORS config
    origin: ["http://localhost:3000"],
    credentials: true,
  },
  autoMigrate: true,          // Optional: Auto-create tables (default: true)
  authenticate: async (auth) => {  // Optional: Custom auth
    return !!await db.findUser(auth.userId)
  },
  path: "/ping-zero",         // Optional: WebSocket path
})`}
            </pre>
          </div>

          <h3 className="text-[15px] font-semibold text-foreground mb-4">Return value</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-foreground">Property</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Type</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground divide-y">
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">io</td><td className="py-3 px-4">Server</td><td className="py-3 px-4">Socket.IO server instance</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">db</td><td className="py-3 px-4">PingZeroDatabase</td><td className="py-3 px-4">Database adapter</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">rooms</td><td className="py-3 px-4">RoomManager</td><td className="py-3 px-4">Room management</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">presence</td><td className="py-3 px-4">PresenceManager</td><td className="py-3 px-4">Online/offline tracking</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">close</td><td className="py-3 px-4">() =&gt; Promise</td><td className="py-3 px-4">Graceful shutdown</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Auto Migration */}
        <section id="auto-migration" className="mb-16 border-t pt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Auto-Migration
          </h2>
          <p className="text-muted-foreground text-[15px] mb-8 leading-relaxed">
            When <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[13px] text-foreground">createPingZero()</code> runs,
            it automatically creates two tables in your database using <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[13px] text-foreground">CREATE TABLE IF NOT EXISTS</code>.
            This is safe to run on every server start.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mb-4">pz_user</h3>
          <div className="overflow-x-auto border rounded-lg mb-8">
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-foreground">Column</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Type</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground divide-y">
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">id</td><td className="py-3 px-4">TEXT PK</td><td className="py-3 px-4">Unique user ID</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">name</td><td className="py-3 px-4">TEXT</td><td className="py-3 px-4">Display name</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">avatar</td><td className="py-3 px-4">TEXT</td><td className="py-3 px-4">Avatar URL (nullable)</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">isOnline</td><td className="py-3 px-4">BOOLEAN</td><td className="py-3 px-4">Online status</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">lastSeen</td><td className="py-3 px-4">TIMESTAMP</td><td className="py-3 px-4">Last activity</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-[15px] font-semibold text-foreground mb-4">pz_message</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-foreground">Column</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Type</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground divide-y">
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">id</td><td className="py-3 px-4">TEXT PK</td><td className="py-3 px-4">Auto-generated ID</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">content</td><td className="py-3 px-4">TEXT</td><td className="py-3 px-4">Message body</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">roomId</td><td className="py-3 px-4">TEXT</td><td className="py-3 px-4">Room identifier</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">senderId</td><td className="py-3 px-4">TEXT FK</td><td className="py-3 px-4">References pz_user</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">type</td><td className="py-3 px-4">TEXT</td><td className="py-3 px-4">TEXT, IMAGE, SYSTEM</td></tr>
                <tr><td className="py-3 px-4 font-mono text-foreground font-medium">readBy</td><td className="py-3 px-4">JSONB</td><td className="py-3 px-4">User IDs who read it</td></tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
