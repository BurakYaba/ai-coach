import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP
const createTransporter = () => {
  // Check if we're using GoDaddy email or Gmail
  const isGoDaddy =
    process.env.EMAIL_PROVIDER === "godaddy" ||
    process.env.EMAIL_HOST === "smtpout.secureserver.net";

  if (isGoDaddy) {
    // GoDaddy SMTP Configuration
    const port = parseInt(process.env.EMAIL_PORT || "465");
    const useSSL = port === 465;

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtpout.secureserver.net",
      port: port,
      secure: useSSL, // Use SSL for 465, TLS for 587
      auth: {
        user: process.env.EMAIL_USERNAME, // Your full email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
      tls: {
        // Handle certificate issues with GoDaddy
        rejectUnauthorized: false,
        ...(useSSL ? { ciphers: "SSLv3" } : {}),
      },
      // Additional options for better compatibility
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    });
  } else {
    // Gmail SMTP Configuration (fallback)
    return nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.GMAIL_USERNAME || process.env.EMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD || process.env.EMAIL_PASSWORD,
      },
    });
  }
};

// Email templates
const getEmailVerificationTemplate = (
  name: string,
  verificationUrl: string
) => {
  return {
    subject: "Verify your email address - Fluenta",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Fluenta!</h1>
        </div>
        <div style="padding: 30px; background-color: #f8f9fa;">
          <h2 style="color: #333;">Hi ${name},</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining Fluenta! Please verify your email address to complete your registration and start your language learning journey.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with Fluenta, you can safely ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            This verification link will expire in 24 hours.
          </p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Fluenta. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `
      Hi ${name},
      
      Welcome to Fluenta! Please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      If you didn't create an account with Fluenta, you can safely ignore this email.
      This verification link will expire in 24 hours.
      
      © 2024 Fluenta. All rights reserved.
    `,
  };
};

const getPasswordResetTemplate = (name: string, resetUrl: string) => {
  return {
    subject: "Reset your password - Fluenta",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 30px; background-color: #f8f9fa;">
          <h2 style="color: #333;">Hi ${name},</h2>
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password for your Fluenta account. If you didn't make this request, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">
            ${resetUrl}
          </p>
          <p style="color: #666; font-size: 14px;">
            This password reset link will expire in 1 hour for security purposes.
          </p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Fluenta. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `
      Hi ${name},
      
      We received a request to reset your password for your Fluenta account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      If you didn't make this request, you can safely ignore this email.
      This password reset link will expire in 1 hour for security purposes.
      
      © 2024 Fluenta. All rights reserved.
    `,
  };
};

// Send email verification
export const sendEmailVerification = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
    const template = getEmailVerificationTemplate(name, verificationUrl);

    const mailOptions = {
      from: `"Fluenta" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email verification sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email verification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    const template = getPasswordResetTemplate(name, resetUrl);

    const mailOptions = {
      from: `"Fluenta" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test email configuration
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return { success: true };
  } catch (error) {
    console.error("Email configuration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
