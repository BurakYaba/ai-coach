import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Fluenta AI",
  description:
    "Learn about how Fluenta AI uses cookies to enhance your English learning experience. Our cookie policy explains what data we collect and how we use it.",
  keywords:
    "cookie policy, privacy, data collection, website cookies, tracking cookies, cookie settings",
  alternates: {
    canonical: "/en/cookie-policy",
    languages: {
      en: "/en/cookie-policy",
      tr: "/cerez-politikasi",
    },
  },
  openGraph: {
    title: "Cookie Policy | Fluenta AI",
    description:
      "Learn about how Fluenta AI uses cookies to enhance your English learning experience.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-cookie-policy.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Cookie Policy",
      },
    ],
  },
};
