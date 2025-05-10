import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin, canManageSchool } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import User from "@/models/User";

// Force dynamic rendering and prevent static path generation
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// GET /api/schools/[id] - Get a school by ID
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

    const school = await School.findById(id).populate({
      path: "admins",
      select: "name email",
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json(school);
  } catch (error) {
    console.error("Error fetching school:", error);
    return NextResponse.json(
      { error: "Failed to fetch school" },
      { status: 500 }
    );
  }
}

// PUT /api/schools/[id] - Update a school
export async function PUT(
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

    const body = await req.json();

    // Find the school
    const school = await School.findById(id);
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Update allowed fields (note: admins array can only be modified by specific endpoint)
    const allowedUpdates = ["name", "location", "primaryContact"];
    const updates: Record<string, any> = {};

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Only allow subscription updates for admins
    if ((await isAdmin(session.user.id)) && body.subscription) {
      updates.subscription = body.subscription;
    }

    // Update the school
    const updatedSchool = await School.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate({
      path: "admins",
      select: "name email",
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error("Error updating school:", error);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[id] - Delete a school (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow system admins to delete schools
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    await dbConnect();

    // Find the school
    const school = await School.findById(id);
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Check if school has any students
    const studentCount = await User.countDocuments({ school: id });
    if (studentCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete school with active students",
          studentCount,
        },
        { status: 400 }
      );
    }

    // Delete the school
    await School.findByIdAndDelete(id);

    return NextResponse.json({ message: "School deleted successfully" });
  } catch (error) {
    console.error("Error deleting school:", error);
    return NextResponse.json(
      { error: "Failed to delete school" },
      { status: 500 }
    );
  }
}
