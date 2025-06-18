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
    }

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No session token found" },
        { status: 400 }
      );
    }

    // Terminate the session
    const terminated = await terminateSession(
      sessionToken,
      reason as "logout" | "concurrent_login" | "expired" | "forced"
    );

    if (terminated) {
      return NextResponse.json({
        success: true,
        message: "Session terminated successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to terminate session" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in logout API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
