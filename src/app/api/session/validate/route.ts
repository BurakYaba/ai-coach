import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import {
  validateSession,
  forceLogoutUser,
  getUserSessionHistory,
  parseDeviceInfo,
} from "@/lib/session-manager";

export async function GET(request: NextRequest) {
  try {
    // Get the JWT token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sessionToken) {
      return NextResponse.json(
        { isValid: false, error: "No session token found" },
        { status: 401 }
      );
    }

    // Get device fingerprint from client-side detection
    const clientDeviceFingerprint = request.headers.get("X-Device-Fingerprint");
    let enhancedDeviceInfo = null;

    if (clientDeviceFingerprint) {
      try {
        const clientInfo = JSON.parse(clientDeviceFingerprint);
        // Combine server-side and client-side device info
        const serverDeviceInfo = parseDeviceInfo(request);

        enhancedDeviceInfo = {
          ...serverDeviceInfo,
          browser: clientInfo.browser || serverDeviceInfo.browser,
          screen: clientInfo.screen,
          timezone: clientInfo.timezone,
          language: clientInfo.language,
          platform: clientInfo.platform,
        };
      } catch (e) {
        console.warn("Failed to parse client device fingerprint");
      }
    }

    // Validate the session
    const sessionValidation = await validateSession(
      token.sessionToken as string
    );

    if (!sessionValidation.isValid) {
      return NextResponse.json(
        {
          isValid: false,
          error: "Session is no longer valid",
          reason: "session_terminated",
        },
        { status: 401 }
      );
    }

    // Get session history if requested
    const includeHistory =
      request.nextUrl.searchParams.get("history") === "true";
    let sessionHistory = [];

    if (includeHistory && sessionValidation.userId) {
      sessionHistory = await getUserSessionHistory(sessionValidation.userId, 5);
    }

    return NextResponse.json({
      isValid: true,
      userId: sessionValidation.userId,
      sessionHistory: includeHistory ? sessionHistory : undefined,
      deviceInfo: enhancedDeviceInfo,
    });
  } catch (error) {
    console.error("Session validation API error:", error);
    return NextResponse.json(
      {
        isValid: false,
        error: "Internal server error during session validation",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "force_logout": {
        // Force logout from all devices (admin or self-service)
        const loggedOutCount = await forceLogoutUser(session.user.id);
        return NextResponse.json({
          success: true,
          message: `Logged out from ${loggedOutCount} device(s)`,
          loggedOutCount,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in session validate POST API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
