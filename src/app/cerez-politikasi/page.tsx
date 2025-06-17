import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export const metadata: Metadata = {
  title: "Çerez Politikası - Fluenta AI İngilizce Öğrenme Platformu",
  description:
    "Fluenta'nın çerezleri ve takip teknolojilerini öğrenme deneyiminizi geliştirmek için nasıl kullandığını öğrenin. Seçimlerinizi ve kontrollerinizi anlayın.",
  keywords:
    "fluenta çerez politikası, çerezler, takip teknolojileri, web depolama, gizlilik kontrolleri",
  alternates: {
    canonical: "/cerez-politikasi",
    languages: {
      en: "/en/cookie-policy",
      tr: "/cerez-politikasi",
    },
  },
  openGraph: {
    title: "Çerez Politikası - Fluenta AI İngilizce Öğrenme Platformu",
    description:
      "Fluenta'nın çerezleri ve takip teknolojilerini öğrenme deneyiminizi geliştirmek için nasıl kullandığını öğrenin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-cookie-policy-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Çerez Politikası",
      },
    ],
  },
};

export default function CerezPolitikasiPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-xl hover:text-primary transition-colors"
            >
              Fluenta
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/moduller"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Modüller
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/hakkimizda"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Hakkımızda
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link href="/register">
                <Button size="sm">Başlayın</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Çerez Politikası</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Çerez Politikası</h1>
          <p className="text-muted-foreground text-lg">
            Son güncelleme: 29 Aralık 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Çerezler Nedir?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Çerezler, web sitemizi ziyaret ettiğinizde cihazınızda saklanan
                küçük metin dosyalarıdır. Tercihlerinizi hatırlayarak ve
                platformumuzu nasıl kullandığınızı analiz ederek size daha iyi
                bir deneyim sunmamıza yardımcı olurlar.
              </p>
              <p>
                Bu Çerez Politikası, Fluenta'nın AI destekli İngilizce öğrenme
                platformunda çerezleri ve benzer takip teknolojilerini nasıl
                kullandığını açıklar.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Kullandığımız Çerez Türleri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Zorunlu Çerezler</h3>
              <p>Bu çerezler web sitemizin düzgün çalışması için gereklidir:</p>
              <ul>
                <li>
                  Kimlik doğrulama çerezleri: Hesabınızda oturum açık tutmanızı
                  sağlar
                </li>
                <li>
                  Güvenlik çerezleri: Dolandırıcılık ve yetkisiz erişime karşı
                  korur
                </li>
                <li>Oturum çerezleri: Gezinirken oturumunuzu sürdürür</li>
                <li>Tercih çerezleri: Dil ve görünüm ayarlarınızı hatırlar</li>
              </ul>

              <h3>Performans ve Analitik Çerezleri</h3>
              <p>
                Bu çerezler ziyaretçilerin platformumuzla nasıl etkileşim
                kurduğunu anlamamıza yardımcı olur:
              </p>
              <ul>
                <li>
                  Google Analytics: Web sitesi trafiği ve kullanıcı davranışı
                  analizi
                </li>
                <li>
                  Performans izleme: Sayfa yükleme süreleri ve teknik performans
                </li>
                <li>Hata takibi: Teknik sorunları tespit etme ve düzeltme</li>
                <li>
                  Kullanım istatistikleri: Hangi özelliklerin popüler olduğunu
                  anlama
                </li>
              </ul>

              <h3>İşlevsel Çerezler</h3>
              <p>
                Bu çerezler seçimlerinizi hatırlayarak deneyiminizi geliştirir:
              </p>
              <ul>
                <li>Dil tercihleri: Seçtiğiniz arayüz dilini hatırlar</li>
                <li>
                  Öğrenme ayarları: Kişiselleştirilmiş öğrenme tercihlerinizi
                  kaydeder
                </li>
                <li>UI tercihleri: Düzen ve görüntü seçimlerinizi hatırlar</li>
                <li>
                  İlerleme kayıtları: Öğrenme ilerlemesi ve tamamlanan dersler
                </li>
              </ul>

              <h3>Pazarlama Çerezleri (izninizle)</h3>
              <p>Bu çerezler ilgili reklamlar sunmak için kullanılır:</p>
              <ul>
                <li>
                  Reklam çerezleri: İlgi alanlarınıza göre ilgili reklamlar
                  gösterir
                </li>
                <li>
                  Sosyal medya çerezleri: Sosyal paylaşım özelliklerini
                  etkinleştirir
                </li>
                <li>
                  Yeniden hedefleme çerezleri: Diğer web sitelerinde
                  reklamlarımızı gösterir
                </li>
                <li>
                  Kampanya takibi: Pazarlama kampanyalarının etkinliğini ölçer
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Choices */}
          <Card>
            <CardHeader>
              <CardTitle>Çerez Seçimleriniz ve Kontrolleriniz</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Çerez Onayı</h3>
              <p>
                Web sitemizi ilk ziyaret ettiğinizde, çerez bannerimiz
                aracılığıyla zorunlu olmayan çerezleri kabul etmeyi veya
                reddetmeyi seçebilirsiniz.
              </p>

              <h3>Tarayıcı Kontrolleri</h3>
              <p>
                Çerezleri tarayıcı ayarlarınız aracılığıyla kontrol
                edebilirsiniz:
              </p>
              <ul>
                <li>
                  Çerezleri engelleme: Tüm çerezleri veya belirli türleri
                  engeller
                </li>
                <li>Çerezleri silme: Mevcut çerezleri cihazınızdan kaldırır</li>
                <li>Gizli gezinme: Gizli/özel mod kullanır</li>
                <li>
                  Çerez bildirimleri: Çerezler ayarlandığında bildirim alır
                </li>
              </ul>

              <h3>Çerezleri Devre Dışı Bırakmanın Etkisi</h3>
              <p>
                Belirli çerezleri devre dışı bırakmak deneyiminizi
                etkileyebilir:
              </p>
              <ul>
                <li>
                  Zorunlu çerezler: Giriş yapamayabilir veya temel özellikleri
                  kullanamayabilirsiniz
                </li>
                <li>İşlevsel çerezler: Tercihleriniz hatırlanmayacak</li>
                <li>
                  Analitik çerezler: Hizmetimizi geliştirmemize yardımcı
                  olamayacaksınız
                </li>
                <li>
                  Pazarlama çerezleri: Daha az ilgili reklamlar görebilirsiniz
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Third Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Üçüncü Taraf Çerezleri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Platformumuzda aşağıdaki üçüncü taraf hizmetlerinden çerezler
                kullanılabilir:
              </p>

              <h3>Google Hizmetleri</h3>
              <ul>
                <li>
                  <strong>Google Analytics:</strong> Web sitesi analizi ve
                  kullanıcı davranışı
                </li>
                <li>
                  <strong>Google Ads:</strong> Reklam gösterimi ve performans
                  ölçümü
                </li>
                <li>
                  <strong>Google Fonts:</strong> Web yazı tiplerinin yüklenmesi
                </li>
              </ul>

              <h3>Sosyal Medya</h3>
              <ul>
                <li>
                  <strong>Facebook Pixel:</strong> Sosyal medya reklamları ve
                  analitik
                </li>
                <li>
                  <strong>Twitter:</strong> Tweet gömme ve sosyal paylaşım
                </li>
                <li>
                  <strong>LinkedIn:</strong> Profesyonel ağ entegrasyonu
                </li>
              </ul>

              <h3>Ödeme Sağlayıcıları</h3>
              <ul>
                <li>
                  <strong>Stripe:</strong> Güvenli ödeme işleme
                </li>
                <li>
                  <strong>PayPal:</strong> Alternatif ödeme yöntemi
                </li>
              </ul>

              <p>
                Bu üçüncü taraf çerezleri hakkında daha fazla bilgi için ilgili
                şirketlerin gizlilik politikalarını inceleyebilirsiniz.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Management */}
          <Card>
            <CardHeader>
              <CardTitle>Çerez Yönetimi</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Çerez Tercih Merkezi</h3>
              <p>Hesap ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz:</p>
              <ul>
                <li>
                  Zorunlu çerezler: Her zaman aktif (devre dışı bırakılamaz)
                </li>
                <li>İşlevsel çerezler: Açık/kapalı</li>
                <li>Analitik çerezler: Açık/kapalı</li>
                <li>Pazarlama çerezleri: Açık/kapalı</li>
              </ul>

              <h3>Tarayıcı Ayarları</h3>
              <p>Popüler tarayıcılarda çerez ayarları:</p>
              <ul>
                <li>
                  <strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik →
                  Çerezler
                </li>
                <li>
                  <strong>Firefox:</strong> Ayarlar → Gizlilik ve güvenlik →
                  Çerezler
                </li>
                <li>
                  <strong>Safari:</strong> Tercihler → Gizlilik → Çerezler
                </li>
                <li>
                  <strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri
                </li>
              </ul>

              <h3>Mobil Cihazlar</h3>
              <p>Mobil uygulamalarımızda çerez benzeri teknolojiler:</p>
              <ul>
                <li>Uygulama tercihleri ve ayarları</li>
                <li>Cihaz tanımlayıcıları</li>
                <li>Yerel depolama</li>
                <li>Push bildirim tokenleri</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Çerez Saklama Süreleri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Farklı çerez türleri için farklı saklama süreleri uygulanır:
              </p>

              <h3>Oturum Çerezleri</h3>
              <ul>
                <li>Tarayıcı kapatıldığında otomatik olarak silinir</li>
                <li>Geçici kimlik doğrulama için kullanılır</li>
              </ul>

              <h3>Kalıcı Çerezler</h3>
              <ul>
                <li>
                  <strong>Tercih çerezleri:</strong> 1 yıl
                </li>
                <li>
                  <strong>Analitik çerezleri:</strong> 2 yıl
                </li>
                <li>
                  <strong>Pazarlama çerezleri:</strong> 30-90 gün
                </li>
                <li>
                  <strong>Güvenlik çerezleri:</strong> 6 ay
                </li>
              </ul>

              <h3>Manuel Silme</h3>
              <p>Çerezleri istediğiniz zaman manuel olarak silebilirsiniz:</p>
              <ul>
                <li>Tarayıcı ayarlarından tüm çerezleri temizleme</li>
                <li>Belirli sitelerin çerezlerini silme</li>
                <li>Hesap ayarlarından tercih sıfırlama</li>
              </ul>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card>
            <CardHeader>
              <CardTitle>Yasal Dayanak</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>Çerez kullanımımızın yasal dayanakları:</p>

              <h3>Zorunlu Çerezler</h3>
              <ul>
                <li>Hizmet sağlamak için gerekli</li>
                <li>Güvenlik ve dolandırıcılık önleme</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              </ul>

              <h3>İsteğe Bağlı Çerezler</h3>
              <ul>
                <li>Açık kullanıcı onayı</li>
                <li>Meşru menfaat (analitik için)</li>
                <li>Hizmet iyileştirme amacı</li>
              </ul>

              <h3>KVKK Uyumluluğu</h3>
              <p>
                Çerez uygulamalarımız Türkiye'deki Kişisel Verilerin Korunması
                Kanunu'na (KVKK) uygun olarak yürütülür.
              </p>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Politika Güncellemeleri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Bu Çerez Politikasını zaman zaman güncelleyebiliriz.
                Değişiklikler için size bildirimde bulunacağız:
              </p>
              <ul>
                <li>Web sitesinde güncelleme tarihi</li>
                <li>Önemli değişiklikler için e-posta bildirimi</li>
                <li>Platform içi duyuru</li>
                <li>Çerez banner'ında güncelleme</li>
              </ul>
              <p>
                Güncellemelerden sonra siteyi kullanmaya devam etmeniz, yeni
                politikayı kabul ettiğiniz anlamına gelir.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Bu Çerez Politikası hakkında sorularınız varsa, bizimle
                iletişime geçin:
              </p>
              <ul>
                <li>
                  <strong>E-posta:</strong> cerez@fluenta-ai.com
                </li>
                <li>
                  <strong>Genel İletişim:</strong> destek@fluenta-ai.com
                </li>
                <li>
                  <strong>Adres:</strong> Fluenta Teknoloji A.Ş., İstanbul,
                  Türkiye
                </li>
                <li>
                  <strong>Telefon:</strong> +90 212 XXX XX XX
                </li>
              </ul>
              <p>
                Veri koruma ve gizlilik sorularınız için:
                <a href="mailto:gizlilik@fluenta-ai.com">
                  gizlilik@fluenta-ai.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Çerez Tercihlerinizi Yönetin
              </h2>
              <p className="text-muted-foreground mb-6">
                Çerez ayarlarınızı istediğiniz zaman değiştirebilir ve
                gizliliğinizi kontrol edebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/settings">
                  <Button size="lg">Çerez Ayarları</Button>
                </Link>
                <Link href="/gizlilik-politikasi">
                  <Button variant="outline" size="lg">
                    Gizlilik Politikası
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
