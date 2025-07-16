"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  StructuredData,
  organizationSchema,
  websiteSchema,
} from "@/components/seo/StructuredData";
import {
  useMobileDetection,
  useReducedMotion,
} from "@/hooks/use-mobile-detection";
import { MainNav } from "@/components/navigation/main-nav";
import FooterTr from "@/components/layout/FooterTr";
import AvatarCarousel from "@/components/AvatarCarousel";

// Custom components based on Brainwave design
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 text-sm font-light tracking-widest uppercase text-center">
    {children}
  </div>
);

// Mobile-optimized animated background element
const BackgroundGradient = () => {
  const { isMobile, isLoaded } = useMobileDetection();
  const prefersReducedMotion = useReducedMotion();

  if (!isLoaded) return null;

  return (
    <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[80rem] h-[80rem] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-primary via-transparent to-secondary blur-3xl ${
            !isMobile && !prefersReducedMotion ? "animate-gradient-xy" : ""
          }`}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] opacity-20">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-accent via-secondary to-transparent blur-3xl ${
            !isMobile && !prefersReducedMotion ? "animate-pulse-glow" : ""
          }`}
        />
      </div>
      {!isMobile && (
        <>
          <div
            className="hidden lg:block absolute bottom-1/3 left-10 w-24 h-24 rounded-full bg-primary bg-opacity-30 blur-xl animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="hidden lg:block absolute top-1/3 right-10 w-20 h-20 rounded-full bg-accent bg-opacity-30 blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="hidden lg:block absolute top-2/3 right-1/4 w-16 h-16 rounded-full bg-secondary bg-opacity-30 blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </>
      )}
    </div>
  );
};

export default function TurkishLandingPage() {
  const { isMobile, isLoaded } = useMobileDetection();
  const prefersReducedMotion = useReducedMotion();

  // Mobile-optimized hero background style
  const getHeroBackgroundStyle = () => {
    if (!isLoaded) return {};

    return {
      backgroundImage: isMobile
        ? "url('/hero_800.webp')" // Use smaller image for mobile
        : "url('/hero_1920.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Add structured data for SEO */}
      <StructuredData type="Organization" data={organizationSchema} />
      <StructuredData type="WebSite" data={websiteSchema} />

      {/* Global background effect */}
      <BackgroundGradient />

      {/* Navigation */}
      <MainNav currentPath="/" language="tr" />

      {/* Hero Section */}
      <section
        className="pt-[7rem] -mt-[4rem] relative bg-cover bg-center bg-no-repeat hero-bg"
        id="hero"
        style={getHeroBackgroundStyle()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80 backdrop-blur-sm"></div>
        <div className="container relative mx-auto px-5 pb-16 pt-20 md:pb-24 md:pt-24 lg:pb-32 lg:pt-36 relative z-10">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-16 lg:mb-[6rem]">
            <Tagline>
              <span
                className="text-white font-medium drop-shadow-lg"
                style={{
                  textShadow: isMobile
                    ? "1px 1px 2px rgba(0,0,0,0.8)"
                    : "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)",
                }}
              >
                Kapsamlı İngilizce Öğrenme Platformu
              </span>
            </Tagline>
            <h1
              className={`text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] text-center mb-6 drop-shadow-xl ${
                !isMobile && !prefersReducedMotion ? "animate-float" : ""
              }`}
              style={{ animationDuration: "6s" }}
            >
              <span
                className="text-gray-100"
                style={{
                  textShadow: isMobile
                    ? "1px 1px 2px rgba(0,0,0,0.7)"
                    : "2px 2px 4px rgba(0,0,0,0.7)",
                }}
              >
                İngilizce'yi
              </span>
              <span className="text-gradient"> Fluenta</span>
              <span
                className="text-gray-100"
                style={{
                  textShadow: isMobile
                    ? "1px 1px 2px rgba(0,0,0,0.7)"
                    : "2px 2px 4px rgba(0,0,0,0.7)",
                }}
              >
                {" "}
                ile Öğrenin
              </span>
            </h1>
            <p
              className="max-w-[42rem] mx-auto leading-normal sm:text-xl sm:leading-8 text-center mb-8 text-gray-100 font-medium drop-shadow-lg"
              style={{
                textShadow: isMobile
                  ? "1px 1px 2px rgba(0,0,0,0.8)"
                  : "1px 1px 3px rgba(0,0,0,0.8)",
              }}
            >
              İnteraktif okuma, yazma, dinleme, konuşma, kelime ve gramer
              modülleri ile İngilizce öğrenin. Tüm dil becerilerinizde
              kişiselleştirilmiş AI geri bildirim alın.
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className={`bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-8 py-3 text-base shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto ${
                    !isMobile && !prefersReducedMotion
                      ? "hover:scale-105 transform animate-pulse-glow"
                      : ""
                  }`}
                  style={{ animationDuration: "3s" }}
                >
                  Hemen Öğrenmeye Başla
                </Button>
              </Link>
              <Link href="#modules">
                <Button
                  variant="outline"
                  size="lg"
                  className={`bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto ${
                    !isMobile && !prefersReducedMotion
                      ? "hover:scale-105 transform"
                      : ""
                  }`}
                >
                  Modülleri Keşfet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Avatar Speaking Module Showcase */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-5 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <Tagline>AI Konuşma Partnerleri</Tagline>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gerçek Zamanlı 3D Avatar'larla İngilizce Konuşın
            </h2>
            <p className="text-muted-foreground">
              Kişiselleştirilmiş AI konuşma partnerlerinizle pratik yapın,
              telaffuzunuzu geliştirin ve güvenle konuşun
            </p>
          </div>

          {/* Avatar Showcase Grid */}
          <AvatarCarousel
            avatars={[
              {
                name: "Alex",
                image: "/images/avatars/Alex.webp",
                role: "İş Profesyoneli",
                rating: 5.0,
                status: "Çevrimiçi",
                description:
                  "İş görüşmeleri, toplantılar ve profesyonel İngilizce konuşma pratiği için özel olarak tasarlanmıştır.",
                tags: [
                  { label: "İş İngilizcesi", color: "#3b82f6" },
                  { label: "Görüşme Pratiği", color: "#22c55e" },
                  { label: "Sunumlar", color: "#a21caf" },
                ],
              },
              {
                name: "Emma",
                image: "/images/avatars/Emma.webp",
                role: "Günlük Konuşma",
                rating: 5.0,
                status: "Çevrimiçi",
                description:
                  "Günlük konuşmalar, seyahat ve sosyal durumlar için rahat ve doğal İngilizce pratiği.",
                tags: [
                  { label: "Günlük Konuşma", color: "#ec4899" },
                  { label: "Seyahat", color: "#f59e42" },
                  { label: "Sosyal", color: "#facc15" },
                ],
              },
              {
                name: "Marcus",
                image: "/images/avatars/Marcus.webp",
                role: "Akademik Eğitmen",
                rating: 5.0,
                status: "Çevrimiçi",
                description:
                  "IELTS, TOEFL ve akademik İngilizce için özel olarak tasarlanmış gelişmiş konuşma pratiği.",
                tags: [
                  { label: "IELTS", color: "#6366f1" },
                  { label: "TOEFL", color: "#3b82f6" },
                  { label: "Akademik", color: "#a21caf" },
                ],
              },
              {
                name: "Oliver",
                image: "/images/avatars/Oliver.webp",
                role: "Akıcılık Koçu",
                rating: 5.0,
                status: "Çevrimiçi",
                description:
                  "Gerçek yaşam senaryoları ve anlık geri bildirimlerle akıcılık ve spontane konuşma pratiği yapın.",
                tags: [
                  { label: "Akıcılık", color: "#0ea5e9" },
                  { label: "Spontane", color: "#f59e42" },
                  { label: "Geri Bildirim", color: "#22c55e" },
                ],
              },
              {
                name: "Sarah",
                image: "/images/avatars/Sarah.webp",
                role: "Telaffuz Uzmanı",
                rating: 5.0,
                status: "Çevrimiçi",
                description:
                  "Telaffuz, aksan azaltma ve net iletişim için uzman yardımı alın.",
                tags: [
                  { label: "Telaffuz", color: "#f43f5e" },
                  { label: "Aksan", color: "#6366f1" },
                  { label: "Netlik", color: "#22c55e" },
                ],
              },
              {
                name: "Zoe",
                image: "/images/avatars/Zoe.webp",
                role: "Konuşma Partneri",
                rating: 5.0,
                status: "Çevrimiçi",
                description:
                  "Başlangıçtan ileri seviyeye kadar her düzey ve konuda samimi konuşma pratiği.",
                tags: [
                  { label: "Samimi", color: "#f59e42" },
                  { label: "Tüm Seviyeler", color: "#3b82f6" },
                  { label: "Konu", color: "#a21caf" },
                ],
              },
            ]}
          />

          {/* Live Demo Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 mt-10">
              3D Avatar'larla Gerçek Zamanlı Konuşma
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI destekli 3D avatar'larımızla anında konuşma pratiği yapın.
              Telaffuz, akıcılık ve gramer geri bildirimi alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 transform shadow-lg">
                  Ücretsiz Demo Başlat
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -z-10 pointer-events-none inset-0 opacity-20">
          <div
            className="absolute top-1/4 right-0 w-72 h-72 bg-blue-500 bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-1/4 left-0 w-72 h-72 bg-purple-500 bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>
      </section>

      {/* Learning Modules Section */}
      <section
        id="modules"
        className="container mx-auto px-5 py-16 md:py-24 space-y-16 relative"
      >
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Tagline>Kapsamlı Öğrenme</Tagline>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tüm Dil Becerilerini Geliştirme
          </h2>
          <p className="text-muted-foreground">
            Platformumuz dil öğreniminin tüm yönleri için interaktif modüller
            sunar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Reading Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/reading_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/80 group-hover:from-blue-900/70 group-hover:via-blue-800/60 group-hover:to-blue-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                Okuma Modülü
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                Seviyenize ve ilgi alanlarınıza uygun AI tarafından oluşturulan
                içeriklerle okuma anlama becerinizi geliştirin. İnteraktif
                sorular yanıtlayın, kelimeleri bağlam içinde öğrenin ve
                ilerlemenizi takip edin.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-blue-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Kişiselleştirilmiş okuma metinleri
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-blue-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Anlama soruları
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-blue-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Bağlam içinde kelime öğrenimi
                </li>
              </ul>
            </div>
          </div>

          {/* Writing Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-green-200/50 dark:border-green-700/50 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/writing_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-900/80 group-hover:from-green-900/70 group-hover:via-green-800/60 group-hover:to-green-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-green-200 transition-colors duration-300">
                Yazma Modülü
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                Rehberli yazma konuları ve AI destekli geri bildirimlerle yazma
                becerilerinizi geliştirin. Gramer, kelime kullanımı, cümle
                yapısı ve daha fazlası hakkında detaylı analiz alın.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-green-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Çeşitli yazma konuları
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-green-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Detaylı yazma analizi
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-green-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  İlerleme takibi
                </li>
              </ul>
            </div>
          </div>

          {/* Listening Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/listening_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-800/70 to-purple-900/80 group-hover:from-purple-900/70 group-hover:via-purple-800/60 group-hover:to-purple-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
                Dinleme Modülü
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                Ses içeriği kütüphanesi ile dinleme becerilerinizi
                keskinleştirin. Konuşmaları dinleyin, soruları yanıtlayın ve ana
                dili konuşanları anlamayı pratik edin.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-purple-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Çeşitli ses içerikleri
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-purple-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  İnteraktif egzersizler
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-purple-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Transkript desteği
                </li>
              </ul>
            </div>
          </div>

          {/* Speaking Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-red-200/50 dark:border-red-700/50 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/speaking_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-800/70 to-red-900/80 group-hover:from-red-900/70 group-hover:via-red-800/60 group-hover:to-red-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-red-200 transition-colors duration-300">
                Konuşma Modülü
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                AI konuşma partnerleri ile İngilizce konuşma pratiği yapın.
                Telaffuz, akıcılık, gramer ve kelime kullanımı hakkında gerçek
                zamanlı geri bildirim alın.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-red-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Gerçek zamanlı konuşmalar
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-red-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Detaylı telaffuz geri bildirimi
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-red-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Çeşitli konuşma senaryoları
                </li>
              </ul>
            </div>
          </div>

          {/* Vocabulary Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/vocabulary_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/80 via-yellow-800/70 to-yellow-900/80 group-hover:from-yellow-900/70 group-hover:via-yellow-800/60 group-hover:to-yellow-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 13V5"></path>
                  <path d="M5 13h14"></path>
                  <path d="M15 3h6v4h-6z"></path>
                  <path d="M5 7a2 2 0 0 1 2-2h6"></path>
                  <path d="M9 17v4"></path>
                  <path d="M6 21h6"></path>
                  <path d="M14 17v4"></path>
                  <path d="M15 21h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-yellow-200 transition-colors duration-300">
                Kelime Modülü
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                Kişiselleştirilmiş kelime bankası, aralıklı tekrar sistemi ve
                interaktif kelime kartları ile kelime hazinenizi geliştirin ve
                ustalık seviyenizi takip edin.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-yellow-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Kişiselleştirilmiş kelime bankası
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-yellow-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Aralıklı tekrar sistemi
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-yellow-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  İnteraktif kelime kartları
                </li>
              </ul>
            </div>
          </div>

          {/* Grammar Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/grammar_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-800/70 to-indigo-900/80 group-hover:from-indigo-900/70 group-hover:via-indigo-800/60 group-hover:to-indigo-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300">
                Gramer Modülü
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                Yapılandırılmış dersler, interaktif egzersizler ve yaygın
                hatalarınıza ve öğrenme ilerlemenize dayalı kişiselleştirilmiş
                pratiklerle İngilizce gramerde ustalaşın.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-indigo-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Yapılandırılmış gramer dersleri
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-indigo-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  İnteraktif egzersizler
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-indigo-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Kişiselleştirilmiş pratik
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-5 py-16 md:py-24 space-y-16 relative"
      >
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Tagline>Güçlü Özellikler</Tagline>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Neden Fluenta'yı Seçmelisiniz?
          </h2>
          <p className="text-muted-foreground">
            Dil öğrenme deneyiminizi dönüştüren gelişmiş özellikler
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-auto lg:h-[600px]">
          {/* AI-Powered Learning - Large card */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/AI_Learning_1200.webp"
              alt="AI destekli öğrenme görseli"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-white"
                >
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                  <path d="M21.17 8H12V2.83c2.44.4 4.77 1.69 6.6 3.67 1.77 1.91 2.57 4 2.57 4z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                AI Destekli Öğrenme
              </h3>
              <p className="text-gray-100 text-lg leading-relaxed">
                Gelişmiş AI motorumuz içeriği kişiselleştirir, performansınızı
                analiz eder ve dersleri öğrenme tarzınıza ve ilerlemenize göre
                uyarlar.
              </p>
            </div>
          </div>

          {/* Comprehensive Feedback - Medium card */}
          <div className="md:col-span-1 lg:col-span-1 lg:row-span-1 group relative overflow-hidden rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/feedback_1200.webp"
              alt="Kapsamlı geri bildirim görseli"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[280px]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Kapsamlı Geri Bildirim
              </h3>
              <p className="text-gray-100 text-sm">
                Yazma, konuşma ve gramer konularında detaylı, uygulanabilir geri
                bildirim alın.
              </p>
            </div>
          </div>

          {/* Interactive Practice - Medium card */}
          <div className="md:col-span-1 lg:col-span-1 lg:row-span-1 group relative overflow-hidden rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/interactive_practice_1200.webp"
              alt="İnteraktif pratik görseli"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[280px]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="m7 11 2-2-2-2"></path>
                  <path d="M11 13h4"></path>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                İnteraktif Pratik
              </h3>
              <p className="text-gray-100 text-sm">
                Öğrenmeyi keyifli hale getiren interaktif egzersizler ve dil
                oyunları ile pratik yapın.
              </p>
            </div>
          </div>

          {/* Gamification & Rewards - Wide card */}
          <div className="md:col-span-3 lg:col-span-2 lg:row-span-1 group relative overflow-hidden rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/gamification_1200.webp"
              alt="Oyunlaştırma ve ödüller görseli"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-center lg:justify-end min-h-[280px]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 text-white"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m15 9-6 6"></path>
                  <path d="m9 9 6 6"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Oyunlaştırma ve Ödüller
              </h3>
              <p className="text-gray-100 text-lg max-w-lg">
                Puan, rozet, seri ve seviye ilerlemesi ile İngilizce öğrenmeyi
                bağımlılık yapan ve eğlenceli hale getiren motivasyon sistemi.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -z-10 pointer-events-none inset-0 opacity-20">
          <div
            className="absolute top-1/4 right-0 w-72 h-72 bg-primary bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-1/4 left-0 w-72 h-72 bg-secondary bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="container mx-auto px-5 py-16 md:py-24 space-y-16 relative"
      >
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Tagline>Basit Fiyatlandırma</Tagline>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Herkes İçin Uygun Fiyat
          </h2>
          <p className="text-muted-foreground">
            Tüm özellikler dahil. Gizli ücret yok. İstediğiniz zaman iptal edin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <GradientCard>
            <div className="p-8 h-full flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Aylık Plan</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$14.99</span>
                  <span className="text-muted-foreground">/ay</span>
                </div>
                <p className="text-muted-foreground">Tüm özellikler dahil</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Tüm 6 öğrenme modülü
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  AI destekli kişiselleştirilmiş öğrenme
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Sınırsız pratik ve egzersiz
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Detaylı ilerleme raporları
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Mobil ve web erişimi
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  E-posta desteği
                </li>
              </ul>

              <Link href="/register?plan=monthly">
                <Button className="w-full" size="lg">
                  Aylık Planı Başlat
                </Button>
              </Link>
            </div>
          </GradientCard>

          {/* Annual Plan */}
          <GradientCard>
            <div className="p-8 h-full flex flex-col relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  En Popüler
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Yıllık Plan</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$149.99</span>
                  <span className="text-muted-foreground">/yıl</span>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    %17 Tasarruf
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Aylık plandaki her şey
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Öncelikli müşteri desteği
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Özel gelişmiş içerik
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Yeni özelliklere erken erişim
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Fiyat kilidi garantisi
                </li>
              </ul>

              <Link href="/register?plan=annual">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                  size="lg"
                >
                  Yıllık Planı Başlat
                </Button>
              </Link>
            </div>
          </GradientCard>
        </div>

        <div className="text-center max-w-2xl mx-auto pt-8">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-medium mb-2">%100 Memnuniyet Garantisi</h4>
            <p className="text-sm text-muted-foreground">
              Platformumuzdan memnun değil misiniz? Satın alma işleminizden
              sonraki 14 gün içinde bize bildirin, tam para iadesi yapalım.
              Hiçbir soru sorulmaz.
            </p>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -z-10 pointer-events-none inset-0 opacity-20">
          <div
            className="absolute top-1/4 right-0 w-72 h-72 bg-primary bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-1/4 left-0 w-72 h-72 bg-secondary bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-foreground border-opacity-5 bg-background bg-opacity-30 backdrop-blur-sm relative">
        <div className="container mx-auto px-5 py-16 md:py-24 space-y-8 text-center relative z-10">
          <Tagline>Yolculuğunuzu Başlatın</Tagline>
          <h2
            className="text-3xl md:text-4xl font-bold animate-float"
            style={{ animationDuration: "5s" }}
          >
            Tüm İngilizce Becerilerinde Tek Platformda Ustalaşın
          </h2>
          <p className="text-muted-foreground max-w-[42rem] mx-auto">
            Kapsamlı AI destekli dil koçumuz ile okuma, yazma, dinleme, konuşma,
            kelime ve gramer becerilerini geliştiren binlerce öğrenciye katılın.
          </p>
          <div className="flex justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-8 py-3 text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform animate-pulse-glow"
                style={{ animationDuration: "3s" }}
              >
                Hemen Öğrenmeye Başla
              </Button>
            </Link>
          </div>

          {/* Decorative background elements */}
          <div className="absolute -z-10 pointer-events-none inset-0 opacity-20">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-10 rounded-full blur-3xl animate-pulse-glow"
              style={{ animationDuration: "10s" }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterTr />
    </div>
  );
}
