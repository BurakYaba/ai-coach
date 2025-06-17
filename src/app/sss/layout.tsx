import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular (SSS) - Fluenta AI İngilizce Öğrenme",
  description:
    "Fluenta AI destekli İngilizce öğrenme platformu hakkında sık sorulan soruların yanıtlarını bulun. Fiyatlandırma, özellikler, teknik destek ve daha fazlası.",
  keywords:
    "Fluenta SSS, İngilizce öğrenme sorular, AI İngilizce yardım, Fluenta fiyat, İngilizce öğrenme destek, platform kullanımı, teknik sorular",
  alternates: {
    canonical: "/sss",
    languages: {
      en: "/en/faq",
      tr: "/sss",
    },
  },
  openGraph: {
    title: "Sık Sorulan Sorular (SSS) - Fluenta AI İngilizce Öğrenme",
    description:
      "Fluenta AI destekli İngilizce öğrenme platformu hakkında sık sorulan soruların yanıtlarını bulun. Fiyatlandırma, özellikler ve destek bilgileri.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-faq-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta SSS",
      },
    ],
  },
};

export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
