import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Fluenta AI English Learning Support",
  description:
    "Get in touch with Fluenta AI's support team. We're here to help you with your English learning journey, technical questions, and account-related inquiries.",
  keywords:
    "Fluenta contact, English learning support, customer service, help desk, technical support, account support",
  alternates: {
    canonical: "/en/contact",
    languages: {
      en: "/en/contact",
      tr: "/iletisim",
    },
  },
  openGraph: {
    title: "Contact Us | Fluenta AI English Learning Support",
    description:
      "Get in touch with Fluenta AI's support team. We're here to help with your English learning journey.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-contact.png",
        width: 1200,
        height: 630,
        alt: "Contact Fluenta Support",
      },
    ],
  },
};
