import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { validateSession } from "@/lib/session-manager";
import { dbConnect } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token required" },
        { status: 400 }
      );
    }

    // First check if the NextAuth session is still valid
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    // Then validate the session token in the database
    await dbConnect();
    const sessionValidation = await validateSession(sessionToken);

    if (!sessionValidation.isValid) {
      return NextResponse.json({ error: "Session invalid" }, { status: 401 });
    }

    return NextResponse.json(
      {
        valid: true,
        userId: session.user.id,
        lastActivity: sessionValidation.session?.lastActivity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
