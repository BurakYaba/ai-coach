import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/db";
import { sendEmailVerification } from "@/lib/email";
import { sendEmailVerificationResend } from "@/lib/email-resend";

export async function POST(req: Request) {
  try {
    const { name, email, password, schoolCode, registrationType } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !registrationType ||
      !["individual", "school"].includes(registrationType)
    ) {
      return NextResponse.json(
        { error: "Invalid registration type" },
        { status: 400 }
      );
    }

    // School registration requires school code
    if (registrationType === "school" && !schoolCode) {
      return NextResponse.json(
        {
          error: "School registration code is required for school registration",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Import models dynamically to ensure proper registration
    const User = (await import("@/models/User")).default;
    const Branch = (await import("@/models/Branch")).default;
    const School = (await import("@/models/School")).default;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate email verification token
    const emailVerificationToken = randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Set up free subscription with 14-day expiration
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14); // 14 days from now

    // Create new user with default values
    const userData: any = {
      name,
      email,
      password,
      emailVerified: false, // Start with unverified email
      emailVerificationToken,
      emailVerificationExpires,
      learningPreferences: {
        topics: ["general"],
        dailyGoal: 30,
        preferredLearningTime: ["morning"],
      },
      subscription: {
        type: "free",
        status: "active",
        startDate,
        endDate,
      },
      onboarding: {
        completed: false,
        currentStep: 1,
        language: "en" as "en" | "tr",
        nativeLanguage: "",
        country: "",
        region: "",
        preferredPracticeTime: "",
        preferredLearningDays: [],
        reminderTiming: "1_hour",
        reasonsForLearning: [],
        howHeardAbout: "",
        dailyStudyTimeGoal: 30,
        weeklyStudyTimeGoal: 210,
        consentDataUsage: false,
        consentAnalytics: false,
        skillAssessment: {
          completed: false,
          ceferLevel: "B1",
          weakAreas: ["grammar", "vocabulary"],
          strengths: ["reading"],
          assessmentDate: new Date(),
          scores: {
            reading: 50,
            writing: 40,
            listening: 45,
            speaking: 35,
            vocabulary: 40,
            grammar: 35,
          },
        },
        preferences: {
          learningGoals: ["general_fluency"],
          interests: [],
          timeAvailable: "30-60 minutes",
          preferredTime: "evening",
          learningStyle: "mixed",
          difficultyPreference: "moderate",
          focusAreas: [],
          strengths: [],
          weaknesses: [],
        },
        recommendedPath: {
          primaryFocus: ["vocabulary", "grammar", "reading"],
          suggestedOrder: [
            "vocabulary",
            "reading",
            "grammar",
            "writing",
            "listening",
            "speaking",
            "games",
          ],
          estimatedWeeks: 12,
        },
        tours: {
          completed: [],
          skipped: [],
        },
        moduleVisits: {},
        // completedAt will be set when onboarding is actually completed
      },
    };

    // Handle school registration - associate with school and branch
    if (registrationType === "school") {
      const branch = await Branch.findOne({
        registrationCode: schoolCode,
      }).populate("school");

      if (!branch) {
        return NextResponse.json(
          { error: "Invalid school registration code" },
          { status: 400 }
        );
      }

      // Assign the user to the branch and its parent school
      userData.branch = branch._id;
      userData.school = branch.school._id;
    }
    // Individual users remain without school/branch associations

    // Create new user
    const user = new User(userData);
    await user.save();

    // Send verification email (don't fail registration if email fails)
    let emailSent = false;
    let emailProvider = "none";
    try {
      // Try Resend first (better deliverability)
      if (process.env.RESEND_API_KEY) {
        const emailResult = await sendEmailVerificationResend(
          user.email,
          user.name,
          emailVerificationToken
        );
        emailSent = emailResult.success;
        emailProvider = "resend";
        if (!emailResult.success) {
          console.log("Resend email verification failed:", emailResult.error);
        }
      } else {
        // Fallback to SMTP if Resend not configured
        const emailResult = await sendEmailVerification(
          user.email,
          user.name,
          emailVerificationToken
        );
        emailSent = emailResult.success;
        emailProvider = "smtp";
        if (!emailResult.success) {
          console.log("SMTP email verification failed:", emailResult.error);
        }
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    // Remove password from response
    const userResponse = user.toJSON();
    const {
      password: _,
      emailVerificationToken: __,
      ...userWithoutSensitiveData
    } = userResponse;

    // Return user information to create a more meaningful response
    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        user: userWithoutSensitiveData,
        subscription: {
          type: user.subscription.type,
          status: user.subscription.status,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate,
        },
        emailSent: emailSent,
        emailProvider: emailProvider,
        userId: user._id,
        emailVerificationRequired: true,
        deliverabilityNote:
          emailProvider === "resend"
            ? "Email sent via Resend for better deliverability"
            : emailProvider === "smtp"
              ? "Email sent via SMTP - consider upgrading to Resend"
              : "Email delivery not configured",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
