import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MainNav } from "@/components/navigation/main-nav";

export const metadata: Metadata = {
  title: "İletişim | Fluenta AI",
  description:
    "Fluenta ekibi ile iletişime geçin. Sorularınızı sorun, destek alın veya önerilerinizi paylaşın.",
  keywords:
    "Fluenta iletişim, İngilizce öğrenme destek, AI İngilizce yardım, müşteri hizmetleri, teknik destek, Fluenta ekip, İngilizce öğrenme sorular",
  alternates: {
    canonical: "/iletisim",
    languages: {
      en: "/contact",
      tr: "/iletisim",
    },
  },
  openGraph: {
    title: "İletişim - Fluenta ile İletişime Geçin | AI İngilizce Öğrenme",
    description:
      "Fluenta ekibi ile iletişime geçin. Sorularınızı sorun, destek alın veya önerilerinizi paylaşın. 7/24 destek hizmeti.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-contact-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta İletişim",
      },
    ],
  },
};

export default function TurkishContactPage() {
  const contactMethods = [
    {
      icon: "📧",
      title: "E-posta",
      description: "Genel sorular ve destek için",
      contact: "destek@fluenta-ai.com",
      responseTime: "24 saat içinde yanıt",
    },
    {
      icon: "💬",
      title: "Canlı Destek",
      description: "Anında yardım için",
      contact: "Canlı sohbet başlat",
      responseTime: "Ortalama 2 dakika",
    },
    {
      icon: "📱",
      title: "WhatsApp",
      description: "Hızlı sorular için",
      contact: "+90 555 123 4567",
      responseTime: "Çalışma saatleri içinde",
    },
    {
      icon: "📞",
      title: "Telefon",
      description: "Acil durumlar için",
      contact: "+90 212 123 4567",
      responseTime: "Pazartesi-Cuma 09:00-18:00",
    },
  ];

  const departments = [
    {
      name: "Genel Destek",
      email: "destek@fluenta-ai.com",
      description: "Platform kullanımı, hesap sorunları, genel sorular",
    },
    {
      name: "Teknik Destek",
      email: "teknik@fluenta-ai.com",
      description: "Teknik sorunlar, hata raporları, performans sorunları",
    },
    {
      name: "Satış",
      email: "satis@fluenta-ai.com",
      description: "Fiyatlandırma, paket seçimi, kurumsal çözümler",
    },
    {
      name: "Ortaklık",
      email: "ortaklik@fluenta-ai.com",
      description: "İş ortaklığı, entegrasyon, API erişimi",
    },
  ];

  const faqs = [
    {
      question: "Destek ekibiniz hangi saatlerde çalışıyor?",
      answer:
        "Canlı destek ekibimiz Pazartesi-Cuma 09:00-18:00 saatleri arasında hizmet veriyor. E-posta desteği 7/24 aktiftir ve 24 saat içinde yanıtlanır.",
    },
    {
      question: "Teknik sorunlarımı nasıl bildirebilirim?",
      answer:
        "Teknik sorunları teknik@fluenta-ai.com adresine e-posta göndererek veya canlı destek üzerinden bildirebilirsiniz. Sorunu detaylı açıklayın ve ekran görüntüsü ekleyin.",
    },
    {
      question: "Kurumsal çözümler sunuyor musunuz?",
      answer:
        "Evet, okullar ve şirketler için özel kurumsal paketlerimiz bulunuyor. Detaylı bilgi için satis@fluenta-ai.com adresine yazabilirsiniz.",
    },
    {
      question: "Geri bildirimlerimi nasıl paylaşabilirim?",
      answer:
        "Önerilerinizi ve geri bildirimlerinizi destek@fluenta-ai.com adresine gönderebilir veya aşağıdaki iletişim formunu kullanabilirsiniz.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/iletisim" language="tr" />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>İletişim</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">📞 İletişim</Badge>
            <Badge variant="outline">7/24 Destek</Badge>
            <Badge variant="outline">Hızlı Yanıt</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Size Nasıl Yardımcı Olabiliriz?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Fluenta ekibi olarak sorularınızı yanıtlamak, sorunlarınızı çözmek
            ve İngilizce öğrenme yolculuğunuzda size destek olmak için
            buradayız.
          </p>
        </section>

        {/* Contact Methods */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              İletişim Yöntemlerimiz
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Size en uygun iletişim kanalını seçin ve hemen destek alın
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground mb-3">
                    {method.description}
                  </p>
                  <p className="font-medium text-primary mb-2">
                    {method.contact}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {method.responseTime}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Bize Yazın</h2>
                <p className="text-muted-foreground mb-6">
                  Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz.
                  En kısa sürede size geri dönüş yapacağız.
                </p>

                <div className="space-y-4">
                  <h3 className="font-semibold mb-3">Departmanlarımız:</h3>
                  {departments.map((dept, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-medium">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {dept.description}
                      </p>
                      <p className="text-sm text-primary">{dept.email}</p>
                    </div>
                  ))}
                </div>
              </div>

              <GradientCard>
                <CardHeader>
                  <CardTitle>İletişim Formu</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Ad</Label>
                        <Input id="firstName" placeholder="Adınız" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Soyad</Label>
                        <Input id="lastName" placeholder="Soyadınız" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
                      <Input id="phone" placeholder="+90 555 123 4567" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Konu</Label>
                      <select
                        id="subject"
                        className="w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="">Konu seçin</option>
                        <option value="general">Genel Destek</option>
                        <option value="technical">Teknik Sorun</option>
                        <option value="billing">Faturalama</option>
                        <option value="feature">Özellik Önerisi</option>
                        <option value="partnership">Ortaklık</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="message">Mesajınız</Label>
                      <Textarea
                        id="message"
                        placeholder="Mesajınızı buraya yazın..."
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Mesaj Gönder
                    </Button>
                  </form>
                </CardContent>
              </GradientCard>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              İletişim ve destek hakkında en çok merak edilen konular
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Office Info */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ofis Bilgilerimiz
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏢</span>
                  İstanbul Ofisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="flex items-start gap-2">
                    <span className="text-primary">📍</span>
                    <span>
                      Maslak Mahallesi, Büyükdere Caddesi No:123
                      <br />
                      Sarıyer, İstanbul 34485
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary">📞</span>
                    <span>+90 212 123 4567</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary">🕒</span>
                    <span>Pazartesi - Cuma: 09:00 - 18:00</span>
                  </p>
                </div>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  Dijital Ofis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="flex items-start gap-2">
                    <span className="text-primary">💬</span>
                    <span>
                      7/24 Canlı Destek
                      <br />
                      Platform üzerinden erişilebilir
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary">📧</span>
                    <span>destek@fluenta-ai.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary">⚡</span>
                    <span>Ortalama yanıt süresi: 2 saat</span>
                  </p>
                </div>
              </CardContent>
            </GradientCard>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Hemen Başlayın!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Sorularınız mı var? Hemen ücretsiz hesap oluşturun ve AI
                destekli İngilizce öğrenme deneyimini keşfedin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Ücretsiz Hesap Oluştur
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Demo İzle
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
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  📧 destek@fluenta-ai.com
                </p>
                <p className="text-gray-400 text-sm">📞 +90 212 123 4567</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hızlı İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/sss" className="hover:text-white">
                    Sıkça Sorulan Sorular
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="hover:text-white">
                    Geri Bildirim
                  </Link>
                </li>
                <li>
                  <Link href="/tr/canlı-destek" className="hover:text-white">
                    Canlı Destek
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Departmanlar</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="mailto:satis@fluenta-ai.com"
                    className="hover:text-white"
                  >
                    Satış
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:teknik@fluenta-ai.com"
                    className="hover:text-white"
                  >
                    Teknik Destek
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:ortaklik@fluenta-ai.com"
                    className="hover:text-white"
                  >
                    Ortaklık
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:basin@fluenta-ai.com"
                    className="hover:text-white"
                  >
                    Basın
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Sosyal Medya</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    YouTube
                  </a>
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
