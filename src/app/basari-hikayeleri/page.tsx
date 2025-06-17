import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  PlayCircle,
  Quote,
  TrendingUp,
  Award,
  Users,
  Clock,
  Globe,
  BookOpen,
  MessageSquare,
  Target,
  ChevronRight,
  Star,
} from "lucide-react";
import PopularResources from "@/components/layout/PopularResources";
import Footer from "@/components/layout/Footer";

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
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Başarı Hikayeleri</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0"
            >
              <Star className="w-4 h-4 mr-1" />
              Başarı Hikayeleri
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Gerçek Sonuçlar
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-0"
            >
              <Users className="w-4 h-4 mr-1" />
              50K+ Öğrenci
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Bu Öğrenciler Gibi İngilizce'nizi Dönüştürün
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Dünya çapındaki öğrencilerin Fluenta'nın AI destekli öğrenme
            platformu ile İngilizce konuşma, telaffuz ve özgüvenlerini nasıl
            geliştirdiklerini keşfedin.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">50K+</div>
              <div className="text-sm text-blue-700">Mutlu Öğrenci</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">%87</div>
              <div className="text-sm text-green-700">Özgüven Artışı</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">%92</div>
              <div className="text-sm text-purple-700">Telaffuz Gelişimi</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                3 Ay
              </div>
              <div className="text-sm text-orange-700">Ortalama İlerleme</div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-16">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button variant="default" size="sm" className="rounded-full">
              <Target className="w-4 h-4 mr-2" />
              Tümü
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Konuşma
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-green-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              IELTS/TOEFL
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-purple-50"
            >
              <Globe className="w-4 h-4 mr-2" />
              İş İngilizcesi
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-orange-50"
            >
              <Award className="w-4 h-4 mr-2" />
              Telaffuz
            </Button>
          </div>
        </section>

        {/* Featured Success Stories */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Öne Çıkan Başarı Hikayeleri
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gerçek öğrencilerin, gerçek dönüşüm hikayelerini keşfedin
            </p>
          </div>

          <div className="space-y-20">
            {/* Maria's Story - Enhanced */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/30 hover:shadow-3xl transition-all duration-300">
                  <CardContent className="p-8 lg:p-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        5.0/5.0
                      </span>
                    </div>

                    <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-60" />
                    <blockquote className="text-lg lg:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "İş görüşmelerinden korkmaktan, Google'da hayallerimin
                      işine güvenle başvurmaya kadar geldim. Fluenta'nın AI
                      mülakat pratiği oyunun kurallarını değiştirdi!"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">MR</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Maria Rodriguez
                        </div>
                        <div className="text-blue-600 font-medium">
                          Google'da Yazılım Mühendisi
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Madrid, İspanya
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      Maria'nın Yolculuğu
                    </h3>
                    <div className="text-blue-100 mb-4">4 Ayda B1'den C1'e</div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-sm font-bold">
                              1
                            </span>
                          </div>
                          <div>
                            <strong className="text-red-600">Zorluk:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Güçlü teknik becerilere sahip yazılım mühendisi
                              ama profesyonel ortamlarda İngilizce iletişimde
                              zorlanıyordu.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-sm font-bold">
                              2
                            </span>
                          </div>
                          <div>
                            <strong className="text-blue-600">Çözüm:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Fluenta'nın AI konuşma partneri ile günlük pratik,
                              iş İngilizcesi modülü ve mülakat simülasyonları.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 text-sm font-bold">
                              3
                            </span>
                          </div>
                          <div>
                            <strong className="text-green-600">Sonuç:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              4 ayda B1'den C1 seviyesine çıktı ve Google'da
                              yazılım mühendisi pozisyonunu aldı.
                            </p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-green-800">
                              İngilizce Seviyesi İlerlemesi
                            </span>
                            <span className="text-sm text-green-600 font-bold">
                              +85%
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-green-700">
                              <span>B1 (Başlangıç)</span>
                              <span>C1 (Mevcut)</span>
                            </div>
                            <Progress value={85} className="h-2 bg-green-100" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Ahmed's Story - Enhanced */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6" />
                      Ahmed'in Hikayesi
                    </h3>
                    <div className="text-emerald-100 mb-4">
                      IELTS 6.0'dan 8.5'e
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <strong className="text-blue-600">Hedef:</strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Kanada'da tıp uzmanlığı için IELTS 8.0+ puanına
                            ihtiyacı vardı.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <strong className="text-orange-600">
                              Başlangıç:
                            </strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            IELTS 6.0 puanı ile özellikle konuşma ve dinleme
                            bölümlerinde zorlanıyordu.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            <strong className="text-purple-600">
                              Strateji:
                            </strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Fluenta'nın IELTS hazırlık modülü, günlük konuşma
                            pratiği ve telaffuz antrenörü.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-green-600" />
                            <strong className="text-green-600">Başarı:</strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            6 ayda IELTS 8.5 puanı aldı ve Kanada'da tıp
                            uzmanlığına kabul edildi.
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                          <div className="text-sm font-medium text-blue-800 mb-3">
                            IELTS Puan Gelişimi:
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Konuşma:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-600">
                                  5.5
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Dinleme:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-600">
                                  6.0
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Okuma:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-orange-600">
                                  6.5
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Yazma:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-600">
                                  6.0
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.0
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="order-2">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50/30 hover:shadow-3xl transition-all duration-300">
                  <CardContent className="p-8 lg:p-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        5.0/5.0
                      </span>
                    </div>

                    <Quote className="w-8 h-8 text-emerald-500 mb-4 opacity-60" />
                    <blockquote className="text-lg lg:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "Fluenta sayesinde sadece IELTS puanımı yükseltmekle
                      kalmadım, gerçek özgüvenle İngilizce konuşabilir hale
                      geldim. Şimdi Kanada'da doktor olarak çalışıyorum!"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">AH</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Dr. Ahmed Hassan
                        </div>
                        <div className="text-emerald-600 font-medium">
                          Tıp Uzmanı
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Toronto, Kanada
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Yuki's Story - Enhanced */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50/30 hover:shadow-3xl transition-all duration-300">
                  <CardContent className="p-8 lg:p-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        5.0/5.0
                      </span>
                    </div>

                    <Quote className="w-8 h-8 text-purple-500 mb-4 opacity-60" />
                    <blockquote className="text-lg lg:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "Japon aksanımdan dolayı anlaşılmıyordum. Fluenta'nın
                      telaffuz antrenörü sayesinde şimdi Amerikan şirketlerde
                      sunum yapabiliyorum!"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">YT</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Yuki Tanaka
                        </div>
                        <div className="text-purple-600 font-medium">
                          Pazarlama Müdürü
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Tokyo, Japonya
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-6 h-6" />
                      Yuki'nin Dönüşümü
                    </h3>
                    <div className="text-purple-100 mb-4">Telaffuz Ustası</div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <strong className="text-red-600">Problem:</strong>
                          <p className="text-sm text-muted-foreground mt-1">
                            Güçlü İngilizce bilgisine rağmen Japon aksanı
                            nedeniyle uluslararası toplantılarda
                            anlaşılamıyordu.
                          </p>
                        </div>

                        <div>
                          <strong className="text-blue-600">Çözüm:</strong>
                          <p className="text-sm text-muted-foreground mt-1">
                            Fluenta'nın AI telaffuz antrenörü ile günlük 20
                            dakika pratik, özel aksan azaltma egzersizleri.
                          </p>
                        </div>

                        <div>
                          <strong className="text-green-600">Gelişim:</strong>
                          <p className="text-sm text-muted-foreground mt-1">
                            3 ayda telaffuz netliği %78 arttı, şimdi global
                            pazarlama sunumları yapıyor.
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                          <div className="text-sm font-medium text-purple-800 mb-3">
                            Telaffuz Gelişimi:
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Netlik:</span>
                                <span className="text-xs font-medium">
                                  45% → 89%
                                </span>
                              </div>
                              <Progress
                                value={89}
                                className="h-2 bg-purple-100"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Akıcılık:</span>
                                <span className="text-xs font-medium">
                                  60% → 85%
                                </span>
                              </div>
                              <Progress
                                value={85}
                                className="h-2 bg-purple-100"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Vurgu:</span>
                                <span className="text-xs font-medium">
                                  40% → 82%
                                </span>
                              </div>
                              <Progress
                                value={82}
                                className="h-2 bg-purple-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Testimonials Grid - Enhanced */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Daha Fazla Başarı Hikayesi
            </h2>
            <p className="text-lg text-muted-foreground">
              Binlerce öğrencimizden daha fazla ilham verici hikaye
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Enhanced testimonial cards */}
            {[
              {
                name: "Elena Popov",
                role: "Öğrenci",
                location: "Bulgaristan",
                avatar: "EP",
                quote:
                  "3 ayda A2'den B2'ye çıktım. Fluenta'nın kişiselleştirilmiş yaklaşımı harika!",
                category: "Level Up",
                color: "from-blue-500 to-purple-500",
              },
              {
                name: "Carlos Silva",
                role: "Mühendis",
                location: "Brezilya",
                avatar: "CS",
                quote:
                  "İş görüşmelerinde artık kendime güveniyorum. AI koçum gerçek bir öğretmen gibi!",
                category: "İş İngilizcesi",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Li Wei",
                role: "Öğrenci",
                location: "Çin",
                avatar: "LW",
                quote:
                  "TOEFL puanım 85'ten 110'a çıktı. Amerika'da üniversiteye kabul edildim!",
                category: "TOEFL",
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Priya Sharma",
                role: "Satış Temsilcisi",
                location: "Hindistan",
                avatar: "PS",
                quote:
                  "Telaffuzum çok gelişti. Artık müşterilerle rahatça konuşabiliyorum.",
                category: "Telaffuz",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Hans Mueller",
                role: "Analist",
                location: "Almanya",
                avatar: "HM",
                quote:
                  "Yazma becerilerim inanılmaz gelişti. Şimdi İngilizce raporlar yazabiliyorum.",
                category: "Yazma",
                color: "from-indigo-500 to-blue-500",
              },
              {
                name: "Anna Kowalski",
                role: "Öğretmen",
                location: "Polonya",
                avatar: "AK",
                quote:
                  "6 ayda İngilizce öğretmeni oldum. Fluenta'ya çok teşekkürler!",
                category: "Kariyer",
                color: "from-teal-500 to-cyan-500",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <Quote className="w-6 h-6 text-gray-400 mb-3" />
                  <p className="text-sm italic mb-6 leading-relaxed text-gray-700">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center shadow-sm`}
                      >
                        <span className="font-bold text-xs text-white">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}, {testimonial.location}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 lg:p-16 text-white shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                <Star className="w-4 h-4 mr-1" />
                50,000+ Başarılı Öğrenci
              </Badge>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Sıradaki Başarı Hikayesi
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Sizin Olsun
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Binlerce öğrencimiz gibi siz de Fluenta ile İngilizce'de
                ustalaşabilirsiniz. Hemen başlayın ve kendi başarı hikayenizi
                yazın.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">7 Gün</div>
                  <div className="text-sm text-blue-100">Ücretsiz Deneme</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">%100</div>
                  <div className="text-sm text-blue-100">
                    Para İade Garantisi
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">24/7</div>
                  <div className="text-sm text-blue-100">AI Destek</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Ücretsiz Denemeyi Başlat
                  </Button>
                </Link>
                <Link href="/sss">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 font-semibold"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Sık Sorulan Sorular
                  </Button>
                </Link>
              </div>
            </div>
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
