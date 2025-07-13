import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Analytics from "./components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A Best and Last Todo App you wanna use, I wanted have a todo app like this & I personally use it daily",
  keywords: "todo, app, todo app, todo list, todo list app, todo list app, todo list app, best todos app, best todo list app, best todo lest",
  openGraph: {
    title: "Todo App",
    description: "A Best and Last Todo App you wanna use, I wanted have a todo app like this & I personally use it daily",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Todo App",
      },
    ],
  },
  verification: {
    google: 'BhJrHvP820i8RZ3nEKPnvulfJ26NSopHTu8_Jw0u-Vs',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics/>
        {children}
      </body>
    </html>
  );
}
