import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions, canManageSchool } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import User from "@/models/User";
import { checkAndUpdateUserSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// GET /api/schools/[id]/students - Get students for a school
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

    // Verify school exists
    const school = await School.findById(id);
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    // Build query
    const query: any = { school: id, role: "user" };

    // Get the current user to check if they're a branch admin
    const admin = await User.findById(session.user.id);

    // If admin is associated with a branch, automatically filter by that branch
    if (admin?.role === "school_admin" && admin.branch) {
      // Branch admins should only see students from their branch
      query.branch = admin.branch;
    }
    // System admins (role="admin") can see all students regardless of branch

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalStudents = await User.countDocuments(query);

    // Get students with pagination
    const students = await User.find(query, { password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Check and update subscription status for each student
    const studentsWithValidatedSubscriptions = await Promise.all(
      students.map(async student => {
        const studentId = student._id.toString();

        // Check and update subscription status if expired
        await checkAndUpdateUserSubscription(studentId);

        // Refetch student to get updated subscription status
        const updatedStudent =
          await User.findById(studentId).select("subscription");

        // Determine actual subscription status based on endDate
        let actualStatus = updatedStudent?.subscription?.status || "pending";

        // Double-check: if status is active but endDate has passed, mark as expired
        if (
          actualStatus === "active" &&
          updatedStudent?.subscription?.endDate &&
          new Date(updatedStudent.subscription.endDate) < new Date()
        ) {
          actualStatus = "expired";
        }

        // Return student with validated subscription status
        return {
          ...student.toObject(),
          subscription: {
            type: updatedStudent?.subscription?.type || "free",
            status: actualStatus,
            startDate: updatedStudent?.subscription?.startDate,
            endDate: updatedStudent?.subscription?.endDate,
          },
        };
      })
    );

    return NextResponse.json({
      students: studentsWithValidatedSubscriptions,
      pagination: {
        total: totalStudents,
        page,
        limit,
        pages: Math.ceil(totalStudents / limit),
      },
      isBranchAdmin: !!admin?.branch, // Tell the frontend if this is a branch admin
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// POST method for adding students has been removed
