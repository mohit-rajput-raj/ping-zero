import type { Metadata } from "next";
import "./globals.css";

import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "ping-zero — The Realtime Messaging Infrastructure",
  description:
    "Open-source realtime messaging framework for Node.js. Auto-provisioned database, WebSocket server, and React components. Ship chat in minutes.",
  keywords: [
    "realtime",
    "messaging",
    "chat",
    "websocket",
    "socket.io",
    "react",
    "node.js",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground">
        <Navbar />
        <main className="flex-1 w-full ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
