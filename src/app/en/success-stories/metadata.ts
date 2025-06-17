import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success Stories | Learn English with Fluenta AI",
  description:
    "Real success stories from Fluenta AI users. Discover how our AI-powered platform has helped thousands of students achieve their English learning goals.",
  keywords:
    "English learning success, student testimonials, Fluenta reviews, English learning stories, AI learning results, English improvement",
  alternates: {
    canonical: "/en/success-stories",
    languages: {
      en: "/en/success-stories",
      tr: "/basari-hikayeleri",
    },
  },
  openGraph: {
    title: "Success Stories | Learn English with Fluenta AI",
    description:
      "Real success stories from Fluenta AI users. See how our platform transforms English learning.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-success-stories.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Success Stories",
      },
    ],
  },
};
