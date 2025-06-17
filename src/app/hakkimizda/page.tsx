import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import FooterTr from "@/components/layout/FooterTr";

export const metadata: Metadata = {
  title: "Hakkımızda - AI Destekli İngilizce Öğrenme Platformu | Fluenta",
  description:
    "Fluenta'nın hikayesini keşfedin. AI teknolojisi ile İngilizce öğrenmeyi nasıl devrimleştirdiğimizi, misyonumuzu ve vizyonumuzu öğrenin. Türkiye'nin önde gelen İngilizce öğrenme platformu.",
  keywords:
    "Fluenta hakkında, AI İngilizce öğrenme hikayesi, Türkiye İngilizce eğitimi, yapay zeka dil öğrenme, İngilizce öğrenme platformu Türkiye, Fluenta misyon vizyon",
  alternates: {
    canonical: "/hakkimizda",
    languages: {
      en: "/en/about",
      tr: "/hakkimizda",
    },
  },
  openGraph: {
    title: "Hakkımızda - AI Destekli İngilizce Öğrenme Platformu | Fluenta",
    description:
      "Fluenta'nın hikayesini keşfedin. AI teknolojisi ile İngilizce öğrenmeyi nasıl devrimleştirdiğimizi, misyonumuzu ve vizyonumuzu öğrenin.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-images/og-about-tr.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Hakkımızda",
      },
    ],
  },
};

export default function TurkishAboutPage() {
  const teamMembers = [
    {
      name: "Dr. Ahmet Yılmaz",
      role: "Kurucu & CEO",
      description: "Stanford'da AI araştırması, 15+ yıl dil eğitimi deneyimi",
      image: "/team/ceo.jpg",
    },
    {
      name: "Elif Kaya",
      role: "CTO & AI Uzmanı",
      description: "MIT mezunu, doğal dil işleme alanında uzman",
      image: "/team/cto.jpg",
    },
    {
      name: "Prof. Dr. Mehmet Özkan",
      role: "Eğitim Direktörü",
      description: "Boğaziçi Üniversitesi, İngiliz Dili ve Edebiyatı",
      image: "/team/education.jpg",
    },
  ];

  const milestones = [
    {
      year: "2022",
      title: "Fluenta'nın Kuruluşu",
      description: "AI destekli İngilizce öğrenme vizyonu ile yola çıktık",
    },
    {
      year: "2023",
      title: "İlk AI Modülü",
      description: "Konuşma pratiği modülümüzü geliştirdik ve test ettik",
    },
    {
      year: "2024",
      title: "Platform Lansmanı",
      description: "6 modüllü tam platform ile Türkiye'de hizmete başladık",
    },
    {
      year: "2025",
      title: "Küresel Genişleme",
      description: "Uluslararası pazarlara açılma hedefimiz",
    },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Kişiselleştirme",
      description: "Her öğrencinin benzersiz ihtiyaçlarına özel çözümler",
    },
    {
      icon: "🚀",
      title: "İnovasyon",
      description: "En son AI teknolojilerini eğitime entegre etme",
    },
    {
      icon: "🤝",
      title: "Erişilebilirlik",
      description: "Kaliteli İngilizce eğitimini herkese ulaştırma",
    },
    {
      icon: "📊",
      title: "Veri Odaklılık",
      description: "Öğrenme sürecini sürekli analiz etme ve iyileştirme",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/hakkimizda" language="tr" />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Hakkımızda</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🏢 Hakkımızda</Badge>
            <Badge variant="outline">AI Teknoloji</Badge>
            <Badge variant="outline">Türkiye</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            İngilizce Öğrenmenin Geleceğini Şekillendiriyoruz
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Fluenta olarak, yapay zeka teknolojisinin gücünü kullanarak
            İngilizce öğrenmeyi daha etkili, kişiselleştirilmiş ve eğlenceli
            hale getiriyoruz. Türkiye'den dünyaya uzanan bir eğitim devrimi
            yaratıyoruz.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">🎯</span>
                  Misyonumuz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  AI teknolojisinin gücünü kullanarak, her bireyin İngilizce
                  öğrenme potansiyelini maksimuma çıkarmak. Kişiselleştirilmiş,
                  etkili ve erişilebilir İngilizce eğitimi sunarak, Türkiye'deki
                  dil öğrenme standartlarını yükseltmek.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">🚀</span>
                  Vizyonumuz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  Dünya çapında en gelişmiş AI destekli dil öğrenme platformu
                  olmak. Milyonlarca öğrencinin hayallerini gerçekleştirmesine
                  yardımcı olarak, küresel iletişimde köprü kurmak ve dil
                  bariyerlerini ortadan kaldırmak.
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hikayemiz</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fluenta'nın doğuşu, İngilizce öğrenmenin daha etkili olabileceği
              inancından başladı
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed mb-4">
                    2022 yılında, Stanford'da AI araştırması yapan Dr. Ahmet
                    Yılmaz ve MIT'den mezun AI uzmanı Elif Kaya, geleneksel
                    İngilizce öğrenme yöntemlerinin sınırlarını fark ettiler.
                    Öğrencilerin bireysel ihtiyaçlarına cevap veremeyen tek
                    boyutlu yaklaşımlar, potansiyelin tam olarak kullanılmasını
                    engelliyordu.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Bu sorunu çözmek için, yapay zeka teknolojisinin gücünü dil
                    öğrenmeye entegre etme fikrini geliştirdiler. Boğaziçi
                    Üniversitesi'nden Prof. Dr. Mehmet Özkan'ın eğitim uzmanlığı
                    ile birleşen bu vizyon, Fluenta'nın temellerini attı.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Bugün, binlerce öğrencinin İngilizce öğrenme yolculuğunda
                    rehberlik eden Fluenta, Türkiye'nin en gelişmiş AI destekli
                    İngilizce öğrenme platformu olarak hizmet veriyor.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Yolculuğumuz
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fluenta'nın gelişim hikayesi ve önemli kilometre taşları
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fluenta'yı yönlendiren temel ilkeler ve değerler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ekibimiz</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fluenta'nın arkasındaki deneyimli ve tutkulu ekip
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-center text-2xl mb-8">
                Rakamlarla Fluenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    50,000+
                  </div>
                  <p className="text-muted-foreground">Aktif Öğrenci</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    1M+
                  </div>
                  <p className="text-muted-foreground">Tamamlanan Ders</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    95%
                  </div>
                  <p className="text-muted-foreground">Memnuniyet Oranı</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <p className="text-muted-foreground">AI Destek</p>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* CTA */}
        <section className="text-center">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Fluenta Ailesine Katılın
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Binlerce öğrencinin tercih ettiği AI destekli İngilizce öğrenme
                deneyimini siz de yaşayın. Hemen ücretsiz hesap oluşturun!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Ücretsiz Hesap Oluştur
                  </Button>
                </Link>
                <Link
                  href="/iletisim"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  İletişim
                </Link>
              </div>
            </CardContent>
          </GradientCard>
        </section>
      </main>

      {/* Footer */}
      <FooterTr />
    </div>
  );
}
