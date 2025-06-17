import { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Speaking Practice | AI Conversation Partner",
  description:
    "Practice English speaking with our AI conversation partner. Get instant feedback on pronunciation, grammar, and fluency. Perfect your spoken English with personalized exercises.",
  keywords:
    "English speaking practice, conversation practice, speaking exercises, pronunciation practice, AI conversation partner, speaking fluency",
  alternates: {
    canonical: "/en/modules/speaking",
    languages: {
      en: "/en/modules/speaking",
      tr: "/moduller/konusma",
    },
  },
  openGraph: {
    title: "English Speaking Practice | AI Conversation Partner",
    description:
      "Practice English speaking with our AI conversation partner. Get instant feedback on pronunciation and fluency.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-speaking-module.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Speaking Practice",
      },
    ],
  },
};
