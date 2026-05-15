import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const TEAM = [
  { name: "Alex Chen", role: "Creator & Lead", avatar: "AC" },
  { name: "Priya Sharma", role: "Core Contributor", avatar: "PS" },
  { name: "Marcus Webb", role: "Developer Relations", avatar: "MW" },
];

const VALUES = [
  {
    title: "Developer-first",
    description: "Every API decision starts with the question: what would a developer expect? We optimize for the 5-minute quickstart.",
  },
  {
    title: "Zero configuration",
    description: "ping-zero works out of the box. Tables auto-created, WebSocket server auto-configured, components auto-themed.",
  },
  {
    title: "Open source forever",
    description: "MIT licensed, always. The core framework will never be paywalled. We believe infrastructure should be transparent.",
  },
  {
    title: "Production-ready defaults",
    description: "Reconnect handling, message queuing, presence tracking — all enabled by default. You shouldn't need to think about these.",
  },
];

const STATS = [
  { value: "4", label: "Packages" },
  { value: "25+", label: "Source files" },
  { value: "13", label: "WebSocket events" },
  { value: "< 5min", label: "Setup time" },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
          We&apos;re building the messaging layer
          <br />
          <span className="text-muted-foreground">so you don&apos;t have to.</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg mx-auto">
          ping-zero started from a simple observation: every team building a product with chat
          ends up writing the same WebSocket server, the same message storage, the same React
          components. We decided to package all of that into a single, well-tested framework
          that works from day one.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-6 text-center"
          >
            <div className="text-3xl font-bold text-foreground mb-2">
              {stat.value}
            </div>
            <div className="text-[12px] text-muted-foreground font-semibold uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="mb-24">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Our mission
        </h2>
        <div className="rounded-xl border bg-muted/30 p-8 sm:p-10">
          <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed tracking-tight">
            &ldquo;Make realtime messaging a solved problem. Developers should spend zero time
            on chat infrastructure and 100% of their time on what makes their product unique.&rdquo;
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-24">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          Principles
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border bg-card p-8"
            >
              <h3 className="text-lg font-bold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-24">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          Team
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {TEAM.map((person) => (
            <div
              key={person.name}
              className="rounded-xl border bg-card p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted border flex items-center justify-center mx-auto mb-5 text-foreground font-bold text-lg">
                {person.avatar}
              </div>
              <h3 className="text-base font-bold text-foreground">
                {person.name}
              </h3>
              <p className="text-[13px] text-muted-foreground mt-1.5 font-medium">
                {person.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border bg-muted/10 p-12 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Want to contribute?
        </h2>
        <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
          ping-zero is open source and we welcome contributions of all kinds — code, docs, bug reports, or ideas.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "font-medium")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            View on GitHub
          </a>
          <Link href="/docs" className={cn(buttonVariants({ variant: "outline" }), "font-medium")}>
            Read the docs
          </Link>
        </div>
      </div>
    </div>
  );
}
