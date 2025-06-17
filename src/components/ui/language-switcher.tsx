"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine current language from pathname
  const getCurrentLanguage = (): string => {
    if (!pathname) return "en";
    if (pathname.startsWith("/en")) {
      return "en";
    }
    return "tr";
  };

  // Get the corresponding path for the other language
  const getLocalizedPath = (targetLang: string): string => {
    if (!pathname) return targetLang === "tr" ? "/" : "/en";

    const currentLang = getCurrentLanguage();

    if (currentLang === targetLang) {
      return pathname;
    }

    // Language path mappings
    const pathMappings: Record<string, Record<string, string>> = {
      // English to Turkish mappings
      en: {
        "/en": "/",
        "/en/about": "/hakkimizda",
        "/en/pricing": "/fiyatlandirma",
        "/en/faq": "/sss",
        "/en/blog": "/blog",
        "/en/blog/english-grammar-rules-common-mistakes":
          "/blog/ingilizce-gramer-rehberi",
      },
      // Turkish to English mappings
      tr: {
        "/": "/en",
        "/hakkimizda": "/en/about",
        "/fiyatlandirma": "/en/pricing",
        "/sss": "/en/faq",
        "/blog": "/en/blog",
        "/blog/ingilizce-gramer-rehberi":
          "/en/blog/english-grammar-rules-common-mistakes",
      },
    };

    // Get mapped path or fallback to root
    const mappedPath = pathMappings[currentLang]?.[pathname];
    if (mappedPath) {
      return mappedPath;
    }

    // Fallback logic
    if (targetLang === "tr") {
      // If switching to Turkish and no mapping found, go to Turkish home
      return "/";
    } else {
      // If switching to English and no mapping found, go to English home
      return "/en";
    }
  };

  const handleLanguageChange = (langCode: string) => {
    console.log(`Switching to ${langCode}`);
    const newPath = getLocalizedPath(langCode);
    console.log(`New path: ${newPath}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLang = getCurrentLanguage();
  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 hover:bg-white/10 focus:bg-white/10"
        onClick={() => {
          console.log("Language switcher clicked, current state:", isOpen);
          setIsOpen(!isOpen);
        }}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
        <span className="sm:hidden">{currentLanguage?.flag}</span>
        <ChevronDown
          className={`h-3 w-3 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[9999] py-1">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => {
                console.log(`Menu item clicked: ${language.code}`);
                handleLanguageChange(language.code);
              }}
              className={`w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center ${
                currentLang === language.code
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-900 dark:text-blue-100"
                  : ""
              }`}
            >
              <span className="mr-2">{language.flag}</span>
              <span className="flex-1 font-medium">{language.name}</span>
              {currentLang === language.code && (
                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple language switcher for inline use
export function SimpleLanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentLanguage = (): string => {
    if (!pathname) return "en";
    if (pathname.startsWith("/en")) {
      return "en";
    }
    return "tr";
  };

  const getOtherLanguagePath = (): { path: string; label: string } => {
    if (!pathname) return { path: "/en", label: "EN" };

    const currentLang = getCurrentLanguage();

    if (currentLang === "tr") {
      // Switch to English
      const pathMappings: Record<string, string> = {
        "/": "/en",
        "/hakkimizda": "/en/about",
        "/fiyatlandirma": "/en/pricing",
        "/sss": "/en/faq",
        "/blog": "/en/blog",
        "/blog/ai-ile-ingilizce-ogrenme":
          "/en/blog/ai-english-tutor-vs-human-teacher",
      };

      return {
        path: pathMappings[pathname] || "/en",
        label: "EN",
      };
    } else {
      // Switch to Turkish
      const pathMappings: Record<string, string> = {
        "/en": "/",
        "/en/about": "/hakkimizda",
        "/en/pricing": "/fiyatlandirma",
        "/en/faq": "/sss",
        "/en/blog": "/blog",
        "/en/blog/ai-english-tutor-vs-human-teacher":
          "/blog/ai-ile-ingilizce-ogrenme",
      };

      return {
        path: pathMappings[pathname] || "/",
        label: "TR",
      };
    }
  };

  const { path, label } = getOtherLanguagePath();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => router.push(path)}
    >
      <Globe className="h-4 w-4" />
      {label}
    </Button>
  );
}
