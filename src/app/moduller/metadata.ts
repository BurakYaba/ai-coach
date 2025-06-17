import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İngilizce Öğrenme Modülleri | Fluenta AI",
  description:
    "Fluenta'nın AI destekli İngilizce öğrenme modülleri. Konuşma, yazma, dinleme, okuma, kelime ve gramer becerilerinizi geliştirin.",
  keywords:
    "İngilizce modüller, İngilizce konuşma, İngilizce yazma, İngilizce dinleme, İngilizce gramer, İngilizce kelime, AI dil öğrenme",
  alternates: {
    canonical: "/moduller",
    languages: {
      en: "/en/modules",
      tr: "/moduller",
    },
  },
  openGraph: {
    title: "İngilizce Öğrenme Modülleri | Fluenta AI",
    description:
      "Fluenta'nın AI destekli İngilizce öğrenme modülleri. Tüm dil becerilerinizi geliştirin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-modules-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Modülleri",
      },
    ],
  },
};
