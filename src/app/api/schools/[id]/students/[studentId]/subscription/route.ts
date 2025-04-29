import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isSchoolAdmin, canManageStudent } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// Update a student's subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is school admin
    const userIsSchoolAdmin = await isSchoolAdmin(session.user.id);
    if (!userIsSchoolAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if school admin can manage this student
    const canManage = await canManageStudent(session.user.id, params.studentId);
    if (!canManage) {
      return NextResponse.json(
        { error: "You don't have permission to manage this student" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { type, startDate, endDate, status } = await request.json();

    // Validate subscription data
    if (!type || !status) {
      return NextResponse.json(
        { error: "Missing required subscription fields" },
        { status: 400 }
      );
    }

    if (type !== "monthly" && type !== "annual") {
      return NextResponse.json(
        { error: "Invalid subscription type" },
        { status: 400 }
      );
    }

    // Update student's subscription
    const student = await User.findByIdAndUpdate(
      params.studentId,
      {
        subscription: {
          type,
          startDate: startDate || new Date(),
          endDate,
          status,
          managedBy: session.user.id,
        },
      },
      { new: true }
    ).select("-password");

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating student subscription:", error);
    return NextResponse.json(
      { error: "Failed to update student subscription" },
      { status: 500 }
    );
  }
}
