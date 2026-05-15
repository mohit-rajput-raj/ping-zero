import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const POSTS = [
  {
    slug: "introducing-ping-zero",
    title: "Introducing ping-zero: Realtime Messaging in Minutes",
    excerpt:
      "We're launching ping-zero, an open-source framework that lets you ship production-ready chat with a single npm install. No more building WebSocket servers from scratch.",
    date: "May 12, 2026",
    readTime: "5 min read",
    tag: "Announcement",
  },
  {
    slug: "why-we-built-ping-zero",
    title: "Why We Built ping-zero: The State of Realtime in 2026",
    excerpt:
      "Every startup ends up building the same chat infrastructure. We looked at the landscape and decided it was time for a better abstraction — one that handles the boring parts so you don't have to.",
    date: "May 10, 2026",
    readTime: "8 min read",
    tag: "Engineering",
  },
  {
    slug: "auto-migration-pattern",
    title: "The Auto-Migration Pattern: How ping-zero Creates Tables on Startup",
    excerpt:
      "Inspired by better-auth, we use CREATE TABLE IF NOT EXISTS to eliminate the migration step entirely. Here's how the pattern works and why it's safe for production.",
    date: "May 8, 2026",
    readTime: "6 min read",
    tag: "Deep Dive",
  },
  {
    slug: "scaling-socketio",
    title: "Scaling Socket.IO: From Single Server to Redis Adapter",
    excerpt:
      "Socket.IO works great on a single server, but what happens when you need to scale horizontally? We explore the Redis adapter pattern and how ping-zero will support it.",
    date: "May 5, 2026",
    readTime: "10 min read",
    tag: "Architecture",
  },
  {
    slug: "building-chat-components",
    title: "Building Accessible Chat Components with shadcn/ui Patterns",
    excerpt:
      "How we designed the ping-zero React components to be beautiful, accessible, and infinitely customizable using CSS variables and the shadcn/ui composition pattern.",
    date: "May 3, 2026",
    readTime: "7 min read",
    tag: "Design",
  },
  {
    slug: "presence-multi-tab",
    title: "Multi-Tab Presence: Why Per-Socket Tracking Isn't Enough",
    excerpt:
      "Most presence systems mark you offline when a single tab closes. We built reference counting into ping-zero so presence reflects the actual user state across all their browser tabs.",
    date: "Apr 28, 2026",
    readTime: "4 min read",
    tag: "Engineering",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-14">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Engineering &amp; Updates
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg">
          Technical deep dives, product updates, and the thinking behind ping-zero.
        </p>
      </div>

      {/* Featured Post */}
      <Link
        href="#"
        className="block group mb-10 rounded-xl border bg-card p-8 hover:bg-muted/50 transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary" className="font-medium text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">
            {POSTS[0]!.tag}
          </Badge>
          <span className="text-[13px] text-muted-foreground font-medium">
            {POSTS[0]!.date}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {POSTS[0]!.title}
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-2xl">
          {POSTS[0]!.excerpt}
        </p>
        <span className="text-[13px] font-semibold text-primary group-hover:underline underline-offset-4">
          Read article →
        </span>
      </Link>

      {/* Post Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {POSTS.slice(1).map((post) => (
          <Link
            key={post.slug}
            href="#"
            className="group rounded-xl border bg-card p-6 hover:bg-muted/50 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="font-medium text-[10px] uppercase tracking-widest text-muted-foreground">
                {post.tag}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">
              {post.title}
            </h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed flex-1">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center justify-between text-[13px] text-muted-foreground font-medium">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
