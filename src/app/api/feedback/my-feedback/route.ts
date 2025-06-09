import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Build filter object for user's own feedback
    const filter: any = { userId: session.user.id };
    if (status) filter.status = status;

    // Get user's feedback with pagination
    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("respondedBy", "name")
        .lean(),
      Feedback.countDocuments(filter),
    ]);

    // Get user's feedback statistics
    const stats = await Feedback.aggregate([
      { $match: { userId: session.user.id } },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          pendingFeedback: {
            $sum: {
              $cond: [{ $eq: ["$status", "new"] }, 1, 0],
            },
          },
          reviewingFeedback: {
            $sum: {
              $cond: [{ $eq: ["$status", "in_review"] }, 1, 0],
            },
          },
          resolvedFeedback: {
            $sum: {
              $cond: [{ $eq: ["$status", "resolved"] }, 1, 0],
            },
          },
        },
      },
    ]);

    return NextResponse.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || {
        totalFeedback: 0,
        averageRating: 0,
        pendingFeedback: 0,
        reviewingFeedback: 0,
        resolvedFeedback: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
