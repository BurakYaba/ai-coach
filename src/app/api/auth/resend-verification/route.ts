import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendEmailVerification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if email exists
      return NextResponse.json(
        {
          message:
            "If this email is registered, a verification email has been sent.",
        },
        { status: 200 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const emailVerificationToken = randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await sendEmailVerification(
      user.email,
      user.name,
      emailVerificationToken
    );

    if (emailResult.success) {
      return NextResponse.json(
        {
          message:
            "Verification email sent successfully. Please check your inbox.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
