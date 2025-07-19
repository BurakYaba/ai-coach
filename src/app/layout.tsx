import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/providers/QueryProvider";
import NextAuthSessionProvider from "@/components/providers/session-provider";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import TurkishGoogleAnalytics from "@/components/analytics/TurkishGoogleAnalytics";
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
    languages: {
      en: "/en",
      tr: "/",
    },
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
        url: "https://www.fluenta-ai.com/og-images/og-home.png",
        width: 1200,
        height: 630,
        alt: "Fluenta - AI-Powered English Learning Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluenta | Master English with AI-Powered Learning",
    description:
      "Master English with Fluenta's AI-powered reading, writing, listening, speaking, vocabulary, and grammar practice.",
    images: ["https://www.fluenta-ai.com/og-images/og-home.png"],
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
    google: "fluenta-verification-code", // Replace with your actual verification code
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

        {/* Hreflang for internationalization */}
        <link
          rel="alternate"
          hrefLang="en"
          href="https://www.fluenta-ai.com/"
        />
        <link
          rel="alternate"
          hrefLang="tr"
          href="https://www.fluenta-ai.com/tr/"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.fluenta-ai.com/"
        />

        {/* Explicit Open Graph tags for better social media compatibility */}
        <meta
          property="og:title"
          content="Fluenta | Master English with AI-Powered Learning"
        />
        <meta
          property="og:description"
          content="Master English with Fluenta's AI-powered reading, writing, listening, speaking, vocabulary, and grammar practice. Get personalized feedback and track your progress."
        />
        <meta
          property="og:image"
          content="https://www.fluenta-ai.com/og-images/og-home.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta
          property="og:image:alt"
          content="Fluenta - AI-Powered English Learning Platform"
        />
        <meta property="og:url" content="https://www.fluenta-ai.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Fluenta" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Fluenta | Master English with AI-Powered Learning"
        />
        <meta
          name="twitter:description"
          content="Master English with Fluenta's AI-powered reading, writing, listening, speaking, vocabulary, and grammar practice."
        />
        <meta
          name="twitter:image"
          content="https://www.fluenta-ai.com/og-images/og-home.png"
        />
        <meta name="twitter:creator" content="@fluenta" />

        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://www.fluenta-ai.com/" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <GoogleAnalytics />
        <TurkishGoogleAnalytics />
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
