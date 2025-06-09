import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import User from "@/models/User";

const updateFeedbackSchema = z.object({
  status: z.enum(["new", "in_review", "resolved", "dismissed"]).optional(),
  adminNotes: z.string().max(1000).optional(),
  adminResponse: z.string().max(1000).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if user is admin
    const user = await User.findById(session.user.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateFeedbackSchema.parse(body);

    // Check if feedback exists
    const feedback = await Feedback.findById(params.id);
    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Update feedback
    const updateData: any = { ...validatedData };

    // If admin is providing a response, set response timestamp
    if (validatedData.adminResponse) {
      updateData.respondedAt = new Date();
      updateData.respondedBy = session.user.id;
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("respondedBy", "name email");

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully",
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if user is admin or the feedback owner
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const feedback = await Feedback.findById(params.id).populate(
      "respondedBy",
      "name email"
    );

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Only allow admin or feedback owner to view
    if (
      user.role !== "admin" &&
      feedback.userId.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
