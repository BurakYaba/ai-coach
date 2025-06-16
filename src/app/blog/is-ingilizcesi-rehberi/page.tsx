import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title:
    "İş İngilizcesi Rehberi: Profesyonel Kariyerinizi Geliştirin | Fluenta Blog",
  description:
    "İş İngilizcesi ile kariyerinizi ileriye taşıyın. Toplantılar, e-postalar, sunumlar ve müzakereler için pratik rehber.",
  keywords:
    "İş İngilizcesi, business English, profesyonel İngilizce, iş hayatı İngilizce, kariye İngilizce, ofis İngilizcesi",
  alternates: {
    canonical: "/blog/is-ingilizcesi-rehberi",
    languages: {
      en: "/en/blog/business-english-guide",
      tr: "/blog/is-ingilizcesi-rehberi",
    },
  },
  openGraph: {
    title: "İş İngilizcesi Rehberi: Profesyonel Kariyerinizi Geliştirin",
    description:
      "İş İngilizcesi ile kariyerinizi ileriye taşıyın. Toplantılar, e-postalar, sunumlar ve müzakereler için pratik rehber.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-29",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/business-english-tr.jpg",
        width: 1200,
        height: 630,
        alt: "İş İngilizcesi Rehberi",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-700/50">
      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
        {children}
      </span>
    </div>
  </div>
);

export default function IsIngilizceRehberi() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/blog" language="tr" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>›</span>
          <span>İş İngilizcesi Rehberi</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>Profesyonel Gelişim</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">İş İngilizcesi</Badge>
              <Badge variant="outline">Kariyer</Badge>
              <Badge variant="outline">10 dk okuma</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              İş İngilizcesi Rehberi: Profesyonel Kariyerinizi Geliştirin
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              İş İngilizcesi ile kariyerinizi ileriye taşıyın. Toplantılar,
              e-postalar, sunumlar ve müzakereler için pratik rehber ve AI
              destekli öğrenme yöntemleri.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>29 Aralık 2024</span>
              <span>•</span>
              <span>10 dk okuma</span>
              <span>•</span>
              <span>İş İngilizcesi</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  💼 İş İngilizcesi Neden Kritik?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Günümüzün küresel iş dünyasında İngilizce, sadece bir dil
                  değil, kariyerinizin anahtarıdır. İş İngilizcesi ile
                  uluslararası projelerde yer alabilir, global şirketlerde
                  çalışabilir ve profesyonel ağınızı genişletebilirsiniz.
                  Fluenta'nın AI destekli İş İngilizcesi modülü ile bu
                  becerileri hızla geliştirebilirsiniz.
                </p>
              </div>
            </GradientCard>
          </section>

          <h2>İş İngilizcesinin Temel Alanları</h2>

          <h3>1. E-posta İletişimi</h3>
          <p>
            Profesyonel e-posta yazımı, iş İngilizcesinin temel taşlarından
            biridir:
          </p>

          <h4>Formal E-posta Yapısı</h4>
          <ul>
            <li>
              <strong>Subject Line:</strong> Net ve açık konu başlığı
            </li>
            <li>
              <strong>Greeting:</strong> Dear Mr./Ms. [Surname] veya Dear [First
              Name]
            </li>
            <li>
              <strong>Opening:</strong> I hope this email finds you well.
            </li>
            <li>
              <strong>Body:</strong> Ana mesaj, paragraflar halinde
            </li>
            <li>
              <strong>Closing:</strong> Best regards, Kind regards, Sincerely
            </li>
            <li>
              <strong>Signature:</strong> İsim, pozisyon, iletişim bilgileri
            </li>
          </ul>

          <Card className="my-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                🚀 Fluenta ile İş İngilizcenizi Geliştirin
              </h3>
              <p className="mb-4">
                Fluenta'nın AI destekli iş İngilizcesi modülü, gerçek iş
                senaryolarında pratik yapmanızı sağlar. Sanal mülakatlar,
                toplantı simülasyonları ve sunum pratiği ile özgüveninizi
                artırın.
              </p>
              <Link href="/register">
                <Button className="w-full sm:w-auto">
                  Ücretsiz Denemeyi Başlat
                </Button>
              </Link>
            </CardContent>
          </Card>

          <h2>Sonuç</h2>
          <p>
            İş İngilizcesi, sadece dil becerisi değil, aynı zamanda profesyonel
            kimliğinizin bir parçasıdır. Doğru kullanım, kariyerinizde fark
            yaratabilir ve global fırsatlara kapı açabilir.
          </p>
        </article>

        {/* Related Articles */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">İlgili Makaleler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  <Link
                    href="/tr/blog/ai-ile-ingilizce-ogrenme"
                    className="hover:text-primary"
                  >
                    2025'te AI ile İngilizce Öğrenme
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl
                  devrimleştirdiğini keşfedin.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  <Link
                    href="/tr/blog/gunluk-ingilizce-konusma-pratigi"
                    className="hover:text-primary"
                  >
                    Günlük İngilizce Konuşma Pratiği
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  30 günde İngilizce akıcılığına ulaşmak için günlük pratik
                  planı.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
