import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/providers/QueryProvider";
import NextAuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Language Learning Platform",
  description: "Learn languages effectively with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <NextAuthSessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </NextAuthSessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
