/**
 * Language detection utilities for geolocation-based language selection
 */

export interface GeolocationData {
  country?: string;
  region?: string;
  city?: string;
  ip?: string;
}

/**
 * Detect user's preferred language based on geolocation
 * @param geoData - Geolocation data from request
 * @returns The preferred language code ('tr' for Turkey, 'en' for others)
 */
export function detectPreferredLanguage(
  geoData?: GeolocationData
): "tr" | "en" {
  if (!geoData?.country) {
    // Default to English if no geolocation data is available
    return "en";
  }

  // Return Turkish for Turkey, English for all other countries
  return geoData.country === "TR" ? "tr" : "en";
}

/**
 * Get language-specific URL path
 * @param pathname - Current pathname
 * @param language - Target language
 * @returns Language-specific URL path
 */
export function getLanguagePath(
  pathname: string,
  language: "tr" | "en"
): string {
  // Remove existing language prefixes
  const cleanPath = pathname.replace(/^\/(tr|en)/, "");

  // Add language prefix
  return language === "tr" ? cleanPath : `/en${cleanPath}`;
}

/**
 * Check if a path should skip language detection
 * @param pathname - Current pathname
 * @returns True if language detection should be skipped
 */
export function shouldSkipLanguageDetection(pathname: string): boolean {
  const exemptPaths = [
    "/en",
    "/tr",
    "/api",
    "/dashboard",
    "/login",
    "/register",
    "/admin",
    "/school-admin",
    "/onboarding",
    "/pricing",
    "/profile",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.json",
  ];

  return exemptPaths.some(path => pathname.startsWith(path));
}

/**
 * Extract geolocation data from request headers
 * @param headers - Request headers
 * @returns Geolocation data
 */
export function extractGeolocationData(headers: Headers): GeolocationData {
  return {
    country:
      headers.get("cf-ipcountry") ||
      headers.get("x-vercel-ip-country") ||
      undefined,
    region:
      headers.get("cf-ipregion") ||
      headers.get("x-vercel-ip-region") ||
      undefined,
    city:
      headers.get("cf-ipcity") || headers.get("x-vercel-ip-city") || undefined,
    ip:
      headers.get("cf-connecting-ip") ||
      headers.get("x-forwarded-for") ||
      headers.get("x-real-ip") ||
      undefined,
  };
}
