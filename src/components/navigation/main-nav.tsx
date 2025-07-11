"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MainNavProps {
  currentPath?: string;
  language?: "tr" | "en";
}

export function MainNav({ currentPath = "/", language = "tr" }: MainNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation links based on language
  const navLinks =
    language === "tr"
      ? [
          { href: "/moduller", label: "Modüller" },
          { href: "/#features", label: "Özellikler" },
          { href: "/blog", label: "Blog" },
          { href: "/basari-hikayeleri", label: "Başarı Hikayeleri" },
          { href: "/sss", label: "SSS" },
          { href: "/#pricing", label: "Fiyatlandırma" },
        ]
      : [
          { href: "/en/modules", label: "Modules" },
          { href: "/en#features", label: "Features" },
          { href: "/en/blog", label: "Blog" },
          { href: "/en/success-stories", label: "Success Stories" },
          { href: "/en/faq", label: "FAQ" },
          { href: "/en#pricing", label: "Pricing" },
        ];

  const homeLink = language === "tr" ? "/" : "/en";
  const otherLanguageLink = language === "tr" ? "/en" : "/";
  const otherLanguageLabel = language === "tr" ? "EN" : "TR";
  const currentLanguageLabel = language === "tr" ? "TR" : "EN";

  // Auth button labels
  const loginLabel = language === "tr" ? "Giriş Yap" : "Login";
  const startLabel = language === "tr" ? "Başla" : "Get Started";

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg backdrop-blur supports-[backdrop-filter]:bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
              <Image
                src="/favicon.svg"
                alt="Fluenta"
                width={20}
                height={20}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </div>
            <Link
              href={homeLink}
              className="font-bold text-lg sm:text-xl text-white"
            >
              Fluenta
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:scale-105 transform ${
                  currentPath === link.href
                    ? "text-white bg-white/20 px-2 py-1 rounded"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Language + Auth + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href={otherLanguageLink}
                className="px-2 py-1 rounded text-xs sm:text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {otherLanguageLabel}
              </Link>
              <span className="text-white/50 text-xs sm:text-sm">|</span>
              <Link
                href={homeLink}
                className="px-2 py-1 rounded text-xs sm:text-sm font-medium text-white bg-white/20 transition-all duration-200"
              >
                {currentLanguageLabel}
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-105 transform text-sm px-3 py-2"
                >
                  {loginLabel}
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-3 sm:px-4 py-2 text-sm transition-all duration-200 hover:scale-105 transform shadow-lg"
                >
                  {startLabel}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
              aria-label={
                language === "tr"
                  ? "Mobil menüyü aç/kapat"
                  : "Toggle mobile menu"
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    currentPath === link.href
                      ? "text-white bg-white/20"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-white/20 space-y-2">
                <Link href="/login" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {loginLabel}
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-all duration-200 shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {startLabel}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
