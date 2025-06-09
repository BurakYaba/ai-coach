import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/providers/QueryProvider";
import NextAuthSessionProvider from "@/components/providers/session-provider";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Fluenta | Master English with AI-Powered Learning",
    template: "%s | Fluenta",
  },
  description:
    "Master English with Fluenta's AI-powered reading, writing, listening, speaking, vocabulary, and grammar practice. Get personalized feedback and track your progress.",
  keywords:
    "language learning, English learning app, AI language tutor, English practice, vocabulary builder, grammar lessons, speaking practice, Fluenta, AI English learning, personalized English tutor",
  authors: [{ name: "Fluenta Team" }],
  creator: "Fluenta",
  publisher: "Fluenta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.fluenta-ai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.fluenta-ai.com",
    title: "Fluenta | Master English with AI-Powered Learning",
    description:
      "Master English with Fluenta's AI-powered reading, writing, listening, speaking, vocabulary, and grammar practice. Get personalized feedback and track your progress.",
    siteName: "Fluenta",
    images: [
      {
        url: "/og-images/og-home.png",
        width: 1200,
        height: 630,
        alt: "Fluenta - AI-Powered English Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluenta | Master English with AI-Powered Learning",
    description:
      "Master English with Fluenta's AI-powered reading, writing, listening, speaking, vocabulary, and grammar practice.",
    images: ["/og-images/og-home.png"],
    creator: "@fluenta",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Add your actual verification code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="icon"
          href="/icon-192x192.svg"
          type="image/svg+xml"
          sizes="192x192"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <GoogleAnalytics />
        <NextAuthSessionProvider>
          <QueryProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </QueryProvider>
        </NextAuthSessionProvider>
        <Toaster />
        <SonnerToaster position="top-right" />
      </body>
    </html>
  );
}
