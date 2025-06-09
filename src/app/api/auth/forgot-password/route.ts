import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

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
      // For security, we return success even if user doesn't exist
      // This prevents email enumeration attacks
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, we have sent a password reset link.",
        },
        { status: 200 }
      );
    }

    // Generate password reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken
    );

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, we have sent a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
