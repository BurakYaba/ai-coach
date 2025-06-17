import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İngilizce Öğrenme Blog | Fluenta AI",
  description:
    "İngilizce öğrenme ipuçları, stratejileri ve en son AI teknolojileri hakkında uzman makaleler. Dil öğrenme yolculuğunuzda size rehberlik edecek içerikler.",
  keywords:
    "İngilizce blog, İngilizce öğrenme, dil öğrenme ipuçları, İngilizce makaleler, AI dil öğrenme, İngilizce eğitim",
  alternates: {
    canonical: "/blog",
    languages: {
      en: "/en/blog",
      tr: "/blog",
    },
  },
  openGraph: {
    title: "İngilizce Öğrenme Blog | Fluenta AI",
    description:
      "İngilizce öğrenme ipuçları, stratejileri ve en son AI teknolojileri hakkında uzman makaleler.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-blog-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Blog",
      },
    ],
  },
};
