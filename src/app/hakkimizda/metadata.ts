import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Fluenta AI İngilizce Öğrenme Platformu",
  description:
    "Fluenta'nın hikayesi ve misyonu. Yapay zeka teknolojisi ile İngilizce öğrenmeyi herkes için erişilebilir ve etkili hale getiriyoruz.",
  keywords:
    "Fluenta hakkında, İngilizce öğrenme platformu, AI dil öğrenme, Fluenta misyon, İngilizce eğitim teknolojisi",
  alternates: {
    canonical: "/hakkimizda",
    languages: {
      en: "/en/about",
      tr: "/hakkimizda",
    },
  },
  openGraph: {
    title: "Hakkımızda | Fluenta AI İngilizce Öğrenme Platformu",
    description:
      "Fluenta'nın hikayesi ve misyonu. Yapay zeka teknolojisi ile İngilizce öğrenmeyi herkes için erişilebilir ve etkili hale getiriyoruz.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-about-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Hakkında",
      },
    ],
  },
};
