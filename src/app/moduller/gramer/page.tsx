import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "İngilizce Gramer Modülü - AI Destekli Gramer Eğitimi | Fluenta",
  description:
    "Fluenta'nın AI destekli gramer modülü ile İngilizce gramer kurallarını sistematik olarak öğrenin. İnteraktif alıştırmalar, kişiselleştirilmiş pratikler ve detaylı açıklamalarla gramer ustası olun.",
  keywords:
    "İngilizce gramer, grammar, İngilizce dilbilgisi, gramer kuralları, AI gramer eğitimi, İngilizce tenses, gramer alıştırmaları, İngilizce syntax",
  alternates: {
    canonical: "/moduller/gramer",
    languages: {
      en: "/en/modules/grammar",
      tr: "/moduller/gramer",
    },
  },
  openGraph: {
    title: "İngilizce Gramer Modülü - AI Destekli Gramer Eğitimi | Fluenta",
    description:
      "AI teknolojisi ile kişiselleştirilmiş İngilizce gramer eğitimi. Sistematik öğrenme, interaktif alıştırmalar ve detaylı açıklamalarla gramer becerilerinizi geliştirin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-grammar-module-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Gramer Modülü",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50">
      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {children}
      </span>
    </div>
  </div>
);

export default function GramerModuluPage() {
  const features = [
    {
      icon: "📚",
      title: "Sistematik Öğrenme",
      description:
        "Temellerden ileri seviyeye kadar yapılandırılmış gramer dersleri",
    },
    {
      icon: "🎯",
      title: "Kişiselleştirilmiş Pratik",
      description:
        "Zayıf olduğunuz gramer konularına odaklanan özel alıştırmalar",
    },
    {
      icon: "🔍",
      title: "Hata Analizi",
      description:
        "Yaptığınız hataları analiz eden ve düzeltme önerileri sunan AI",
    },
    {
      icon: "💡",
      title: "Detaylı Açıklamalar",
      description: "Her gramer kuralı için kapsamlı açıklamalar ve örnekler",
    },
    {
      icon: "🎮",
      title: "İnteraktif Alıştırmalar",
      description: "Eğlenceli ve çeşitli gramer egzersizleri",
    },
    {
      icon: "📊",
      title: "İlerleme Takibi",
      description:
        "Gramer konularındaki gelişiminizi detaylı raporlarla izleyin",
    },
  ];

  const grammarTopics = [
    {
      category: "Temel Gramer",
      description: "İngilizce gramerinin temel yapı taşları",
      topics: [
        "Present Tense",
        "Past Tense",
        "Articles",
        "Pronouns",
        "Basic Sentence Structure",
      ],
      level: "A1-A2",
    },
    {
      category: "Orta Seviye Gramer",
      description: "Daha karmaşık gramer yapıları ve kuralları",
      topics: [
        "Perfect Tenses",
        "Passive Voice",
        "Conditionals",
        "Modal Verbs",
        "Relative Clauses",
      ],
      level: "B1-B2",
    },
    {
      category: "İleri Gramer",
      description: "Akademik ve profesyonel İngilizce için ileri gramer",
      topics: [
        "Subjunctive",
        "Complex Sentences",
        "Advanced Tenses",
        "Inversion",
        "Ellipsis",
      ],
      level: "C1-C2",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/moduller/gramer" language="tr" />

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
          <span>Gramer Modülü</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI Destekli Gramer Eğitimi</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            İngilizce Gramer Modülü
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sistematik ve kişiselleştirilmiş gramer eğitimi ile İngilizce
            dilbilgisi kurallarında ustalaşın. AI destekli alıştırmalar ve
            detaylı açıklamalarla gramer becerilerinizi geliştirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3"
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
              Gramer Modülü Özellikleri
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI destekli araçlarla gramer öğrenme sürecinizi optimize edin
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
            <h2 className="text-3xl md:text-4xl font-bold">Gramer Konuları</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Temellerden ileri seviyeye kadar kapsamlı gramer eğitimi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {grammarTopics.map((topic, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{topic.level}</Badge>
                    <span className="text-2xl">📖</span>
                  </div>
                  <CardTitle>{topic.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {topic.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Konu Başlıkları:</h4>
                    <div className="space-y-1">
                      {topic.topics.map((topicItem, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="outline"
                          className="text-xs mr-1 mb-1"
                        >
                          {topicItem}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Nasıl Çalışır?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              4 adımda etkili gramer öğrenme süreci
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Konu Öğrenimi</h3>
              <p className="text-muted-foreground text-sm">
                Gramer kurallarını detaylı açıklamalar ve örneklerle öğrenin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pratik Yapma</h3>
              <p className="text-muted-foreground text-sm">
                İnteraktif alıştırmalarla öğrendiğiniz kuralları pekiştirin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Hata Analizi</h3>
              <p className="text-muted-foreground text-sm">
                AI, hatalarınızı analiz eder ve düzeltme önerileri sunar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">İlerleme Takibi</h3>
              <p className="text-muted-foreground text-sm">
                Gramer konularındaki gelişiminizi detaylı raporlarla izleyin
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <GradientCard>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Gramer Becerilerinizi Geliştirmeye Başlayın
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                AI destekli gramer modülü ile İngilizce dilbilgisi kurallarında
                ustalaşın. Hemen ücretsiz denemeye başlayın!
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
