import { NextRequest, NextResponse } from "next/server";
import { testEmailConnection, sendPasswordResetEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Test the email connection
    const connectionTest = await testEmailConnection();

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Email connection failed",
          details: connectionTest.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email configuration is working",
      config: {
        provider: process.env.EMAIL_PROVIDER || "gmail",
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT || "587",
        username: process.env.EMAIL_USERNAME ? "configured" : "missing",
        password: process.env.EMAIL_PASSWORD ? "configured" : "missing",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Send a test email
    const result = await sendPasswordResetEmail(
      email,
      "Test User",
      "test-token-123"
    );

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "Test email sent successfully"
        : "Failed to send test email",
      error: result.error || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
