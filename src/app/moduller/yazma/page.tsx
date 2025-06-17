import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import FooterTr from "@/components/layout/FooterTr";

export const metadata: Metadata = {
  title: "İngilizce Yazma Modülü - AI Destekli Yazma Eğitimi | Fluenta",
  description:
    "Fluenta'nın AI destekli yazma modülü ile İngilizce yazma becerilerinizi geliştirin. Gramer analizi, stil önerileri ve kişiselleştirilmiş geri bildirimlerle mükemmel metinler yazın.",
  keywords:
    "İngilizce yazma, yazma becerisi, AI yazma eğitimi, İngilizce kompozisyon, gramer analizi, yazma pratiği, İngilizce essay, yazma geri bildirimi",
  alternates: {
    canonical: "/moduller/yazma",
    languages: {
      en: "/en/modules/writing",
      tr: "/moduller/yazma",
    },
  },
  openGraph: {
    title: "İngilizce Yazma Modülü - AI Destekli Yazma Eğitimi | Fluenta",
    description:
      "AI teknolojisi ile kişiselleştirilmiş İngilizce yazma eğitimi. Gramer, stil ve içerik analizi ile yazma becerilerinizi profesyonel seviyeye taşıyın.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-writing-module-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Yazma Modülü",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200/50 dark:border-green-700/50">
      <span className="text-sm font-medium text-green-700 dark:text-green-300">
        {children}
      </span>
    </div>
  </div>
);

export default function YazmaModuluPage() {
  const features = [
    {
      icon: "🤖",
      title: "AI Yazma Asistanı",
      description: "Gerçek zamanlı gramer, stil ve içerik önerileri alın",
    },
    {
      icon: "📝",
      title: "Çeşitli Yazma Türleri",
      description: "Essay, e-posta, rapor, hikaye ve daha fazlası",
    },
    {
      icon: "🎯",
      title: "Hedef Odaklı Pratik",
      description: "IELTS, TOEFL ve akademik yazma için özel hazırlık",
    },
    {
      icon: "📊",
      title: "Detaylı Analiz",
      description: "Gramer, kelime seçimi ve cümle yapısı analizi",
    },
    {
      icon: "🔄",
      title: "Sürüm Karşılaştırma",
      description: "Yazınızın gelişimini adım adım takip edin",
    },
    {
      icon: "⚡",
      title: "Anında Düzeltme",
      description: "Yazdığınız anda hataları tespit edin ve düzeltin",
    },
  ];

  const writingTypes = [
    {
      type: "Akademik Yazma",
      description: "Essay, araştırma makalesi ve akademik raporlar",
      topics: [
        "Argumentative Essay",
        "Research Paper",
        "Literature Review",
        "Case Study",
      ],
      level: "B2-C2",
    },
    {
      type: "İş İngilizcesi",
      description: "Profesyonel e-posta, rapor ve sunum yazma",
      topics: [
        "Business Email",
        "Report Writing",
        "Proposal",
        "Meeting Minutes",
      ],
      level: "B1-C1",
    },
    {
      type: "Günlük Yazma",
      description: "Blog, günlük ve kişisel yazışmalar",
      topics: ["Blog Post", "Personal Letter", "Diary Entry", "Social Media"],
      level: "A2-B2",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/moduller/yazma" language="tr" />

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
          <span>Yazma Modülü</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI Destekli Yazma Eğitimi</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            İngilizce Yazma Modülü
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI yazma asistanı ile İngilizce yazma becerilerinizi profesyonel
            seviyeye taşıyın. Gramer, stil ve içerik konusunda anında geri
            bildirim alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
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
              Yazma Modülü Özellikleri
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI destekli araçlarla yazma becerilerinizi sistematik olarak
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
            <h2 className="text-3xl md:text-4xl font-bold">Yazma Türleri</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Her ihtiyacınıza uygun yazma pratiği
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {writingTypes.map((type, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{type.level}</Badge>
                    <span className="text-2xl">✍️</span>
                  </div>
                  <CardTitle>{type.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Örnek Konular:</h4>
                    <div className="space-y-1">
                      {type.topics.map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="outline"
                          className="text-xs mr-1 mb-1"
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

        <section className="text-center">
          <GradientCard>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Yazma Becerinizi Geliştirmeye Başlayın
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                AI destekli yazma modülü ile İngilizce yazma becerilerinizi
                profesyonel seviyeye taşıyın. Hemen ücretsiz denemeye başlayın!
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
