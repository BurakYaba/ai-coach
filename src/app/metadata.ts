import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fluenta | AI Destekli İngilizce Öğrenme Platformu",
  description:
    "Yapay zeka destekli İngilizce öğrenme platformu. Kişiselleştirilmiş okuma, yazma, dinleme, konuşma, kelime ve gramer modülleri ile İngilizce'yi etkili öğrenin.",
  keywords:
    "İngilizce öğrenme, yapay zeka, AI İngilizce, online İngilizce, İngilizce kursu, İngilizce eğitim, dil öğrenme",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      tr: "/",
    },
  },
  openGraph: {
    title: "Fluenta | AI Destekli İngilizce Öğrenme Platformu",
    description:
      "Yapay zeka destekli İngilizce öğrenme platformu. Kişiselleştirilmiş modüller ile İngilizce'yi etkili öğrenin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-home-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta AI İngilizce Öğrenme",
      },
    ],
  },
};
