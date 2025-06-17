import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "İngilizce Kelime Hazinesi Modülü | Fluenta",
  description:
    "Fluenta'nın AI destekli kelime hazinesi modülü ile İngilizce kelime dağarcığınızı sistematik olarak genişletin. Aralıklı tekrar sistemi, bağlamsal öğrenme ve kişiselleştirilmiş kelime kartları.",
  keywords:
    "İngilizce kelime öğrenme, vocabulary, kelime hazinesi, İngilizce kelime kartları, spaced repetition, kelime dağarcığı, İngilizce sözcük, kelime ezberleme",
  alternates: {
    canonical: "/moduller/kelime-hazinesi",
    languages: {
      en: "/en/modules/vocabulary",
      tr: "/moduller/kelime-hazinesi",
    },
  },
  openGraph: {
    title:
      "İngilizce Kelime Hazinesi Modülü - AI Destekli Kelime Öğrenimi | Fluenta",
    description:
      "AI teknolojisi ile kişiselleştirilmiş İngilizce kelime öğrenimi. Aralıklı tekrar sistemi ve bağlamsal öğrenme ile kelime haznenizi sistematik olarak genişletin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-vocabulary-module-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Kelime Hazinesi Modülü",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200/50 dark:border-yellow-700/50">
      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
        {children}
      </span>
    </div>
  </div>
);

export default function KelimeHazinesiModuluPage() {
  const features = [
    {
      icon: "🧠",
      title: "Aralıklı Tekrar Sistemi",
      description: "Bilimsel olarak kanıtlanmış spaced repetition algoritması",
    },
    {
      icon: "🎯",
      title: "Kişiselleştirilmiş Öğrenme",
      description: "Seviyenize ve ihtiyaçlarınıza göre özel kelime listeleri",
    },
    {
      icon: "📚",
      title: "Bağlamsal Öğrenme",
      description: "Kelimeleri cümle içinde ve gerçek durumlarla öğrenin",
    },
    {
      icon: "🎮",
      title: "İnteraktif Kelime Kartları",
      description: "Eğlenceli ve etkileşimli kelime kartları ile pratik",
    },
    {
      icon: "📊",
      title: "İlerleme Takibi",
      description: "Öğrendiğiniz kelimeleri ve ilerlemenizi detaylı takip edin",
    },
    {
      icon: "🔄",
      title: "Otomatik Tekrar",
      description:
        "Unutmaya başladığınız kelimeleri otomatik olarak tekrar edin",
    },
  ];

  const categories = [
    {
      category: "Temel Kelimeler",
      description: "Günlük hayatta en çok kullanılan temel kelimeler",
      wordCount: "1000+",
      examples: ["Family", "Food", "Colors", "Numbers", "Time"],
      level: "A1-A2",
    },
    {
      category: "Akademik Kelimeler",
      description: "Üniversite ve akademik ortamlarda kullanılan kelimeler",
      wordCount: "2000+",
      examples: ["Research", "Analysis", "Theory", "Method", "Evidence"],
      level: "B2-C2",
    },
    {
      category: "İş İngilizcesi",
      description: "Profesyonel ortamlarda kullanılan iş kelimeleri",
      wordCount: "1500+",
      examples: [
        "Management",
        "Strategy",
        "Revenue",
        "Marketing",
        "Innovation",
      ],
      level: "B1-C1",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/moduller/kelime-hazinesi" language="tr" />

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
          <span>Kelime Hazinesi Modülü</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI Destekli Kelime Öğrenimi</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            İngilizce Kelime Hazinesi Modülü
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Aralıklı tekrar sistemi ve AI destekli öğrenme yöntemleri ile
            İngilizce kelime dağarcığınızı sistematik olarak genişletin. Bağlam
            içinde öğrenin, kalıcı hafızaya aktarın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-3"
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
              Kelime Hazinesi Modülü Özellikleri
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bilimsel yöntemlerle kelime öğrenme sürecinizi optimize edin
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
              Kelime Kategorileri
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              İhtiyacınıza göre özel kelime grupları
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{category.level}</Badge>
                    <span className="text-2xl">📖</span>
                  </div>
                  <CardTitle>{category.category}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {category.wordCount} kelime
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Örnek Kelimeler:</h4>
                    <div className="space-y-1">
                      {category.examples.map((example, exampleIndex) => (
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
                Kelime Haznenizi Genişletmeye Başlayın
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                AI destekli kelime hazinesi modülü ile İngilizce kelime
                dağarcığınızı sistematik olarak genişletin. Hemen ücretsiz
                denemeye başlayın!
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
