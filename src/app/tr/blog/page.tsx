import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export const metadata: Metadata = {
  title:
    "İngilizce Öğrenme Blog | AI Destekli İpuçları ve Stratejiler | Fluenta",
  description:
    "İngilizce öğrenme konusunda uzman ipuçları, AI destekli stratejiler ve kanıtlanmış yöntemleri keşfedin. IELTS hazırlığından günlük konuşma pratiğine kadar İngilizce potansiyelinizi Fluenta ile açığa çıkarın.",
  keywords:
    "İngilizce öğrenme blog, AI İngilizce araçları, IELTS hazırlık, İngilizce konuşma pratiği, dil öğrenme ipuçları, İngilizce gramer, kelime hazinesi geliştirme, İngilizce telaffuz, dil öğrenme AI",
  alternates: {
    canonical: "/tr/blog",
    languages: {
      en: "/blog",
      tr: "/tr/blog",
    },
  },
  openGraph: {
    title:
      "İngilizce Öğrenme Blog | AI Destekli İpuçları ve Stratejiler | Fluenta",
    description:
      "İngilizce öğrenme konusunda uzman ipuçları, AI destekli stratejiler ve kanıtlanmış yöntemleri keşfedin. IELTS hazırlığından günlük konuşma pratiğine kadar İngilizce potansiyelinizi Fluenta ile açığa çıkarın.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "https://www.fluenta-ai.com/og-images/og-blog-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İngilizce Öğrenme Blog",
      },
    ],
  },
};

const blogPosts = [
  // Featured Turkish SEO-optimized blog posts
  {
    id: "ai-ile-ingilizce-ogrenme",
    title: "2025'te AI ile İngilizce Öğrenme: Geleceğin Eğitim Yöntemi",
    excerpt:
      "Yapay zeka teknolojisinin İngilizce öğrenmeyi nasıl devrimleştirdiğini keşfedin. Kişiselleştirilmiş öğrenme planları, gerçek zamanlı geri bildirim ve daha fazlası.",
    category: "AI Teknoloji",
    readTime: "8 dk okuma",
    publishDate: "2024-12-30",
    featured: true,
    tags: ["AI", "Teknoloji", "İngilizce Öğrenme", "Gelecek"],
  },
  {
    id: "ingilizce-telaffuz-gelistirme",
    title: "İngilizce Telaffuzunu Geliştirmenin 10 Etkili Yolu",
    excerpt:
      "Mükemmel İngilizce telaffuza sahip olmak için gereken teknikleri öğrenin. AI destekli telaffuz antrenörü ile pratik yapmak da dahil.",
    category: "Telaffuz",
    readTime: "12 dk okuma",
    publishDate: "2024-12-29",
    featured: true,
    tags: ["Telaffuz", "Konuşma", "Pratik", "AI"],
  },
  {
    id: "ingilizce-gramer-rehberi",
    title: "İngilizce Gramer Rehberi: Temellerden İleri Seviyeye",
    excerpt:
      "İngilizce gramerinin tüm inceliklerini öğrenin. Başlangıç seviyesinden ileri seviyeye kadar kapsamlı rehber ve pratik örnekler.",
    category: "Gramer",
    readTime: "15 dk okuma",
    publishDate: "2024-12-28",
    featured: true,
    tags: ["Gramer", "Temel Bilgiler", "İleri Seviye", "Rehber"],
  },
  {
    id: "is-ingilizcesi-rehberi",
    title: "İş İng ilizcesi Rehberi: Kariyerinizi Geliştirin",
    excerpt:
      "Profesyonel hayatta İngilizce kullanmanın püf noktalarını öğrenin. İş görüşmelerinden sunum yapmaya kadar kapsamlı rehber.",
    category: "İş İngilizcesi",
    readTime: "10 dk okuma",
    publishDate: "2024-12-27",
    featured: false,
    tags: ["İş İngilizcesi", "Kariyer", "Profesyonel", "İletişim"],
  },
  {
    id: "ielts-hazirlik-rehberi",
    title: "IELTS Hazırlık Rehberi 2025: Yüksek Puan Almanın Sırları",
    excerpt:
      "IELTS sınavından yüksek puan almak için gereken tüm stratejileri öğrenin. AI destekli hazırlık araçları ile pratik yapın.",
    category: "IELTS",
    readTime: "18 dk okuma",
    publishDate: "2024-12-26",
    featured: false,
    tags: ["IELTS", "Sınav Hazırlığı", "Yüksek Puan", "Strateji"],
  },
  {
    id: "gunluk-ingilizce-konusma-pratigi",
    title: "Günlük İngilizce Konuşma Pratiği: 30 Günde Akıcılığa Ulaşın",
    excerpt:
      "Günlük konuşma pratiği ile İngilizce akıcılığınızı geliştirin. 30 günlük pratik planı ve AI konuşma partneri ile egzersizler.",
    category: "Konuşma",
    readTime: "9 dk okuma",
    publishDate: "2024-12-25",
    featured: false,
    tags: ["Konuşma", "Günlük Pratik", "Akıcılık", "30 Gün"],
  },
  {
    id: "kelime-hazinesi-gelistirme-yontemleri",
    title: "Kelime Hazinesi Geliştirme: En Etkili 7 Yöntem",
    excerpt:
      "İngilizce kelime hazinezi ni hızla geliştirmenin en etkili yöntemlerini keşfedin. Spaced repetition ve AI destekli teknikler dahil.",
    category: "Kelime Hazinesi",
    readTime: "11 dk okuma",
    publishDate: "2024-12-24",
    featured: false,
    tags: ["Kelime Hazinesi", "Öğrenme Teknikleri", "Hafıza", "AI"],
  },
  {
    id: "ingilizce-dinleme-becerisi-gelistirme",
    title: "İngilizce Dinleme Becerisini Geliştirmenin 8 Yolu",
    excerpt:
      "Farklı aksanları anlama, hızlı konuşmaları takip etme ve dinleme becerinizi geliştirme teknikleri.",
    category: "Dinleme",
    readTime: "13 dk okuma",
    publishDate: "2024-12-23",
    featured: false,
    tags: ["Dinleme", "Aksan", "Anlama", "Gelişim"],
  },
];

const categories = [
  { name: "Tümü", count: blogPosts.length, active: true },
  { name: "AI Teknoloji", count: 2, active: false },
  { name: "Telaffuz", count: 1, active: false },
  { name: "Gramer", count: 1, active: false },
  { name: "İş İngilizcesi", count: 1, active: false },
  { name: "IELTS", count: 1, active: false },
  { name: "Konuşma", count: 2, active: false },
];

export default function TurkishBlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
                className="text-sm font-medium text-primary"
              >
                Blog
              </Link>
              <Link
                href="/tr/hakkimizda"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Hakkımızda
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
                <Button size="sm">Ücretsiz Başla</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/tr" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Blog</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">📚 İngilizce Öğrenme</Badge>
            <Badge variant="outline">AI Destekli</Badge>
            <Badge variant="outline">Uzman İpuçları</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            İngilizce Öğrenme Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI destekli stratejiler, uzman ipuçları ve kanıtlanmış yöntemlerle
            İngilizce öğrenme yolculuğunuzda size rehberlik ediyoruz. IELTS
            hazırlığından günlük konuşma pratiğine kadar her konuda değerli
            bilgiler.
          </p>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant={category.active ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Öne Çıkan Yazılar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map(post => (
              <GradientCard
                key={post.id}
                className="h-full hover:scale-105 transition-transform duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link
                      href={`/tr/blog/${post.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.publishDate}</span>
                    <Link
                      href={`/tr/blog/${post.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Devamını Oku →
                    </Link>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Regular Posts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Tüm Yazılar</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {regularPosts.map(post => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link
                      href={`/tr/blog/${post.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 4).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.publishDate}</span>
                    <Link
                      href={`/tr/blog/${post.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Devamını Oku →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mb-16">
          <GradientCard className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">
                İngilizce Öğrenme İpuçlarını Kaçırmayın
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Haftalık İngilizce öğrenme ipuçları, AI destekli stratejiler ve
                yeni blog yazılarımızdan haberdar olmak için ücretsiz hesap
                oluşturun.
              </p>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Ücretsiz Hesap Oluştur
                </Button>
              </Link>
            </CardContent>
          </GradientCard>
        </section>

        {/* Related Links */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            İlgili Kaynaklar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">Seviye Testi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  İngilizce seviyenizi belirleyin
                </p>
                <Link href="/tr/ingilizce-seviye-testi">
                  <Button variant="outline" size="sm">
                    Test Et
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">📖</div>
                <h3 className="font-semibold mb-2">Öğrenme Rehberi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kapsamlı İngilizce öğrenme rehberi
                </p>
                <Link href="/tr/ingilizce-ogrenme-rehberi">
                  <Button variant="outline" size="sm">
                    Keşfet
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="font-semibold mb-2">Başarı Hikayeleri</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kullanıcı deneyimlerini okuyun
                </p>
                <Link href="/tr/basari-hikayeleri">
                  <Button variant="outline" size="sm">
                    Oku
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">❓</div>
                <h3 className="font-semibold mb-2">SSS</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sık sorulan sorular
                </p>
                <Link href="/tr/sss">
                  <Button variant="outline" size="sm">
                    Görüntüle
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
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
              <h3 className="font-semibold mb-4">Popüler Konular</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/tr/blog/ai-ile-ingilizce-ogrenme"
                    className="hover:text-white"
                  >
                    AI ile Öğrenme
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/blog/ingilizce-telaffuz-gelistirme"
                    className="hover:text-white"
                  >
                    Telaffuz Geliştirme
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/blog/is-ingilizcesi-rehberi"
                    className="hover:text-white"
                  >
                    İş İngilizcesi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/blog/ielts-hazirlik-rehberi"
                    className="hover:text-white"
                  >
                    IELTS Hazırlık
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Diğer Sayfalar</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/tr" className="hover:text-white">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/tr/hakkimizda" className="hover:text-white">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/tr/fiyatlandirma" className="hover:text-white">
                    Fiyatlandırma
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
