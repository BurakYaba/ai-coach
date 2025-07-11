import nodemailer from "nodemailer";
import { formatPracticeTimeWithDetails } from "@/lib/formatting/display-formatters";

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
export const getEmailVerificationTemplate = (
  name: string,
  verificationUrl: string
) => {
  return {
    subject: "Welcome to Fluenta! Complete your registration",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Fluenta - Complete Registration</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" width="600" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Fluenta!</h1>
                    <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your AI English Learning Assistant</p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}!</h2>
                    <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                      Thank you for joining Fluenta! We're excited to help you on your English learning journey. 
                      To get started, please complete your registration by clicking the button below.
                    </p>
                    
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding: 25px 0;">
                          <a href="${verificationUrl}" 
                             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                    color: white; 
                                    padding: 16px 32px; 
                                    text-decoration: none; 
                                    border-radius: 6px; 
                                    display: inline-block;
                                    font-weight: bold;
                                    font-size: 16px;
                                    text-align: center;">
                            Complete Registration
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #666; font-size: 14px; margin: 20px 0; line-height: 1.5;">
                      <strong>What's next?</strong> Once verified, you'll have access to:
                    </p>
                    <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0 0 20px 20px;">
                      <li>Personalized AI conversation practice</li>
                      <li>Interactive reading and listening exercises</li>
                      <li>Real-time pronunciation feedback</li>
                      <li>Progress tracking and achievements</li>
                    </ul>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0;">
                      <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>Security Notice:</strong> If you didn't create this account, please ignore this email. 
                        This verification link expires in 24 hours for your security.
                      </p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin: 20px 0 0 0;">
                      Need help? Reply to this email or visit our support center.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #333; padding: 30px; text-align: center;">
                    <p style="color: #999; margin: 0; font-size: 12px; line-height: 1.4;">
                      © 2024 Fluenta Learning Platform. All rights reserved.<br>
                      This email was sent because you signed up for Fluenta.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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

export const getPasswordResetTemplate = (name: string, resetUrl: string) => {
  return {
    subject: "Fluenta password reset request",
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
      from: `"Fluenta Support" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      // Enhanced headers for better deliverability
      headers: {
        "X-Mailer": "Fluenta Learning Platform",
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        "List-Unsubscribe": `<${process.env.NEXTAUTH_URL || "http://localhost:3000"}/unsubscribe>`,
        "Reply-To":
          process.env.EMAIL_USERNAME ||
          process.env.GMAIL_USERNAME ||
          "noreply@fluenta-ai.com",
      },
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email verification sent:", result.messageId);

    // Log delivery for monitoring
    await logEmailDelivery("email_verification", email, result.messageId, true);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email verification:", error);

    // Log delivery failure
    await logEmailDelivery(
      "email_verification",
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
      from: `"Fluenta Support" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      // Enhanced headers for better deliverability
      headers: {
        "X-Mailer": "Fluenta Learning Platform",
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        "List-Unsubscribe": `<${process.env.NEXTAUTH_URL || "http://localhost:3000"}/unsubscribe>`,
        "Reply-To":
          process.env.EMAIL_USERNAME ||
          process.env.GMAIL_USERNAME ||
          "noreply@fluenta-ai.com",
      },
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

// Send study reminder email
export const sendStudyReminderEmail = async (
  email: string,
  name: string,
  studyGoal: number,
  preferredTime: string,
  streakCount: number = 0
) => {
  try {
    const transporter = createTransporter();

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
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .streak { background: #ff6b6b; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 10px 0; }
          .goal { background: #4ecdc4; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Study Time, ${name}!</h1>
            ${streakCount > 0 ? `<div class="streak">🔥 ${streakCount} Day Streak!</div>` : ""}
          </div>
          <div class="content">
            <h2>It's time for your ${formatPracticeTimeWithDetails(preferredTime)} study session!</h2>
            <div class="goal">📚 Today's Goal: ${studyGoal} minutes</div>
            
            <p>Ready to continue your English learning journey? Your ${formatPracticeTimeWithDetails(preferredTime)} study time is here!</p>
            
            ${
              streakCount > 0
                ? `
              <p><strong>🔥 You're on fire!</strong> Don't let your ${streakCount}-day learning streak break. Just ${studyGoal} minutes today will keep you on track!</p>
            `
                : `
              <p>Consistency is key to language learning success. Just ${studyGoal} minutes of focused practice can make a real difference!</p>
            `
            }
            
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="button">
              Start Learning Now →
            </a>
            
            <h3>Quick Study Options:</h3>
            <ul>
              <li>📖 <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/reading">Reading Practice</a></li>
              <li>🎧 <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/listening">Listening Exercises</a></li>
              <li>💬 <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/speaking">Speaking Practice</a></li>
              <li>📝 <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/vocabulary">Vocabulary Review</a></li>
            </ul>
            
            <p><small>Don't want these reminders? <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings">Update your notification preferences</a>.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Study Time, ${name}!
      
      It's time for your ${formatPracticeTimeWithDetails(preferredTime)} study session!
      Today's Goal: ${studyGoal} minutes
      
      ${streakCount > 0 ? `🔥 You're on a ${streakCount}-day streak! Don't break it now.` : ""}
      
      Start learning: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard
      
      Update preferences: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings
    `;

    const mailOptions = {
      from: `"Fluenta AI" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Study reminder email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending study reminder email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Send weekly progress report email
export const sendWeeklyProgressEmail = async (
  email: string,
  name: string,
  progressData: {
    weeklyGoal: number;
    actualStudyTime: number;
    streakCount: number;
    completedSessions: number;
    strongestSkill: string;
    improvementArea: string;
    xpEarned: number;
    level: number;
    achievements: string[];
  }
) => {
  try {
    const transporter = createTransporter();
    const goalPercentage = Math.round(
      (progressData.actualStudyTime / progressData.weeklyGoal) * 100
    );

    const subject = `Your Weekly Progress Report - ${goalPercentage}% of goal achieved! 📊`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Progress Report - Fluenta AI</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .stat-number { font-size: 2em; font-weight: bold; color: #4ecdc4; }
          .stat-label { font-size: 0.9em; color: #666; }
          .progress-bar { background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
          .progress-fill { background: linear-gradient(90deg, #4ecdc4, #44a08d); height: 100%; transition: width 0.3s ease; }
          .achievement { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 5px 0; border-radius: 5px; }
          .button { display: inline-block; background: #4ecdc4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Progress Report</h1>
            <p>Hey ${name}! Here's how you did this week.</p>
          </div>
          <div class="content">
            <h2>Goal Achievement</h2>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(goalPercentage, 100)}%"></div>
            </div>
            <p><strong>${goalPercentage}%</strong> of your weekly goal (${progressData.actualStudyTime}/${progressData.weeklyGoal} minutes)</p>
            
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-number">${progressData.completedSessions}</div>
                <div class="stat-label">Sessions Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${progressData.streakCount}</div>
                <div class="stat-label">Day Streak</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${progressData.xpEarned}</div>
                <div class="stat-label">XP Earned</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${progressData.level}</div>
                <div class="stat-label">Current Level</div>
              </div>
            </div>
            
            <h3>📈 Your Progress</h3>
            <p><strong>Strongest Skill:</strong> ${progressData.strongestSkill}</p>
            <p><strong>Focus Area:</strong> ${progressData.improvementArea}</p>
            
            ${
              progressData.achievements.length > 0
                ? `
              <h3>🏆 New Achievements</h3>
              ${progressData.achievements.map(achievement => `<div class="achievement">🎉 ${achievement}</div>`).join("")}
            `
                : ""
            }
            
            <h3>💪 Keep Going!</h3>
            <p>${
              goalPercentage >= 100
                ? "Amazing work! You exceeded your goal this week. Keep up the fantastic momentum!"
                : goalPercentage >= 80
                  ? "Great progress! You're so close to your weekly goal. A little more practice and you'll nail it!"
                  : "Every step counts! Even small, consistent practice leads to big improvements over time."
            }</p>
            
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="button">
              Continue Learning →
            </a>
            
            <p><small>Want to adjust your goals or preferences? <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings">Update your settings</a>.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Weekly Progress Report - ${name}
      
      Goal Achievement: ${goalPercentage}% (${progressData.actualStudyTime}/${progressData.weeklyGoal} minutes)
      Sessions Completed: ${progressData.completedSessions}
      Current Streak: ${progressData.streakCount} days
      XP Earned: ${progressData.xpEarned}
      Current Level: ${progressData.level}
      
      Strongest Skill: ${progressData.strongestSkill}
      Focus Area: ${progressData.improvementArea}
      
      ${progressData.achievements.length > 0 ? `New Achievements: ${progressData.achievements.join(", ")}` : ""}
      
      Continue learning: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard
    `;

    const mailOptions = {
      from: `"Fluenta AI" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Weekly progress email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending weekly progress email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Send achievement notification email
export const sendAchievementEmail = async (
  email: string,
  name: string,
  achievement: {
    name: string;
    description: string;
    xpReward: number;
    category: string;
  }
) => {
  try {
    const transporter = createTransporter();

    const subject = `🏆 Achievement Unlocked: ${achievement.name}!`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Achievement Unlocked - Fluenta AI</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .achievement-card { background: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .achievement-icon { font-size: 4em; margin-bottom: 20px; }
          .achievement-name { font-size: 1.5em; font-weight: bold; color: #333; margin-bottom: 10px; }
          .achievement-desc { color: #666; margin-bottom: 20px; }
          .xp-reward { background: #4ecdc4; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; }
          .button { display: inline-block; background: #ffd700; color: #333; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations, ${name}!</h1>
            <p>You've unlocked a new achievement!</p>
          </div>
          <div class="content">
            <div class="achievement-card">
              <div class="achievement-icon">🏆</div>
              <div class="achievement-name">${achievement.name}</div>
              <div class="achievement-desc">${achievement.description}</div>
              <div class="xp-reward">+${achievement.xpReward} XP</div>
            </div>
            
            <p>Outstanding work! This ${achievement.category} achievement shows your dedication to learning English. Keep up the amazing progress!</p>
            
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/gamification" class="button">
              View All Achievements →
            </a>
            
            <p>Ready for your next challenge? Check out your dashboard to see what other achievements you can unlock!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      🏆 Achievement Unlocked: ${achievement.name}!
      
      Congratulations, ${name}!
      
      ${achievement.description}
      Reward: +${achievement.xpReward} XP
      
      View all achievements: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/gamification
    `;

    const mailOptions = {
      from: `"Fluenta AI" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Achievement email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending achievement email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Email deliverability testing and monitoring functions
export const checkEmailDeliverability = (emailContent: {
  subject: string;
  html: string;
  text: string;
}) => {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Subject line analysis
  const spamWords = [
    "verify",
    "click here",
    "urgent",
    "act now",
    "free",
    "limited time",
    "winner",
    "congratulations",
    "earn money",
    "get paid",
    "no cost",
  ];

  const subjectLower = emailContent.subject.toLowerCase();
  spamWords.forEach(word => {
    if (subjectLower.includes(word)) {
      warnings.push(`Subject contains potential spam word: "${word}"`);
    }
  });

  if (emailContent.subject.length > 60) {
    warnings.push("Subject line is longer than 60 characters");
  }

  if (
    emailContent.subject.includes("!!!!") ||
    emailContent.subject.includes("????")
  ) {
    issues.push("Subject contains excessive punctuation");
  }

  // Content analysis
  const htmlLinkCount = (emailContent.html.match(/href=/g) || []).length;
  if (htmlLinkCount > 10) {
    warnings.push(`High number of links detected: ${htmlLinkCount}`);
  }

  if (emailContent.html.includes("javascript:")) {
    issues.push("JavaScript links detected (security risk)");
  }

  // Text-to-HTML ratio
  const textLength = emailContent.text.length;
  const htmlLength = emailContent.html.replace(/<[^>]*>/g, "").length;
  const ratio = textLength / htmlLength;

  if (ratio < 0.1) {
    warnings.push("Low text-to-HTML ratio (add more text content)");
  }

  return {
    score: Math.max(0, 100 - issues.length * 20 - warnings.length * 5),
    issues,
    warnings,
    recommendations: [
      "Ensure SPF, DKIM, and DMARC records are configured",
      "Use a dedicated IP address for email sending",
      "Monitor sender reputation regularly",
      "Implement email list hygiene practices",
      "Test emails with spam checking tools",
    ],
  };
};

// Send test email with deliverability analysis
export const sendTestEmailWithAnalysis = async (
  email: string,
  name: string = "Test User",
  type: "verification" | "password_reset" = "verification"
) => {
  try {
    let template;
    const testToken = "test-token-" + Date.now();

    if (type === "verification") {
      const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email?token=${testToken}`;
      template = getEmailVerificationTemplate(name, verificationUrl);
    } else {
      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${testToken}`;
      template = getPasswordResetTemplate(name, resetUrl);
    }

    // Analyze deliverability
    const analysis = checkEmailDeliverability(template);

    // Send test email
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Fluenta Support" <${process.env.EMAIL_USERNAME || process.env.GMAIL_USERNAME}>`,
      to: email,
      subject: `[TEST] ${template.subject}`,
      html: template.html,
      text: template.text,
      headers: {
        "X-Mailer": "Fluenta Learning Platform",
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        "List-Unsubscribe": `<${process.env.NEXTAUTH_URL || "http://localhost:3000"}/unsubscribe>`,
        "Reply-To":
          process.env.EMAIL_USERNAME ||
          process.env.GMAIL_USERNAME ||
          "noreply@fluenta-ai.com",
      },
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
      deliverabilityAnalysis: analysis,
      testingInstructions: [
        "Check your inbox and spam folder",
        "Note delivery time",
        "Check sender reputation with Gmail/Outlook",
        "Test email rendering across different clients",
        "Test email deliverability at mail-tester.com",
      ],
    };
  } catch (error) {
    console.error("Error sending test email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Monitor email delivery metrics
export const logEmailDelivery = async (
  emailType: string,
  recipientEmail: string,
  messageId: string,
  success: boolean,
  error?: string
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    emailType,
    recipientEmail: recipientEmail.replace(/(.{2}).*(@.*)/, "$1***$2"), // Partially mask email for privacy
    messageId,
    success,
    error,
    provider: process.env.EMAIL_PROVIDER || "gmail",
  };

  // Log to console (in production, you'd want to log to a proper logging service)
  console.log("Email Delivery Log:", JSON.stringify(logEntry));

  // You could extend this to:
  // - Store in database for analytics
  // - Send to monitoring service (e.g., DataDog, New Relic)
  // - Trigger alerts for high failure rates

  return logEntry;
};

// Bulk email validation
export const validateEmailAddresses = (
  emails: string[]
): {
  valid: string[];
  invalid: string[];
  suspicious: string[];
} => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];
  const suspicious: string[] = [];

  // Common suspicious patterns
  const suspiciousPatterns = [
    /\+.*@/, // Plus signs (not inherently bad, but could indicate testing)
    /@(10minutemail|temp-mail|guerrillamail|mailinator)/i, // Temporary email services
    /@.*\.tk$/i, // .tk domains are often suspicious
    /^[a-z]+\d{4,}@/i, // Pattern like 'user12345@' often indicates fake accounts
  ];

  emails.forEach(email => {
    if (!emailRegex.test(email)) {
      invalid.push(email);
    } else if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      suspicious.push(email);
    } else {
      valid.push(email);
    }
  });

  return { valid, invalid, suspicious };
};
