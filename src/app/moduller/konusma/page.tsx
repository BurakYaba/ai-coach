import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "İngilizce Konuşma Modülü | Fluenta",
  description:
    "Fluenta'nın AI destekli konuşma modülü ile İngilizce konuşma becerilerinizi geliştirin. AI konuşma partnerleri, telaffuz analizi ve gerçek zamanlı geri bildirimlerle pratik yapın.",
  keywords:
    "İngilizce konuşma, speaking practice, telaffuz, İngilizce aksan, AI konuşma partneri, konuşma pratiği, İngilizce sohbet, pronunciation",
  alternates: {
    canonical: "/moduller/konusma",
    languages: {
      en: "/en/modules/speaking",
      tr: "/moduller/konusma",
    },
  },
  openGraph: {
    title: "İngilizce Konuşma Modülü - AI Destekli Konuşma Eğitimi | Fluenta",
    description:
      "AI teknolojisi ile kişiselleştirilmiş İngilizce konuşma eğitimi. AI konuşma partnerleri ile gerçek zamanlı pratik yapın ve telaffuzunuzu mükemmelleştirin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-speaking-module-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Konuşma Modülü",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border border-red-200/50 dark:border-red-700/50">
      <span className="text-sm font-medium text-red-700 dark:text-red-300">
        {children}
      </span>
    </div>
  </div>
);

export default function KonusmaModuluPage() {
  const features = [
    {
      icon: "🤖",
      title: "AI Konuşma Partneri",
      description: "7/24 hazır AI konuşma partnerleri ile sınırsız pratik",
    },
    {
      icon: "🎯",
      title: "Telaffuz Analizi",
      description:
        "Gerçek zamanlı telaffuz değerlendirmesi ve düzeltme önerileri",
    },
    {
      icon: "🎭",
      title: "Rol Yapma Senaryoları",
      description:
        "İş görüşmesi, alışveriş, seyahat gibi gerçek hayat senaryoları",
    },
    {
      icon: "📊",
      title: "Akıcılık Takibi",
      description: "Konuşma hızı, duraklama ve akıcılık analizi",
    },
    {
      icon: "🔊",
      title: "Ses Tanıma",
      description: "Gelişmiş ses tanıma teknolojisi ile doğru anlama",
    },
    {
      icon: "💬",
      title: "Konuşma Konuları",
      description: "Güncel ve ilginç konularda sohbet pratiği",
    },
  ];

  const scenarios = [
    {
      category: "Günlük Hayat",
      description: "Günlük durumlar için konuşma pratiği",
      situations: [
        "Alışveriş yapma",
        "Restoranda sipariş",
        "Yol tarifi alma",
        "Doktor randevusu",
      ],
      level: "A1-B1",
    },
    {
      category: "İş Hayatı",
      description: "Profesyonel ortamlar için konuşma becerileri",
      situations: [
        "İş görüşmesi",
        "Sunum yapma",
        "Toplantı yönetme",
        "Müzakere",
      ],
      level: "B1-C1",
    },
    {
      category: "Akademik",
      description: "Eğitim ortamları için konuşma pratiği",
      situations: [
        "Sınıf tartışması",
        "Proje sunumu",
        "Soru sorma",
        "Fikir paylaşma",
      ],
      level: "B2-C2",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/moduller/konusma" language="tr" />

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
          <span>Konuşma Modülü</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI Destekli Konuşma Eğitimi</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            İngilizce Konuşma Modülü
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI konuşma partnerleri ile gerçek zamanlı konuşma pratiği yapın.
            Telaffuz, akıcılık ve özgüven geliştirin. Her seviyeye uygun
            senaryolarla pratik yapın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3"
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
              Konuşma Modülü Özellikleri
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI destekli araçlarla konuşma becerilerinizi sistematik olarak
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
            <h2 className="text-3xl md:text-4xl font-bold">
              Konuşma Senaryoları
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Gerçek hayat durumları için konuşma pratiği
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {scenarios.map((scenario, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{scenario.level}</Badge>
                    <span className="text-2xl">🎤</span>
                  </div>
                  <CardTitle>{scenario.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {scenario.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Örnek Durumlar:</h4>
                    <div className="space-y-1">
                      {scenario.situations.map((situation, situationIndex) => (
                        <Badge
                          key={situationIndex}
                          variant="outline"
                          className="text-xs mr-1 mb-1"
                        >
                          {situation}
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
                Konuşma Becerinizi Geliştirmeye Başlayın
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                AI destekli konuşma modülü ile İngilizce konuşma becerilerinizi
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
