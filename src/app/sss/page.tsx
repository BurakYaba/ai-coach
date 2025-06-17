"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MainNav } from "@/components/navigation/main-nav";
import PopularResources from "@/components/layout/PopularResources";
import Footer from "@/components/layout/Footer";

export default function TurkishFAQPage() {
  const faqCategories = [
    {
      title: "Genel Sorular",
      icon: "❓",
      id: "genel-sorular",
      faqs: [
        {
          question: "Fluenta nedir ve nasıl çalışır?",
          answer:
            "Fluenta, yapay zeka teknolojisi kullanarak kişiselleştirilmiş İngilizce öğrenme deneyimi sunan bir platformdur. AI öğretmeniniz seviyenizi analiz eder, zayıf yanlarınızı tespit eder ve size özel ders planları oluşturur. 6 farklı modül (konuşma, dinleme, okuma, yazma, gramer, kelime) ile kapsamlı öğrenme imkanı sunar.",
        },
        {
          question: "Hangi seviyedeki öğrenciler için uygun?",
          answer:
            "Fluenta başlangıç (A1) seviyesinden ileri (C2) seviyesine kadar tüm seviyelerdeki öğrenciler için uygundur. Platform, seviye testiyle başlayarak size uygun içeriği sunar ve ilerledikçe zorluğu otomatik olarak ayarlar.",
        },
        {
          question: "Diğer İngilizce öğrenme uygulamalarından farkı nedir?",
          answer:
            "Fluenta'nın temel farkı, gerçek AI teknolojisi kullanmasıdır. Sadece önceden hazırlanmış içerik sunmaz, her öğrenciye özel olarak adapte olur. Gerçek zamanlı telaffuz analizi, kişiselleştirilmiş geri bildirim ve sürekli öğrenen AI sistemi ile benzersiz bir deneyim sunar.",
        },
        {
          question: "Ne kadar sürede sonuç alabilirim?",
          answer:
            "Çoğu öğrencimiz ilk 2 hafta içinde belirgin gelişmeler fark ediyor. Düzenli kullanımla (günde 30 dakika) 3 ayda bir seviye atlama mümkündür. Tabii ki bu, başlangıç seviyenize ve çalışma düzeninize bağlıdır.",
        },
      ],
    },
    {
      title: "Fiyatlandırma ve Abonelik",
      icon: "💰",
      id: "fiyatlandirma",
      faqs: [
        {
          question: "Fiyatlandırma planlarınız nelerdir?",
          answer:
            "3 farklı planımız var: Ücretsiz ($0/ay - sınırlı özellikler), Premium ($14.99/ay - tüm özellikler), Pro ($24.99/ay - 1:1 koçluk + gelişmiş özellikler). Tüm ücretli planlar 7 gün ücretsiz deneme ile başlar.",
        },
        {
          question: "Ücretsiz deneme nasıl çalışır?",
          answer:
            "7 gün boyunca Premium planın tüm özelliklerini ücretsiz kullanabilirsiniz. Kredi kartı bilgisi gerekmez. Deneme süresi bitiminde otomatik ücretlendirme yapılmaz, manuel olarak abonelik satın almanız gerekir.",
        },
        {
          question: "İstediğim zaman iptal edebilir miyim?",
          answer:
            "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar erişiminiz devam eder. İptal işlemini hesap ayarlarından veya destek ekibimizle iletişime geçerek yapabilirsiniz.",
        },
        {
          question: "Para iade garantiniz var mı?",
          answer:
            "Evet, ilk 30 gün içerisinde memnun kalmazsanız koşulsuz para iadesi yapıyoruz. İade talebinizi destek@fluenta-ai.com adresine göndererek başlatabilirsiniz.",
        },
        {
          question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          answer:
            "Kredi kartı, banka kartı, PayPal ve Apple Pay ile ödeme yapabilirsiniz. Tüm ödemeler SSL şifreleme ile güvenli şekilde işlenir. Kurumsal müşteriler için havale/EFT seçeneği de mevcuttur.",
        },
      ],
    },
    {
      title: "Platform Kullanımı",
      icon: "💻",
      id: "platform-kullanimi",
      faqs: [
        {
          question: "Hangi cihazlarda kullanabilirim?",
          answer:
            "Fluenta web tarayıcısı (Chrome, Safari, Firefox, Edge) ve mobil uygulamalar (iOS, Android) üzerinden kullanılabilir. Aynı hesapla tüm cihazlarınızdan erişebilir, kaldığınız yerden devam edebilirsiniz.",
        },
        {
          question: "İnternet bağlantısı olmadan kullanabilir miyim?",
          answer:
            "Mobil uygulamada bazı içerikleri offline kullanabilirsiniz. Ancak AI özellikler (konuşma analizi, gerçek zamanlı geri bildirim) için internet bağlantısı gereklidir.",
        },
        {
          question: "Günde ne kadar çalışmam gerekiyor?",
          answer:
            "Minimum günde 15-20 dakika öneriyoruz. En iyi sonuçlar için günde 30-45 dakika ideal. Platform, çalışma sürenizi takip eder ve size uygun hedefler belirler.",
        },
        {
          question: "İlerleme durumumu nasıl takip edebilirim?",
          answer:
            "Detaylı dashboard'da günlük, haftalık ve aylık ilerlemenizi görebilirsiniz. Hangi alanlarda güçlü olduğunuz, hangi konularda daha çok çalışmanız gerektiği grafiklerle gösterilir.",
        },
      ],
    },
    {
      title: "AI Özellikler",
      icon: "🤖",
      id: "ai-ozellikler",
      faqs: [
        {
          question: "AI öğretmeni nasıl çalışır?",
          answer:
            "AI öğretmeniniz performansınızı sürekli analiz eder, öğrenme paternlerinizi öğrenir ve size özel ders planları oluşturur. Hatalarınızdan öğrenir ve benzer hataları tekrar etmemeniz için özel egzersizler hazırlar.",
        },
        {
          question: "Telaffuz analizi ne kadar doğru?",
          answer:
            "Telaffuz analizimiz %95+ doğruluk oranına sahiptir. Ses tanıma teknolojimiz, ana dil konuşmacılarının telaffuzuyla karşılaştırma yaparak size detaylı geri bildirim verir.",
        },
        {
          question: "AI ile gerçek konuşma pratiği yapabilir miyim?",
          answer:
            "Evet, AI konuşma partnerinizle gerçek zamanlı sohbet edebilirsiniz. Farklı senaryolar (iş görüşmesi, alışveriş, seyahat) üzerinden pratik yapabilir, anında düzeltme alabilirsiniz.",
        },
        {
          question: "Gramer hatalarımı otomatik düzeltiyor mu?",
          answer:
            "Evet, yazma modülünde AI asistanınız gramer hatalarınızı gerçek zamanlı olarak tespit eder ve düzeltir. Sadece düzeltmekle kalmaz, neden yanlış olduğunu da açıklar.",
        },
      ],
    },
    {
      title: "Teknik Destek",
      icon: "🔧",
      id: "teknik-destek",
      faqs: [
        {
          question: "Teknik sorun yaşadığımda ne yapmalıyım?",
          answer:
            "İlk olarak sayfayı yenilemeyi ve farklı tarayıcı denemeyi öneriyoruz. Sorun devam ederse canlı destek (platform içi) veya teknik@fluenta-ai.com adresine yazabilirsiniz.",
        },
        {
          question: "Ses kaydetme özelliği çalışmıyor, ne yapmalıyım?",
          answer:
            "Tarayıcınızın mikrofon erişim iznini kontrol edin. Chrome'da adres çubuğundaki mikrofon simgesine tıklayarak izin verebilirsiniz. Sorun devam ederse farklı tarayıcı deneyin.",
        },
        {
          question: "Mobil uygulamayı nereden indirebilirim?",
          answer:
            "iOS için App Store'dan, Android için Google Play Store'dan 'Fluenta' aratarak indirebilirsiniz. QR kod ile direkt indirme linkleri de web sitemizde mevcuttur.",
        },
        {
          question: "Hesabıma giriş yapamıyorum, ne yapmalıyım?",
          answer:
            "Şifrenizi unuttuysanız 'Şifremi Unuttum' linkini kullanın. E-posta adresinizi doğru yazdığınızdan emin olun. Sorun devam ederse destek ekibimizle iletişime geçin.",
        },
      ],
    },
    {
      title: "İlerleme ve Başarı",
      icon: "🏆",
      id: "ilerleme-basari",
      faqs: [
        {
          question: "İlerleme durumumu nasıl ölçebilirim?",
          answer:
            "Platform üzerinde detaylı analitikler ve ilerleme raporları bulunmaktadır. Günlük, haftalık ve aylık performansınızı takip edebilir, güçlü ve zayıf yanlarınızı görebilirsiniz.",
        },
        {
          question: "İş İngilizcesi öğrenebilir miyim?",
          answer:
            "Evet, platformumuzda İş İngilizcesi içerikleri bulunmaktadır. E-posta yazma, sunum yapma, toplantı yönetme, müzakere gibi iş hayatında kullanacağınız İngilizce becerilerini geliştirebilirsiniz.",
        },
        {
          question: "Konuşma pratiği için gerçek kişilerle eşleşebilir miyim?",
          answer:
            "Şu anda sadece AI konuşma partneri ile pratik yapabilirsiniz. Gelecekte gerçek konuşma partnerleri ile eşleşme özelliği eklenebilir.",
        },
        {
          question: "Başarı durumumu nasıl takip edebilirim?",
          answer:
            "Dashboard'da detaylı istatistikler, başarı rozetleri ve ilerleme grafikleri bulunuyor. Haftalık ve aylık raporlar e-posta ile gönderilir.",
        },
      ],
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/sss" language="tr" />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span>›</span>
          <span>Sık Sorulan Sorular</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">❓ SSS</Badge>
            <Badge variant="outline">Hızlı Yanıtlar</Badge>
            <Badge variant="outline">Destek</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sık Sorulan Sorular
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Fluenta AI destekli İngilizce öğrenme platformu hakkında merak
            ettiğiniz her şeyin yanıtını burada bulabilirsiniz. Aradığınızı
            bulamazsanız, destek ekibimizle iletişime geçin.
          </p>
        </section>

        {/* Quick Links */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Hızlı Erişim</h2>
            <p className="text-muted-foreground">
              Aradığınız konuya hızlıca ulaşın
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {faqCategories.map((category, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => scrollToSection(category.id)}
              >
                <CardContent className="pt-4">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="text-sm font-medium">{category.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} id={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-semibold">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Resources */}
        <PopularResources />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
