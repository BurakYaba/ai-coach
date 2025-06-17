import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Fiyatlandırma - AI Destekli İngilizce Öğrenme Planları | Fluenta",
  description:
    "Fluenta'nın AI destekli İngilizce öğrenme platformu için en uygun fiyatlandırma planını seçin. Ücretsiz deneme, aylık ve yıllık paketler ile İngilizce öğrenme yolculuğunuza başlayın.",
  keywords:
    "Fluenta fiyat, İngilizce öğrenme ücreti, AI İngilizce öğretmeni fiyat, İngilizce kursu fiyatları, online İngilizce ders ücreti, İngilizce öğrenme abonelik",
  alternates: {
    canonical: "/fiyatlandirma",
    languages: {
      en: "/en/pricing",
      tr: "/fiyatlandirma",
    },
  },
  openGraph: {
    title: "Fiyatlandırma - AI Destekli İngilizce Öğrenme Planları | Fluenta",
    description:
      "Fluenta'nın AI destekli İngilizce öğrenme platformu için en uygun fiyatlandırma planını seçin. Ücretsiz deneme, aylık ve yıllık paketler mevcut.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-pricing-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Fiyatlandırma Planları",
      },
    ],
  },
};

export default function TurkishPricingPage() {
  const pricingPlans = [
    {
      name: "Ücretsiz",
      price: "$0",
      period: "/ay",
      description: "Temel özelliklerle başlayın",
      features: [
        "Günlük 30 dakika pratik",
        "Temel gramer dersleri",
        "Sınırlı kelime hazinesi",
        "Temel telaffuz kontrolü",
        "Mobil uygulama erişimi",
      ],
      limitations: ["Sınırlı içerik", "Temel raporlar", "E-mail desteği"],
      buttonText: "Ücretsiz Başla",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Premium",
      price: "$14.99",
      originalPrice: "$19.99",
      period: "/ay",
      description: "Tam özelliklerle hızlı öğrenme",
      features: [
        "Sınırsız pratik süresi",
        "Tüm öğrenme modülleri",
        "AI destekli kişisel koç",
        "Detaylı performans analizi",
        "Offline içerik erişimi",
        "Öncelikli destek",
        "İlerleme sertifikaları",
      ],
      buttonText: "Premium'u Dene",
      buttonVariant: "default" as const,
      popular: true,
      savings: "$5 tasarruf",
    },
    {
      name: "Pro",
      price: "$24.99",
      originalPrice: "$34.99",
      period: "/ay",
      description: "Profesyonel seviye için tam paket",
      features: [
        "Premium'daki tüm özellikler",
        "1:1 AI koçluk seansları",
        "IELTS/TOEFL hazırlık modülü",
        "Canlı grup dersleri",
        "Kişisel öğrenme planı",
        "Uzman desteği",
        "Sınırsız sertifika",
        "Öncelikli yeni özellikler",
      ],
      buttonText: "Pro'yu Dene",
      buttonVariant: "outline" as const,
      popular: false,
      savings: "$10 tasarruf",
    },
  ];

  const faqs = [
    {
      question: "Ücretsiz deneme süresi ne kadar?",
      answer:
        "7 gün boyunca Premium planın tüm özelliklerini ücretsiz kullanabilirsiniz. Kredi kartı bilgisi gerektirmez.",
    },
    {
      question: "İstediğim zaman iptal edebilir miyim?",
      answer:
        "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar erişiminiz devam eder.",
    },
    {
      question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
      answer:
        "Kredi kartı, banka kartı, Paypal ve Apple Pay ile ödeme yapabilirsiniz. Tüm ödemeler güvenli şekilde işlenir.",
    },
    {
      question: "Yıllık abonelikte indirim var mı?",
      answer:
        "Evet! Yıllık abonelikte %40'a varan indirim kazanırsınız. Ayrıca ilk ay ücretsizdir.",
    },
    {
      question: "Birden fazla cihazdan kullanabilir miyim?",
      answer:
        "Evet, Premium ve Pro planlarında aynı hesapla bilgisayar, tablet ve telefon gibi tüm cihazlarınızdan erişebilirsiniz.",
    },
    {
      question: "İade politikanız nedir?",
      answer:
        "İlk 30 gün içerisinde memnun kalmazsanız, koşulsuz para iadesi garantisi sunuyoruz.",
    },
  ];

  const features = [
    {
      title: "🎯 Kişiselleştirilmiş Öğrenme",
      description: "AI seviyenizi analiz eder ve size özel plan oluşturur",
    },
    {
      title: "🗣️ Gerçek Zamanlı Telaffuz Analizi",
      description: "Konuşurken anında düzeltme ve geri bildirim alın",
    },
    {
      title: "📚 6 Farklı Öğrenme Modülü",
      description: "Konuşma, dinleme, okuma, yazma, gramer ve kelime",
    },
    {
      title: "📱 Mobil + Web Uygulama",
      description: "İstediğiniz yerden, istediğiniz cihazla öğrenin",
    },
    {
      title: "📊 Detaylı İlerleme Takibi",
      description: "Gelişiminizi grafikler ve raporlarla takip edin",
    },
    {
      title: "🎓 Sertifika Programları",
      description: "Tamamladığınız seviyeler için sertifika alın",
    },
  ];

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
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Ana Sayfa
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
              <Link
                href="/fiyatlandirma"
                className="text-sm font-medium text-primary"
              >
                Fiyatlandırma
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                EN
              </Link>
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
          <span>Fiyatlandırma</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">💰 Fiyatlandırma</Badge>
            <Badge variant="outline">7 Gün Ücretsiz</Badge>
            <Badge variant="outline">Para İade Garantisi</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI destekli İngilizce öğrenme platformumuzda hedeflerinize uygun
            planı seçin. 7 gün ücretsiz deneme ile tüm özellikleri keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Badge variant="secondary" className="text-green-600 bg-green-50">
              ✓ 7 gün ücretsiz deneme
            </Badge>
            <Badge variant="secondary" className="text-blue-600 bg-blue-50">
              ✓ 30 gün para iade garantisi
            </Badge>
            <Badge variant="secondary" className="text-purple-600 bg-purple-50">
              ✓ İstediğiniz zaman iptal
            </Badge>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "hover:shadow-lg transition-shadow"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      En Popüler
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                        {plan.savings && (
                          <Badge variant="secondary" className="text-green-600">
                            {plan.savings}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Link href="/register">
                    <Button
                      variant={plan.buttonVariant}
                      className="w-full mb-6"
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        DAHİL OLAN ÖZELLİKLER:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {plan.limitations && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                          SINIRLAMALAR:
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map(
                            (limitation, limitationIndex) => (
                              <li
                                key={limitationIndex}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="text-orange-500 mt-0.5">
                                  •
                                </span>
                                <span>{limitation}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tüm Planlarda Yer Alan Özellikler
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fluenta'nın AI destekli İngilizce öğrenme platformunda premium
              deneyim yaşayın
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fiyatlandırma ve abonelik hakkında merak ettikleriniz
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Money Back Guarantee */}
        <section className="mb-16">
          <GradientCard className="text-center">
            <CardHeader>
              <div className="text-4xl mb-4">💰</div>
              <CardTitle className="text-2xl">
                30 Gün Para İade Garantisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                İlk 30 gün içerisinde memnun kalmazsanız, koşulsuz olarak
                ödediğiniz tutarı iade ediyoruz. Hiçbir soru sormuyoruz, hiçbir
                şart koşmuyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Risksiz Deneyin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                İngilizce Öğrenme Yolculuğunuza Başlayın
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Fluenta'nın AI destekli İngilizce öğrenme platformu ile
                hedeflerinize ulaşın. 7 gün ücretsiz deneme ile hemen başlayın!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    7 Gün Ücretsiz Dene
                  </Button>
                </Link>
              </div>
            </CardContent>
          </GradientCard>
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
              <h3 className="font-semibold mb-4">Planlar</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/tr/fiyatlandirma" className="hover:text-white">
                    Ücretsiz Plan
                  </Link>
                </li>
                <li>
                  <Link href="/tr/fiyatlandirma" className="hover:text-white">
                    Premium Plan
                  </Link>
                </li>
                <li>
                  <Link href="/tr/fiyatlandirma" className="hover:text-white">
                    Pro Plan
                  </Link>
                </li>
                <li>
                  <Link href="/tr/kurumsal" className="hover:text-white">
                    Kurumsal Çözümler
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/sss" className="hover:text-white">
                    Sıkça Sorulan Sorular
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hukuki</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/cerez-politikasi"
                    className="hover:text-white"
                  >
                    Çerez Politikası
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
