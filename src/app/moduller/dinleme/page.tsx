import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "İngilizce Dinleme Modülü - AI Destekli Dinleme Eğitimi | Fluenta",
  description:
    "Fluenta'nın AI destekli dinleme modülü ile İngilizce dinleme becerilerinizi geliştirin. Çeşitli aksanlar, konuşma hızları ve interaktif egzersizlerle dinleme pratiği yapın.",
  keywords:
    "İngilizce dinleme, listening practice, İngilizce aksan, dinleme becerisi, AI dinleme eğitimi, İngilizce podcast, dinleme anlama, İngilizce ses",
  alternates: {
    canonical: "/moduller/dinleme",
    languages: {
      en: "/en/modules/listening",
      tr: "/moduller/dinleme",
    },
  },
  openGraph: {
    title: "İngilizce Dinleme Modülü - AI Destekli Dinleme Eğitimi | Fluenta",
    description:
      "AI teknolojisi ile kişiselleştirilmiş İngilizce dinleme eğitimi. Farklı aksanlar, konuşma hızları ve interaktif egzersizlerle dinleme becerinizi geliştirin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-listening-module-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Dinleme Modülü",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200/50 dark:border-purple-700/50">
      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
        {children}
      </span>
    </div>
  </div>
);

export default function DinlemeModuluPage() {
  const features = [
    {
      icon: "🎧",
      title: "Çeşitli Aksanlar",
      description:
        "Amerikan, İngiliz, Avustralya ve diğer aksanlarla pratik yapın",
    },
    {
      icon: "⚡",
      title: "Farklı Hızlar",
      description: "Yavaş, normal ve hızlı konuşma tempoları ile alıştırma",
    },
    {
      icon: "📝",
      title: "Transkript Desteği",
      description: "Dinlediğiniz metinlerin yazılı halini görün",
    },
    {
      icon: "🎯",
      title: "Hedefli Egzersizler",
      description: "Belirli dinleme becerilerine odaklanan özel alıştırmalar",
    },
    {
      icon: "📊",
      title: "İlerleme Analizi",
      description: "Dinleme performansınızı detaylı raporlarla takip edin",
    },
    {
      icon: "🔄",
      title: "Tekrar Sistemi",
      description: "Zorlandığınız bölümleri tekrar tekrar dinleyin",
    },
  ];

  const contentTypes = [
    {
      type: "Günlük Konuşmalar",
      description: "Günlük hayattan diyaloglar ve sohbetler",
      examples: [
        "Alışveriş",
        "Restoran",
        "Telefon görüşmeleri",
        "Arkadaş sohbetleri",
      ],
      level: "A1-B1",
    },
    {
      type: "Haberler & Medya",
      description: "Haber bültenleri, röportajlar ve belgeseller",
      examples: ["BBC News", "CNN", "Röportajlar", "Belgesel anlatımları"],
      level: "B1-C1",
    },
    {
      type: "Akademik İçerik",
      description: "Üniversite dersleri ve akademik sunumlar",
      examples: [
        "Ders anlatımları",
        "Konferanslar",
        "Seminerler",
        "Tartışmalar",
      ],
      level: "B2-C2",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/moduller/dinleme" language="tr" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <Link href="/moduller" className="hover:text-primary">
            Modüller
          </Link>
          <span>›</span>
          <span>Dinleme Modülü</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI Destekli Dinleme Eğitimi</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            İngilizce Dinleme Modülü
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Çeşitli aksanlar ve konuşma hızları ile İngilizce dinleme
            becerilerinizi geliştirin. AI destekli egzersizlerle ana dili
            konuşanları anlamayı öğrenin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
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

        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Dinleme Modülü Özellikleri
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI destekli araçlarla dinleme becerilerinizi sistematik olarak
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

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">İçerik Türleri</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Her seviyeye uygun çeşitli dinleme materyalleri
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contentTypes.map((content, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{content.level}</Badge>
                    <span className="text-2xl">🎵</span>
                  </div>
                  <CardTitle>{content.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {content.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Örnekler:</h4>
                    <div className="space-y-1">
                      {content.examples.map((example, exampleIndex) => (
                        <Badge
                          key={exampleIndex}
                          variant="outline"
                          className="text-xs mr-1 mb-1"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        <section className="text-center">
          <GradientCard>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Dinleme Becerinizi Geliştirmeye Başlayın
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                AI destekli dinleme modülü ile İngilizce dinleme becerilerinizi
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
    </div>
  );
}
