import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import FooterTr from "@/components/layout/FooterTr";

export const metadata: Metadata = {
  title: "IELTS Hazırlık Rehberi | Fluenta Blog",
  description:
    "IELTS sınavına hazırlanmak için kapsamlı rehber. AI destekli pratik yöntemleri, puan artırma teknikleri ve başarı stratejileri.",
  keywords:
    "IELTS hazırlık, IELTS sınavı, İngilizce sınav hazırlığı, IELTS puanı artırma, AI IELTS hazırlık, IELTS stratejileri",
  alternates: {
    canonical: "/blog/ielts-hazirlik-rehberi",
    languages: {
      en: "/en/blog/ielts-preparation-ai-guide",
      tr: "/blog/ielts-hazirlik-rehberi",
    },
  },
  openGraph: {
    title: "IELTS Hazırlık Rehberi: AI ile Yüksek Puan Alma Stratejileri",
    description:
      "IELTS sınavına hazırlanmak için kapsamlı rehber. AI destekli pratik yöntemleri, puan artırma teknikleri ve başarı stratejileri.",
    type: "article",
    locale: "tr_TR",
    publishedTime: "2024-12-29",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/ielts-preparation-tr.jpg",
        width: 1200,
        height: 630,
        alt: "IELTS Hazırlık Rehberi",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 border border-blue-200/50 dark:border-blue-700/50">
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {children}
      </span>
    </div>
  </div>
);

export default function IeltsHazirlikRehberi() {
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
          <span>IELTS Hazırlık Rehberi</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>Yüksek Puan Stratejileri</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">IELTS</Badge>
              <Badge variant="outline">Sınav Hazırlığı</Badge>
              <Badge variant="outline">15 dk okuma</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              IELTS Hazırlık Rehberi: AI ile Yüksek Puan Alma Stratejileri
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              IELTS sınavına hazırlanmak için kapsamlı rehber. AI destekli
              pratik yöntemleri, puan artırma teknikleri ve başarı stratejileri
              ile hedeflediğiniz puanı alın.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>29 Aralık 2024</span>
              <span>•</span>
              <span>15 dk okuma</span>
              <span>•</span>
              <span>IELTS</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  🎯 IELTS Neden Bu Kadar Önemli?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IELTS (International English Language Testing System), dünya
                  çapında en çok kabul gören İngilizce yeterlilik sınavıdır.
                  Üniversite başvuruları, iş başvuruları ve göçmenlik
                  süreçlerinde kritik rol oynar. Fluenta'nın AI destekli IELTS
                  hazırlık modülü ile hedeflediğiniz puanı alabilirsiniz.
                </p>
              </div>
            </GradientCard>
          </section>

          <h2>IELTS Sınavı Hakkında Temel Bilgiler</h2>

          <h3>IELTS Türleri</h3>
          <ul>
            <li>
              <strong>Academic IELTS:</strong> Üniversite başvuruları için
            </li>
            <li>
              <strong>General Training IELTS:</strong> İş başvuruları ve
              göçmenlik için
            </li>
          </ul>

          <h3>Sınav Bölümleri</h3>
          <p>IELTS sınavı 4 ana bölümden oluşur:</p>
          <ul>
            <li>
              <strong>Listening (Dinleme):</strong> 30 dakika + 10 dakika
              transfer süresi
            </li>
            <li>
              <strong>Reading (Okuma):</strong> 60 dakika
            </li>
            <li>
              <strong>Writing (Yazma):</strong> 60 dakika
            </li>
            <li>
              <strong>Speaking (Konuşma):</strong> 11-14 dakika
            </li>
          </ul>

          <h3>Puanlama Sistemi</h3>
          <p>
            Her bölüm 0-9 arasında puanlanır. Genel puan, 4 bölümün
            ortalamasıdır. Çoğu üniversite 6.5-7.0 arası puan ister.
          </p>

          <h2>Bölüm Bazında Hazırlık Stratejileri</h2>

          <h3>1. Listening (Dinleme) Bölümü</h3>

          <h4>Sınav Formatı</h4>
          <ul>
            <li>4 bölüm, toplam 40 soru</li>
            <li>Zorluk seviyesi giderek artar</li>
            <li>Çeşitli aksan ve konuşma hızları</li>
            <li>Sadece bir kez dinleme imkanı</li>
          </ul>

          <h4>Hazırlık Stratejileri</h4>
          <ul>
            <li>
              <strong>Günlük Dinleme Pratiği:</strong> BBC, CNN, TED Talks
              dinleyin
            </li>
            <li>
              <strong>Not Alma Tekniği:</strong> Anahtar kelimeleri hızlıca not
              alın
            </li>
            <li>
              <strong>Tahmin Etme:</strong> Soruları önceden okuyup tahmin yapın
            </li>
            <li>
              <strong>Aksan Çeşitliliği:</strong> Farklı aksanlara alışın
            </li>
          </ul>

          <Card className="my-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">💡 Fluenta İpucu</h3>
              <p>
                Fluenta'nın AI dinleme modülü, IELTS formatında sorular sunar ve
                gerçek zamanlı geri bildirim verir. Zayıf olduğunuz alanları
                tespit eder ve özel pratik önerileri sunar.
              </p>
            </CardContent>
          </Card>

          <h3>2. Reading (Okuma) Bölümü</h3>

          <h4>Academic vs General Training</h4>
          <ul>
            <li>
              <strong>Academic:</strong> Akademik metinler, grafik yorumlama
            </li>
            <li>
              <strong>General:</strong> Günlük hayat metinleri, iş belgeleri
            </li>
          </ul>

          <h4>Soru Türleri</h4>
          <ul>
            <li>Multiple choice (Çoktan seçmeli)</li>
            <li>True/False/Not Given</li>
            <li>Matching headings (Başlık eşleştirme)</li>
            <li>Gap filling (Boşluk doldurma)</li>
            <li>Short answer questions</li>
          </ul>

          <h4>Başarı Stratejileri</h4>
          <ul>
            <li>
              <strong>Skimming ve Scanning:</strong> Hızlı okuma teknikleri
            </li>
            <li>
              <strong>Zaman Yönetimi:</strong> Her metin için 20 dakika
            </li>
            <li>
              <strong>Anahtar Kelime Takibi:</strong> Sorulardaki anahtar
              kelimeleri metinde bulun
            </li>
            <li>
              <strong>Parafraz Anlama:</strong> Aynı anlamı farklı kelimelerle
              ifade etme
            </li>
          </ul>

          <h3>3. Writing (Yazma) Bölümü</h3>

          <h4>Task 1 (20 dakika, 150 kelime)</h4>
          <ul>
            <li>
              <strong>Academic:</strong> Grafik, tablo, diyagram açıklama
            </li>
            <li>
              <strong>General:</strong> Mektup yazma (formal/informal)
            </li>
          </ul>

          <h4>Task 2 (40 dakika, 250 kelime)</h4>
          <ul>
            <li>Argumentative essay (Tartışmalı makale)</li>
            <li>Opinion essay (Görüş bildirme)</li>
            <li>Problem-solution essay</li>
            <li>Discussion essay</li>
          </ul>

          <h4>Yazma Stratejileri</h4>
          <ul>
            <li>
              <strong>Planlama:</strong> 5 dakika plan yapın
            </li>
            <li>
              <strong>Paragraf Yapısı:</strong> Giriş, gelişme, sonuç
            </li>
            <li>
              <strong>Kelime Çeşitliliği:</strong> Aynı kelimeleri tekrar
              etmeyin
            </li>
            <li>
              <strong>Gramer Karmaşıklığı:</strong> Farklı cümle yapıları
              kullanın
            </li>
          </ul>

          <h3>4. Speaking (Konuşma) Bölümü</h3>

          <h4>Sınav Formatı</h4>
          <ul>
            <li>
              <strong>Part 1:</strong> Tanışma ve genel sorular (4-5 dakika)
            </li>
            <li>
              <strong>Part 2:</strong> Uzun konuşma (3-4 dakika)
            </li>
            <li>
              <strong>Part 3:</strong> Tartışma ve analiz (4-5 dakika)
            </li>
          </ul>

          <h4>Değerlendirme Kriterleri</h4>
          <ul>
            <li>
              <strong>Fluency & Coherence:</strong> Akıcılık ve tutarlılık
            </li>
            <li>
              <strong>Lexical Resource:</strong> Kelime hazinesi
            </li>
            <li>
              <strong>Grammatical Range:</strong> Gramer çeşitliliği
            </li>
            <li>
              <strong>Pronunciation:</strong> Telaffuz
            </li>
          </ul>

          <Card className="my-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                🚀 Fluenta ile IELTS Speaking Pratiği
              </h3>
              <p className="mb-4">
                Fluenta'nın AI konuşma partneri, gerçek IELTS sınavı formatında
                sorular sorar ve performansınızı 4 kritere göre değerlendirir.
                Telaffuz, akıcılık ve kelime kullanımınızda anında geri bildirim
                alın.
              </p>
              <Link href="/register">
                <Button className="w-full sm:w-auto">
                  IELTS Speaking Pratiğine Başla
                </Button>
              </Link>
            </CardContent>
          </Card>

          <h2>AI Destekli IELTS Hazırlık Avantajları</h2>

          <h3>1. Kişiselleştirilmiş Öğrenme</h3>
          <ul>
            <li>Zayıf alanlarınızı tespit eder</li>
            <li>Size özel pratik planı oluşturur</li>
            <li>İlerlemenizi sürekli takip eder</li>
            <li>Hedef puanınıza göre strateji geliştirir</li>
          </ul>

          <h3>2. Gerçek Zamanlı Geri Bildirim</h3>
          <ul>
            <li>Anında hata düzeltme</li>
            <li>Telaffuz analizi</li>
            <li>Gramer kontrolü</li>
            <li>Kelime önerileri</li>
          </ul>

          <h3>3. Sınırsız Pratik İmkanı</h3>
          <ul>
            <li>7/24 erişim</li>
            <li>Binlerce pratik sorusu</li>
            <li>Gerçek sınav simülasyonları</li>
            <li>İlerleme raporları</li>
          </ul>

          <h2>IELTS Hazırlık Takvimi</h2>

          <h3>3 Aylık Yoğun Program</h3>

          <h4>1. Ay: Temel Beceri Geliştirme</h4>
          <ul>
            <li>Seviye tespit sınavı</li>
            <li>Temel gramer ve kelime çalışması</li>
            <li>Her bölüm için günlük 30 dakika pratik</li>
            <li>Sınav formatına alışma</li>
          </ul>

          <h4>2. Ay: Yoğun Pratik</h4>
          <ul>
            <li>Günlük 2 saat çalışma</li>
            <li>Zayıf alanlara odaklanma</li>
            <li>Mock test çözme</li>
            <li>Hata analizi ve düzeltme</li>
          </ul>

          <h4>3. Ay: Sınav Hazırlığı</h4>
          <ul>
            <li>Haftalık tam sınav simülasyonu</li>
            <li>Zaman yönetimi pratiği</li>
            <li>Stres yönetimi teknikleri</li>
            <li>Son tekrarlar</li>
          </ul>

          <h2>Sınav Günü İpuçları</h2>

          <h3>Sınav Öncesi</h3>
          <ul>
            <li>Erken yatın, iyi uyuyun</li>
            <li>Sağlıklı kahvaltı yapın</li>
            <li>Gerekli belgeleri kontrol edin</li>
            <li>Sınav merkezine erken gidin</li>
          </ul>

          <h3>Sınav Sırasında</h3>
          <ul>
            <li>Sakin kalın ve nefes alın</li>
            <li>Zamanı iyi yönetin</li>
            <li>Talimatları dikkatle dinleyin</li>
            <li>Emin olmadığınız sorularda tahmin yapın</li>
          </ul>

          <h2>Yaygın Hatalar ve Çözümleri</h2>

          <h3>Listening Hataları</h3>
          <ul>
            <li>
              <strong>Hata:</strong> Tüm metni anlamaya çalışmak
              <br />
              <strong>Çözüm:</strong> Sadece soruyla ilgili kısımlara odaklanın
            </li>
            <li>
              <strong>Hata:</strong> Cevapları transfer etmeyi unutmak
              <br />
              <strong>Çözüm:</strong> Son 10 dakikayı transfer için kullanın
            </li>
          </ul>

          <h3>Reading Hataları</h3>
          <ul>
            <li>
              <strong>Hata:</strong> Her kelimeyi anlamaya çalışmak
              <br />
              <strong>Çözüm:</strong> Genel anlam ve anahtar kelimeler üzerine
              odaklanın
            </li>
            <li>
              <strong>Hata:</strong> Zaman yönetimi problemi
              <br />
              <strong>Çözüm:</strong> Her metin için 20 dakika sınırı koyun
            </li>
          </ul>

          <h3>Writing Hataları</h3>
          <ul>
            <li>
              <strong>Hata:</strong> Kelime sayısını karşılamamak
              <br />
              <strong>Çözüm:</strong> Yazarken kelime sayısını takip edin
            </li>
            <li>
              <strong>Hata:</strong> Soruyu tam olarak cevaplamamak
              <br />
              <strong>Çözüm:</strong> Soruyu dikkatle okuyun ve tüm kısımlarını
              cevaplayın
            </li>
          </ul>

          <h3>Speaking Hataları</h3>
          <ul>
            <li>
              <strong>Hata:</strong> Çok kısa cevaplar vermek
              <br />
              <strong>Çözüm:</strong> Cevaplarınızı detaylandırın ve örnekler
              verin
            </li>
            <li>
              <strong>Hata:</strong> Hata yapmaktan korkmak
              <br />
              <strong>Çözüm:</strong> Akıcılığa odaklanın, küçük hatalar normal
            </li>
          </ul>

          <h2>Sonuç</h2>
          <p>
            IELTS başarısı, sistematik hazırlık ve düzenli pratik gerektirir. AI
            destekli araçlar bu süreci hızlandırabilir ve daha etkili hale
            getirebilir. Fluenta'nın IELTS hazırlık modülü ile hedeflediğiniz
            puanı almak için gereken tüm araçlara sahip olursunuz.
          </p>
          <p>
            Unutmayın, IELTS sadece bir sınav değil, İngilizce becerilerinizi
            geliştirme yolculuğunun bir parçasıdır. Sabırlı olun, düzenli
            çalışın ve hedefinize ulaşın!
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
                    href="/blog/ingilizce-gramer-rehberi"
                    className="hover:text-primary"
                  >
                    İngilizce Gramer Rehberi: Temellerden İleri Seviyeye
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  İngilizce gramerinin tüm inceliklerini öğrenin. IELTS için
                  gerekli gramer konuları.
                </p>
              </CardContent>
            </Card>
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterTr />
    </div>
  );
}
