import { useState, useEffect } from "react";
import {
  detectPreferredLanguage,
  GeolocationData,
} from "@/lib/language-detection";

export type Language = "tr" | "en";

interface UseLanguageDetectionOptions {
  fallbackLanguage?: Language;
  enableGeolocation?: boolean;
}

interface UseLanguageDetectionReturn {
  language: Language;
  isLoading: boolean;
  error: string | null;
  setLanguage: (lang: Language) => void;
}

/**
 * React hook for detecting user's preferred language
 * @param options - Configuration options
 * @returns Language detection state and controls
 */
export function useLanguageDetection(
  options: UseLanguageDetectionOptions = {}
): UseLanguageDetectionReturn {
  const { fallbackLanguage = "en", enableGeolocation = true } = options;

  const [language, setLanguage] = useState<Language>(fallbackLanguage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectLanguage() {
      try {
        setIsLoading(true);
        setError(null);

        // First, check if user has a saved language preference
        const savedLanguage = localStorage.getItem(
          "fluenta-language"
        ) as Language;
        if (
          savedLanguage &&
          (savedLanguage === "tr" || savedLanguage === "en")
        ) {
          setLanguage(savedLanguage);
          setIsLoading(false);
          return;
        }

        // Check browser language preference
        const browserLanguage = navigator.language.toLowerCase();
        if (browserLanguage.startsWith("tr")) {
          setLanguage("tr");
          setIsLoading(false);
          return;
        }

        // If geolocation is enabled, try to detect country
        if (enableGeolocation) {
          try {
            // Try to get geolocation data from the server
            const response = await fetch("/api/geolocation");
            if (response.ok) {
              const geoData: GeolocationData = await response.json();
              const detectedLanguage = detectPreferredLanguage(geoData);
              setLanguage(detectedLanguage);
            } else {
              // Fallback to browser language or default
              setLanguage(fallbackLanguage);
            }
          } catch (geoError) {
            console.warn("Geolocation detection failed:", geoError);
            setLanguage(fallbackLanguage);
          }
        } else {
          setLanguage(fallbackLanguage);
        }
      } catch (err) {
        console.error("Language detection error:", err);
        setError(
          err instanceof Error ? err.message : "Language detection failed"
        );
        setLanguage(fallbackLanguage);
      } finally {
        setIsLoading(false);
      }
    }

    detectLanguage();
  }, [fallbackLanguage, enableGeolocation]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // Save to localStorage for future visits
    localStorage.setItem("fluenta-language", lang);
  };

  return {
    language,
    isLoading,
    error,
    setLanguage: handleSetLanguage,
  };
}

/**
 * Get the current language from URL or localStorage
 * @returns Current language or fallback
 */
export function getCurrentLanguage(): Language {
  // Check URL first
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/en")) {
      return "en";
    }
    if (pathname.startsWith("/tr")) {
      return "tr";
    }

    // Check localStorage
    const savedLanguage = localStorage.getItem("fluenta-language") as Language;
    if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
      return savedLanguage;
    }
  }

  return "en"; // Default fallback
}
