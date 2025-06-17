import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "İngilizce Dinleme Becerisi | Fluenta Blog",
  description:
    "İngilizce dinleme becerinizi geliştirmenin en etkili yöntemlerini keşfedin. Farklı aksanları anlama, hızlı konuşmaları takip etme ve dinleme stratejileri ile İngilizce anlama kabiliyetinizi artırın.",
  keywords:
    "İngilizce dinleme, listening skills, İngilizce anlama, dinleme becerisi geliştirme, İngilizce aksan, hızlı konuşma anlama, İngilizce podcast, dinleme pratiği",
  alternates: {
    canonical: "/blog/ingilizce-dinleme-becerisi-gelistirme",
    languages: {
      en: "/en/blog/english-listening-skills-development",
      tr: "/blog/ingilizce-dinleme-becerisi-gelistirme",
    },
  },
  openGraph: {
    title: "İngilizce Dinleme Becerisini Geliştirmenin 8 Yolu",
    description:
      "İngilizce dinleme becerinizi geliştirmenin en etkili yöntemlerini keşfedin. Farklı aksanları anlama, hızlı konuşmaları takip etme ve dinleme stratejileri ile İngilizce anlama kabiliyetinizi artırın.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-23",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/listening-skills-development-tr.jpg",
        width: 1200,
        height: 630,
        alt: "İngilizce Dinleme Becerisi Geliştirme",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200/50 dark:border-purple-700/50">
      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
        {children}
      </span>
    </div>
  </div>
);

export default function ListeningSkillsBlogPost() {
  const methods = [
    {
      number: "01",
      title: "Aktif Dinleme Tekniği",
      description: "Sadece duymak değil, aktif olarak anlamaya odaklanın",
      content:
        "Aktif dinleme, sadece sesleri duymak değil, anlamaya odaklanmak demektir. Bu teknik, dikkatinizi konuşmacının mesajına yoğunlaştırır ve anlama kabiliyetinizi artırır.",
      tips: [
        "Dinlerken not alın ve anahtar kelimeleri işaretleyin",
        "Konuşmacının ana fikrini tahmin etmeye çalışın",
        "Anlamadığınız kısımları tekrar dinleyin",
      ],
    },
    {
      number: "02",
      title: "Farklı Aksanlarla Pratik",
      description: "Amerikan, İngiliz, Avustralya aksanlarını tanıyın",
      content:
        "Her İngilizce aksanının kendine özgü özellikleri vardır. Farklı aksanlara maruz kalmak, genel dinleme becerinizi güçlendirir.",
      tips: [
        "BBC (İngiliz), CNN (Amerikan), ABC (Avustralya) izleyin",
        "Her gün farklı bir aksanla 15 dakika pratik yapın",
        "Aksan farklılıklarını not edin ve karşılaştırın",
      ],
    },
    {
      number: "03",
      title: "Hız Kademeli Artırma",
      description: "Yavaş konuşmalardan hızlı konuşmalara geçiş yapın",
      content:
        "Dinleme becerinizi geliştirmek için konuşma hızını kademeli olarak artırın. Bu yöntem, beyninizdeki işleme hızını geliştirir.",
      tips: [
        "0.75x hızla başlayıp normal hıza çıkın",
        "Rahat anladığınızda 1.25x hıza geçin",
        "Podcast uygulamalarının hız ayarını kullanın",
      ],
    },
    {
      number: "04",
      title: "Bağlam İpuçlarını Kullanma",
      description: "Anlamadığınız kelimeleri bağlamdan çıkarın",
      content:
        "Her kelimeyi bilmeniz gerekmez. Bağlam ipuçlarını kullanarak genel anlamı çıkarabilirsiniz.",
      tips: [
        "Konuşmanın genel konusunu belirleyin",
        "Önceki ve sonraki cümlelere dikkat edin",
        "Konuşmacının ses tonunu analiz edin",
      ],
    },
    {
      number: "05",
      title: "Çeşitli İçerik Türleriyle Çalışma",
      description: "Haber, film, podcast, müzik gibi farklı türleri dinleyin",
      content:
        "Farklı içerik türleri, farklı kelime dağarcığı ve konuşma tarzları sunar. Bu çeşitlilik, genel dinleme becerinizi geliştirir.",
      tips: [
        "Günde bir haber bülteni dinleyin",
        "Haftada bir İngilizce film izleyin",
        "İlgi alanınıza uygun podcast bulun",
      ],
    },
    {
      number: "06",
      title: "Transkript ile Karşılaştırma",
      description: "Dinlediklerinizi yazılı metinle karşılaştırın",
      content:
        "Transkript kullanmak, kaçırdığınız kısımları görmenizi ve telaffuz-yazım ilişkisini anlamanızı sağlar.",
      tips: [
        "İlk önce transkriptsiz dinleyin",
        "Sonra transkriptle karşılaştırın",
        "Kaçırdığınız kısımları tekrar dinleyin",
      ],
    },
    {
      number: "07",
      title: "Günlük Dinleme Rutini",
      description: "Düzenli ve sistematik dinleme alışkanlığı oluşturun",
      content:
        "Dinleme becerisi, düzenli pratikle gelişir. Günlük rutininize İngilizce dinleme aktivitelerini dahil edin.",
      tips: [
        "Günde en az 30 dakika İngilizce dinleyin",
        "Sabah haberlerini İngilizce takip edin",
        "Yolda giderken İngilizce podcast dinleyin",
      ],
    },
    {
      number: "08",
      title: "İnteraktif Dinleme Egzersizleri",
      description: "AI destekli dinleme testleri ve egzersizleri yapın",
      content:
        "Modern teknoloji, kişiselleştirilmiş dinleme egzersizleri sunar. Bu araçlar, zayıf olduğunuz alanları tespit eder.",
      tips: [
        "Fluenta gibi AI destekli uygulamaları kullanın",
        "Dinleme testlerini düzenli olarak yapın",
        "İlerlemenizi takip edin ve analiz edin",
      ],
    },
  ];

  const listeningResources = [
    {
      category: "Haberler",
      resources: ["BBC News", "CNN", "NPR", "Voice of America"],
      level: "B1-C2",
    },
    {
      category: "Podcast",
      resources: ["TED Talks", "This American Life", "Serial", "Radiolab"],
      level: "B2-C2",
    },
    {
      category: "Eğitim",
      resources: [
        "Coursera",
        "Khan Academy",
        "YouTube EDU",
        "MIT OpenCourseWare",
      ],
      level: "B2-C2",
    },
    {
      category: "Eğlence",
      resources: ["Netflix", "YouTube", "Spotify", "Apple Podcasts"],
      level: "A2-C1",
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
      title: "Günlük İngilizce Konuşma Pratiği: 30 Günde Akıcılığa Ulaşın",
      href: "/blog/gunluk-ingilizce-konusma-pratigi",
      category: "Konuşma",
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
          <span>Dinleme Becerisi Geliştirme</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>Dinleme Becerisi Geliştirme</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">Dinleme</Badge>
              <Badge variant="outline">Beceri Geliştirme</Badge>
              <Badge variant="outline">13 dk okuma</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              İngilizce Dinleme Becerisini Geliştirmenin 8 Yolu
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Farklı aksanları anlama, hızlı konuşmaları takip etme ve dinleme
              becerinizi geliştirme teknikleri. Sistematik yaklaşımlarla
              İngilizce anlama kabiliyetinizi artırın.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>23 Aralık 2024</span>
              <span>•</span>
              <span>13 dk okuma</span>
              <span>•</span>
              <span>Dinleme</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  Dinleme Becerisi Neden Bu Kadar Önemli?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Dinleme, dil öğrenmenin en temel becerilerinden biridir.
                  Araştırmalar gösteriyor ki, günlük iletişimimizin %45'i
                  dinleme, %30'u konuşma, %16'sı okuma ve sadece %9'u yazmadan
                  oluşuyor. Bu nedenle güçlü dinleme becerileri, etkili
                  iletişimin anahtarıdır.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  İngilizce dinleme becerinizi geliştirmek, sadece akademik
                  başarınızı değil, sosyal ve profesyonel hayatınızı da doğrudan
                  etkiler. Bu yazıda, dinleme becerinizi sistematik olarak
                  geliştirmenin 8 etkili yolunu öğreneceksiniz.
                </p>
              </div>
            </GradientCard>
          </section>

          {/* Methods */}
          <section className="space-y-12 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                8 Etkili Dinleme Geliştirme Yöntemi
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Uzmanlar tarafından önerilen, kanıtlanmış teknikler
              </p>
            </div>

            <div className="space-y-8">
              {methods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {method.number}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold mb-2">
                          {method.title}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-4">
                          {method.description}
                        </p>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {method.content}
                        </p>

                        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
                          <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">
                            🎧 Pratik İpuçları:
                          </h4>
                          <ul className="space-y-2">
                            {method.tips.map((tip, tipIndex) => (
                              <li
                                key={tipIndex}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-purple-600 mt-1">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="space-y-12 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Önerilen Dinleme Kaynakları
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Seviyenize uygun içeriklerle pratik yapın
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {listeningResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {resource.category}
                      </CardTitle>
                      <Badge variant="outline">{resource.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {resource.resources.map((item, itemIndex) => (
                        <Badge
                          key={itemIndex}
                          variant="secondary"
                          className="justify-center py-2"
                        >
                          {item}
                        </Badge>
                      ))}
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
                  Dinleme Becerisi İstatistikleri
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      45%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Günlük iletişimde dinleme oranı
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      30dk
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Günlük önerilen pratik süresi
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      3-6
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ay içinde görülen gelişim
                    </div>
                  </div>
                </div>
              </div>
            </GradientCard>
          </section>

          {/* CTA Section */}
          <section className="text-center mb-16">
            <GradientCard>
              <div className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Dinleme Becerinizi AI ile Geliştirin
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Fluenta'nın AI destekli dinleme modülü ile kişiselleştirilmiş
                  dinleme egzersizleri yapın. Farklı aksanlar, konuşma hızları
                  ve interaktif testlerle dinleme becerinizi sistematik olarak
                  geliştirin.
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
                  <Link href="/moduller/dinleme">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-3 w-full sm:w-auto"
                    >
                      Dinleme Modülünü Keşfet
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
    </div>
  );
}
