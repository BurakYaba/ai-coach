import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export const metadata: Metadata = {
  title: "İngilizce Öğrenme Modülleri | Fluenta AI",
  description:
    "Fluenta'nın kapsamlı İngilizce öğrenme modülleri ile okuma, yazma, dinleme, konuşma, kelime hazinesi ve gramer becerilerinizi geliştirin.",
  keywords:
    "İngilizce modülleri, okuma modülü, yazma modülü, konuşma modülü, dinleme modülü, kelime hazinesi, gramer modülü",
  alternates: {
    canonical: "/tr/moduller",
    languages: {
      en: "/modules",
      tr: "/tr/moduller",
    },
  },
  openGraph: {
    title: "İngilizce Öğrenme Modülleri | Fluenta AI",
    description:
      "Fluenta'nın kapsamlı İngilizce öğrenme modülleri ile okuma, yazma, dinleme, konuşma, kelime hazinesi ve gramer becerilerinizi geliştirin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-modules-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Öğrenme Modülleri",
      },
    ],
  },
};

export default function TurkishModulesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/tr"
              className="font-bold text-xl hover:text-primary transition-colors"
            >
              Fluenta
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/tr"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/tr/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/tr/moduller"
                className="text-sm font-medium text-primary"
              >
                Modüller
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link href="/register">
                <Button size="sm">Ücretsiz Başla</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/tr" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Öğrenme Modülleri</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🎯 Kapsamlı Öğrenme</Badge>
            <Badge variant="outline">AI Destekli</Badge>
            <Badge variant="outline">Kişiselleştirilmiş</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            İngilizce Öğrenme Modülleri
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Fluenta'nın AI destekli modülleri ile İngilizce'nin tüm beceri
            alanlarında ustalaşın. Her modül, kişiselleştirilmiş öğrenme
            deneyimi sunar.
          </p>
        </section>

        {/* Modules Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Reading Module */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <CardTitle>Okuma Modülü</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Seviyenize uygun metinlerle okuduğunuzu anlama becerinizi
                geliştirin. AI destekli içerik önerileri ve interaktif sorular.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Kişiselleştirilmiş okuma metinleri
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Anlama soruları ve analiz
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Kelime öğrenimi ve bağlam
                </li>
              </ul>
              <Link href="/modules/reading-comprehension">
                <Button className="w-full">Modülü Keşfet</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Writing Module */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <CardTitle>Yazma Modülü</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                AI destekli geri bildirimlerle yazma becerilerinizi geliştirin.
                Gramer, stil ve içerik analizi ile mükemmel metinler yazın.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Çeşitli yazma konuları
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Detaylı yazma analizi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  İlerleme takibi
                </li>
              </ul>
              <Link href="/modules/writing-assistant">
                <Button className="w-full">Modülü Keşfet</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Listening Module */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <CardTitle>Dinleme Modülü</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Çeşitli aksanlar ve konuşma hızları ile dinleme becerilerinizi
                keskinleştirin. İnteraktif alıştırmalar ve transkript desteği.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Çeşitli ses içerikleri
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  İnteraktif alıştırmalar
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Transkript desteği
                </li>
              </ul>
              <Link href="/listening">
                <Button className="w-full">Modülü Keşfet</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Speaking Module */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </div>
              <CardTitle>Konuşma Modülü</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                AI konuşma partnerleri ile gerçek zamanlı konuşma pratiği yapın.
                Telaffuz, akıcılık ve özgüven geliştirin.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Gerçek zamanlı konuşmalar
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Telaffuz geri bildirimi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Çeşitli konuşma senaryoları
                </li>
              </ul>
              <Link href="/modules/speaking">
                <Button className="w-full">Modülü Keşfet</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Vocabulary Module */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 13V5"></path>
                  <path d="M5 13h14"></path>
                  <path d="M15 3h6v4h-6z"></path>
                  <path d="M5 7a2 2 0 0 1 2-2h6"></path>
                  <path d="M9 17v4"></path>
                  <path d="M6 21h6"></path>
                  <path d="M14 17v4"></path>
                  <path d="M15 21h4"></path>
                </svg>
              </div>
              <CardTitle>Kelime Hazinesi Modülü</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Kişiselleştirilmiş kelime bankası ve aralıklı tekrar sistemi ile
                kelime haznenizi sistematik olarak geliştirin.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Kişiselleştirilmiş kelime bankası
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Aralıklı tekrar sistemi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  İnteraktif kelime kartları
                </li>
              </ul>
              <Link href="/modules/vocabulary-builder">
                <Button className="w-full">Modülü Keşfet</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Grammar Module */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <CardTitle>Gramer Modülü</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Yapılandırılmış dersler ve kişiselleştirilmiş pratiklerle
                İngilizce gramerde ustalaşın. Hatalarınızı analiz edin.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Yapılandırılmış gramer dersleri
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  İnteraktif alıştırmalar
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Kişiselleştirilmiş pratik
                </li>
              </ul>
              <Link href="/modules/grammar-coach">
                <Button className="w-full">Modülü Keşfet</Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tüm Modüllere Erişim Sağlayın
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fluenta'nın tüm modüllerine erişim sağlayın ve İngilizce öğrenme
            yolculuğunuzu hızlandırın. AI destekli kişiselleştirilmiş deneyim
            sizi bekliyor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Ücretsiz Denemeyi Başlat
              </Button>
            </Link>
            <Link href="/tr/fiyatlandirma">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Fiyatlandırmayı Görüntüle
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
