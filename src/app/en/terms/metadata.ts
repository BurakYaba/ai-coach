import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Fluenta AI",
  description:
    "Fluenta AI's terms of service and user agreement. Learn about our policies, user rights, and responsibilities for using our AI-powered English learning platform.",
  keywords:
    "terms of service, user agreement, legal terms, privacy policy, user rights, service terms",
  alternates: {
    canonical: "/en/terms",
    languages: {
      en: "/en/terms",
      tr: "/kullanim-kosullari",
    },
  },
  openGraph: {
    title: "Terms of Service | Fluenta AI",
    description:
      "Fluenta AI's terms of service and user agreement. Learn about our policies and user rights.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-terms.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Terms of Service",
      },
    ],
  },
};
