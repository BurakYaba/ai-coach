import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export const metadata: Metadata = {
  title: "İş İngilizcesi Rehberi: Kariyerinizi Geliştirin | Fluenta Blog",
  description:
    "Profesyonel hayatta İngilizce kullanmanın püf noktalarını öğrenin. İş görüşmelerinden sunum yapmaya kadar kapsamlı rehber.",
  keywords:
    "İş İngilizcesi, business English, profesyonel İngilizce, iş görüşmesi İngilizce, sunum İngilizcesi, e-posta İngilizcesi",
  alternates: {
    canonical: "/tr/blog/is-ingilizcesi-rehberi",
    languages: {
      en: "/blog/english-conversation-practice-app",
      tr: "/tr/blog/is-ingilizcesi-rehberi",
    },
  },
  openGraph: {
    title: "İş İngilizcesi Rehberi: Kariyerinizi Geliştirin",
    description:
      "Profesyonel hayatta İngilizce kullanmanın püf noktalarını öğrenin. İş görüşmelerinden sunum yapmaya kadar kapsamlı rehber.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-27",
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

export default function IsIngilizcesiRehberi() {
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
                href="/modules"
                className="text-sm font-medium hover:text-primary transition-colors"
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/tr" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <Link href="/tr/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>›</span>
          <span>İş İngilizcesi Rehberi</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">İş İngilizcesi</Badge>
            <Badge variant="outline">10 dk okuma</Badge>
            <Badge variant="outline">27 Aralık 2024</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            İş İngilizcesi Rehberi: Kariyerinizi Geliştirin
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Profesyonel hayatta İngilizce kullanmanın püf noktalarını öğrenin.
            İş görüşmelerinden sunum yapmaya kadar kapsamlı rehber.
          </p>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              💼 İş İngilizcesi Neden Kritik?
            </h2>
            <p>
              Günümüz iş dünyasında İngilizce, global kariyerin anahtarıdır.
              Doğru iş İngilizcesi kullanımı, profesyonel imajınızı güçlendirir
              ve kariyer fırsatlarınızı artırır. Fluenta'nın AI destekli iş
              İngilizcesi modülü ile bu becerileri hızla geliştirebilirsiniz.
            </p>
          </div>

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
