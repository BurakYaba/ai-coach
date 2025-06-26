import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/db";
import { sendEmailVerification } from "@/lib/email";

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
    try {
      const emailResult = await sendEmailVerification(
        user.email,
        user.name,
        emailVerificationToken
      );
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.log("Email verification failed:", emailResult.error);
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
        userId: user._id,
        emailVerificationRequired: true,
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
