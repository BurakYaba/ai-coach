import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { forceLogoutUser, validateSession } from "@/lib/session-manager";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        {
          isValid: false,
          message: "No token found",
        },
        { status: 401 }
      );
    }

    // Database session validation
    if (!token.sessionToken) {
      // For old users without sessionTokens, accept the JWT as valid
      return NextResponse.json({
        isValid: true,
        userId: token.id,
        message: "Session valid (JWT only - legacy user)",
      });
    }

    try {
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

      return NextResponse.json({
        isValid: true,
        userId: token.id,
        message: "Session valid",
      });
    } catch (validationError: any) {
      console.error("Session validation error:", validationError);

      // For database connection errors, fall back to JWT validation
      if (
        validationError?.name === "MongoNetworkError" ||
        validationError?.name === "MongoServerError" ||
        validationError?.message?.includes("connection")
      ) {
        return NextResponse.json({
          isValid: true,
          userId: token.id,
          message: "Session valid (JWT fallback due to DB error)",
        });
      }

      // For session termination, return 401
      if (validationError.message?.includes("session_terminated")) {
        return NextResponse.json(
          {
            isValid: false,
            error: "Session is no longer valid",
            reason: "session_terminated",
          },
          { status: 401 }
        );
      }

      // For other validation errors, fall back to JWT validation
      return NextResponse.json({
        isValid: true,
        userId: token.id,
        message: "Session valid (JWT fallback)",
      });
    }
  } catch (error) {
    console.error("Session validation request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
