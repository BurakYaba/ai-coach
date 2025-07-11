import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// List of paths that should skip geolocation-based language detection
const LANGUAGE_DETECTION_EXEMPT_PATHS = [
  "/en",
  "/tr",
  "/api",
  "/dashboard",
  "/login",
  "/register",
  "/admin",
  "/school-admin",
  "/pricing",
  "/profile",
  "/verify-email", // Add email verification
  "/reset-password", // Add password reset
  "/forgot-password", // Add forgot password
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
];

// Paths that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/profile",
  "/settings",
  "/subscription",
];

// Paths that require completed onboarding
const ONBOARDING_REQUIRED_PATHS = [
  "/dashboard",
  "/profile",
  "/settings",
  "/subscription",
];

// Admin-only paths
const ADMIN_PATHS = ["/admin"];

// School admin paths
const SCHOOL_ADMIN_PATHS = ["/school-admin"];

// Subscription-protected paths (premium features)
const SUBSCRIPTION_PROTECTED_PATHS = [
  "/dashboard/speaking",
  "/dashboard/writing",
  "/dashboard/listening",
  "/dashboard/reading",
  "/dashboard/vocabulary",
  "/dashboard/grammar",
  "/dashboard/games",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files (images, scripts, stylesheets, etc.)
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/sounds/") ||
    pathname.includes("/api/og/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  // Skip middleware for API routes except authentication-related ones
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Handle legacy URL redirects first (before other processing)
  if (pathname === "/gizlilik") {
    return NextResponse.redirect(new URL("/gizlilik-politikasi", req.url));
  }

  // Redirect missing Turkish blog posts to Turkish equivalents
  if (pathname === "/blog/english-conversation-practice-app") {
    return NextResponse.redirect(
      new URL("/blog/ingilizce-konusma-pratigi-uygulamalari", req.url)
    );
  }

  if (pathname === "/blog/ai-english-conversation-practice") {
    return NextResponse.redirect(
      new URL("/blog/ai-ingilizce-konusma-pratiği", req.url)
    );
  }

  // Enhanced geolocation detection with better error handling
  const getCountryCode = (request: NextRequest): string | null => {
    try {
      // Skip geolocation for localhost development
      const host = request.headers.get("host") || "";
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        return null; // Skip geolocation redirects for localhost
      }

      // Check for bot traffic patterns that shouldn't be redirected
      const userAgent = request.headers.get("user-agent") || "";
      const isBotTraffic =
        /bot|crawl|spider|scraper|facebook|twitter|linkedin/i.test(userAgent);

      if (isBotTraffic) {
        return null;
      }

      // Production geolocation detection with validation
      const cfCountry = request.headers.get("cf-ipcountry");
      const vercelCountry = request.headers.get("x-vercel-ip-country");
      const forwardedCountry = request.headers.get("x-forwarded-country");

      // Validate country codes (should be 2-letter ISO codes)
      const isValidCountryCode = (code: string | null): boolean => {
        return (
          code !== null &&
          code.length === 2 &&
          /^[A-Z]{2}$/.test(code) &&
          code !== "XX"
        ); // Common placeholder for unknown
      };

      const country = [cfCountry, vercelCountry, forwardedCountry].find(code =>
        isValidCountryCode(code)
      );

      // Only return country if we have a valid code, otherwise let user stay on current path
      return country || null;
    } catch (error) {
      console.error("Middleware: Error in geolocation detection:", error);
      return null; // Fail gracefully
    }
  };

  // Check if path should skip language detection
  const shouldSkipLanguageDetection = LANGUAGE_DETECTION_EXEMPT_PATHS.some(
    exemptPath => pathname.startsWith(exemptPath)
  );

  // Language detection for root path and non-exempt paths (production only)
  if (!shouldSkipLanguageDetection && (pathname === "/" || pathname === "")) {
    try {
      const countryCode = getCountryCode(req);

      // Enhanced language detection with Accept-Language fallback
      if (!countryCode) {
        // Try to use Accept-Language header as fallback
        const acceptLanguage = req.headers.get("accept-language") || "";
        const hasTurkish = /tr|turkish/i.test(acceptLanguage);

        // If no Turkish preference detected, redirect to English
        if (!hasTurkish && acceptLanguage) {
          const redirectUrl = new URL("/en", req.url);
          return NextResponse.redirect(redirectUrl);
        }
        // Otherwise, let Turkish users stay at root
        return NextResponse.next();
      }

      // Only redirect non-Turkish users to /en, Turkish users stay at root
      if (countryCode !== "TR") {
        const redirectUrl = new URL("/en", req.url);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error("Middleware: Error in language detection:", error);
      // Fail gracefully - let user stay at current path
      return NextResponse.next();
    }
  }

  // Early return for non-authenticated requests to protected paths
  const isProtectedPath = PROTECTED_PATHS.some(path =>
    pathname.startsWith(path)
  );
  const isOnboardingRequiredPath = ONBOARDING_REQUIRED_PATHS.some(path =>
    pathname.startsWith(path)
  );

  // Only check authentication for protected paths
  if (isProtectedPath) {
    const token = await getToken({
      req: req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthenticated = !!token;

    // Redirect unauthenticated users from protected paths
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check onboarding completion for authenticated users
    if (isAuthenticated && isOnboardingRequiredPath) {
      const onboardingCompleted = token.onboardingCompleted as boolean;

      // If user hasn't completed onboarding and is trying to access protected paths
      if (!onboardingCompleted) {
        // Allow access and let the onboarding page handle the redirect
        // This prevents infinite redirects when JWT token is stale
        return NextResponse.next();
      }
    }

    // Role-based access control
    if (isAuthenticated) {
      const userRole = (token.role as string) || "user";

      if (SCHOOL_ADMIN_PATHS.some(path => pathname.startsWith(path))) {
        if (userRole !== "school_admin" && userRole !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
        if (userRole !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      // Add subscription check for regular users
      const isSubscriptionProtected = SUBSCRIPTION_PROTECTED_PATHS.some(path =>
        pathname.startsWith(path)
      );

      if (isSubscriptionProtected && userRole === "user") {
        const subscriptionStatus = token.subscriptionStatus as string;
        const isExpiredUser = token.isExpiredUser as boolean;

        // Allow access for non-expired active subscribers
        if (subscriptionStatus !== "active" || isExpiredUser) {
          return NextResponse.redirect(new URL("/dashboard/expired", req.url));
        }
      }
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match only the paths that need middleware processing:
     * 1. Dashboard and protected routes
     * 2. Admin routes
     * 3. Auth routes
     * 4. Root path for language detection
     * 5. Exclude all static assets and API routes that don't need auth
     */
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
    "/school-admin/:path*",
    "/login",
    "/register",
    "/onboarding",
    "/profile",
    "/settings",
    "/subscription",
    "/pricing",
    "/api/auth/:path*",
  ],
};
