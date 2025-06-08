import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// List of paths that require subscription
const SUBSCRIPTION_PROTECTED_PATHS = [
  "/dashboard",
  "/grammar",
  "/reading",
  "/speaking",
  "/listening",
  "/writing",
  "/vocabulary",
];

// List of paths that require authentication
const AUTH_PROTECTED_PATHS = [
  ...SUBSCRIPTION_PROTECTED_PATHS,
  "/profile",
  "/school-admin",
  "/admin",
  "/onboarding",
];

// List of paths that expired individual users can still access for subscription management
const SUBSCRIPTION_MANAGEMENT_PATHS = ["/pricing", "/profile"];

// List of paths that require school admin role
const SCHOOL_ADMIN_PATHS = ["/school-admin"];

// List of paths that require system admin role
const ADMIN_PATHS = ["/admin"];

// List of public paths accessible without authentication
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
  "/api/payments/webhook",
];

// List of paths that should skip onboarding check
const ONBOARDING_EXEMPT_PATHS = [
  "/onboarding",
  "/api/onboarding",
  "/api/auth",
  "/api/user/profile",
  "/api/user/settings",
  "/login",
  "/register",
  "/pricing",
  "/profile",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected API route
  const isApiRoute = pathname.startsWith("/api/");
  const isAuthApiRoute = isApiRoute && !pathname.startsWith("/api/auth/");
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

  // Skip middleware for public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for internal API key for server-to-server authentication
  const internalApiKey = request.headers.get("X-Internal-Api-Key");
  const expectedApiKey = process.env.NEXTAUTH_SECRET || "internal-api-key";

  // If this is an internal API call with the correct key, allow it through
  if (isApiRoute && internalApiKey === expectedApiKey) {
    return NextResponse.next();
  }

  // Get the token and verify authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Handle authentication for protected paths
  const isAuthProtected = AUTH_PROTECTED_PATHS.some(path =>
    pathname.startsWith(path)
  );

  if (isAuthProtected || isAuthApiRoute) {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // Check for onboarding completion for authenticated users
    const isOnboardingExempt = ONBOARDING_EXEMPT_PATHS.some(path =>
      pathname.startsWith(path)
    );

    if (!isOnboardingExempt && isAuthenticated) {
      // Check if user has completed onboarding
      const onboardingCompleted = token.onboardingCompleted as boolean;
      const userRole = (token.role as string) || "user";

      // Only redirect regular users to onboarding (not admins or school admins)
      if (!onboardingCompleted && userRole === "user") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    // Check for role-based access
    const userRole = (token.role as string) || "user";

    // Handle school admin routes
    const isSchoolAdminPath = SCHOOL_ADMIN_PATHS.some(path =>
      pathname.startsWith(path)
    );
    if (
      isSchoolAdminPath &&
      userRole !== "school_admin" &&
      userRole !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Handle admin routes
    const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path));
    if (isAdminPath && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Add additional subscription check for regular users
    const isSubscriptionProtected = SUBSCRIPTION_PROTECTED_PATHS.some(path =>
      pathname.startsWith(path)
    );

    if (isSubscriptionProtected && userRole === "user") {
      // Check for refresh_token parameter - if present, allow temporary access for JWT refresh
      const url = new URL(request.url);
      const hasRefreshToken = url.searchParams.get("refresh_token") === "true";
      const hasSuccessParam = url.searchParams.get("success") === "true";

      // Allow access if refresh_token is present OR if this looks like a post-payment redirect
      if (hasRefreshToken || hasSuccessParam) {
        // Allow access temporarily while JWT refresh happens on client-side
        return NextResponse.next();
      }

      // Check token for subscription status and expiry
      const subscriptionStatus = token.subscriptionStatus as string;
      const subscriptionExpiry = token.subscriptionExpiry as string | undefined;
      const userSchool = token.school as string | null;

      // If subscription is explicitly expired or if end date has passed
      const isExpired =
        subscriptionStatus === "expired" ||
        (subscriptionExpiry && new Date(subscriptionExpiry) < new Date());

      if (isExpired) {
        // Check if this is an individual user (no school) vs school user
        const isIndividualUser = !userSchool;

        if (isIndividualUser) {
          // For individual users, redirect to pricing page to allow subscription
          const url = new URL("/pricing", request.url);
          url.searchParams.set("expired", "true");
          return NextResponse.redirect(url);
        } else {
          // For school users, redirect to login with expired message
          const url = new URL("/login", request.url);
          url.searchParams.set("error", "SubscriptionExpired");
          return NextResponse.redirect(url);
        }
      }
    }

    // Allow expired individual users to access subscription management pages
    const isSubscriptionManagement = SUBSCRIPTION_MANAGEMENT_PATHS.some(path =>
      pathname.startsWith(path)
    );

    if (isSubscriptionManagement && userRole === "user") {
      const subscriptionStatus = token.subscriptionStatus as string;
      const subscriptionExpiry = token.subscriptionExpiry as string | undefined;
      const userSchool = token.school as string | null;
      const isIndividualUser = !userSchool;

      // Allow access for individual users even if expired (they can manage their subscription)
      // Block access for expired school users (they should contact admin)
      const isExpired =
        subscriptionStatus === "expired" ||
        (subscriptionExpiry && new Date(subscriptionExpiry) < new Date());

      if (isExpired && !isIndividualUser) {
        // School users with expired subscription should contact admin
        const url = new URL("/login", request.url);
        url.searchParams.set("error", "SubscriptionExpired");
        return NextResponse.redirect(url);
      }
    }

    // Allow payment API access for authenticated users (needed for subscription management)
    if (
      pathname.startsWith("/api/payments/") &&
      pathname !== "/api/payments/webhook"
    ) {
      // Already authenticated, allow access to payment APIs
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. All paths that start with: _next, static, images, favicon.ico, sw.js, robots.txt, manifest.json, etc.
     * 2. All public files in the public directory
     */
    "/((?!_next/|static/|public/|images/|img/|favicon.ico|sw.js|workbox-|robots.txt|manifest.json|sitemap.xml).*)",
  ],
};
