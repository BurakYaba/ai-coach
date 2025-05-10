import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, canManageSchool, canManageStudent } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// GET /api/schools/[id]/students/[studentId] - Get a specific student
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, studentId } = params;

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

    // Find the student and ensure they belong to this school
    const student = await User.findOne(
      { _id: studentId, school: id, role: "user" },
      { password: 0 } // Exclude password
    );

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

// PUT /api/schools/[id]/students/[studentId] - Update a student
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, studentId } = params;

    // Check if user can manage this school
    const canManage = await canManageSchool(session.user.id, id);
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Verify student exists and belongs to this school
    const student = await User.findOne({ _id: studentId, school: id });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await req.json();

    // Define which fields school admins can update
    const allowedUpdates = ["name", "languageLevel", "learningPreferences"];

    const updates: Record<string, any> = {};

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Update the student
    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[id]/students/[studentId] - Remove a student from school
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, studentId } = params;

    // Check if user can manage this school
    const canManage = await canManageSchool(session.user.id, id);
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Verify student exists and belongs to this school
    const student = await User.findOne({ _id: studentId, school: id });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Import all necessary models for cascade deletion
    const GamificationProfile = (await import("@/models/GamificationProfile"))
      .default;
    const UserActivity = (await import("@/models/UserActivity")).default;
    const VocabularyBank = (await import("@/models/VocabularyBank")).default;
    const ReadingSession = (await import("@/models/ReadingSession")).default;
    const ListeningSession = (await import("@/models/ListeningSession"))
      .default;
    const SpeakingSession = (await import("@/models/SpeakingSession")).default;
    const WritingSession = (await import("@/models/WritingSession")).default;

    // Collect all deletion operations
    const deleteOperations = [
      // Delete the user's gamification profile
      GamificationProfile.deleteOne({ userId: studentId }),

      // Delete all user activities
      UserActivity.deleteMany({ userId: studentId }),

      // Delete vocabulary bank
      VocabularyBank.deleteOne({ userId: studentId }),

      // Delete all session data
      ReadingSession.deleteMany({ userId: studentId }),
      ListeningSession.deleteMany({ userId: studentId }),
      SpeakingSession.deleteMany({ userId: studentId }),
      WritingSession.deleteMany({ userId: studentId }),

      // Finally, delete the user
      User.findByIdAndDelete(studentId),
    ];

    // Execute all delete operations concurrently
    await Promise.all(deleteOperations);

    return NextResponse.json({
      message: "Student and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
