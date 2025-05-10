import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Branch from "@/models/Branch";

export const dynamic = "force-dynamic";

// GET /api/user/branch - Get the current user's branch information
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the user with their branch
    const user = await User.findById(session.user.id);

    if (!user || !user.branch) {
      return NextResponse.json(
        { error: "User has no associated branch" },
        { status: 404 }
      );
    }

    // Get branch details
    const branch = await Branch.findById(user.branch);

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    return NextResponse.json({
      branch: {
        _id: branch._id,
        name: branch.name,
        registrationCode: branch.registrationCode,
      },
    });
  } catch (error) {
    console.error("Error fetching branch information:", error);
    return NextResponse.json(
      { error: "Failed to fetch branch information" },
      { status: 500 }
    );
  }
}
