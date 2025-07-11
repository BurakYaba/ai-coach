import { Resend } from "resend";
import {
  getEmailVerificationTemplate,
  getPasswordResetTemplate,
  logEmailDelivery,
} from "./email";
import { formatPracticeTimeWithDetails } from "@/lib/formatting/display-formatters";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send email verification using Resend
export const sendEmailVerificationResend = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
    const template = getEmailVerificationTemplate(name, verificationUrl);

    const { data, error } = await resend.emails.send({
      from: "Fluenta Support <noreply@fluenta-ai.com>",
      to: [email],
      subject: template.subject,
      html: template.html,
      text: template.text,
      headers: {
        "X-Entity-Ref-ID": verificationToken,
      },
    });

    if (error) {
      console.error("Resend email verification error:", error);
      await logEmailDelivery(
        "email_verification_resend",
        email,
        "",
        false,
        error.message
      );

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("Email verification sent via Resend:", data?.id);
    await logEmailDelivery(
      "email_verification_resend",
      email,
      data?.id || "",
      true
    );

    return {
      success: true,
      messageId: data?.id,
      provider: "resend",
    };
  } catch (error) {
    console.error("Error sending email verification via Resend:", error);
    await logEmailDelivery(
      "email_verification_resend",
      email,
      "",
      false,
      error instanceof Error ? error.message : "Unknown error"
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Send password reset email using Resend
export const sendPasswordResetEmailResend = async (
  email: string,
  name: string,
  resetToken: string
) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    const template = getPasswordResetTemplate(name, resetUrl);

    const { data, error } = await resend.emails.send({
      from: "Fluenta Support <noreply@fluenta-ai.com>",
      to: [email],
      subject: template.subject,
      html: template.html,
      text: template.text,
      headers: {
        "X-Entity-Ref-ID": resetToken,
      },
    });

    if (error) {
      console.error("Resend password reset error:", error);
      await logEmailDelivery(
        "password_reset_resend",
        email,
        "",
        false,
        error.message
      );

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("Password reset email sent via Resend:", data?.id);
    await logEmailDelivery(
      "password_reset_resend",
      email,
      data?.id || "",
      true
    );

    return {
      success: true,
      messageId: data?.id,
      provider: "resend",
    };
  } catch (error) {
    console.error("Error sending password reset via Resend:", error);
    await logEmailDelivery(
      "password_reset_resend",
      email,
      "",
      false,
      error instanceof Error ? error.message : "Unknown error"
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Send study reminder email using Resend
export const sendStudyReminderEmailResend = async (
  email: string,
  name: string,
  studyGoal: number,
  preferredTime: string,
  streakCount: number = 0
) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const subject =
      streakCount > 0
        ? `Don't break your ${streakCount}-day streak! Time to study 🔥`
        : `Time for your daily English study session! 📚`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Study Reminder - Fluenta AI</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" width="600" style="background-color: white; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🎯 Study Time, ${name}!</h1>
                    ${streakCount > 0 ? `<div style="background: #ff6b6b; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 10px 0;">🔥 ${streakCount} Day Streak!</div>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="color: #333;">It's time for your ${formatPracticeTimeWithDetails(preferredTime)} study session!</h2>
                    <div style="background: #4ecdc4; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0;">📚 Today's Goal: ${studyGoal} minutes</div>
                    
                    <p>Ready to continue your English learning journey?</p>
                    
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" 
                             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Start Learning Now →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Fluenta AI <notifications@fluenta-ai.com>",
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend study reminder error:", error);
      return { success: false, error: error.message };
    }

    console.log("Study reminder sent via Resend:", data?.id);
    return { success: true, messageId: data?.id, provider: "resend" };
  } catch (error) {
    console.error("Error sending study reminder via Resend:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test Resend configuration
export const testResendConnection = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: "RESEND_API_KEY not configured",
      };
    }

    // Test with a simple API call to validate the key
    const { data, error } = await resend.emails.send({
      from: "Fluenta Support <noreply@fluenta-ai.com>",
      to: ["test@resend.dev"], // Resend test email
      subject: "Connection Test",
      html: "<p>Testing Resend connection</p>",
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Resend configuration is working",
      messageId: data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
