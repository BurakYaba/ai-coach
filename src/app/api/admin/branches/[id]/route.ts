import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Branch from "@/models/Branch";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// Get a specific branch by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;
    const branch = await Branch.findById(id)
      .populate("school", "name")
      .populate("admins", "name email");

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    return NextResponse.json(
      { error: "Failed to fetch branch" },
      { status: 500 }
    );
  }
}

// Update a branch
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const { name, location, admins } = body;

    // Build update object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;

    // Update admins if provided
    if (Array.isArray(admins)) {
      // Validate all admin users exist
      const adminIds = admins.filter(id => id && typeof id === "string");
      if (adminIds.length > 0) {
        const existingAdmins = await User.find({
          _id: { $in: adminIds },
          role: "school_admin",
        });

        if (existingAdmins.length !== adminIds.length) {
          return NextResponse.json(
            { error: "One or more admin users not found or not school_admin" },
            { status: 400 }
          );
        }

        updateData.admins = adminIds;
      }
    }

    // Update the branch
    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("school", "name")
      .populate("admins", "name email");

    if (!updatedBranch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error("Error updating branch:", error);
    return NextResponse.json(
      { error: "Failed to update branch" },
      { status: 500 }
    );
  }
}

// Delete a branch
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;

    // Check if branch exists
    const branch = await Branch.findById(id);
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Check if there are users associated with this branch
    const userCount = await User.countDocuments({ branch: id });
    if (userCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete branch with associated users",
          userCount,
        },
        { status: 400 }
      );
    }

    // Delete the branch
    await Branch.findByIdAndDelete(id);

    return NextResponse.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    return NextResponse.json(
      { error: "Failed to delete branch" },
      { status: 500 }
    );
  }
}
