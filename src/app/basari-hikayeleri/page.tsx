import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "Öğrenci Başarı Hikayeleri ve Yorumlar - Fluenta AI İngilizce Öğrenme",
  description:
    "İngilizce konuşma, telaffuz ve özgüvenlerini geliştiren Fluenta öğrencilerinin ilham verici başarı hikayelerini okuyun. AI destekli İngilizce öğrenme platformumuzdan gerçek sonuçları keşfedin.",
  keywords:
    "İngilizce öğrenme başarı hikayeleri, Fluenta yorumları, AI İngilizce öğretmeni sonuçları, telaffuz geliştirme hikayeleri, İngilizce konuşma özgüveni, dil öğrenme dönüşümü",
  alternates: {
    canonical: "/basari-hikayeleri",
    languages: {
      en: "/en/testimonials",
      tr: "/basari-hikayeleri",
    },
  },
  openGraph: {
    title:
      "Öğrenci Başarı Hikayeleri ve Yorumlar - Fluenta AI İngilizce Öğrenme",
    description:
      "Dünya çapındaki öğrencilerin Fluenta'nın AI destekli öğrenme platformu ile İngilizce becerilerini nasıl dönüştürdüklerini keşfedin. Gerçek hikayeler, gerçek sonuçlar.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-testimonials-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Öğrenci Başarı Hikayeleri",
      },
    ],
  },
};

export default function BasariHikayeleri() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/basari-hikayeleri" language="tr" />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Başarı Hikayeleri</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🌟 Başarı Hikayeleri</Badge>
            <Badge variant="outline">Gerçek Sonuçlar</Badge>
            <Badge variant="outline">Öğrenci Yorumları</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bu Öğrenciler Gibi İngilizce'nizi Dönüştürün
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Dünya çapındaki öğrencilerin Fluenta'nın AI destekli öğrenme
            platformu ile İngilizce konuşma, telaffuz ve özgüvenlerini nasıl
            geliştirdiklerini keşfedin.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="mb-16">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Rakamlarla Başarı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    50.000+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Dünya Çapında Öğrenci
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    %87
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Konuşma Özgüveni Artışı
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    %92
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Daha İyi Telaffuz Puanları
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    3 Ay
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ortalama Seviye Atlama Süresi
                  </div>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* Featured Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Öne Çıkan Başarı Hikayeleri
          </h2>

          <div className="space-y-12">
            {/* Maria's Story */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <GradientCard>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-lg italic mb-6">
                      "İş görüşmelerinden korkmaktan, Google'da hayallerimin
                      işine güvenle başvurmaya kadar geldim. Fluenta'nın AI
                      mülakat pratiği oyunun kurallarını değiştirdi!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-xl">MR</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Maria Rodriguez</div>
                        <div className="text-muted-foreground/80">
                          Google'da Yazılım Mühendisi
                        </div>
                        <div className="text-sm text-muted-foreground/60">
                          Madrid, İspanya
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </GradientCard>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Maria'nın Yolculuğu: 4 Ayda B1'den C1'e
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Zorluk:</strong> Güçlü teknik becerilere sahip
                        yazılım mühendisi ama profesyonel ortamlarda İngilizce
                        iletişimde zorlanıyordu.
                      </div>
                      <div>
                        <strong>Çözüm:</strong> Fluenta'nın AI konuşma partneri
                        ile günlük pratik, iş İngilizcesi modülü ve mülakat
                        simülasyonları.
                      </div>
                      <div>
                        <strong>Sonuç:</strong> 4 ayda B1'den C1 seviyesine
                        çıktı ve Google'da yazılım mühendisi pozisyonunu aldı.
                      </div>
                      <div className="pt-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          İlerleme:
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          B1 → C1 (85% gelişim)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Ahmed's Story */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Ahmed'in Hikayesi: IELTS 6.0'dan 8.5'e
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Hedef:</strong> Kanada'da tıp uzmanlığı için
                        IELTS 8.0+ puanına ihtiyacı vardı.
                      </div>
                      <div>
                        <strong>Başlangıç:</strong> IELTS 6.0 puanı ile
                        özellikle konuşma ve dinleme bölümlerinde zorlanıyordu.
                      </div>
                      <div>
                        <strong>Strateji:</strong> Fluenta'nın IELTS hazırlık
                        modülü, günlük konuşma pratiği ve telaffuz antrenörü.
                      </div>
                      <div>
                        <strong>Başarı:</strong> 6 ayda IELTS 8.5 puanı aldı ve
                        Kanada'da tıp uzmanlığına kabul edildi.
                      </div>
                      <div className="pt-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          IELTS Puanları:
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Konuşma:</span>
                            <span>5.5 → 8.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dinleme:</span>
                            <span>6.0 → 8.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Okuma:</span>
                            <span>6.5 → 8.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Yazma:</span>
                            <span>6.0 → 8.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="order-1 md:order-2">
                <GradientCard>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-lg italic mb-6">
                      "Fluenta sayesinde sadece IELTS puanımı yükseltmekle
                      kalmadım, gerçek özgüvenle İngilizce konuşabilir hale
                      geldim. Şimdi Kanada'da doktor olarak çalışıyorum!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-xl">AH</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">
                          Dr. Ahmed Hassan
                        </div>
                        <div className="text-muted-foreground/80">
                          Tıp Uzmanı
                        </div>
                        <div className="text-sm text-muted-foreground/60">
                          Toronto, Kanada
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </GradientCard>
              </div>
            </div>

            {/* Yuki's Story */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <GradientCard>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-lg italic mb-6">
                      "Japon aksanımdan dolayı anlaşılmıyordum. Fluenta'nın
                      telaffuz antrenörü sayesinde şimdi Amerikan şirketlerde
                      sunum yapabiliyorum!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-xl">YT</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Yuki Tanaka</div>
                        <div className="text-muted-foreground/80">
                          Pazarlama Müdürü
                        </div>
                        <div className="text-sm text-muted-foreground/60">
                          Tokyo, Japonya
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </GradientCard>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Yuki'nin Dönüşümü: Telaffuz Ustası</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Problem:</strong> Güçlü İngilizce bilgisine
                        rağmen Japon aksanı nedeniyle uluslararası toplantılarda
                        anlaşılamıyordu.
                      </div>
                      <div>
                        <strong>Çözüm:</strong> Fluenta'nın AI telaffuz
                        antrenörü ile günlük 20 dakika pratik, özel aksan
                        azaltma egzersizleri.
                      </div>
                      <div>
                        <strong>Gelişim:</strong> 3 ayda telaffuz netliği %78
                        arttı, şimdi global pazarlama sunumları yapıyor.
                      </div>
                      <div className="pt-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          Telaffuz Gelişimi:
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Netlik:</span>
                            <span>45% → 89%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Akıcılık:</span>
                            <span>60% → 85%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vurgu:</span>
                            <span>40% → 82%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* More Testimonials Grid */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Daha Fazla Başarı Hikayesi
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick testimonials */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-sm italic mb-4">
                  "3 ayda A2'den B2'ye çıktım. Fluenta'nın kişiselleştirilmiş
                  yaklaşımı harika!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold">Elena Popov</div>
                  <div className="text-muted-foreground">
                    Öğrenci, Bulgaristan
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-sm italic mb-4">
                  "İş görüşmelerinde artık kendime güveniyorum. AI koçum gerçek
                  bir öğretmen gibi!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold">Carlos Silva</div>
                  <div className="text-muted-foreground">
                    Mühendis, Brezilya
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-sm italic mb-4">
                  "TOEFL puanım 85'ten 110'a çıktı. Amerika'da üniversiteye
                  kabul edildim!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold">Li Wei</div>
                  <div className="text-muted-foreground">Öğrenci, Çin</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-sm italic mb-4">
                  "Telaffuzum çok gelişti. Artık müşterilerle rahatça
                  konuşabiliyorum."
                </p>
                <div className="text-sm">
                  <div className="font-semibold">Priya Sharma</div>
                  <div className="text-muted-foreground">
                    Satış Temsilcisi, Hindistan
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-sm italic mb-4">
                  "Yazma becerilerim inanılmaz gelişti. Şimdi İngilizce raporlar
                  yazabiliyorum."
                </p>
                <div className="text-sm">
                  <div className="font-semibold">Hans Mueller</div>
                  <div className="text-muted-foreground">Analist, Almanya</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-sm italic mb-4">
                  "6 ayda İngilizce öğretmeni oldum. Fluenta'ya çok
                  teşekkürler!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold">Anna Kowalski</div>
                  <div className="text-muted-foreground">Öğretmen, Polonya</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <GradientCard>
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Sıradaki Başarı Hikayesi Sizin Olsun
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Binlerce öğrencimiz gibi siz de Fluenta ile İngilizce'de
                ustalaşabilirsiniz. Hemen başlayın ve kendi başarı hikayenizi
                yazın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Ücretsiz Denemeyi Başlat
                  </Button>
                </Link>
                <Link href="/tr/sss">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3"
                  >
                    Sık Sorulan Sorular
                  </Button>
                </Link>
              </div>
            </CardContent>
          </GradientCard>
        </section>
      </main>
    </div>
  );
}
