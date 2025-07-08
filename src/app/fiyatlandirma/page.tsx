import Link from "next/link";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

import FooterTr from "@/components/layout/FooterTr";
import { ArrowLeft } from "lucide-react";
import { ExpiredUserAlert } from "@/components/pricing/expired-user-alert";
import { CheckoutButton } from "@/components/payments/checkout-button";

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

export default async function TurkishPricingPage() {
  const session = await getServerSession(authOptions);
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
      name: "Aylık",
      price: "$14.99",
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
      buttonText: "Aylık Planı Seç",
      buttonVariant: "outline" as const,
      popular: false,
      planType: "monthly" as const,
    },
    {
      name: "Yıllık",
      price: "$149.99",
      period: "/yıl",
      description: "En iyi değer, uzun vadeli öğrenenler için",
      features: [
        "Aylık plandaki tüm özellikler",
        "2 ay ücretsiz (30$ tasarruf)",
        "Öncelikli müşteri desteği",
        "Yeni özelliklere erken erişim",
        "Gelişmiş analitik ve içgörüler",
        "İndirilebilir sertifikalar",
      ],
      buttonText: "Yıllık Planı Seç",
      buttonVariant: "default" as const,
      popular: true,
      planType: "annual" as const,
    },
  ];

  const faqs = [
    {
      question: "Ücretsiz deneme süresi ne kadar?",
      answer:
        "14 gün boyunca Premium planın tüm özelliklerini ücretsiz kullanabilirsiniz. Kredi kartı bilgisi gerektirmez.",
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
      <TurkishPricingContent
        session={session}
        pricingPlans={pricingPlans}
        faqs={faqs}
        features={features}
      />
    </div>
  );
}

function TurkishPricingContent({
  session,
  pricingPlans,
  faqs,
  features,
}: {
  session: any;
  pricingPlans: any[];
  faqs: any[];
  features: any[];
}) {
  // Determine the correct back link based on authentication status and expired user status
  const isExpiredUser = session?.user?.isExpiredUser;
  const backLink = isExpiredUser
    ? "/login"
    : session?.user
      ? "/dashboard"
      : "/";
  const backText = isExpiredUser
    ? "Giriş Sayfasına Dön"
    : session?.user
      ? "Kontrol Paneline Dön"
      : "Ana Sayfaya Dön";

  return (
    <>
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
        <ExpiredUserAlert />

        <div className="mb-8">
          <Link
            href={backLink}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backText}
          </Link>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Fiyatlandırma</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">💰 Fiyatlandırma</Badge>
            <Badge variant="outline">14 Gün Ücretsiz</Badge>
            <Badge variant="outline">Para İade Garantisi</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI destekli İngilizce öğrenme platformumuzda hedeflerinize uygun
            planı seçin. 14 gün ücretsiz deneme ile tüm özellikleri keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Badge variant="secondary" className="text-green-600 bg-green-50">
              ✓ 14 gün ücretsiz deneme
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
                  {session?.user ? (
                    <CheckoutButton
                      planType={plan.planType}
                      className="w-full mb-6"
                      variant={plan.buttonVariant}
                    >
                      {plan.buttonText}
                    </CheckoutButton>
                  ) : (
                    <Link href="/register">
                      <Button
                        variant={plan.buttonVariant}
                        className="w-full mb-6"
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        DAHİL OLAN ÖZELLİKLER:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map(
                          (feature: string, featureIndex: number) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="text-green-500 mt-0.5">✓</span>
                              <span>{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    {plan.limitations && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                          SINIRLAMALAR:
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map(
                            (limitation: string, limitationIndex: number) => (
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
                hedeflerinize ulaşın. 14 gün ücretsiz deneme ile hemen başlayın!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    14 Gün Ücretsiz Dene
                  </Button>
                </Link>
              </div>
            </CardContent>
          </GradientCard>
        </section>
      </main>

      {/* Footer */}
      <FooterTr />
    </>
  );
}
