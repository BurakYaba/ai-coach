import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "Kullanım Koşulları - Fluenta AI İngilizce Öğrenme Platformu",
  description:
    "Fluenta'nın AI destekli İngilizce öğrenme platformunu kullanırken haklarınızı ve yükümlülüklerinizi anlamak için Kullanım Koşullarımızı okuyun.",
  keywords:
    "fluenta kullanım koşulları, kullanıcı sözleşmesi, şartlar ve koşullar, yasal şartlar, hizmet sözleşmesi",
  alternates: {
    canonical: "/kullanim-kosullari",
    languages: {
      en: "/en/terms",
      tr: "/kullanim-kosullari",
    },
  },
  openGraph: {
    title: "Kullanım Koşulları - Fluenta AI İngilizce Öğrenme Platformu",
    description:
      "Fluenta'nın AI destekli İngilizce öğrenme platformunu kullanırken haklarınızı ve yükümlülüklerinizi anlamak için Kullanım Koşullarımızı okuyun.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-terms-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Kullanım Koşulları",
      },
    ],
  },
};

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/kullanim-kosullari" language="tr" />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Kullanım Koşulları</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kullanım Koşulları</h1>
          <p className="text-muted-foreground text-lg">
            Son güncelleme: 29 Aralık 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Giriş ve Kabul</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Fluenta'ya hoş geldiniz. Bu Kullanım Koşulları ("Koşullar"),
                Fluenta Teknoloji A.Ş. ("Fluenta", "biz", "bizim" veya "bize")
                tarafından işletilen Fluenta AI destekli İngilizce öğrenme
                platformu, web sitemiz, mobil uygulamalarımız ve ilgili
                hizmetlerimizin (toplu olarak "Hizmet") kullanımınızı yönetir.
              </p>
              <p>
                Hizmetimize erişerek veya kullanarak, bu Koşullara bağlı olmayı
                kabul etmiş olursunuz. Bu Koşulların herhangi bir bölümüyle aynı
                fikirde değilseniz, Hizmete erişemezsiniz. Bu Koşullar, Hizmete
                erişen veya kullanan tüm ziyaretçiler, kullanıcılar ve diğer
                kişiler için geçerlidir.
              </p>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card>
            <CardHeader>
              <CardTitle>Hesap Kaydı ve Güvenlik</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Hesap Oluşturma</h3>
              <p>
                Hizmetimizin belirli özelliklerine erişmek için doğru ve
                eksiksiz bilgiler sağlayarak bir hesap kaydetmeniz gerekir.
                Şunları kabul etmiş olursunuz:
              </p>
              <ul>
                <li>Doğru, kesin, güncel ve eksiksiz bilgi sağlamak</li>
                <li>Hesap bilgilerinizi sürdürmek ve derhal güncellemek</li>
                <li>Hesabınız altındaki tüm faaliyetlerden sorumlu olmak</li>
                <li>Şifrenizi güvenli ve gizli tutmak</li>
                <li>Yetkisiz kullanımı derhal bize bildirmek</li>
              </ul>

              <h3>Yaş Gereksinimleri</h3>
              <p>
                Hizmetimizi kullanmak için en az 13 yaşında olmanız gerekir.
                13-18 yaş arasındaysanız, ebeveyn izniniz olmalıdır. 13 yaş
                altındaki kullanıcıların Hizmeti kullanmasına izin verilmez.
              </p>

              <h3>Hesap Sonlandırma</h3>
              <p>
                Bu Koşulları ihlal ettiğine veya diğer kullanıcılara, bize veya
                üçüncü taraflara zarar verdiğine inandığımız davranışlar için
                hesabınızı istediğimiz zaman, bildirimli veya bildirimsiz olarak
                sonlandırma veya askıya alma hakkını saklı tutarız.
              </p>
            </CardContent>
          </Card>

          {/* Use of Service */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmetin Kabul Edilebilir Kullanımı</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>İzin Verilen Kullanım</h3>
              <p>
                Hizmetimizi bu Koşullara uygun olarak kişisel, eğitim amaçları
                için kullanabilirsiniz. AI destekli öğrenme araçlarımız,
                İngilizce dil becerilerinizi geliştirmenize yardımcı olmak için
                tasarlanmıştır.
              </p>

              <h3>Yasaklı Faaliyetler</h3>
              <p>
                Aşağıdaki yasaklı faaliyetlerde bulunmamayı kabul etmiş
                olursunuz:
              </p>
              <ul>
                <li>Hizmeti yasadışı veya yetkisiz amaçlar için kullanmak</li>
                <li>Yargı yetkinizdeki yasaları ihlal etmek</li>
                <li>Zararlı, tehdit edici veya saldırgan içerik iletmek</li>
                <li>Hizmetin yetkisiz alanlarına erişmeye çalışmak</li>
                <li>
                  Tersine mühendislik yapmak veya kaynak kodu çıkarmaya çalışmak
                </li>
                <li>Hizmete erişmek için otomatik sistemler kullanmak</li>
                <li>Hesap kimlik bilgilerinizi başkalarıyla paylaşmak</li>
                <li>Güvenlik önlemlerini atlatmak</li>
                <li>Virüs veya kötü amaçlı kod yüklemek</li>
                <li>
                  Diğer kullanıcıları taciz etmek, kötüye kullanmak veya zarar
                  vermek
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Subscription and Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Abonelik ve Ödeme Koşulları</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Abonelik Planları</h3>
              <p>
                Fluenta, farklı özellikler ve fiyatlandırma ile çeşitli abonelik
                planları sunar. Abone olarak, geçerli ücretleri ve vergileri
                ödemeyi kabul etmiş olursunuz. Fiyatlar bildirimle
                değiştirilebilir.
              </p>

              <h3>Ödeme ve Faturalandırma</h3>
              <ul>
                <li>Abonelik ücretleri peşin olarak faturalandırılır</li>
                <li>Ödeme her faturalandırma döneminin başında yapılır</li>
                <li>
                  Başlıca kredi kartları ve diğer ödeme yöntemlerini kabul
                  ederiz
                </li>
                <li>
                  Ödeme yönteminizi otomatik olarak ücretlendirmemize izin
                  verirsiniz
                </li>
                <li>
                  Başarısız ödemeler hizmet askıya alınmasına neden olabilir
                </li>
              </ul>

              <h3>İptal ve İadeler</h3>
              <p>
                Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal, bir
                sonraki faturalandırma döneminin başında etkili olur. İade
                politikamız için ayrı İade Politikası sayfamızı inceleyin.
              </p>

              <h3>Ücretsiz Deneme</h3>
              <p>
                Ücretsiz deneme süresi boyunca tüm premium özelliklere
                erişebilirsiniz. Deneme süresi sona ermeden iptal etmezseniz,
                otomatik olarak ücretli aboneliğe geçersiniz.
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Fikri Mülkiyet Hakları</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Fluenta'nın Hakları</h3>
              <p>
                Hizmet ve orijinal içeriği, özellikleri ve işlevselliği
                Fluenta'ya aittir ve telif hakkı, ticari marka, patent ve diğer
                fikri mülkiyet yasalarıyla korunur.
              </p>

              <h3>Kullanıcı İçeriği</h3>
              <p>
                Hizmete yüklediğiniz veya gönderdiğiniz içeriğin (ses kayıtları,
                yazılar, geri bildirimler) sahibi sizsiniz. Ancak, bize bu
                içeriği Hizmeti sağlamak için kullanma lisansı verirsiniz.
              </p>

              <h3>Lisans Verilen Haklar</h3>
              <p>
                Size Hizmeti kullanmak için sınırlı, münhasır olmayan,
                devredilemez bir lisans veriyoruz. Bu lisans, bu Koşullara
                uymanız koşuluyla geçerlidir.
              </p>
            </CardContent>
          </Card>

          {/* AI and Learning Data */}
          <Card>
            <CardHeader>
              <CardTitle>AI ve Öğrenme Verileri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>AI Destekli Özellikler</h3>
              <p>
                Hizmetimiz, öğrenme deneyiminizi kişiselleştirmek için yapay
                zeka teknolojisi kullanır. AI sistemlerimiz:
              </p>
              <ul>
                <li>Konuşma ve telaffuzunuzu analiz eder</li>
                <li>Yazma becerilerinizi değerlendirir</li>
                <li>Kişiselleştirilmiş öğrenme yolları önerir</li>
                <li>İlerlemenizi takip eder ve raporlar</li>
              </ul>

              <h3>Veri Kullanımı</h3>
              <p>
                Öğrenme verileriniz, AI modellerimizi geliştirmek ve hizmet
                kalitesini artırmak için kullanılabilir. Tüm veriler
                anonimleştirilir ve gizlilik politikamıza uygun olarak işlenir.
              </p>

              <h3>Doğruluk Garantisi</h3>
              <p>
                AI destekli geri bildirimlerimiz yardımcı olmak için
                tasarlanmıştır, ancak %100 doğruluk garantisi vermez. Önemli
                kararlar için profesyonel değerlendirme almanızı öneririz.
              </p>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle>Gizlilik ve Veri Koruma</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Gizliliğiniz bizim için önemlidir. Kişisel verilerinizin nasıl
                toplandığını, kullanıldığını ve korunduğunu anlamak için
                <Link
                  href="/gizlilik-politikasi"
                  className="text-primary hover:underline"
                >
                  Gizlilik Politikamızı
                </Link>{" "}
                inceleyin.
              </p>
              <p>
                Hizmeti kullanarak, Gizlilik Politikamızda açıklanan veri işleme
                uygulamalarımızı kabul etmiş olursunuz.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>Sorumluluk Reddi</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Hizmet Garantisi</h3>
              <p>
                Hizmet "olduğu gibi" ve "mevcut olduğu şekliyle" sağlanır.
                Hizmetin kesintisiz, güvenli veya hatasız olacağına dair garanti
                vermiyoruz.
              </p>

              <h3>Eğitim Sonuçları</h3>
              <p>
                Bireysel öğrenme sonuçları değişiklik gösterebilir. Belirli
                öğrenme hedeflerine ulaşacağınızı veya belirli bir sürede
                ilerleme kaydedeceğinizi garanti etmiyoruz.
              </p>

              <h3>Üçüncü Taraf İçeriği</h3>
              <p>
                Hizmetimiz üçüncü taraf içeriği veya bağlantıları içerebilir. Bu
                içeriklerin doğruluğu, yararlılığı veya güvenliği için
                sorumluluk kabul etmiyoruz.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Sorumluluk Sınırlaması</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Yasaların izin verdiği ölçüde, Fluenta ve bağlı kuruluşları,
                yöneticileri, çalışanları ve temsilcileri aşağıdakiler için
                sorumlu tutulamaz:
              </p>
              <ul>
                <li>Dolaylı, arızi veya sonuçsal zararlar</li>
                <li>Kar, gelir veya veri kaybı</li>
                <li>Hizmet kesintileri veya gecikmeler</li>
                <li>
                  Üçüncü taraf eylem veya ihmallerinden kaynaklanan zararlar
                </li>
              </ul>
              <p>
                Toplam sorumluluğumuz, son 12 ayda ödediğiniz ücretleri
                aşmayacaktır.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Sonlandırma</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Kullanıcı Tarafından Sonlandırma</h3>
              <p>
                Hesabınızı istediğiniz zaman kapatabilir ve Hizmeti kullanmayı
                durdurabilirsiniz. Hesap kapatma işlemi için müşteri
                desteğimizle iletişime geçin.
              </p>

              <h3>Fluenta Tarafından Sonlandırma</h3>
              <p>Aşağıdaki durumlarda hesabınızı sonlandırabiliriz:</p>
              <ul>
                <li>Bu Koşulların ihlali</li>
                <li>Yasadışı faaliyetler</li>
                <li>Diğer kullanıcılara zarar verme</li>
                <li>Ödeme yükümlülüklerinin yerine getirilmemesi</li>
              </ul>

              <h3>Sonlandırma Sonrası</h3>
              <p>Hesap sonlandırıldıktan sonra:</p>
              <ul>
                <li>Hizmete erişiminiz derhal sona erer</li>
                <li>Verileriniz gizlilik politikamıza uygun olarak işlenir</li>
                <li>Ödenmemiş ücretler tahsil edilebilir</li>
                <li>Bu Koşulların ilgili bölümleri yürürlükte kalır</li>
              </ul>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Geçerli Hukuk ve Uyuşmazlık Çözümü</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Geçerli Hukuk</h3>
              <p>
                Bu Koşullar Türkiye Cumhuriyeti yasalarına tabidir ve bu
                yasalara uygun olarak yorumlanır.
              </p>

              <h3>Uyuşmazlık Çözümü</h3>
              <p>
                Bu Koşullardan kaynaklanan uyuşmazlıklar öncelikle dostane
                yollarla çözülmeye çalışılır. Çözülemezse, İstanbul mahkemeleri
                yetkilidir.
              </p>

              <h3>Tahkim</h3>
              <p>
                Taraflar, belirli uyuşmazlıkları bağlayıcı tahkim yoluyla
                çözmeyi kabul edebilir. Tahkim kuralları ayrıca belirlenecektir.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Koşullarda Değişiklikler</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Bu Koşulları zaman zaman güncelleyebiliriz. Önemli değişiklikler
                için size bildirimde bulunacağız:
              </p>
              <ul>
                <li>E-posta ile bildirim</li>
                <li>Platform içi duyuru</li>
                <li>Web sitesinde güncelleme tarihi</li>
              </ul>
              <p>
                Değişiklikler yayınlandıktan sonra Hizmeti kullanmaya devam
                etmeniz, yeni Koşulları kabul ettiğiniz anlamına gelir.
                Değişiklikleri kabul etmiyorsanız, Hizmeti kullanmayı
                durdurmalısınız.
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
                Bu Kullanım Koşulları hakkında sorularınız varsa, bizimle
                iletişime geçin:
              </p>
              <ul>
                <li>
                  <strong>E-posta:</strong> hukuk@fluenta-ai.com
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
                Yasal sorularınız için:
                <a href="mailto:yasal@fluenta-ai.com">yasal@fluenta-ai.com</a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Koşulları Anladınız mı?
              </h2>
              <p className="text-muted-foreground mb-6">
                Sorularınız varsa veya açıklama istiyorsanız, destek ekibimizle
                iletişime geçmekten çekinmeyin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/iletisim">
                  <Button size="lg">Destek Ekibiyle İletişim</Button>
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
