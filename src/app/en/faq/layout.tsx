import { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Learning FAQ - Common Questions About Fluenta AI",
  description:
    "Get answers to frequently asked questions about English learning, AI tutoring, pronunciation practice, grammar checking, and Fluenta's features. Find solutions to common English learning challenges.",
  keywords:
    "English learning FAQ, AI English tutor questions, pronunciation practice help, grammar checker support, English learning tips, common English problems, language learning guide",
  alternates: {
    canonical: "/en/faq",
    languages: {
      en: "/en/faq",
      tr: "/sss",
    },
  },
  openGraph: {
    title: "English Learning FAQ - Common Questions About Fluenta AI",
    description:
      "Find answers to common English learning questions and get the most out of Fluenta's AI-powered language learning platform.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-faq-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Learning FAQ",
      },
    ],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
