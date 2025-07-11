import { NextRequest, NextResponse } from "next/server";
import {
  testEmailConnection,
  sendPasswordResetEmail,
  sendTestEmailWithAnalysis,
  checkEmailDeliverability,
  getEmailVerificationTemplate,
} from "@/lib/email";

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

    // Test email deliverability for verification email
    const verificationTemplate = getEmailVerificationTemplate(
      "Test User",
      "https://fluenta-ai.com/verify-email?token=test-token"
    );

    const deliverabilityAnalysis =
      checkEmailDeliverability(verificationTemplate);

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
      deliverabilityAnalysis: {
        score: deliverabilityAnalysis.score,
        issues: deliverabilityAnalysis.issues,
        warnings: deliverabilityAnalysis.warnings,
        recommendations: deliverabilityAnalysis.recommendations,
      },
      nextSteps: [
        "Configure SPF record: v=spf1 include:secureserver.net ~all",
        "Enable DKIM signing in your hosting control panel",
        "Add DMARC policy for domain protection",
        "Test actual email delivery using POST endpoint",
        "Monitor sender reputation and delivery rates",
      ],
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
    const {
      email,
      type = "verification",
      advanced = false,
    } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (advanced) {
      // Use the advanced testing with deliverability analysis
      const result = await sendTestEmailWithAnalysis(
        email,
        "Test User",
        type as "verification" | "password_reset"
      );

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? "Advanced test email sent with deliverability analysis"
          : "Failed to send test email",
        messageId: result.messageId,
        deliverabilityAnalysis: result.deliverabilityAnalysis,
        testingInstructions: result.testingInstructions,
        error: result.error || null,
      });
    } else {
      // Legacy simple test
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
    }
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
