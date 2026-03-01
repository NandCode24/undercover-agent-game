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
  metadataBase: new URL("https://YOUR_VERCEL_URL.vercel.app"),

  title: {
    default: "Undercover Game Online – Play With Friends",
    template: "%s | Undercover Game",
  },

  description:
    "Play Undercover Game online with friends. A fun multiplayer word guessing party game where one player is undercover and must blend in without getting caught.",

  keywords: [
    "undercover game",
    "undercover game online",
    "play undercover online",
    "party game online",
    "spy word game",
    "multiplayer guessing game",
  ],

  openGraph: {
    title: "Undercover Game Online – Play With Friends",
    description: "Play the viral undercover party game online with friends.",
    url: "https://undercover-agent-game.vercel.app",
    siteName: "Undercover Game",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Undercover Game Online",
    description: "Play the undercover word guessing party game with friends.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
