import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "30 Günde İngilizce Konuşma Pratiği Rehberi | Fluenta",
  description:
    "Günlük İngilizce konuşma pratiği ile akıcılığınızı geliştirin. Haftalık planlar, pratik ipuçları ve AI destekli konuşma egzersizleri ile İngilizce konuşma becerinizi artırın.",
  keywords:
    "İngilizce konuşma pratiği, günlük İngilizce, konuşma akıcılığı, İngilizce konuşma egzersizleri, konuşma becerisi geliştirme",
  alternates: {
    canonical: "/blog/gunluk-ingilizce-konusma-pratigi",
    languages: {
      en: "/en/blog/daily-english-conversation-practice",
      tr: "/blog/gunluk-ingilizce-konusma-pratigi",
    },
  },
  openGraph: {
    title: "30 Günde İngilizce Konuşma Pratiği Rehberi | Fluenta",
    description:
      "Günlük İngilizce konuşma pratiği ile akıcılığınızı geliştirin. Haftalık planlar ve pratik ipuçları ile İngilizce konuşma becerinizi artırın.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-25",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/daily-conversation-practice-tr.jpg",
        width: 1200,
        height: 630,
        alt: "30 Günlük İngilizce Konuşma Pratiği",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200/50 dark:border-red-700/50">
      <span className="text-sm font-medium text-red-700 dark:text-red-300">
        {children}
      </span>
    </div>
  </div>
);

export default function GunlukIngilizceKonusmaPratigi() {
  const weeklyPlan = [
    {
      week: "1. Hafta",
      title: "Temel Konuşma Becerileri",
      days: "1-7. Günler",
      focus: "Kendini tanıtma, günlük rutinler, temel sorular",
      activities: [
        {
          day: "Gün 1-2",
          topic: "Kendini Tanıtma",
          goal: "Kendinizi akıcı şekilde tanıtmak",
          practice: "5 dakika aynaya karşı konuşma",
          content: "İsim, yaş, meslek, hobiler",
          example: "Hi, I'm [name]. I'm [age] years old and I work as a [job].",
        },
        {
          day: "Gün 3-4",
          topic: "Günlük Rutinler",
          goal: "Günlük aktivitelerinizi anlatmak",
          practice: "Günlük rutininizi İngilizce anlatın",
          content: "Sabah rutini, iş, akşam aktiviteleri",
          example: "I wake up at 7 AM, have breakfast, and go to work.",
        },
        {
          day: "Gün 5-7",
          topic: "Temel Sorular ve Cevaplar",
          goal: "Basit sorular sorup cevaplamak",
          practice: "Kendinize sorular sorup cevaplama",
          content: "What, Where, When, How soruları",
          example: "What do you do for fun? I like reading books.",
        },
      ],
    },
    {
      week: "2. Hafta",
      title: "Günlük Konuşmalar",
      days: "8-14. Günler",
      focus: "Alışveriş, restoran, yol tarifi",
      activities: [
        {
          day: "Gün 8-9",
          topic: "Alışveriş Senaryoları",
          goal: "Mağazada konuşabilmek",
          practice: "Alışveriş diyalogları kurma",
          content: "Fiyat sorma, ürün arama, ödeme",
          example:
            "How much does this cost? Do you have this in a different size?",
        },
        {
          day: "Gün 10-11",
          topic: "Restoran Konuşmaları",
          goal: "Restoranda sipariş verebilmek",
          practice: "Menü okuma ve sipariş verme",
          content: "Yemek siparişi, hesap isteme",
          example: "I'd like to order the chicken salad, please.",
        },
        {
          day: "Gün 12-14",
          topic: "Yol Tarifi",
          goal: "Yol sorabilmek ve tarif edebilmek",
          practice: "Harita kullanarak yol tarifi",
          content: "Yön ifadeleri, mesafe, konum",
          example: "Excuse me, how do I get to the train station?",
        },
      ],
    },
    {
      week: "3. Hafta",
      title: "Sosyal Etkileşimler",
      days: "15-21. Günler",
      focus: "Arkadaşlık, hobiler, görüşler",
      activities: [
        {
          day: "Gün 15-16",
          topic: "Arkadaşlık Kurma",
          goal: "Yeni insanlarla tanışabilmek",
          practice: "Sosyal ortam simülasyonları",
          content: "Tanışma, ortak noktalar bulma",
          example: "Nice to meet you! What brings you here?",
        },
        {
          day: "Gün 17-18",
          topic: "Hobiler ve İlgi Alanları",
          goal: "İlgi alanlarınızı paylaşabilmek",
          practice: "Hobiler hakkında konuşma",
          content: "Spor, müzik, kitap, film",
          example: "I'm really into photography. What about you?",
        },
        {
          day: "Gün 19-21",
          topic: "Görüş Bildirme",
          goal: "Fikirlerinizi ifade edebilmek",
          practice: "Güncel konular hakkında konuşma",
          content: "Görüş belirtme, karşılaştırma",
          example: "In my opinion, I think that... What do you think?",
        },
      ],
    },
    {
      week: "4. Hafta",
      title: "İleri Seviye Konuşmalar",
      days: "22-30. Günler",
      focus: "İş hayatı, gelecek planları, karmaşık konular",
      activities: [
        {
          day: "Gün 22-24",
          topic: "İş Hayatı Konuşmaları",
          goal: "Profesyonel ortamda konuşabilmek",
          practice: "İş görüşmesi simülasyonu",
          content: "Kariyer, projeler, hedefler",
          example: "I've been working in this field for three years.",
        },
        {
          day: "Gün 25-27",
          topic: "Gelecek Planları",
          goal: "Hedeflerinizi anlatabilmek",
          practice: "Gelecek zaman kullanımı",
          content: "Planlar, hayaller, hedefler",
          example: "I'm planning to travel to Europe next year.",
        },
        {
          day: "Gün 28-30",
          topic: "Karmaşık Konular",
          goal: "Detaylı konuşmalar yapabilmek",
          practice: "Uzun diyaloglar kurma",
          content: "Analiz, değerlendirme, tartışma",
          example: "Let me explain the situation in more detail...",
        },
      ],
    },
  ];

  const tips = [
    {
      icon: "🎯",
      title: "Günlük Hedef Belirleme",
      description: "Her gün için spesifik ve ulaşılabilir hedefler koyun",
    },
    {
      icon: "🔄",
      title: "Tekrar ve Pekiştirme",
      description: "Önceki günlerin konularını düzenli olarak tekrar edin",
    },
    {
      icon: "📱",
      title: "Teknoloji Kullanımı",
      description: "AI konuşma partnerleri ve uygulamalardan yararlanın",
    },
    {
      icon: "👥",
      title: "Sosyal Pratik",
      description: "Mümkün olduğunca gerçek insanlarla pratik yapın",
    },
    {
      icon: "📝",
      title: "İlerleme Takibi",
      description: "Günlük gelişiminizi not alın ve değerlendirin",
    },
    {
      icon: "🎵",
      title: "Eğlenceli Aktiviteler",
      description: "Şarkı, film ve oyunlarla öğrenmeyi eğlenceli hale getirin",
    },
  ];

  const relatedPosts = [
    {
      title: "İngilizce Telaffuzunu Geliştirmenin 10 Etkili Yolu",
      href: "/blog/ingilizce-telaffuz-gelistirme",
      category: "Telaffuz",
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
          <span>Günlük Konuşma Pratiği</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>30 Günlük Konuşma Programı</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">Konuşma</Badge>
              <Badge variant="outline">Günlük Pratik</Badge>
              <Badge variant="outline">9 dk okuma</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Günlük İngilizce Konuşma Pratiği: 30 Günde Akıcılığa Ulaşın
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sistematik günlük pratiklerle İngilizce konuşma becerinizi
              geliştirin. 30 günlük detaylı plan ile akıcılığınızı artırın ve
              özgüveninizi kazanın.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>25 Aralık 2024</span>
              <span>•</span>
              <span>9 dk okuma</span>
              <span>•</span>
              <span>Konuşma</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  🗣️ Konuşma Pratiğinin Önemi
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  İngilizce öğrenmenin en zor kısmı konuşmadır. Günlük düzenli
                  pratiklerle bu engeli aşabilir, 30 gün içinde belirgin bir
                  gelişim gösterebilirsiniz. Araştırmalar gösteriyor ki, günde
                  sadece 15-20 dakika konuşma pratiği yapanlar, bir ay içinde
                  %70 daha akıcı konuşmaya başlıyor.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Bu rehberde, 30 günlük sistematik konuşma pratiği planını
                  bulacaksınız. Her hafta farklı konulara odaklanarak, temel
                  seviyeden ileri seviyeye kadar ilerleyeceksiniz.
                </p>
              </div>
            </GradientCard>
          </section>

          {/* Weekly Plan */}
          <section className="space-y-12 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                30 Günlük Konuşma Pratiği Planı
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Haftalık hedefler ve günlük aktivitelerle sistematik gelişim
              </p>
            </div>

            <div className="space-y-8">
              {weeklyPlan.map((week, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {week.week.split(".")[0]}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{week.title}</CardTitle>
                        <p className="text-muted-foreground">
                          {week.days} • {week.focus}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {week.activities.map((activity, actIndex) => (
                      <div
                        key={actIndex}
                        className="border-l-4 border-red-200 pl-6"
                      >
                        <h4 className="font-bold text-lg mb-2">
                          {activity.day}: {activity.topic}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p>
                              <strong>Hedef:</strong> {activity.goal}
                            </p>
                            <p>
                              <strong>Pratik:</strong> {activity.practice}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>İçerik:</strong> {activity.content}
                            </p>
                            <p>
                              <strong>Örnek:</strong> "{activity.example}"
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <section className="space-y-12 mb-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Başarı İçin Pratik İpuçları
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Konuşma pratiğinizi daha etkili hale getiren stratejiler
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{tip.icon}</div>
                    <h3 className="text-lg font-semibold mb-3">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Progress Tracking */}
          <section className="mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  İlerleme Takibi
                </h2>
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      1. Hafta
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Temel konuşma becerileri
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      2. Hafta
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Günlük konuşmalar
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      3. Hafta
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sosyal etkileşimler
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      4. Hafta
                    </div>
                    <div className="text-sm text-muted-foreground">
                      İleri seviye konuşmalar
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
                  AI Konuşma Partneri ile Pratik Yapın
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Fluenta'nın AI destekli konuşma modülü ile bu 30 günlük planı
                  uygulayın. 7/24 hazır konuşma partnerleri, gerçek zamanlı geri
                  bildirim ve kişiselleştirilmiş egzersizlerle hızla gelişin.
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
                  <Link href="/moduller/konusma">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-3 w-full sm:w-auto"
                    >
                      Konuşma Modülünü Keşfet
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
