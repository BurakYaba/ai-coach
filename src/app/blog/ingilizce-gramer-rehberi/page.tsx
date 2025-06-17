import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import FooterTr from "@/components/layout/FooterTr";

export const metadata: Metadata = {
  title: "Kapsamlı İngilizce Gramer Rehberi 2025 | Fluenta",
  description:
    "İngilizce gramerini kolay ve sistematik şekilde öğrenin. Temel kurallardan ileri seviyeye, AI destekli pratik egzersizleri ile dilbilgisi becerilerinizi geliştirin.",
  keywords:
    "İngilizce gramer, grammar, İngilizce dilbilgisi, gramer kuralları, İngilizce öğrenme, AI gramer kontrolü",
  alternates: {
    canonical: "/blog/ingilizce-gramer-rehberi",
    languages: {
      en: "/en/blog/english-grammar-guide",
      tr: "/blog/ingilizce-gramer-rehberi",
    },
  },
  openGraph: {
    title: "Kapsamlı İngilizce Gramer Rehberi 2025 | Fluenta",
    description:
      "İngilizce gramerini kolay ve sistematik şekilde öğrenin. Temel kurallardan ileri seviyeye, AI destekli pratik egzersizleri ile dilbilgisi becerilerinizi geliştirin.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-29",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/grammar-guide-tr.jpg",
        width: 1200,
        height: 630,
        alt: "Kapsamlı İngilizce Gramer Rehberi",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50">
      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {children}
      </span>
    </div>
  </div>
);

export default function IngilizceGramerRehberi() {
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
          <span>Gramer Rehberi</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>Temellerden İleri Seviyeye</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">Gramer</Badge>
              <Badge variant="outline">Dilbilgisi</Badge>
              <Badge variant="outline">12 dk okuma</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              İngilizce Gramer Rehberi: Temellerden İleri Seviyeye
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              İngilizce gramerini sistematik şekilde öğrenin. Temel kurallardan
              karmaşık yapılara kadar kapsamlı rehber ve AI destekli pratik
              egzersizleri ile dilbilgisi becerilerinizi geliştirin.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>29 Aralık 2024</span>
              <span>•</span>
              <span>12 dk okuma</span>
              <span>•</span>
              <span>Gramer</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  📚 Gramer Neden Temel Taş?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  İngilizce gramer, dilin iskeletidir. Doğru gramer kullanımı,
                  düşüncelerinizi net ve etkili şekilde ifade etmenizi sağlar.
                  Araştırmalar gösteriyor ki, sağlam gramer temeli olan
                  öğrenciler %60 daha hızlı İngilizce öğreniyor. Fluenta'nın AI
                  destekli gramer modülü ile kişiselleştirilmiş egzersizler
                  yapabilir ve hatalarınızı anında düzeltebilirsiniz.
                </p>
              </div>
            </GradientCard>
          </section>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <h2>Temel Gramer Konuları</h2>

            <h3>1. Zamanlar (Tenses)</h3>
            <p>
              İngilizce'de 12 temel zaman vardır. Her birinin kendine özgü
              kullanım alanları:
            </p>

            <h4>Şimdiki Zaman (Present Tenses)</h4>
            <ul>
              <li>
                <strong>Simple Present:</strong> I work every day.
                (Alışkanlıklar, genel gerçekler)
              </li>
              <li>
                <strong>Present Continuous:</strong> I am working now. (Şu anda
                devam eden eylemler)
              </li>
              <li>
                <strong>Present Perfect:</strong> I have worked here for 5
                years. (Geçmişte başlayıp şimdiye etkisi olan)
              </li>
              <li>
                <strong>Present Perfect Continuous:</strong> I have been working
                since morning. (Geçmişte başlayıp devam eden)
              </li>
            </ul>

            <h4>Geçmiş Zaman (Past Tenses)</h4>
            <ul>
              <li>
                <strong>Simple Past:</strong> I worked yesterday. (Geçmişte
                tamamlanan eylemler)
              </li>
              <li>
                <strong>Past Continuous:</strong> I was working when you called.
                (Geçmişte devam eden)
              </li>
              <li>
                <strong>Past Perfect:</strong> I had worked before you arrived.
                (Geçmişte daha önce tamamlanan)
              </li>
              <li>
                <strong>Past Perfect Continuous:</strong> I had been working for
                hours. (Geçmişte uzun süre devam eden)
              </li>
            </ul>

            <h4>Gelecek Zaman (Future Tenses)</h4>
            <ul>
              <li>
                <strong>Simple Future:</strong> I will work tomorrow. (Gelecek
                planlar)
              </li>
              <li>
                <strong>Future Continuous:</strong> I will be working at 3 PM.
                (Gelecekte devam edecek)
              </li>
              <li>
                <strong>Future Perfect:</strong> I will have worked by then.
                (Gelecekte tamamlanacak)
              </li>
              <li>
                <strong>Future Perfect Continuous:</strong> I will have been
                working for 10 hours. (Gelecekte uzun süre devam edecek)
              </li>
            </ul>

            <Card className="my-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Fluenta İpucu</h3>
                <p>
                  Fluenta'nın AI gramer koçu, yazdığınız metinlerdeki zaman
                  hatalarını tespit eder ve size doğru kullanımı öğretir. Gerçek
                  zamanlı geri bildirim ile gramer becerilerinizi hızla
                  geliştirebilirsiniz.
                </p>
              </CardContent>
            </Card>

            <h3>2. Kelime Türleri (Parts of Speech)</h3>

            <h4>İsimler (Nouns)</h4>
            <ul>
              <li>
                <strong>Sayılabilir İsimler:</strong> book/books, car/cars
              </li>
              <li>
                <strong>Sayılamaz İsimler:</strong> water, information, advice
              </li>
              <li>
                <strong>Özel İsimler:</strong> London, John, Microsoft
              </li>
              <li>
                <strong>Soyut İsimler:</strong> happiness, freedom, love
              </li>
            </ul>

            <h4>Sıfatlar (Adjectives)</h4>
            <ul>
              <li>
                <strong>Tanımlayıcı:</strong> beautiful, large, red
              </li>
              <li>
                <strong>Karşılaştırmalı:</strong> bigger, more beautiful
              </li>
              <li>
                <strong>Üstünlük:</strong> biggest, most beautiful
              </li>
            </ul>

            <h4>Zarflar (Adverbs)</h4>
            <ul>
              <li>
                <strong>Şekil zarfları:</strong> quickly, carefully, loudly
              </li>
              <li>
                <strong>Zaman zarfları:</strong> yesterday, soon, always
              </li>
              <li>
                <strong>Yer zarfları:</strong> here, there, everywhere
              </li>
            </ul>

            <h3>3. Cümle Yapısı (Sentence Structure)</h3>

            <h4>Temel Cümle Kalıpları</h4>
            <ol>
              <li>
                <strong>S + V:</strong> Birds fly. (Özne + Yüklem)
              </li>
              <li>
                <strong>S + V + O:</strong> I read books. (Özne + Yüklem +
                Nesne)
              </li>
              <li>
                <strong>S + V + O + O:</strong> I gave him a book. (Özne +
                Yüklem + Dolaylı Nesne + Doğrudan Nesne)
              </li>
              <li>
                <strong>S + V + O + C:</strong> We elected him president. (Özne
                + Yüklem + Nesne + Tümleç)
              </li>
            </ol>

            <h4>Soru Cümleleri</h4>
            <ul>
              <li>
                <strong>Yes/No Questions:</strong> Do you like coffee?
              </li>
              <li>
                <strong>Wh- Questions:</strong> What do you like?
              </li>
              <li>
                <strong>Tag Questions:</strong> You like coffee, don't you?
              </li>
            </ul>

            <h3>4. Artikeller (Articles)</h3>
            <ul>
              <li>
                <strong>Belirsiz Artikel (a/an):</strong> a book, an apple
              </li>
              <li>
                <strong>Belirli Artikel (the):</strong> the book I mentioned
              </li>
              <li>
                <strong>Sıfır Artikel:</strong> I like music. (Genel kavramlar)
              </li>
            </ul>

            <h2>İleri Seviye Gramer Konuları</h2>

            <h3>5. Koşul Cümleleri (Conditionals)</h3>
            <ul>
              <li>
                <strong>Zero Conditional:</strong> If you heat water, it boils.
                (Genel gerçekler)
              </li>
              <li>
                <strong>First Conditional:</strong> If it rains, I will stay
                home. (Gerçek durumlar)
              </li>
              <li>
                <strong>Second Conditional:</strong> If I were rich, I would
                travel. (Hayali durumlar)
              </li>
              <li>
                <strong>Third Conditional:</strong> If I had studied, I would
                have passed. (Geçmiş pişmanlıklar)
              </li>
            </ul>

            <h3>6. Pasif Yapı (Passive Voice)</h3>
            <ul>
              <li>
                <strong>Present:</strong> The book is written by John.
              </li>
              <li>
                <strong>Past:</strong> The book was written by John.
              </li>
              <li>
                <strong>Future:</strong> The book will be written by John.
              </li>
              <li>
                <strong>Perfect:</strong> The book has been written by John.
              </li>
            </ul>

            <h3>7. Dolaylı Anlatım (Reported Speech)</h3>
            <ul>
              <li>
                <strong>Statements:</strong> He said (that) he was tired.
              </li>
              <li>
                <strong>Questions:</strong> He asked if I was coming.
              </li>
              <li>
                <strong>Commands:</strong> He told me to come early.
              </li>
            </ul>

            <Card className="my-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  🚀 Fluenta ile Gramer Ustası Olun
                </h3>
                <p className="mb-4">
                  Fluenta'nın AI destekli gramer koçu, yukarıdaki tüm konularda
                  size kişiselleştirilmiş alıştırmalar sunar. Hatalarınızı
                  analiz eder ve zayıf olduğunuz alanlara odaklanmanızı sağlar.
                </p>
                <Link href="/register">
                  <Button className="w-full sm:w-auto">
                    Ücretsiz Denemeyi Başlat
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <h2>Yaygın Gramer Hataları ve Çözümleri</h2>

            <h3>1. Subject-Verb Agreement</h3>
            <ul>
              <li>
                <strong>Yanlış:</strong> He don't like coffee.
              </li>
              <li>
                <strong>Doğru:</strong> He doesn't like coffee.
              </li>
            </ul>

            <h3>2. Preposition Kullanımı</h3>
            <ul>
              <li>
                <strong>Yanlış:</strong> I'm good in English.
              </li>
              <li>
                <strong>Doğru:</strong> I'm good at English.
              </li>
            </ul>

            <h3>3. Countable/Uncountable Nouns</h3>
            <ul>
              <li>
                <strong>Yanlış:</strong> I need some informations.
              </li>
              <li>
                <strong>Doğru:</strong> I need some information.
              </li>
            </ul>

            <h3>4. Gerund vs Infinitive</h3>
            <ul>
              <li>
                <strong>Enjoy + Gerund:</strong> I enjoy reading.
              </li>
              <li>
                <strong>Want + Infinitive:</strong> I want to read.
              </li>
            </ul>

            <h2>Gramer Öğrenme Stratejileri</h2>

            <h3>1. Kademeli Öğrenme</h3>
            <p>
              Temel konulardan başlayıp yavaş yavaş ileri seviyeye geçin. Her
              konuyu iyice kavradıktan sonra bir sonrakine geçin.
            </p>

            <h3>2. Pratik Yapma</h3>
            <p>
              Öğrendiğiniz gramer kurallarını cümleler kurarak pratik edin.
              Sadece kural ezberlemek yeterli değildir.
            </p>

            <h3>3. Gerçek Metinlerle Çalışma</h3>
            <p>
              Kitaplar, makaleler ve haberlerden örnekler bulun. Gerçek kullanım
              örnekleri gramer kurallarını pekiştirir.
            </p>

            <h3>4. Hata Analizi</h3>
            <p>
              Yaptığınız hataları not edin ve neden yanlış olduğunu anlayın.
              Aynı hatayı tekrar yapmamaya odaklanın.
            </p>

            <h2>Sonuç</h2>
            <p>
              İngilizce gramer, sabır ve düzenli pratik gerektiren bir konudur.
              Ancak doğru yaklaşım ve araçlarla bu süreci çok daha etkili hale
              getirebilirsiniz. Unutmayın, gramer sadece kurallar değil,
              düşüncelerinizi doğru ifade etmenin yoludur.
            </p>
            <p>
              AI destekli öğrenme araçları, gramer öğrenme sürecini
              kişiselleştirir ve hızlandırır. Fluenta'nın gramer koçu ile zayıf
              olduğunuz alanları tespit edebilir ve hedefli pratikler
              yapabilirsiniz.
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
                      href="/blog/ai-ile-ingilizce-ogrenme"
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
                      href="/blog/ingilizce-telaffuz-gelistirme"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      İngilizce Telaffuz Geliştirme →
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mükemmel İngilizce telaffuza sahip olmak için gereken
                    teknikleri öğrenin.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <FooterTr />
    </div>
  );
}
