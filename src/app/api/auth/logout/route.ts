import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { terminateSession } from "@/lib/session-manager";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.sessionToken) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 400 }
      );
    }

    // Terminate the session
    const terminated = await terminateSession(
      session.user.sessionToken,
      "logout"
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
