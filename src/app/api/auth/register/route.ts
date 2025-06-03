import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

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

    // Set up free subscription with 7-day expiration
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // 7 days from now

    // Create new user with default values
    const userData: any = {
      name,
      email,
      password,
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

    // Remove password from response
    const userResponse = user.toJSON();
    const { password: _, ...userWithoutPassword } = userResponse;

    // Return user information to create a more meaningful response
    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
        subscription: {
          type: user.subscription.type,
          status: user.subscription.status,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate,
        },
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
