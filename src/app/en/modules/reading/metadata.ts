import { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Reading Practice | AI-Powered Reading Comprehension",
  description:
    "Improve your English reading skills with AI-powered comprehension exercises. Practice with personalized texts, instant feedback, and adaptive difficulty levels. Master reading comprehension with Fluenta.",
  keywords:
    "English reading practice, reading comprehension, English texts, AI reading tutor, reading exercises, English learning, comprehension skills",
  alternates: {
    canonical: "/en/modules/reading",
    languages: {
      en: "/en/modules/reading",
      tr: "/moduller/okuma",
    },
  },
  openGraph: {
    title: "English Reading Practice | AI-Powered Reading Comprehension",
    description:
      "Improve your English reading skills with AI-powered comprehension exercises. Practice with personalized texts and instant feedback.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-reading-module.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Reading Practice",
      },
    ],
  },
};
