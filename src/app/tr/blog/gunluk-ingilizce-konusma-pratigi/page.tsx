import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export const metadata: Metadata = {
  title:
    "Günlük İngilizce Konuşma Pratiği: 30 Günde Akıcılığa Ulaşın | Fluenta Blog",
  description:
    "30 günlük İngilizce konuşma pratiği planı ile akıcılığınızı geliştirin. Günlük rutinler, pratik ipuçları ve etkili yöntemler.",
  keywords:
    "İngilizce konuşma pratiği, günlük İngilizce, konuşma akıcılığı, İngilizce konuşma egzersizleri, konuşma becerisi geliştirme",
  alternates: {
    canonical: "/tr/blog/gunluk-ingilizce-konusma-pratigi",
    languages: {
      en: "/blog/daily-english-conversation-practice",
      tr: "/tr/blog/gunluk-ingilizce-konusma-pratigi",
    },
  },
  openGraph: {
    title: "Günlük İngilizce Konuşma Pratiği: 30 Günde Akıcılığa Ulaşın",
    description:
      "30 günlük İngilizce konuşma pratiği planı ile akıcılığınızı geliştirin. Günlük rutinler, pratik ipuçları ve etkili yöntemler.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-27",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/daily-conversation-practice-tr.jpg",
        width: 1200,
        height: 630,
        alt: "Günlük İngilizce Konuşma Pratiği",
      },
    ],
  },
};

export default function GunlukIngilizceKonusmaPratigi() {
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
                href="/tr/moduller"
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
          <span>Günlük İngilizce Konuşma Pratiği</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Konuşma Pratiği</Badge>
            <Badge variant="outline">12 dk okuma</Badge>
            <Badge variant="outline">27 Aralık 2024</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Günlük İngilizce Konuşma Pratiği: 30 Günde Akıcılığa Ulaşın
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Sistematik günlük pratiklerle İngilizce konuşma becerinizi
            geliştirin. 30 günlük plan ile akıcılığınızı artırın ve özgüveninizi
            kazanın.
          </p>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              🗣️ Konuşma Pratiğinin Önemi
            </h2>
            <p>
              İngilizce öğrenmenin en zor kısmı konuşmadır. Günlük düzenli
              pratiklerle bu engeli aşabilir, 30 gün içinde belirgin bir gelişim
              gösterebilirsiniz. Fluenta'nın AI konuşma partnerleri ile her gün
              pratik yapma fırsatınız var.
            </p>
          </div>

          <h2>30 Günlük Konuşma Pratiği Planı</h2>

          <h3>1. Hafta: Temel Konuşma Becerileri (1-7. Günler)</h3>

          <h4>Gün 1-2: Kendini Tanıtma</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Kendinizi akıcı şekilde tanıtmak
            </li>
            <li>
              <strong>Pratik:</strong> 5 dakika aynaya karşı konuşma
            </li>
            <li>
              <strong>İçerik:</strong> İsim, yaş, meslek, hobiler
            </li>
            <li>
              <strong>Örnek:</strong> "Hi, I'm [name]. I'm [age] years old and I
              work as a [job]."
            </li>
          </ul>

          <h4>Gün 3-4: Günlük Rutinler</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Günlük aktivitelerinizi anlatmak
            </li>
            <li>
              <strong>Pratik:</strong> Günlük rutininizi İngilizce anlatın
            </li>
            <li>
              <strong>İçerik:</strong> Sabah rutini, iş, akşam aktiviteleri
            </li>
            <li>
              <strong>Örnek:</strong> "I wake up at 7 AM, have breakfast, and go
              to work."
            </li>
          </ul>

          <h4>Gün 5-7: Temel Sorular ve Cevaplar</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Basit sorular sorup cevaplamak
            </li>
            <li>
              <strong>Pratik:</strong> Kendinize sorular sorup cevaplama
            </li>
            <li>
              <strong>İçerik:</strong> What, Where, When, How soruları
            </li>
            <li>
              <strong>Örnek:</strong> "What do you do for fun?" "I like reading
              books."
            </li>
          </ul>

          <Card className="my-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">💡 1. Hafta İpucu</h3>
              <p>
                Mükemmel olmaya odaklanmayın. Akıcılık, doğruluktan daha
                önemlidir. Hata yapmaktan korkmayın, her hata bir öğrenme
                fırsatıdır.
              </p>
            </CardContent>
          </Card>

          <h3>2. Hafta: Günlük Konuşmalar (8-14. Günler)</h3>

          <h4>Gün 8-9: Alışveriş Senaryoları</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Mağazada konuşabilmek
            </li>
            <li>
              <strong>Pratik:</strong> Alışveriş diyalogları kurma
            </li>
            <li>
              <strong>İçerik:</strong> Fiyat sorma, ürün hakkında bilgi alma
            </li>
            <li>
              <strong>Örnek:</strong> "How much does this cost?" "Do you have
              this in a different size?"
            </li>
          </ul>

          <h4>Gün 10-11: Restoran Konuşmaları</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Restoranda sipariş verebilmek
            </li>
            <li>
              <strong>Pratik:</strong> Menü okuma ve sipariş verme
            </li>
            <li>
              <strong>İçerik:</strong> Yemek siparişi, hesap isteme
            </li>
            <li>
              <strong>Örnek:</strong> "I'd like to order..." "Could I have the
              bill, please?"
            </li>
          </ul>

          <h4>Gün 12-14: Yol Tarifi</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Yol sorabilmek ve tarif verebilmek
            </li>
            <li>
              <strong>Pratik:</strong> Harita kullanarak yol tarifi
            </li>
            <li>
              <strong>İçerik:</strong> Yön ifadeleri, mesafe belirtme
            </li>
            <li>
              <strong>Örnek:</strong> "Excuse me, how do I get to...?" "Go
              straight, then turn left."
            </li>
          </ul>

          <h3>3. Hafta: Sosyal Etkileşimler (15-21. Günler)</h3>

          <h4>Gün 15-16: Arkadaşlarla Sohbet</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Günlük sohbet edebilmek
            </li>
            <li>
              <strong>Pratik:</strong> Hava durumu, haberler, planlar
            </li>
            <li>
              <strong>İçerik:</strong> Small talk, görüş paylaşma
            </li>
            <li>
              <strong>Örnek:</strong> "What do you think about...?" "I
              agree/disagree because..."
            </li>
          </ul>

          <h4>Gün 17-18: Telefon Konuşmaları</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Telefonda konuşabilmek
            </li>
            <li>
              <strong>Pratik:</strong> Telefon diyalogları simüle etme
            </li>
            <li>
              <strong>İçerik:</strong> Randevu alma, bilgi sorma
            </li>
            <li>
              <strong>Örnek:</strong> "Hello, this is..." "Could you please hold
              on?"
            </li>
          </ul>

          <h4>Gün 19-21: Görüş Bildirme</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Fikirlerinizi ifade edebilmek
            </li>
            <li>
              <strong>Pratik:</strong> Güncel konular hakkında konuşma
            </li>
            <li>
              <strong>İçerik:</strong> Görüş belirtme, karşı argüman
            </li>
            <li>
              <strong>Örnek:</strong> "In my opinion..." "I believe that..."
            </li>
          </ul>

          <Card className="my-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                🚀 Fluenta ile Pratik Yapın
              </h3>
              <p className="mb-4">
                Fluenta'nın AI konuşma partnerleri ile bu senaryoları gerçek
                zamanlı olarak pratik edebilirsiniz. Telaffuz geri bildirimi ve
                konuşma analizi ile gelişiminizi takip edin.
              </p>
              <Link href="/register">
                <Button className="w-full sm:w-auto">
                  Konuşma Pratiğine Başla
                </Button>
              </Link>
            </CardContent>
          </Card>

          <h3>4. Hafta: İleri Seviye Konuşmalar (22-30. Günler)</h3>

          <h4>Gün 22-24: İş Konuşmaları</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Profesyonel ortamda konuşabilmek
            </li>
            <li>
              <strong>Pratik:</strong> İş toplantısı simülasyonu
            </li>
            <li>
              <strong>İçerik:</strong> Sunum yapma, görüş bildirme
            </li>
            <li>
              <strong>Örnek:</strong> "I'd like to present..." "What are your
              thoughts on this?"
            </li>
          </ul>

          <h4>Gün 25-27: Hikaye Anlatma</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Uzun anlatımlar yapabilmek
            </li>
            <li>
              <strong>Pratik:</strong> Kişisel deneyimler anlatma
            </li>
            <li>
              <strong>İçerik:</strong> Geçmiş olaylar, detaylı açıklamalar
            </li>
            <li>
              <strong>Örnek:</strong> "Let me tell you about..." "It was an
              amazing experience because..."
            </li>
          </ul>

          <h4>Gün 28-30: Tartışma ve Müzakere</h4>
          <ul>
            <li>
              <strong>Hedef:</strong> Karmaşık konuları tartışabilmek
            </li>
            <li>
              <strong>Pratik:</strong> Farklı görüşleri savunma
            </li>
            <li>
              <strong>İçerik:</strong> Argüman geliştirme, ikna etme
            </li>
            <li>
              <strong>Örnek:</strong> "I understand your point, but..." "Have
              you considered that..."
            </li>
          </ul>

          <h2>Günlük Pratik İpuçları</h2>

          <h3>1. Düzenli Zaman Ayırın</h3>
          <ul>
            <li>Her gün aynı saatte 15-30 dakika pratik yapın</li>
            <li>Sabah veya akşam saatlerini tercih edin</li>
            <li>Pratik yapmayı alışkanlık haline getirin</li>
          </ul>

          <h3>2. Kendinizi Kaydedin</h3>
          <ul>
            <li>Konuşmalarınızı telefona kaydedin</li>
            <li>Telaffuz ve akıcılığınızı değerlendirin</li>
            <li>İlerlemenizi takip edin</li>
          </ul>

          <h3>3. Çeşitli Konular Seçin</h3>
          <ul>
            <li>İlgi alanlarınızdan konular seçin</li>
            <li>Güncel olayları takip edin</li>
            <li>Farklı durumları simüle edin</li>
          </ul>

          <h3>4. Hatalarınızı Analiz Edin</h3>
          <ul>
            <li>Sık yaptığınız hataları not edin</li>
            <li>Bu hatalara odaklanarak pratik yapın</li>
            <li>Gelişim alanlarınızı belirleyin</li>
          </ul>

          <h2>Konuşma Pratiği Araçları</h2>

          <h3>Teknoloji Destekli Araçlar</h3>
          <ul>
            <li>
              <strong>AI Konuşma Partnerleri:</strong> Fluenta gibi platformlar
            </li>
            <li>
              <strong>Ses Kayıt Uygulamaları:</strong> İlerleme takibi için
            </li>
            <li>
              <strong>Telaffuz Uygulamaları:</strong> Ses analizi için
            </li>
            <li>
              <strong>Video Konferans:</strong> Gerçek insanlarla pratik
            </li>
          </ul>

          <h3>Geleneksel Yöntemler</h3>
          <ul>
            <li>
              <strong>Ayna Karşısında Konuşma:</strong> Özgüven geliştirme
            </li>
            <li>
              <strong>Sesli Okuma:</strong> Telaffuz geliştirme
            </li>
            <li>
              <strong>Monolog Pratiği:</strong> Akıcılık artırma
            </li>
            <li>
              <strong>Diyalog Kurma:</strong> Etkileşim becerisi
            </li>
          </ul>

          <h2>Başarı Ölçütleri</h2>

          <h3>1. Hafta Sonunda</h3>
          <ul>
            <li>Kendinizi rahatça tanıtabiliyorsunuz</li>
            <li>Basit sorular sorup cevaplıyorsunuz</li>
            <li>Günlük rutininizi anlatabiliyorsunuz</li>
          </ul>

          <h3>2. Hafta Sonunda</h3>
          <ul>
            <li>Günlük durumları halledebiliyorsunuz</li>
            <li>Alışveriş ve restoran konuşmaları yapabiliyorsunuz</li>
            <li>Yol sorabilir ve tarif verebiliyorsunuz</li>
          </ul>

          <h3>3. Hafta Sonunda</h3>
          <ul>
            <li>Sosyal sohbetlere katılabiliyorsunuz</li>
            <li>Telefonda konuşabiliyorsunuz</li>
            <li>Görüşlerinizi ifade edebiliyorsunuz</li>
          </ul>

          <h3>4. Hafta Sonunda</h3>
          <ul>
            <li>Profesyonel konuşmalar yapabiliyorsunuz</li>
            <li>Hikaye anlatabiliyorsunuz</li>
            <li>Karmaşık konuları tartışabiliyorsunuz</li>
          </ul>

          <h2>Sonuç</h2>
          <p>
            30 günlük sistematik konuşma pratiği ile İngilizce akıcılığınızda
            belirgin bir gelişim göstereceksiniz. Önemli olan düzenli olmak ve
            her gün biraz daha zorlu konulara geçmektir.
          </p>
          <p>
            Fluenta'nın AI destekli konuşma modülü ile bu planı daha etkili
            şekilde uygulayabilir, gerçek zamanlı geri bildirimlerle
            gelişiminizi hızlandırabilirsiniz.
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
                    href="/tr/blog/ingilizce-telaffuz-gelistirme"
                    className="hover:text-primary"
                  >
                    İngilizce Telaffuzunu Geliştirmenin 10 Etkili Yolu
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mükemmel İngilizce telaffuza sahip olmak için gereken
                  teknikleri öğrenin.
                </p>
              </CardContent>
            </Card>
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
          </div>
        </section>
      </main>
    </div>
  );
}
