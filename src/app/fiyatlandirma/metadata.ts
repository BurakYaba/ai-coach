import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiyatlandırma | Fluenta AI İngilizce Öğrenme",
  description:
    "Fluenta'nın uygun fiyatlı İngilizce öğrenme planları. Ücretsiz deneme ve öğrencilere özel indirimler ile AI destekli İngilizce eğitimine başlayın.",
  keywords:
    "İngilizce kurs fiyatları, online İngilizce fiyat, İngilizce öğrenme ücreti, AI İngilizce eğitim fiyatları, uygun İngilizce kursu",
  alternates: {
    canonical: "/fiyatlandirma",
    languages: {
      en: "/en/pricing",
      tr: "/fiyatlandirma",
    },
  },
  openGraph: {
    title: "Fiyatlandırma | Fluenta AI İngilizce Öğrenme",
    description:
      "Fluenta'nın uygun fiyatlı İngilizce öğrenme planları. Ücretsiz deneme ve öğrencilere özel indirimler.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-pricing-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Fiyatlandırma",
      },
    ],
  },
};
