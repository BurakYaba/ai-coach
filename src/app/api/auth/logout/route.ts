import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { terminateSession } from "@/lib/session-manager";

export async function POST(request: NextRequest) {
  try {
    // Try to get session from NextAuth
    const session = await getServerSession(authOptions);

    // For browser close scenarios, we might not have a full session
    // so also check the request body for sessionToken
    let sessionToken = session?.user?.sessionToken;
    let reason = "logout";

    try {
      const body = await request.json();
      if (body.sessionToken) {
        sessionToken = body.sessionToken;
      }
      if (body.reason) {
        reason = body.reason;
      }
    } catch (error) {
      // Body parsing failed, continue with session-based approach
      console.warn("Failed to parse logout request body:", error);
    }

    // Enhanced validation and logging
    if (!sessionToken) {
      console.warn("Logout attempt without session token", {
        hasSession: !!session,
        sessionUserId: session?.user?.id,
        userAgent: request.headers.get("user-agent"),
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
      });

      return NextResponse.json(
        { error: "No session token found" },
        { status: 400 }
      );
    }

    console.log(
      `Attempting to terminate session: ${sessionToken.substring(0, 8)}... for reason: ${reason}`
    );

    // Terminate the session
    const terminated = await terminateSession(
      sessionToken,
      reason as "logout" | "concurrent_login" | "expired" | "forced"
    );

    if (terminated) {
      console.log(
        `Session terminated successfully: ${sessionToken.substring(0, 8)}...`
      );
      return NextResponse.json({
        success: true,
        message: "Session terminated successfully",
      });
    } else {
      console.warn(
        `Failed to terminate session - session not found: ${sessionToken.substring(0, 8)}...`
      );
      // Return success even if session wasn't found (idempotent operation)
      // This prevents 500 errors when browser close detection tries to logout already-terminated sessions
      return NextResponse.json({
        success: true,
        message: "Session already terminated or not found",
      });
    }
  } catch (error) {
    console.error("Error in logout API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
