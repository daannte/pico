import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JellyfinProvider } from "@/contexts/jellyfin-context";
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
  title: "Pico",
  description: "Minimal Jellyfin Web Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        <JellyfinProvider>
          {children}
        </JellyfinProvider>
      </body>
    </html>
  );
}
