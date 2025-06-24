import { randomBytes } from "crypto";
import { NextRequest } from "next/server";
import UserSession from "@/models/UserSession";
import dbConnect from "./db";

interface DeviceInfo {
  userAgent: string;
  ip: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browser: string;
  os: string;
  location?: {
    country?: string;
    city?: string;
  };
}

// Parse device information from request
export function parseDeviceInfo(request: NextRequest): DeviceInfo {
  const userAgent = request.headers.get("user-agent") || "Unknown";
  const ip = getClientIP(request);

  // Basic device type detection
  const deviceType = getDeviceType(userAgent);

  // Basic browser detection
  const browser = getBrowserName(userAgent);

  // Basic OS detection
  const os = getOperatingSystem(userAgent);

  return {
    userAgent,
    ip,
    deviceType,
    browser,
    os,
  };
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (real) {
    return real.trim();
  }

  if (cfIP) {
    return cfIP.trim();
  }

  return request.ip || "127.0.0.1";
}

// Detect device type from user agent
function getDeviceType(
  userAgent: string
): "desktop" | "mobile" | "tablet" | "unknown" {
  const ua = userAgent.toLowerCase();

  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    return "mobile";
  }

  if (ua.includes("tablet") || ua.includes("ipad")) {
    return "tablet";
  }

  if (
    ua.includes("windows") ||
    ua.includes("macintosh") ||
    ua.includes("linux")
  ) {
    return "desktop";
  }

  return "unknown";
}

// Extract browser name from user agent
function getBrowserName(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Check for Brave first - Brave includes "brave" in some user agents
  if (ua.includes("brave")) return "Brave";

  // Check for specific browser signatures
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("opera") || ua.includes("opr/")) return "Opera";
  if (ua.includes("msie") || ua.includes("trident")) return "Internet Explorer";

  // Chrome check last (since Brave also contains "chrome")
  if (ua.includes("chrome")) return "Chrome";

  return "Unknown";
}

// Extract operating system from user agent
function getOperatingSystem(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes("windows")) return "Windows";
  if (ua.includes("macintosh") || ua.includes("mac os")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";

  return "Unknown";
}

// Generate unique session token
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

// Create new user session (terminates existing ones)
export async function createUserSession(
  userId: string,
  deviceInfo: DeviceInfo,
  expiresAt: Date
): Promise<string> {
  await dbConnect();

  const sessionToken = generateSessionToken();

  try {
    const userSession = new UserSession({
      userId,
      sessionToken,
      deviceInfo,
      expiresAt,
      isActive: true,
    });

    await userSession.save(); // Pre-save middleware will terminate other sessions
    return sessionToken;
  } catch (error: any) {
    // Handle duplicate key error - this might be due to index issues
    if (error.code === 11000) {
      console.warn(
        "Duplicate key error in session creation, attempting cleanup and retry"
      );

      try {
        // First, force terminate all existing sessions for this user
        await UserSession.updateMany(
          { userId, isActive: true },
          {
            $set: {
              isActive: false,
              terminatedAt: new Date(),
              terminationReason: "concurrent_login",
            },
          }
        );

        // Generate a new token and try again
        const newSessionToken = generateSessionToken();
        const newUserSession = new UserSession({
          userId,
          sessionToken: newSessionToken,
          deviceInfo,
          expiresAt,
          isActive: true,
        });

        await newUserSession.save();
        return newSessionToken;
      } catch (retryError) {
        console.error(
          "Failed to create session even after cleanup:",
          retryError
        );
        // Return a fallback session token - the system will work without session tracking
        return generateSessionToken();
      }
    }

    // For other errors, log and return a fallback token
    console.error("Session creation error:", error);
    return generateSessionToken();
  }
}

// Validate session token
export async function validateSession(sessionToken: string): Promise<{
  isValid: boolean;
  userId?: string;
  session?: any;
}> {
  if (!sessionToken) {
    console.warn("validateSession called with empty sessionToken");
    return { isValid: false };
  }

  try {
    await dbConnect();

    const session = await UserSession.findOne({
      sessionToken,
      isActive: true,
    }).populate("userId");

    if (!session) {
      console.log(
        `Session not found or inactive: ${sessionToken.substring(0, 8)}...`
      );
      return { isValid: false };
    }

    // Check if session is still valid
    const isValid = session.isValidSession();

    if (!isValid) {
      console.log(
        `Session expired for token: ${sessionToken.substring(0, 8)}..., terminating`
      );
      // Terminate invalid session
      session.isActive = false;
      session.terminatedAt = new Date();
      session.terminationReason = "expired";
      await session.save();

      return { isValid: false };
    }

    // Update last activity
    await session.updateActivity();

    // Get the actual userId string - handle both populated and non-populated cases
    const userIdString =
      typeof session.userId === "string"
        ? session.userId
        : session.userId._id?.toString() || session.userId.toString();

    console.log(
      `Session valid for user: ${userIdString}, token: ${sessionToken.substring(0, 8)}...`
    );

    return {
      isValid: true,
      userId: userIdString,
      session,
    };
  } catch (error) {
    console.error("validateSession error:", error);
    return { isValid: false };
  }
}

// Terminate user session
export async function terminateSession(
  sessionToken: string,
  reason: "logout" | "concurrent_login" | "expired" | "forced" = "logout"
): Promise<boolean> {
  if (!sessionToken) {
    console.warn("terminateSession called with empty sessionToken");
    return false;
  }

  try {
    await dbConnect();

    const result = await UserSession.terminateSession(sessionToken, reason);

    if (result) {
      console.log(
        `Session terminated successfully: ${sessionToken.substring(0, 8)}..., reason: ${reason}`
      );
    } else {
      console.warn(
        `Session termination failed - session not found: ${sessionToken.substring(0, 8)}..., reason: ${reason}`
      );
    }

    return result;
  } catch (error) {
    console.error("terminateSession error:", error);
    return false;
  }
}

// Get active session for user
export async function getUserActiveSession(userId: string): Promise<any> {
  await dbConnect();

  return await UserSession.getActiveSession(userId);
}

// Check if user has concurrent login attempt
export async function checkConcurrentLogin(userId: string): Promise<{
  hasActiveSession: boolean;
  activeSession?: any;
}> {
  const activeSession = await getUserActiveSession(userId);

  return {
    hasActiveSession: !!activeSession,
    activeSession,
  };
}

// Clean up expired sessions (can be called by cron job)
export async function cleanupExpiredSessions(): Promise<number> {
  await dbConnect();

  return await UserSession.cleanupExpiredSessions();
}

// Force logout user from all devices
export async function forceLogoutUser(userId: string): Promise<number> {
  await dbConnect();

  const result = await UserSession.updateMany(
    { userId, isActive: true },
    {
      $set: {
        isActive: false,
        terminatedAt: new Date(),
        terminationReason: "forced",
      },
    }
  );

  // Trigger storage event to notify other tabs (browser-based only)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("force_logout", "true");
      // Clear it immediately so it can be set again if needed
      setTimeout(() => localStorage.removeItem("force_logout"), 100);
    } catch (error) {
      // Ignore localStorage errors
      console.warn("Could not trigger storage event for logout:", error);
    }
  }

  console.log(
    `Force logout completed for user ${userId}: ${result.modifiedCount} sessions terminated`
  );

  return result.modifiedCount;
}

// Clean up ALL sessions (for development/testing)
export async function forceCleanupAllSessions(): Promise<number> {
  await dbConnect();

  const result = await UserSession.updateMany(
    { isActive: true },
    {
      $set: {
        isActive: false,
        terminatedAt: new Date(),
        terminationReason: "forced",
      },
    }
  );

  return result.modifiedCount;
}

// Get user's session history
export async function getUserSessionHistory(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  await dbConnect();

  // Ensure userId is a proper string (handle any object passed in)
  const userIdString = typeof userId === "string" ? userId : String(userId);

  return await UserSession.find({ userId: userIdString })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select(
      "deviceInfo createdAt lastActivity isActive terminationReason terminatedAt"
    );
}

// Generate a more robust device fingerprint
export function generateDeviceFingerprint(deviceInfo: DeviceInfo): string {
  const components = [
    deviceInfo.browser,
    deviceInfo.os,
    deviceInfo.deviceType,
    deviceInfo.ip,
    // Add more distinguishing factors
    deviceInfo.userAgent.length.toString(),
    deviceInfo.userAgent.includes("Brave") ? "brave-detected" : "no-brave",
  ];

  return components.join("|");
}
