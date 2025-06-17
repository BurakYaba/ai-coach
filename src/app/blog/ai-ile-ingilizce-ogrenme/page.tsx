import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import FooterTr from "@/components/layout/FooterTr";

export const metadata: Metadata = {
  title: "AI ile İngilizce Öğrenme | Fluenta Blog",
  description:
    "Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl devrimleştirdiğini keşfedin. AI destekli dil öğrenme araçları ve yöntemleri.",
  keywords:
    "AI İngilizce öğrenme, yapay zeka dil eğitimi, AI dil öğrenme araçları, gelecek dil eğitimi, akıllı İngilizce öğrenme",
  alternates: {
    canonical: "/blog/ai-ile-ingilizce-ogrenme",
    languages: {
      en: "/en/blog/ai-english-learning-2025",
      tr: "/blog/ai-ile-ingilizce-ogrenme",
    },
  },
  openGraph: {
    title: "2025'te AI ile İngilizce Öğrenme: Geleceğin Dil Eğitimi",
    description:
      "Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl devrimleştirdiğini keşfedin. AI destekli dil öğrenme araçları ve yöntemleri.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-30",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/ai-english-learning-tr.jpg",
        width: 1200,
        height: 630,
        alt: "AI ile İngilizce Öğrenme",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200/50 dark:border-blue-700/50">
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {children}
      </span>
    </div>
  </div>
);

export default function AIEnglishLearningBlogPost() {
  const aiFeatures = [
    {
      icon: "🎯",
      title: "Kişiselleştirilmiş Öğrenme Planları",
      description:
        "AI, öğrenme tarzınızı analiz ederek size özel planlar oluşturur",
      content:
        "Yapay zeka algoritmaları, öğrenme hızınızı, güçlü ve zayıf yönlerinizi analiz ederek tamamen size özel öğrenme rotaları çizer.",
    },
    {
      icon: "⚡",
      title: "Gerçek Zamanlı Geri Bildirim",
      description: "Anında düzeltme ve önerilerle hızlı gelişim",
      content:
        "AI, telaffuzunuzdan gramerinize kadar her alanda anında geri bildirim vererek öğrenme sürecinizi hızlandırır.",
    },
    {
      icon: "🤖",
      title: "AI Konuşma Partnerleri",
      description: "7/24 hazır konuşma partnerleri ile sınırsız pratik",
      content:
        "Yapay zeka destekli konuşma partnerleri ile istediğiniz zaman, istediğiniz konuda pratik yapabilirsiniz.",
    },
    {
      icon: "📊",
      title: "Akıllı İlerleme Takibi",
      description: "Detaylı analiz ve raporlarla gelişiminizi izleyin",
      content:
        "AI, öğrenme verilerinizi analiz ederek hangi alanlarda ne kadar ilerlediğinizi detaylı raporlarla sunar.",
    },
    {
      icon: "🎮",
      title: "Gamifikasyon ve Motivasyon",
      description: "Oyunlaştırılmış öğrenme deneyimi ile motivasyonu artırın",
      content:
        "AI destekli oyun mekanikleri, öğrenmeyi eğlenceli hale getirirken motivasyonunuzu yüksek tutar.",
    },
    {
      icon: "🌍",
      title: "Çoklu Aksan ve Diyalekt Desteği",
      description: "Farklı İngilizce aksanlarını tanıyın ve anlayın",
      content:
        "AI, Amerikan, İngiliz, Avustralya ve diğer aksanları tanımanızı sağlayarak global iletişim becerinizi geliştirir.",
    },
  ];

  const futureFeatures = [
    {
      year: "2025",
      feature: "Hologram Öğretmenler",
      description: "3D hologram teknolojisi ile gerçekçi öğretmen deneyimi",
    },
    {
      year: "2026",
      feature: "Beyin-Bilgisayar Arayüzü",
      description: "Düşünce ile dil öğrenme ve anında çeviri",
    },
    {
      year: "2027",
      feature: "Sanal Gerçeklik Sınıfları",
      description: "Tamamen immersive VR dil öğrenme ortamları",
    },
    {
      year: "2028",
      feature: "Quantum AI Öğretmenleri",
      description: "Quantum bilgisayar destekli süper akıllı AI öğretmenler",
    },
  ];

  const relatedPosts = [
    {
      title: "İngilizce Telaffuzunu Geliştirmenin 10 Etkili Yolu",
      href: "/blog/ingilizce-telaffuz-gelistirme",
      category: "Telaffuz",
    },
    {
      title: "Kelime Hazinesi Geliştirme: En Etkili 7 Yöntem",
      href: "/blog/kelime-hazinesi-gelistirme-yontemleri",
      category: "Kelime Hazinesi",
    },
    {
      title: "İngilizce Gramer Rehberi: Temellerden İleri Seviyeye",
      href: "/blog/ingilizce-gramer-rehberi",
      category: "Gramer",
    },
  ];

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
          <span>AI ile İngilizce Öğrenme</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>Geleceğin Eğitim Teknolojisi</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">AI Teknoloji</Badge>
              <Badge variant="outline">Geleceğin Eğitimi</Badge>
              <Badge variant="outline">8 dk okuma</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              2025'te AI ile İngilizce Öğrenme: Geleceğin Eğitim Yöntemi
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl
              devrimleştirdiğini keşfedin. Kişiselleştirilmiş öğrenme planları,
              gerçek zamanlı geri bildirim ve AI destekli pratik yöntemleri ile
              dil öğrenmenin geleceğini deneyimleyin.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>30 Aralık 2024</span>
              <span>•</span>
              <span>8 dk okuma</span>
              <span>•</span>
              <span>AI Teknoloji</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  AI Neden Dil Öğrenmenin Geleceği?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  2025 yılında yapay zeka, eğitim sektöründe devrim yaratıyor.
                  Özellikle dil öğrenme alanında AI teknolojileri, geleneksel
                  yöntemlerin sınırlarını aşarak tamamen kişiselleştirilmiş,
                  etkileşimli ve verimli öğrenme deneyimleri sunuyor.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Araştırmalar gösteriyor ki, AI destekli dil öğrenme yöntemleri
                  geleneksel yöntemlere göre %40 daha hızlı sonuç veriyor ve
                  öğrenci motivasyonunu %60 oranında artırıyor.
                </p>
              </div>
            </GradientCard>
          </section>

          {/* AI Features */}
          <section className="space-y-12 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                AI Destekli İngilizce Öğrenmenin Avantajları
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Yapay zekanın dil öğrenmeye getirdiği devrimsel yenilikler
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{feature.icon}</div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-3">
                          {feature.description}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Future Timeline */}
          <section className="space-y-12 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Dil Öğrenmenin Geleceği
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Önümüzdeki yıllarda bizi bekleyen teknolojik yenilikler
              </p>
            </div>

            <div className="space-y-6">
              {futureFeatures.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {item.year}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-2">
                          {item.feature}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-16">
            <GradientCard>
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-8">
                  AI Öğrenme İstatistikleri
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      40%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Daha hızlı öğrenme
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      60%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Artan motivasyon
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      24/7
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Kesintisiz erişim
                    </div>
                  </div>
                </div>
              </div>
            </GradientCard>
          </section>

          {/* How to Start */}
          <section className="space-y-8 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                AI ile İngilizce Öğrenmeye Nasıl Başlarsınız?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Seviye Testi</h3>
                  <p className="text-sm text-muted-foreground">
                    AI ile mevcut seviyenizi belirleyin
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Kişisel Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Size özel öğrenme planı oluşturun
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">AI Pratik</h3>
                  <p className="text-sm text-muted-foreground">
                    AI partnerleri ile günlük pratik yapın
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">İlerleme Takibi</h3>
                  <p className="text-sm text-muted-foreground">
                    Gelişiminizi AI ile analiz edin
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center mb-16">
            <GradientCard>
              <div className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  AI ile İngilizce Öğrenmeye Başlayın
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Fluenta'nın gelişmiş AI teknolojisi ile geleceğin dil öğrenme
                  deneyimini bugün yaşayın. Kişiselleştirilmiş öğrenme planları
                  ve AI destekli pratiklerle İngilizce hedeflerinize hızla
                  ulaşın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-3 w-full sm:w-auto"
                    >
                      Ücretsiz AI Deneyimi Başlat
                    </Button>
                  </Link>
                  <Link href="/moduller">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-3 w-full sm:w-auto"
                    >
                      AI Modüllerini Keşfet
                    </Button>
                  </Link>
                </div>
              </div>
            </GradientCard>
          </section>
        </article>

        {/* Related Posts */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">İlgili Yazılar</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              İngilizce öğrenme yolculuğunuzda size yardımcı olacak diğer
              içerikler
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((post, index) => (
              <Card
                key={index}
                className="hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <Link href={post.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      Devamını Oku →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterTr />
    </div>
  );
}
