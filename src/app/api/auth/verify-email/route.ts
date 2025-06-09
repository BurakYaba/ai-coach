import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Force dynamic rendering since we use request.url
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user by verification token and check if token hasn't expired
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }, // Token hasn't expired
    });

    if (!user) {
      // Check if this token was recently used (within last 5 minutes)
      // This handles double-clicks or page refreshes
      const recentlyVerified = await User.findOne({
        emailVerified: true,
        emailVerificationExpires: {
          $gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
        $or: [
          { emailVerificationToken: { $exists: false } },
          { emailVerificationToken: null },
          { emailVerificationToken: "" },
        ],
      });

      if (recentlyVerified) {
        return NextResponse.json(
          {
            success: true,
            message: "Email is already verified! You can now log in.",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid or expired verification token. Please request a new verification email.",
        },
        { status: 400 }
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: true,
          message: "Email is already verified! You can now log in.",
        },
        { status: 200 }
      );
    }

    // Update user as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Return success JSON instead of redirect
    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully! You can now log in.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
      },
      { status: 500 }
    );
  }
}
