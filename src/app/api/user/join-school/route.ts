import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Branch from "@/models/Branch";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { schoolCode } = await request.json();

    if (!schoolCode) {
      return NextResponse.json(
        { error: "School code is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already associated with a school
    if (user.school) {
      return NextResponse.json(
        { error: "You are already associated with a school" },
        { status: 400 }
      );
    }

    // Find branch by registration code
    const branch = await Branch.findOne({
      registrationCode: schoolCode,
    }).populate("school");

    if (!branch) {
      return NextResponse.json(
        { error: "Invalid school registration code" },
        { status: 400 }
      );
    }

    // Check if school was populated correctly
    if (!branch.school || typeof branch.school === "string") {
      return NextResponse.json(
        { error: "School information not found" },
        { status: 400 }
      );
    }

    // Associate user with school and branch
    user.school = (branch.school as any)._id;
    user.branch = branch._id;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Successfully joined school",
      school: {
        id: (branch.school as any)._id,
        name: (branch.school as any).name,
      },
      branch: {
        id: branch._id,
        name: branch.name,
      },
    });
  } catch (error) {
    console.error("Error joining school:", error);
    return NextResponse.json(
      { error: "Failed to join school" },
      { status: 500 }
    );
  }
}
