// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// const FEATURES = [
//   {
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//       </svg>
//     ),
//     title: "WebSocket Communication",
//     description: "Built on Socket.IO. Automatic transport fallback, binary support, and native room management.",
//   },
//   {
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//       </svg>
//     ),
//     title: "Room & Channel System",
//     description: "Dynamic rooms created on-the-fly. No pre-configuration. Join a room, get history, start chatting.",
//   },
//   {
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//         <ellipse cx="12" cy="5" rx="9" ry="3" />
//         <path d="M3 5V19A9 3 0 0 0 21 19V5" />
//         <path d="M3 12A9 3 0 0 0 21 12" />
//       </svg>
//     ),
//     title: "Auto Database Storage",
//     description: "Tables created automatically via Prisma. Every message persisted. History loaded on room join.",
//   },
//   {
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
//       </svg>
//     ),
//     title: "Typing Indicators",
//     description: "Real-time typing status with 3-second auto-timeout. Smart multi-user display.",
//   },
//   {
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="12" cy="12" r="10" />
//         <path d="M8 12h.01M12 12h.01M16 12h.01" />
//       </svg>
//     ),
//     title: "Online Presence",
//     description: "Multi-tab aware presence tracking. Only marks offline when all browser tabs close.",
//   },
//   {
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
//       </svg>
//     ),
//     title: "Reconnect Handling",
//     description: "Automatic reconnection with room re-join and pending message flush. Exponential backoff.",
//   },
// ];

// const STEPS = [
//   {
//     step: "01",
//     title: "Install dependencies",
//     code: `npm install @ping-zero/server @ping-zero/react`,
//   },
//   {
//     step: "02",
//     title: "Initialize the server",
//     code: `import { createPingZero } from "@ping-zero/server"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// const chat = await createPingZero({
//   database: prisma,
//   cors: { origin: "http://localhost:3000" },
// })`,
//   },
//   {
//     step: "03",
//     title: "Drop in the UI",
//     code: `import { PingZeroProvider, ChatBox } from "@ping-zero/react"

// <PingZeroProvider config={{
//   url: "http://localhost:3001",
//   auth: { userId: "user1", userName: "Alice" },
// }}>
//   <ChatBox room="general" />
// </PingZeroProvider>`,
//   },
// ];

// export default function Page() {
//   return (
//     <>
//       {/* ── HERO ─────────────────────────────────────── */}
//       <section className="relative overflow-hidden pt-28 pb-20">
//         <div className="container mx-auto max-w-4xl px-6 text-center">
//           <Badge variant="outline" className="mb-8 border-primary/20 text-muted-foreground font-normal py-1">
//             <span className="mr-2 flex h-2 w-2">
//               <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75"></span>
//               <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
//             </span>
//             v0.1.0 — Open Source Beta
//           </Badge>

//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
//             Realtime messaging infrastructure <br className="hidden sm:inline" />
//             <span className="text-muted-foreground">for modern apps.</span>
//           </h1>

//           <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10">
//             Ship production-ready chat in minutes, not months. Auto-provisioned database, WebSocket server, and React components — all from a single npm install.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
//             <Link href="/docs" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto font-medium")}>
//               Get started — it&apos;s free
//             </Link>
//             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto font-medium")}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
//               Star on GitHub
//             </a>
//           </div>

//           <div className="inline-flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2 text-sm text-muted-foreground shadow-sm">
//             <span className="select-none opacity-50">$</span>
//             <code className="font-mono">npm i @ping-zero/server @ping-zero/react</code>
//           </div>
//         </div>
//       </section>

//       {/* ── CODE PREVIEW ─────────────────────────────── */}
//       <section className="container mx-auto max-w-5xl px-6 pb-24">
//         <div className="grid md:grid-cols-2 gap-6">
//           <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm overflow-hidden flex flex-col">
//             <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
//               <span className="text-xs font-medium text-muted-foreground font-mono">server.ts</span>
//             </div>
//             <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto text-muted-foreground flex-1">
//               <code>
//                 <span className="text-primary/90">import</span> {"{ createPingZero }"} <span className="text-primary/90">from</span> "@ping-zero/server"{"\n\n"}
//                 <span className="text-primary/90">const</span> chat = <span className="text-primary/90">await</span> createPingZero{"({"}{"\n"}
//                 {"  "}database: prisma,{"\n"}
//                 {"})"}
//               </code>
//             </pre>
//           </Card>
//           <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm overflow-hidden flex flex-col">
//             <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
//               <span className="text-xs font-medium text-muted-foreground font-mono">app.tsx</span>
//             </div>
//             <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto text-muted-foreground flex-1">
//               <code>
//                 <span className="text-primary/90">import</span> {"{ ChatBox }"} <span className="text-primary/90">from</span> "@ping-zero/react"{"\n\n"}
//                 {"// That's it. Seriously."}{"\n"}
//                 {"<"}ChatBox room=<span className="text-primary/90">"general"</span> {"/>"}
//               </code>
//             </pre>
//           </Card>
//         </div>
//       </section>

//       {/* ── TRUST BAR ────────────────────────────────── */}
//       <section className="border-y bg-muted/20">
//         <div className="container mx-auto max-w-5xl px-6 py-10 flex flex-col md:flex-row items-center justify-center gap-10">
//           <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold whitespace-nowrap">
//             Built with
//           </span>
//           <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-muted-foreground/80">
//             {["TypeScript", "Socket.IO", "React", "Prisma", "Node.js"].map((tech) => (
//               <span key={tech} className="text-sm font-medium tracking-tight">{tech}</span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── FEATURES ─────────────────────────────────── */}
//       <section id="features" className="container mx-auto max-w-6xl px-6 py-24 sm:py-32">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold tracking-tight mb-4">
//             Everything you need to ship chat
//           </h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
//             ping-zero abstracts away the complex realtime infrastructure so you can focus on building your product.
//           </p>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {FEATURES.map((feature) => (
//             <Card key={feature.title} className="bg-transparent border-border/50 shadow-none hover:bg-muted/30 transition-colors">
//               <CardHeader>
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-foreground mb-4">
//                   {feature.icon}
//                 </div>
//                 <CardTitle className="text-base">{feature.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-[13px] leading-relaxed">
//                   {feature.description}
//                 </CardDescription>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* ── HOW IT WORKS ─────────────────────────────── */}
//       <section id="how-it-works" className="border-t bg-muted/10">
//         <div className="container mx-auto max-w-4xl px-6 py-24 sm:py-32">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold tracking-tight mb-4">
//               Three steps to production chat
//             </h2>
//             <p className="text-muted-foreground">Setup is completely automated. No manual migrations needed.</p>
//           </div>

//           <div className="space-y-8">
//             {STEPS.map((step, idx) => (
//               <div key={step.step} className="flex gap-6">
//                 <div className="hidden sm:flex flex-col items-center">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-sm font-medium shrink-0">
//                     {step.step}
//                   </div>
//                   {idx !== STEPS.length - 1 && (
//                     <div className="w-px h-full bg-border mt-4" />
//                   )}
//                 </div>
//                 <div className="flex-1 pb-4">
//                   <h3 className="text-base font-semibold mb-4">
//                     {step.title}
//                   </h3>
//                   <Card className="overflow-hidden shadow-none">
//                     <pre className="p-4 text-[13px] text-muted-foreground leading-relaxed overflow-x-auto bg-muted/30">
//                       <code>{step.code}</code>
//                     </pre>
//                   </Card>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ──────────────────────────────────────── */}
//       <section className="border-t">
//         <div className="container mx-auto max-w-3xl px-6 py-24 sm:py-32 text-center">
//           <h2 className="text-3xl font-bold tracking-tight mb-4">
//             Ready to ship chat?
//           </h2>
//           <p className="text-muted-foreground mb-8 text-lg">
//             Stop building messaging from scratch. Get a production-ready realtime chat system in minutes.
//           </p>
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link href="/docs" className={cn(buttonVariants({ size: "lg" }), "font-medium")}>
//               Read the documentation
//             </Link>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  MessagesSquare,
  Database,
  PenTool,
  Globe,
  RefreshCcw,
  ChevronRight,
  Github,
  Terminal
} from "lucide-react";

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    title: "WebSocket Communication",
    description: "Built on Socket.IO. Automatic transport fallback, binary support, and native room management.",
  },
  {
    icon: <MessagesSquare className="w-5 h-5 text-blue-500" />,
    title: "Room & Channel System",
    description: "Dynamic rooms created on-the-fly. No pre-configuration. Join a room, get history, start chatting.",
  },
  {
    icon: <Database className="w-5 h-5 text-emerald-500" />,
    title: "Auto Database Storage",
    description: "Tables created automatically via Prisma. Every message persisted. History loaded on room join.",
  },
  {
    icon: <PenTool className="w-5 h-5 text-purple-500" />,
    title: "Typing Indicators",
    description: "Real-time typing status with 3-second auto-timeout. Smart multi-user display.",
  },
  {
    icon: <Globe className="w-5 h-5 text-sky-500" />,
    title: "Online Presence",
    description: "Multi-tab aware presence tracking. Only marks offline when all browser tabs close.",
  },
  {
    icon: <RefreshCcw className="w-5 h-5 text-orange-500" />,
    title: "Reconnect Handling",
    description: "Automatic reconnection with room re-join and pending message flush. Exponential backoff.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Install dependencies",
    code: `npm install @ping-zero/server @ping-zero/react`,
  },
  {
    step: "02",
    title: "Initialize the server",
    code: `import { createPingZero } from "@ping-zero/server"
const chat = await createPingZero({
  database: prisma,
  cors: { origin: "http://localhost:3000" },
})`,
  },
  {
    step: "03",
    title: "Drop in the UI",
    code: `<PingZeroProvider config={{ url: "..." }}>
  <ChatBox room="general" />
</PingZeroProvider>`,
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-background w-full flex flex-col items-center">
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 [background:radial-gradient(50%_50%_at_50%_50%,#3b82f610_0,transparent_100%)]" />

        <div className="container mx-auto max-w-5xl px-6 text-center">
          <Badge variant="secondary" className="mb-8 rounded-full px-4 py-1.5 text-sm font-medium border-primary/10 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-3 duration-1000">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            v0.1.0 — Now in Open Beta
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 text-balance">
            Realtime messaging <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              for modern apps.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 text-balance">
            Ship production-ready chat in minutes. Auto-provisioned infrastructure, WebSocket logic, and React components in one package.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/docs" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20")}>
              Get started <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
            <a href="#" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-12 px-8 text-base bg-background")}>
              <Github className="mr-2 w-4 h-4" /> Star on GitHub
            </a>
          </div>

          {/* Quick Install Snippet */}
          <div className="group relative mx-auto max-w-sm">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm font-mono shadow-sm">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">$</span>
              <code className="text-foreground">npm i @ping-zero/react</code>
            </div>
          </div>
        </div>
      </section>

      {/* ── CODE PREVIEW ─────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> Server Setup
            </div>
            <Card className="border-border/60 bg-black/5 dark:bg-white/[0.02] shadow-2xl">
              <pre className="p-6 text-[13px] font-mono leading-relaxed overflow-x-auto">
                <code className="text-foreground">
                  <span className="text-blue-500">import</span> {"{ createPingZero }"} <span className="text-blue-500">from</span> <span className="text-emerald-500">"@ping-zero/server"</span>{"\n\n"}
                  <span className="text-blue-500">const</span> chat = <span className="text-blue-500">await</span> createPingZero{"({"}{"\n"}
                  {"  "}database: prisma,{"\n"}
                  {"})"}
                </code>
              </pre>
            </Card>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Component Usage
            </div>
            <Card className="border-border/60 bg-black/5 dark:bg-white/[0.02] shadow-2xl">
              <pre className="p-6 text-[13px] font-mono leading-relaxed overflow-x-auto">
                <code className="text-foreground">
                  <span className="text-blue-500">import</span> {"{ ChatBox }"} <span className="text-blue-500">from</span> <span className="text-emerald-500">"@ping-zero/react"</span>{"\n\n"}
                  <span className="text-muted-foreground">// Drop-in React Component</span>{"\n"}
                  {"<"}ChatBox room=<span className="text-emerald-500">"general"</span> {"/>"}
                </code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────── */}
      <section id="features" className="container mx-auto max-w-6xl px-6 py-24 border-t">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful out of the box</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every feature you expect from a premium chat experience, built into a single lightweight package.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="group relative">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-card shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-primary/5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STEPS SECTION ────────────────────────────── */}
      <section className="bg-muted/30 py-24 border-y">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2">Three steps to production</h2>
            <p className="text-muted-foreground">Go from zero to chatting in under 60 seconds.</p>
          </div>

          <div className="grid gap-12">
            {STEPS.map((step) => (
              <div key={step.step} className="relative flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-black text-primary/10 select-none">{step.step}</span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <Card className="bg-zinc-950 overflow-hidden border-none">
                    <pre className="p-5 text-sm text-zinc-300 overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-6 py-32 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to scale?</h2>
        <p className="text-xl text-muted-foreground mb-10">
          Join 500+ developers building with PingZero. Open source and free forever.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/docs" className={cn(buttonVariants({ size: "lg" }), "px-10")}>
            Start Building
          </Link>
          <Link href="/docs" className={cn(buttonVariants({ size: "lg", variant: "ghost" }))}>
            View Examples
          </Link>
        </div>
      </section>
    </div>
  );
}