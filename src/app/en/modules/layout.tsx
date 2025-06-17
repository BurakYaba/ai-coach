import { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Learning Modules - AI-Powered Practice | Fluenta",
  description:
    "Explore Fluenta's comprehensive English learning modules. Practice speaking, pronunciation, grammar, vocabulary, writing, and reading with AI-powered feedback and personalized lessons.",
  keywords:
    "English learning modules, speaking practice, pronunciation training, grammar lessons, vocabulary builder, writing assistant, reading comprehension, AI English tutor",
  alternates: {
    canonical: "/en/modules",
    languages: {
      en: "/en/modules",
      tr: "/moduller",
    },
  },
  openGraph: {
    title: "English Learning Modules - AI-Powered Practice | Fluenta",
    description:
      "Master English with our comprehensive learning modules. AI-powered speaking, pronunciation, grammar, vocabulary, writing, and reading practice.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-modules-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Learning Modules",
      },
    ],
  },
};

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
