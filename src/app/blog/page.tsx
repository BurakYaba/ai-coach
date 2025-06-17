import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import PopularResources from "@/components/layout/PopularResources";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title:
    "İngilizce Öğrenme Blog | AI Destekli İpuçları ve Stratejiler | Fluenta",
  description:
    "İngilizce öğrenme konusunda uzman ipuçları, AI destekli stratejiler ve kanıtlanmış yöntemleri keşfedin. IELTS hazırlığından günlük konuşma pratiğine kadar İngilizce potansiyelinizi Fluenta ile açığa çıkarın.",
  keywords:
    "İngilizce öğrenme blog, AI İngilizce araçları, IELTS hazırlık, İngilizce konuşma pratiği, dil öğrenme ipuçları, İngilizce gramer, kelime hazinesi geliştirme, İngilizce telaffuz, dil öğrenme AI",
  alternates: {
    canonical: "/blog",
    languages: {
      en: "/en/blog",
      tr: "/blog",
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

// Tagline component matching the modules page
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50">
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {children}
      </span>
    </div>
  </div>
);

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
    title: "İş İngilizcesi Rehberi: Kariyerinizi Geliştirin",
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
      {/* Navigation */}
      <MainNav currentPath="/blog" language="tr" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Blog</span>
        </nav>

        {/* Header */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>Uzman İpuçları & AI Destekli Stratejiler</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            İngilizce Öğrenme Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI destekli stratejiler, uzman ipuçları ve kanıtlanmış yöntemlerle
            İngilizce öğrenme yolculuğunuzda size rehberlik ediyoruz. IELTS
            hazırlığından günlük konuşma pratiğine kadar her konuda değerli
            bilgiler.
          </p>
        </section>

        {/* Categories */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Blog Kategorileri
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant={category.active ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Öne Çıkan Yazılar
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              En popüler ve güncel İngilizce öğrenme içeriklerimiz
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map(post => (
              <GradientCard
                key={post.id}
                className="h-full hover:scale-105 hover:-translate-y-2 transition-all duration-300"
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
                      href={`/blog/${post.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
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
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                    <span>{post.publishDate}</span>
                    <Link
                      href={`/blog/${post.id}`}
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
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Tüm Yazılar</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              İngilizce öğrenme yolculuğunuzda size yardımcı olacak kapsamlı
              içerikler
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {regularPosts.map(post => (
              <Card
                key={post.id}
                className="hover:shadow-lg hover:scale-105 transition-all duration-300 h-full flex flex-col"
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
                      href={`/blog/${post.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
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
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                    <span>{post.publishDate}</span>
                    <Link
                      href={`/blog/${post.id}`}
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
        <section className="text-center">
          <GradientCard>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                İngilizce Öğrenme İpuçlarını Kaçırmayın
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Haftalık İngilizce öğrenme ipuçları, AI destekli stratejiler ve
                yeni blog yazılarımızdan haberdar olmak için ücretsiz hesap
                oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    Ücretsiz Hesap Oluştur
                  </Button>
                </Link>
                <Link href="/moduller">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    Öğrenme Modüllerini Keşfet
                  </Button>
                </Link>
              </div>
            </div>
          </GradientCard>
        </section>

        {/* Popular Resources */}
        <PopularResources />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
