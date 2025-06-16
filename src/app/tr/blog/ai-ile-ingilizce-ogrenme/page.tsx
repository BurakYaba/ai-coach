import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  StructuredData,
  generateArticleSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title:
    "2025'te AI ile İngilizce Öğrenme: Geleceğin Dil Eğitimi | Fluenta Blog",
  description:
    "Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl devrimleştirdiğini keşfedin. AI destekli dil öğrenme araçları ve yöntemleri.",
  keywords:
    "AI İngilizce öğrenme, yapay zeka dil eğitimi, AI dil öğrenme araçları, gelecek dil eğitimi, akıllı İngilizce öğrenme",
  alternates: {
    canonical: "/tr/blog/ai-ile-ingilizce-ogrenme",
    languages: {
      en: "/blog/ai-english-learning-2025",
      tr: "/tr/blog/ai-ile-ingilizce-ogrenme",
    },
  },
  openGraph: {
    title: "2025'te AI ile İngilizce Öğrenme: Geleceğin Dil Eğitimi",
    description:
      "Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl devrimleştirdiğini keşfedin. AI destekli dil öğrenme araçları ve yöntemleri.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-27",
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

export default function AIEnglishLearningBlogPost() {
  const articleSchema = generateArticleSchema(
    "2025'te AI ile İngilizce Öğrenme: Geleceğin Eğitim Yöntemi",
    "Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl devrimleştirdiğini keşfedin. Kişiselleştirilmiş öğrenme planları, gerçek zamanlı geri bildirim ve AI destekli pratik yöntemleri öğrenin.",
    "2024-12-30",
    "2024-12-30",
    "ai-ile-ingilizce-ogrenme",
    "8 dk okuma",
    "AI Teknoloji",
    [
      "AI İngilizce öğrenme",
      "yapay zeka",
      "İngilizce teknoloji",
      "kişiselleştirilmiş öğrenme",
      "gelecek eğitim",
    ]
  );

  const relatedPosts = [
    {
      title: "İngilizce Telaffuzunu Geliştirmenin 10 Etkili Yolu",
      href: "/tr/blog/ingilizce-telaffuz-gelistirme",
      category: "Telaffuz",
    },
    {
      title: "İngilizce Gramer Rehberi: Temellerden İleri Seviyeye",
      href: "/tr/blog/ingilizce-gramer-rehberi",
      category: "Gramer",
    },
    {
      title: "İş İngilizcesi Rehberi: Kariyerinizi Geliştirin",
      href: "/tr/blog/is-ingilizcesi-rehberi",
      category: "İş İngilizcesi",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StructuredData type="Article" data={articleSchema} />

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
                href="/tr/fiyatlandirma"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Fiyatlandırma
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link href="/register">
                <Button size="sm">Ücretsiz Dene</Button>
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
          <span>AI ile İngilizce Öğrenme</span>
        </nav>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">AI Teknoloji</Badge>
              <Badge variant="outline">Geleceğin Eğitimi</Badge>
              <Badge variant="outline">İnnovasyokn</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              2025'te AI ile İngilizce Öğrenme: Geleceğin Eğitim Yöntemi
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl
              devrimleştirdiğini keşfedin. Kişiselleştirilmiş öğrenme planları,
              gerçek zamanlı geri bildirim ve daha fazlası.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>30 Aralık 2024</span>
              <span>•</span>
              <span>8 dk okuma</span>
              <span>•</span>
              <span>AI Teknoloji</span>
            </div>
          </header>

          {/* Quick Navigation */}
          <GradientCard className="mb-8">
            <CardHeader>
              <CardTitle>İçerik Rehberi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>
                  <a href="#ai-nedir" className="text-primary hover:underline">
                    AI İngilizce Öğrenme Nedir?
                  </a>
                </li>
                <li>
                  <a
                    href="#avantajlar"
                    className="text-primary hover:underline"
                  >
                    AI'ın Sağladığı Avantajlar
                  </a>
                </li>
                <li>
                  <a
                    href="#kisisellestirilmis-ogrenme"
                    className="text-primary hover:underline"
                  >
                    Kişiselleştirilmiş Öğrenme
                  </a>
                </li>
                <li>
                  <a
                    href="#gercek-zamanli-geri-bildirim"
                    className="text-primary hover:underline"
                  >
                    Gerçek Zamanlı Geri Bildirim
                  </a>
                </li>
                <li>
                  <a
                    href="#pratik-uygulamalar"
                    className="text-primary hover:underline"
                  >
                    Pratik Uygulamalar
                  </a>
                </li>
                <li>
                  <a
                    href="#gelecek-trendleri"
                    className="text-primary hover:underline"
                  >
                    Gelecek Trendleri
                  </a>
                </li>
              </ul>
            </CardContent>
          </GradientCard>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-lg leading-relaxed mb-4">
              2025 yılında yapay zeka (AI) teknolojisi, İngilizce öğrenme
              alanında devrim niteliğinde değişiklikler yaratıyor. Geleneksel
              öğrenme yöntemlerinin yerini alan AI destekli platformlar,
              öğrencilere kişiselleştirilmiş, etkili ve eğlenceli bir öğrenme
              deneyimi sunuyor.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Bu kapsamlı rehberde, AI'ın İngilizce öğrenmeyi nasıl
              dönüştürdüğünü, sunduğu benzersiz avantajları ve geleceğin eğitim
              trendlerini keşfedeceksiniz. Ayrıca, kendi İngilizce öğrenme
              yolculuğunuzda AI'dan nasıl en iyi şekilde yararlanabileceğinizi
              öğreneceksiniz.
            </p>
          </section>

          {/* AI Nedir Section */}
          <section id="ai-nedir" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              AI İngilizce Öğrenme Nedir?
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              AI destekli İngilizce öğrenme, yapay zeka algoritmaları kullanarak
              öğrencilerin bireysel ihtiyaçlarına göre özelleştirilmiş eğitim
              deneyimi sunan yeni nesil öğrenme yaklaşımıdır. Bu teknoloji,
              makine öğrenimi, doğal dil işleme ve konuşma tanıma gibi gelişmiş
              AI teknolojilerini bir araya getirir.
            </p>

            <GradientCard className="mb-6">
              <CardHeader>
                <CardTitle>AI İngilizce Öğrenmenin Temel Bileşenleri</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">🧠</span>
                    <div>
                      <strong>Makine Öğrenimi:</strong> Öğrencinin öğrenme
                      paternlerini analiz eder ve sürekli iyileşen öneriler
                      sunar
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">🗣️</span>
                    <div>
                      <strong>Konuşma Tanıma:</strong> Telaffuzu analiz eder ve
                      gerçek zamanlı düzeltmeler yapar
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">📝</span>
                    <div>
                      <strong>Doğal Dil İşleme:</strong> Yazılı metinleri analiz
                      eder ve gramer hatalarını tespit eder
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">🎯</span>
                    <div>
                      <strong>Adaptif Öğrenme:</strong> Zorluik seviyesini
                      öğrencinin performansına göre otomatik ayarlar
                    </div>
                  </li>
                </ul>
              </CardContent>
            </GradientCard>
          </section>

          {/* Avantajlar Section */}
          <section id="avantajlar" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              AI'ın İngilizce Öğrenmede Sağladığı 7 Ana Avantaj
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Hızlı İlerleme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI, öğrenme sürecinizi hızlandırır ve geleneksel yöntemlere
                    göre %40 daha hızlı ilerleme sağlar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Kişiselleştirme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Her öğrencinin öğrenme tarzına ve seviyesine özel olarak
                    tasarlanmış içerik ve egzersizler.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔄</span>
                    Sürekli Geri Bildirim
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Gerçek zamanlı düzeltmeler ve öneriler ile öğrenme sürecinde
                    sürekli gelişim.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    7/24 Erişim
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    İstediğiniz zaman, istediğiniz yerden AI öğretmeninizle
                    pratik yapabilirsiniz.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Kişiselleştirilmiş Öğrenme Section */}
          <section id="kisisellestirilmis-ogrenme" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Kişiselleştirilmiş Öğrenme Deneyimi
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              AI'ın en büyük avantajlarından biri, her öğrenciye özel olarak
              tasarlanmış öğrenme deneyimi sunmasıdır. Geleneksel tek boyutlu
              eğitim yaklaşımlarından farklı olarak, AI sistemnleri her bireyin
              benzersiz öğrenme ihtiyaçlarını analiz eder ve buna uygun içerik
              sunar.
            </p>

            <GradientCard className="mb-6">
              <CardHeader>
                <CardTitle>AI Nasıl Kişiselleştirme Yapar?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">
                      1. Başlangıç Değerlendirmesi
                    </h4>
                    <p className="text-muted-foreground">
                      AI, önce mevcut İngilizce seviyenizi, öğrenme
                      tercihlerinizi ve hedeflerinizi kapsamlı bir şekilde
                      değerlendirir.
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">2. Sürekli Analiz</h4>
                    <p className="text-muted-foreground">
                      Öğrenme sürecinde performansınızı sürekli takip eder,
                      güçlü ve zayıf yanlarınızı belirler.
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">3. Dinamik İçerik</h4>
                    <p className="text-muted-foreground">
                      Analiz sonuçlarına göre ders içeriğini, zorluik seviyesini
                      ve öğrenme metodlarını otomatik olarak ayarlar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </GradientCard>
          </section>

          {/* Pratik Uygulamalar Section */}
          <section id="pratik-uygulamalar" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              AI ile İngilizce Öğrenmenin Pratik Uygulamaları
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Modern AI teknolojileri, İngilizce öğrenmenin her alanında
              devrimsel uygulamalar sunuyor. İşte günlük yaşamda
              karşılaşabileceğiniz başlıca AI uygulamaları:
            </p>

            <div className="grid gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎤</span>
                    AI Konuşma Partneri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Fluenta'nın AI konuşma partneri ile gerçek zamanlı sohbet
                    edebilir, telaffuzunuzu geliştirebilir ve akıcılığınızı
                    artırabilirsiniz.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      Örnek Özellikler:
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Farklı konularda sohbet imkanı</li>
                      <li>• Anında telaffuz düzeltmeleri</li>
                      <li>• Kelime ve ifade önerileri</li>
                      <li>• Günlük hayat senaryoları</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">✍️</span>
                    Akıllı Yazma Asistanı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    AI destekli yazma asistanı, gramer hatalarınızı düzeltir,
                    stil önerileri sunar ve yazma becerilerinizi geliştirir.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      Sağladığı Faydalar:
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Gerçek zamanlı gramer kontrolü</li>
                      <li>• Yazı stili iyileştirme önerileri</li>
                      <li>• Kelime çeşitliliği artırma</li>
                      <li>• Metin akışı analizi</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <GradientCard className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">
                  AI ile İngilizce Öğrenmeye Hemen Başlayın!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Fluenta'nın AI destekli İngilizce öğrenme platformunu 7 gün
                  ücretsiz deneyin. Kişiselleştirilmiş öğrenme deneyimini hemen
                  keşfedin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Ücretsiz Hesap Oluştur
                    </Button>
                  </Link>
                  <Link href="/tr/fiyatlandirma">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Fiyatları İncele
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </GradientCard>
          </section>

          {/* Gelecek Trendleri Section */}
          <section id="gelecek-trendleri" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              2025 ve Sonrası: İngilizce Öğrenmede AI Trendleri
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              AI teknolojisi sürekli gelişmeye devam ediyor ve İngilizce öğrenme
              alanında daha da heyecan verici gelişmeler bizi bekliyor. İşte
              yakın gelecekte görebileceğimiz başlıca trendler:
            </p>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔮 Sanal Gerçeklik (VR) Entegrasyonu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    VR teknolojisi ile gerçek hayat senaryolarında İngilizce
                    pratiği yapmak mümkün olacak. Londra'da alışveriş yapmak
                    veya New York'ta iş görüşmesine girmek artık evinizdeyken
                    mümkün.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🧬 Nöröeğitim ve AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Beyin bilimi ile AI'ın buluştuğu nöröeğitim yöntemleri,
                    öğrenme verimliğini maksimum seviyeye çıkaracak
                    kişiselleştirilmiş eğitim programları sunacak.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🤝 AI Öğrenme Topluluları</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI tarafından yönetilen öğrenme toplulukları, benzer
                    seviyedeki öğrencileri buluşturacak ve grup öğrenme
                    deneyimlerini optimize edecek.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Sonuç</h2>
            <p className="text-lg leading-relaxed mb-4">
              AI ile İngilizce öğrenme, artık bir hayal değil, günümüzün
              gerçeği. Bu teknoloji, öğrenme sürecini daha kişiselleştirilmiş,
              etkili ve eğlenceli hale getiriyor. Geleneksel yöntemlerle
              karşılaştırıldığında çok daha hızlı ve kalıcı sonuçlar elde etmek
              mümkün.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Fluenta olarak, AI teknolojisinin gücünü kullanarak İngilizce
              öğrenme yolculuğunuzda size eşlik ediyoruz. Kişiselleştirilmiş
              öğrenme planları, gerçek zamanlı geri bildirim ve eğlenceli
              öğrenme deneyimi ile hedeflerinize ulaşmanızı sağlıyoruz.
            </p>
            <p className="text-lg leading-relaxed font-medium">
              2025'te AI ile İngilizce öğrenmenin keyfini çıkarın ve dil öğrenme
              potansiyelinizi tam anlamıyla keşfedin!
            </p>
          </section>
        </article>

        {/* Related Posts */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">İlgili Yazılar</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {post.category}
                  </Badge>
                  <CardTitle className="text-lg">
                    <Link
                      href={post.href}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={post.href}
                    className="text-primary hover:underline font-medium"
                  >
                    Devamını Oku →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-bold text-xl">Fluenta</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI destekli İngilizce öğrenme platformu
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">AI Özellikler</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/register" className="hover:text-white">
                    AI Konuşma Partneri
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Telaffuz Antrenörü
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Yazma Asistanı
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Gramer Koçu
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Blog Kategorileri</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/tr/blog?category=ai"
                    className="hover:text-white"
                  >
                    AI Teknoloji
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/blog?category=telaffuz"
                    className="hover:text-white"
                  >
                    Telaffuz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/blog?category=gramer"
                    className="hover:text-white"
                  >
                    Gramer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/blog?category=ielts"
                    className="hover:text-white"
                  >
                    IELTS
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/tr" className="hover:text-white">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/tr/fiyatlandirma" className="hover:text-white">
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link href="/tr/hakkimizda" className="hover:text-white">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/tr/iletisim" className="hover:text-white">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fluenta. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
