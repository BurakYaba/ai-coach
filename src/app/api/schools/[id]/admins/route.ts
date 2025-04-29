import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions, isAdmin, canManageSchool } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// GET /api/schools/[id]/admins - Get school admins
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user can manage this school
    const canManage = await canManageSchool(session.user.id, id);
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Fetch admin users with details
    const admins = await User.find(
      { _id: { $in: school.admins } },
      { password: 0 } // Exclude password
    );

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching school admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch school admins" },
      { status: 500 }
    );
  }
}

// POST /api/schools/[id]/admins - Add a school admin
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Only system admins can add school admins
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const body = await req.json();

    if (!body.userId && !body.email) {
      return NextResponse.json(
        { error: "Missing userId or email" },
        { status: 400 }
      );
    }

    // Find user by ID or email
    let user;
    if (body.userId) {
      user = await User.findById(body.userId);
    } else {
      user = await User.findOne({ email: body.email });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already an admin of this school
    if (school.admins.includes(user._id)) {
      return NextResponse.json(
        { error: "User is already an admin of this school" },
        { status: 400 }
      );
    }

    // Update user role to school_admin if not already an admin
    if (user.role !== "admin" && user.role !== "school_admin") {
      user.role = "school_admin";
      await user.save();
    }

    // Add user to school admins
    school.admins.push(user._id);
    await school.save();

    // Update user's school
    if (!user.school) {
      user.school = new mongoose.Types.ObjectId(id);
      await user.save();
    }

    return NextResponse.json({ message: "Admin added successfully" });
  } catch (error) {
    console.error("Error adding school admin:", error);
    return NextResponse.json(
      { error: "Failed to add school admin" },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[id]/admins - Remove a school admin
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Only system admins can remove school admins
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json(
        { error: "Missing adminId parameter" },
        { status: 400 }
      );
    }

    // Check if user is an admin of this school
    if (!school.admins.some(admin => admin.toString() === adminId)) {
      return NextResponse.json(
        { error: "User is not an admin of this school" },
        { status: 400 }
      );
    }

    // Remove user from school admins
    school.admins = school.admins.filter(admin => admin.toString() !== adminId);
    await school.save();

    // Don't automatically change role back to user, as they might be admin for other schools
    // This should be handled separately or when removing the last school

    return NextResponse.json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error removing school admin:", error);
    return NextResponse.json(
      { error: "Failed to remove school admin" },
      { status: 500 }
    );
  }
}
