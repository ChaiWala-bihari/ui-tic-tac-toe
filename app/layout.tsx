import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tic-Tac-Toe Arcade | Play Online vs Computer & PvP",
  description:
    "A production-grade Next.js Tic-Tac-Toe game with multiple difficulty levels (Easy, Medium, and unbeatable Minimax), local PvP, auto-play modes, custom board themes, retro synth sound effects, statistics, and accomplishments tracker.",
  keywords: [
    "Tic-Tac-Toe",
    "Game",
    "Minimax",
    "AI",
    "Next.js",
    "TypeScript",
    "React",
    "Tailwind CSS",
    "Accessibility",
  ],
  authors: [{ name: "Senior Frontend Developer" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans">
        {children}
      </body>
    </html>
  );
}
