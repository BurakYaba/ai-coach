import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "Kelime Hazinesi Geliştirme | Fluenta Blog",
  description:
    "İngilizce kelime hazinesi geliştirmenin en etkili yöntemlerini keşfedin. Spaced repetition, bağlamsal öğrenme ve AI destekli tekniklerle kelime dağarcığınızı hızla genişletin.",
  keywords:
    "İngilizce kelime hazinesi, vocabulary geliştirme, kelime öğrenme teknikleri, spaced repetition, İngilizce kelime kartları, kelime dağarcığı artırma, İngilizce sözcük öğrenme",
  alternates: {
    canonical: "/blog/kelime-hazinesi-gelistirme-yontemleri",
    languages: {
      en: "/en/blog/vocabulary-development-methods",
      tr: "/blog/kelime-hazinesi-gelistirme-yontemleri",
    },
  },
  openGraph: {
    title: "Kelime Hazinesi Geliştirme: En Etkili 7 Yöntem",
    description:
      "İngilizce kelime hazinesi geliştirmenin en etkili yöntemlerini keşfedin. Spaced repetition, bağlamsal öğrenme ve AI destekli tekniklerle kelime dağarcığınızı hızla genişletin.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-24",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/vocabulary-development-tr.jpg",
        width: 1200,
        height: 630,
        alt: "İngilizce Kelime Hazinesi Geliştirme Yöntemleri",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200/50 dark:border-yellow-700/50">
      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
        {children}
      </span>
    </div>
  </div>
);

export default function VocabularyDevelopmentBlogPost() {
  const methods = [
    {
      number: "01",
      title: "Aralıklı Tekrar Sistemi (Spaced Repetition)",
      description:
        "Bilimsel olarak kanıtlanmış en etkili kelime öğrenme yöntemi",
      content:
        "Spaced repetition sistemi, kelimeleri unutmaya başladığınız anda tekrar etmenizi sağlar. Bu yöntem, kelimeleri uzun süreli hafızaya aktarmanın en etkili yoludur.",
      tips: [
        "Anki veya Quizlet gibi uygulamaları kullanın",
        "Günde 15-20 dakika düzenli çalışın",
        "Zorlandığınız kelimeleri daha sık tekrar edin",
      ],
    },
    {
      number: "02",
      title: "Bağlamsal Öğrenme",
      description: "Kelimeleri cümle içinde ve gerçek durumlarla öğrenin",
      content:
        "Kelimeleri izole olarak değil, cümle içinde ve gerçek bağlamda öğrenmek kalıcılığı artırır ve doğru kullanımı sağlar.",
      tips: [
        "Her yeni kelime için 2-3 örnek cümle oluşturun",
        "Kelimeleri hikaye içinde kullanın",
        "Günlük yaşamdan örnekler bulun",
      ],
    },
    {
      number: "03",
      title: "Kelime Aileleri ve Kök Kelimeler",
      description: "Aynı kökten türeyen kelimeleri gruplar halinde öğrenin",
      content:
        "Bir kelimenin farklı formlarını (isim, fiil, sıfat) birlikte öğrenmek, kelime haznenizi hızla genişletir.",
      tips: [
        "Prefiks ve suffixleri öğrenin",
        "Kelime ailelerini harita şeklinde çizin",
        "Aynı kökten 5-6 kelimeyi birlikte çalışın",
      ],
    },
    {
      number: "04",
      title: "Görsel ve İşitsel Öğrenme",
      description: "Kelimeleri resim, ses ve video ile destekleyin",
      content:
        "Çoklu duyu organını kullanarak öğrenme, hafızada daha güçlü bağlantılar oluşturur.",
      tips: [
        "Kelimeler için görsel kartlar oluşturun",
        "Kelimelerin telaffuzunu dinleyin",
        "YouTube videolarında kelimeleri izleyin",
      ],
    },
    {
      number: "05",
      title: "Aktif Kullanım ve Pratik",
      description: "Öğrendiğiniz kelimeleri konuşma ve yazmada aktif kullanın",
      content:
        "Pasif kelime bilgisini aktif kullanıma dönüştürmek için sürekli pratik yapmanız gerekir.",
      tips: [
        "Günlük 5 yeni kelimeyi cümlede kullanın",
        "Öğrendiğiniz kelimelerle kısa paragraflar yazın",
        "AI konuşma partneri ile pratik yapın",
      ],
    },
    {
      number: "06",
      title: "Okuma ve Dinleme ile Doğal Öğrenme",
      description: "Gerçek içeriklerden doğal olarak kelime öğrenin",
      content:
        "Kitap, makale, podcast ve videolardan kelime öğrenmek, kelimelerin doğal kullanımını gösterir.",
      tips: [
        "Seviyenize uygun kitaplar okuyun",
        "İngilizce podcast dinleyin",
        "Netflix'te altyazılı film izleyin",
      ],
    },
    {
      number: "07",
      title: "AI Destekli Kişiselleştirilmiş Öğrenme",
      description: "Yapay zeka ile öğrenme sürecinizi optimize edin",
      content:
        "AI teknolojisi, öğrenme tarzınızı analiz ederek size en uygun kelimeleri ve yöntemleri önerir.",
      tips: [
        "Fluenta gibi AI destekli uygulamaları kullanın",
        "Kişiselleştirilmiş kelime listelerinizi oluşturun",
        "İlerlemenizi AI ile takip edin",
      ],
    },
  ];

  const relatedPosts = [
    {
      title: "İngilizce Gramer Rehberi: Temellerden İleri Seviyeye",
      href: "/blog/ingilizce-gramer-rehberi",
      category: "Gramer",
    },
    {
      title: "İngilizce Dinleme Becerisini Geliştirmenin 8 Yolu",
      href: "/blog/ingilizce-dinleme-becerisi-gelistirme",
      category: "Dinleme",
    },
    {
      title: "2025'te AI ile İngilizce Öğrenme: Geleceğin Eğitim Yöntemi",
      href: "/blog/ai-ile-ingilizce-ogrenme",
      category: "AI Teknoloji",
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
          <span>Kelime Hazinesi Geliştirme</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>Kelime Öğrenme Teknikleri</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">Kelime Hazinesi</Badge>
              <Badge variant="outline">Öğrenme Teknikleri</Badge>
              <Badge variant="outline">11 dk okuma</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Kelime Hazinesi Geliştirme: En Etkili 7 Yöntem
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              İngilizce kelime hazinesi geliştirmenin en etkili yöntemlerini
              keşfedin. Spaced repetition, bağlamsal öğrenme ve AI destekli
              tekniklerle kelime dağarcığınızı hızla genişletin.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>24 Aralık 2024</span>
              <span>•</span>
              <span>11 dk okuma</span>
              <span>•</span>
              <span>Kelime Hazinesi</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  Neden Kelime Hazinesi Bu Kadar Önemli?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kelime hazinesi, İngilizce öğrenmenin temel taşlarından
                  biridir. Güçlü bir kelime dağarcığı, hem anlama hem de anlatım
                  becerilerinizi doğrudan etkiler. Araştırmalar gösteriyor ki,
                  ortalama bir İngilizce konuşanı günlük hayatta 2000-3000
                  kelime kullanırken, akademik ve profesyonel ortamlarda bu sayı
                  5000-10000 kelimeye çıkabiliyor.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Bu yazıda, bilimsel araştırmalarla desteklenmiş 7 etkili
                  yöntemi öğrenecek ve kelime öğrenme sürecinizi optimize
                  edeceksiniz.
                </p>
              </div>
            </GradientCard>
          </section>

          {/* Methods */}
          <section className="space-y-12 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                7 Etkili Kelime Öğrenme Yöntemi
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Bilimsel araştırmalarla desteklenmiş, kanıtlanmış yöntemler
              </p>
            </div>

            <div className="space-y-8">
              {methods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
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

                        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4">
                          <h4 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200">
                            💡 Pratik İpuçları:
                          </h4>
                          <ul className="space-y-2">
                            {method.tips.map((tip, tipIndex) => (
                              <li
                                key={tipIndex}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-yellow-600 mt-1">•</span>
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

          {/* Statistics */}
          <section className="mb-16">
            <GradientCard>
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-8">
                  Kelime Öğrenme İstatistikleri
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-4xl font-bold text-yellow-600 mb-2">
                      2000+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Günlük kullanılan kelime
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-yellow-600 mb-2">
                      15-20
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Günlük çalışma dakikası
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-yellow-600 mb-2">
                      85%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Spaced repetition başarı oranı
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
                  Kelime Haznenizi AI ile Geliştirin
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Fluenta'nın AI destekli kelime öğrenme modülü ile bu
                  yöntemleri otomatik olarak uygulayın. Kişiselleştirilmiş
                  kelime listeleri ve akıllı tekrar sistemi ile öğrenme
                  sürecinizi hızlandırın.
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
                  <Link href="/moduller/kelime-hazinesi">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-3 w-full sm:w-auto"
                    >
                      Kelime Modülünü Keşfet
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
