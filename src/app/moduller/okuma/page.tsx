import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import FooterTr from "@/components/layout/FooterTr";

export const metadata: Metadata = {
  title: "İngilizce Okuma Modülü | Fluenta",
  description:
    "Fluenta'nın AI destekli okuma modülü ile İngilizce okuma anlama becerinizi geliştirin. Kişiselleştirilmiş metinler, interaktif sorular ve kelime öğrenimi ile seviyenizi yükseltin.",
  keywords:
    "İngilizce okuma, okuma anlama, İngilizce metin okuma, AI okuma eğitimi, İngilizce comprehension, okuma becerisi geliştirme, İngilizce kelime öğrenme, okuma pratiği",
  alternates: {
    canonical: "/moduller/okuma",
    languages: {
      en: "/en/modules/reading",
      tr: "/moduller/okuma",
    },
  },
  openGraph: {
    title:
      "İngilizce Okuma Modülü - AI Destekli Okuma Anlama Eğitimi | Fluenta",
    description:
      "AI teknolojisi ile kişiselleştirilmiş İngilizce okuma eğitimi. Seviyenize uygun metinler, anlama soruları ve kelime öğrenimi ile okuma becerinizi geliştirin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-reading-module-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Okuma Modülü",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50">
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {children}
      </span>
    </div>
  </div>
);

export default function OkumaModuluPage() {
  const features = [
    {
      icon: "🎯",
      title: "Kişiselleştirilmiş İçerik",
      description:
        "AI, seviyenize ve ilgi alanlarınıza göre özel metinler oluşturur",
    },
    {
      icon: "📊",
      title: "İlerleme Takibi",
      description:
        "Okuma hızınız, anlama oranınız ve kelime gelişiminizi takip edin",
    },
    {
      icon: "💡",
      title: "Akıllı Kelime Öğrenimi",
      description: "Metinlerdeki yeni kelimeleri bağlam içinde öğrenin",
    },
    {
      icon: "🎮",
      title: "İnteraktif Sorular",
      description: "Anlama sorularıyla metni ne kadar anladığınızı test edin",
    },
    {
      icon: "📚",
      title: "Çeşitli Metin Türleri",
      description: "Haber, hikaye, makale ve daha fazla türde metinler",
    },
    {
      icon: "⚡",
      title: "Anında Geri Bildirim",
      description: "Yanıtlarınız için hemen detaylı açıklamalar alın",
    },
  ];

  const levels = [
    {
      level: "A1-A2",
      title: "Başlangıç",
      description: "Basit cümleler ve günlük konular",
      topics: ["Aile", "Hobiler", "Günlük rutinler", "Alışveriş"],
    },
    {
      level: "B1-B2",
      title: "Orta",
      description: "Daha karmaşık metinler ve konular",
      topics: ["Haberler", "Seyahat", "Teknoloji", "Kültür"],
    },
    {
      level: "C1-C2",
      title: "İleri",
      description: "Akademik ve profesyonel metinler",
      topics: ["Bilim", "Edebiyat", "İş dünyası", "Felsefe"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/moduller/okuma" language="tr" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <Link href="/moduller" className="hover:text-primary">
            Modüller
          </Link>
          <span>›</span>
          <span>Okuma Modülü</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI Destekli Okuma Eğitimi</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            İngilizce Okuma Modülü
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Yapay zeka teknolojisi ile kişiselleştirilmiş okuma deneyimi
            yaşayın. Seviyenize uygun metinlerle okuma anlama becerinizi
            geliştirin ve kelime haznenizi genişletin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Hemen Başla
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Özellikleri Keşfet
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Okuma Modülü Özellikleri
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI destekli özelliklerle okuma becerinizi sistematik olarak
              geliştirin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Nasıl Çalışır?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              4 adımda etkili okuma öğrenme süreci
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Seviye Belirleme</h3>
              <p className="text-muted-foreground text-sm">
                AI, okuma seviyenizi analiz eder ve size uygun metinler seçer
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Metin Okuma</h3>
              <p className="text-muted-foreground text-sm">
                İlgi alanınıza uygun, eğlenceli ve öğretici metinleri okuyun
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Anlama Testi</h3>
              <p className="text-muted-foreground text-sm">
                İnteraktif sorularla metni ne kadar anladığınızı ölçün
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kelime Öğrenimi</h3>
              <p className="text-muted-foreground text-sm">
                Yeni kelimeleri bağlam içinde öğrenin ve kelime bankanıza
                ekleyin
              </p>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tüm Seviyelere Uygun İçerik
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Başlangıçtan ileri seviyeye kadar her düzeyde okuma materyali
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {levels.map((level, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{level.level}</Badge>
                    <span className="text-2xl">📖</span>
                  </div>
                  <CardTitle>{level.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {level.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Örnek Konular:</h4>
                    <div className="flex flex-wrap gap-2">
                      {level.topics.map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Okuma Modülünün Faydaları
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Kelime Hazinesi Genişletme
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Her metin ile yeni kelimeler öğrenin ve kalıcı hafızaya
                    aktarın
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Okuma Hızı Artırma</h3>
                  <p className="text-muted-foreground text-sm">
                    Düzenli pratikle okuma hızınızı ve anlama kabiliyetinizi
                    geliştirin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Kültürel Farkındalık</h3>
                  <p className="text-muted-foreground text-sm">
                    Farklı kültürlerden metinlerle dünya görüşünüzü genişletin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Sınav Hazırlığı</h3>
                  <p className="text-muted-foreground text-sm">
                    IELTS, TOEFL ve diğer İngilizce sınavlarına hazırlanın
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-2xl font-bold">1000+ Metin</h3>
                <p className="text-muted-foreground">
                  Çeşitli konularda binlerce metin ile sınırsız okuma pratiği
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-muted-foreground">
                      Başarı Oranı
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">30dk</div>
                    <div className="text-sm text-muted-foreground">
                      Günlük Pratik
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <GradientCard>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Okuma Becerinizi Geliştirmeye Başlayın
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                AI destekli okuma modülü ile İngilizce okuma anlama becerinizi
                sistematik olarak geliştirin. Hemen ücretsiz denemeye başlayın!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    Ücretsiz Denemeyi Başlat
                  </Button>
                </Link>
                <Link href="/moduller">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    Diğer Modülleri Gör
                  </Button>
                </Link>
              </div>
            </div>
          </GradientCard>
        </section>
      </main>

      {/* Footer */}
      <FooterTr />
    </div>
  );
}
