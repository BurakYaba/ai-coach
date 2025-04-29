import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import Branch from "@/models/Branch";

export async function POST(req: Request) {
  try {
    const { name, email, password, schoolCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

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
    };

    // If school code is provided, try to find the corresponding school and branch
    if (schoolCode) {
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

    // Create new user
    const user = new User(userData);
    await user.save();

    // Remove password from response
    const userResponse = user.toJSON();
    const { password: _, ...userWithoutPassword } = userResponse;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
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
