import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, canManageSchool } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// Sync subscriptions for students in a specific school
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = params.id;

    // Check if user can manage this school
    const canManage = await canManageSchool(session.user.id, schoolId);
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Find all students in this school with active subscriptions that have actually expired
    const expiredStudents = await User.find({
      school: schoolId,
      "subscription.status": "active",
      "subscription.endDate": { $lt: new Date() },
    });

    console.log(
      `Found ${expiredStudents.length} students with expired subscriptions in school ${schoolId}`
    );

    // Update all expired subscriptions for students in this school
    const updateResult = await User.updateMany(
      {
        school: schoolId,
        "subscription.status": "active",
        "subscription.endDate": { $lt: new Date() },
      },
      {
        $set: { "subscription.status": "expired" },
      }
    );

    return NextResponse.json({
      message: "School subscription sync completed",
      studentsFound: expiredStudents.length,
      studentsUpdated: updateResult.modifiedCount,
      updatedStudents: expiredStudents.map(student => ({
        id: student._id,
        name: student.name,
        email: student.email,
        endDate: student.subscription?.endDate,
      })),
    });
  } catch (error) {
    console.error("Error syncing school subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to sync school subscriptions" },
      { status: 500 }
    );
  }
}
