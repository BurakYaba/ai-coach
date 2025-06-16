import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export const metadata: Metadata = {
  title: "Gizlilik Politikası - Fluenta AI İngilizce Öğrenme Platformu",
  description:
    "Fluenta'nın gizliliğinizi nasıl koruduğunu ve kişisel verilerinizi nasıl işlediğini öğrenin. Veri toplama ve kullanımı konusunda şeffaflık için kapsamlı gizlilik politikamızı okuyun.",
  keywords:
    "fluenta gizlilik politikası, veri koruma, kişisel bilgiler, KVKK uyumluluğu, gizlilik hakları, veri güvenliği",
  alternates: {
    canonical: "/tr/gizlilik-politikasi",
    languages: {
      en: "/privacy",
      tr: "/tr/gizlilik-politikasi",
    },
  },
  openGraph: {
    title: "Gizlilik Politikası - Fluenta AI İngilizce Öğrenme Platformu",
    description:
      "Fluenta'nın gizliliğinizi nasıl koruduğunu ve kişisel verilerinizi nasıl işlediğini öğrenin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-privacy-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Gizlilik Politikası",
      },
    ],
  },
};

export default function GizlilikPolitikasiPage() {
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
                href="/tr/moduller"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Modüller
              </Link>
              <Link
                href="/tr/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/tr/hakkimizda"
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
          <Link href="/tr" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Gizlilik Politikası</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-muted-foreground text-lg">
            Son güncelleme: 29 Aralık 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Giriş</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Fluenta ("biz", "bizim" veya "bize") olarak gizliliğinizi
                korumaya ve kişisel bilgilerinizin güvenliğini sağlamaya
                kararlıyız. Bu Gizlilik Politikası, AI destekli İngilizce
                öğrenme platformumuz, web sitemiz, mobil uygulamalarımız ve
                ilgili hizmetlerimizi (toplu olarak "Hizmet") kullandığınızda
                bilgilerinizi nasıl topladığımızı, kullandığımızı,
                açıkladığımızı ve koruduğumuzu açıklar.
              </p>
              <p>
                Hizmetimizi kullanarak, bu Gizlilik Politikası uyarınca
                bilgilerin toplanması ve kullanılmasını kabul etmiş olursunuz.
                Politikalarımız ve uygulamalarımızla aynı fikirde değilseniz,
                Hizmetimizi kullanmama seçeneğiniz vardır.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>Topladığımız Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Kişisel Bilgiler</h3>
              <p>
                Aşağıdaki durumlarda bize gönüllü olarak sağladığınız kişisel
                bilgileri topluyoruz:
              </p>
              <ul>
                <li>Hesap kaydı yaptığınızda</li>
                <li>Öğrenme modüllerimizi kullandığınızda</li>
                <li>Destek ekibimizle iletişime geçtiğinizde</li>
                <li>Bültenimize abone olduğunuzda</li>
                <li>
                  Anketlere katıldığınızda veya geri bildirim verdiğinizde
                </li>
              </ul>

              <p>Bu bilgiler şunları içerebilir:</p>
              <ul>
                <li>Ad ve e-posta adresi</li>
                <li>Profil fotoğrafı ve biyografi (isteğe bağlı)</li>
                <li>Öğrenme hedefleri ve tercihleri</li>
                <li>Ödeme ve fatura bilgileri</li>
                <li>Destek ile iletişim kayıtları</li>
              </ul>

              <h3>Öğrenme Verileri</h3>
              <p>
                Kişiselleştirilmiş öğrenme deneyimleri sağlamak için şunları
                topluyoruz:
              </p>
              <ul>
                <li>Telaffuz analizi için konuşma ses kayıtlarınız</li>
                <li>Gramer ve stil geri bildirimi için yazma örnekleri</li>
                <li>Öğrenme ilerlemesi ve performans metrikleri</li>
                <li>Farklı aktivitelerde geçirilen süre</li>
                <li>Quiz ve egzersiz yanıtları</li>
                <li>Zorluk yaşanan ve gelişim gösterilen alanlar</li>
              </ul>

              <h3>Teknik Bilgiler</h3>
              <p>Aşağıdaki teknik bilgileri otomatik olarak topluyoruz:</p>
              <ul>
                <li>Cihaz bilgileri (tür, işletim sistemi, tarayıcı)</li>
                <li>IP adresi ve genel konum</li>
                <li>Kullanım kalıpları ve özellik etkileşimleri</li>
                <li>Hata günlükleri ve performans verileri</li>
                <li>Çerezler ve benzer takip teknolojileri</li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bilgilerinizi Nasıl Kullanıyoruz</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>Topladığımız bilgileri aşağıdaki amaçlar için kullanıyoruz:</p>

              <h3>Hizmet Sağlama</h3>
              <ul>
                <li>Öğrenme platformumuzu sağlamak ve sürdürmek</li>
                <li>Öğrenme deneyiminizi kişiselleştirmek</li>
                <li>AI destekli geri bildirim ve öneriler oluşturmak</li>
                <li>İlerlemenizi ve başarılarınızı takip etmek</li>
                <li>Ödemeleri işlemek ve abonelikleri yönetmek</li>
              </ul>

              <h3>İletişim</h3>
              <ul>
                <li>Hizmetle ilgili bildirimler göndermek</li>
                <li>Sorularınıza ve destek taleplerinize yanıt vermek</li>
                <li>Pazarlama iletişimleri göndermek (izninizle)</li>
                <li>
                  Güncellemeler ve yeni özellikler hakkında bilgilendirmek
                </li>
              </ul>

              <h3>İyileştirme ve Analitik</h3>
              <ul>
                <li>
                  Hizmetimizi geliştirmek için kullanım kalıplarını analiz etmek
                </li>
                <li>Araştırma ve geliştirme yapmak</li>
                <li>Güvenliği sağlamak ve dolandırıcılığı önlemek</li>
                <li>Yasal yükümlülüklere uymak</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Bilgilerinizi Nasıl Paylaşıyoruz</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü
                taraflarla satmaz, kiralamaz veya paylaşmayız:
              </p>

              <h3>Hizmet Sağlayıcıları</h3>
              <ul>
                <li>Ödeme işleme hizmetleri</li>
                <li>Bulut depolama ve hosting sağlayıcıları</li>
                <li>Analitik ve performans izleme araçları</li>
                <li>Müşteri destek platformları</li>
                <li>E-posta ve iletişim hizmetleri</li>
              </ul>

              <h3>Yasal Gereklilikler</h3>
              <p>Bilgilerinizi şu durumlarda açıklayabiliriz:</p>
              <ul>
                <li>Yasal bir süreç gereği</li>
                <li>Haklarımızı korumak için</li>
                <li>Güvenlik tehditlerine karşı</li>
                <li>Kamu güvenliği için</li>
              </ul>

              <h3>İş Transferi</h3>
              <p>
                Şirket birleşmesi, satın alma veya varlık satışı durumunda,
                kişisel bilgileriniz transfer edilebilir.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>Veri Güvenliği</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Kişisel bilgilerinizin güvenliğini sağlamak için çeşitli
                güvenlik önlemleri uyguluyoruz:
              </p>
              <ul>
                <li>SSL/TLS şifreleme ile veri aktarımı</li>
                <li>Güvenli veri depolama ve yedekleme</li>
                <li>Düzenli güvenlik denetimleri</li>
                <li>Erişim kontrolü ve kimlik doğrulama</li>
                <li>Çalışan güvenlik eğitimleri</li>
              </ul>
              <p>
                Ancak, internet üzerinden hiçbir veri aktarımının %100 güvenli
                olmadığını unutmayın.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Haklarınız</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                KVKK ve diğer veri koruma yasaları kapsamında aşağıdaki haklara
                sahipsiniz:
              </p>
              <ul>
                <li>
                  <strong>Erişim Hakkı:</strong> Hangi kişisel verilerinizi
                  işlediğimizi öğrenme
                </li>
                <li>
                  <strong>Düzeltme Hakkı:</strong> Yanlış veya eksik bilgileri
                  düzeltme
                </li>
                <li>
                  <strong>Silme Hakkı:</strong> Belirli koşullarda verilerinizin
                  silinmesini isteme
                </li>
                <li>
                  <strong>İşlemeyi Sınırlama:</strong> Veri işlemenin
                  sınırlanmasını isteme
                </li>
                <li>
                  <strong>Taşınabilirlik:</strong> Verilerinizi başka bir
                  hizmete aktarma
                </li>
                <li>
                  <strong>İtiraz Etme:</strong> Belirli veri işleme
                  faaliyetlerine itiraz etme
                </li>
              </ul>
              <p>
                Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz:
                <a href="mailto:gizlilik@fluenta-ai.com">
                  gizlilik@fluenta-ai.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Veri Saklama</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Kişisel verilerinizi yalnızca gerekli olduğu sürece saklarız:
              </p>
              <ul>
                <li>
                  <strong>Hesap Verileri:</strong> Hesabınız aktif olduğu sürece
                </li>
                <li>
                  <strong>Öğrenme Verileri:</strong> Hizmet sağlamak için
                  gerekli süre
                </li>
                <li>
                  <strong>İletişim Kayıtları:</strong> 3 yıl
                </li>
                <li>
                  <strong>Ödeme Bilgileri:</strong> Yasal gereklilikler
                  doğrultusunda
                </li>
                <li>
                  <strong>Teknik Loglar:</strong> 12 ay
                </li>
              </ul>
              <p>
                Hesabınızı sildiğinizde, kişisel verileriniz yasal yükümlülükler
                dışında silinir.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>Uluslararası Veri Transferleri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Verileriniz Türkiye dışındaki sunucularda işlenebilir. Bu
                durumda:
              </p>
              <ul>
                <li>Uygun güvenlik önlemleri alınır</li>
                <li>Veri koruma standartları korunur</li>
                <li>Yasal gereklilikler yerine getirilir</li>
                <li>Şeffaflık sağlanır</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Çocukların Gizliliği</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Hizmetimiz 13 yaş altındaki çocuklara yönelik değildir. 13 yaş
                altındaki çocuklardan bilerek kişisel bilgi toplamayız. Eğer 13
                yaş altında bir çocuğun bilgilerini topladığımızı fark edersek,
                bu bilgileri derhal sileriz.
              </p>
              <p>13-18 yaş arası kullanıcılar için ebeveyn izni gereklidir.</p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Politika Değişiklikleri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli
                değişiklikler için size bildirimde bulunacağız:
              </p>
              <ul>
                <li>E-posta ile bildirim</li>
                <li>Platform içi duyuru</li>
                <li>Web sitesinde güncelleme tarihi</li>
              </ul>
              <p>
                Değişiklikler yayınlandıktan sonra Hizmeti kullanmaya devam
                etmeniz, yeni politikayı kabul ettiğiniz anlamına gelir.
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
                Bu Gizlilik Politikası hakkında sorularınız varsa, bizimle
                iletişime geçin:
              </p>
              <ul>
                <li>
                  <strong>E-posta:</strong> gizlilik@fluenta-ai.com
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
                Veri koruma sorularınız için özel olarak oluşturulmuş e-posta
                adresimizi kullanabilirsiniz:
                <a href="mailto:verikoruma@fluenta-ai.com">
                  verikoruma@fluenta-ai.com
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
                Gizliliğiniz Bizim İçin Önemli
              </h2>
              <p className="text-muted-foreground mb-6">
                Sorularınız varsa veya haklarınızı kullanmak istiyorsanız,
                bizimle iletişime geçmekten çekinmeyin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tr/iletisim">
                  <Button size="lg">İletişime Geçin</Button>
                </Link>
                <Link href="/tr">
                  <Button variant="outline" size="lg">
                    Ana Sayfaya Dön
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
