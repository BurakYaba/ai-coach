import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import User from "@/models/User";

const createFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  category: z.enum([
    "general",
    "features",
    "usability",
    "content",
    "performance",
    "bug_report",
  ]),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      currentPage: z.string().optional(),
      deviceInfo: z.string().optional(),
      appVersion: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createFeedbackSchema.parse(body);

    await dbConnect();

    // Get user information
    const user = await User.findById(session.user.id).select("name email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create feedback
    const feedback = await Feedback.create({
      userId: session.user.id,
      user: {
        name: user.name,
        email: user.email,
      },
      rating: validatedData.rating,
      category: validatedData.category,
      subject: validatedData.subject,
      message: validatedData.message,
      metadata: validatedData.metadata || {},
    });

    // Note: Google Analytics tracking is handled client-side in the form component

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackId: feedback._id,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);

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

    // Check if user is admin
    const user = await User.findById(session.user.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const rating = searchParams.get("rating");

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (rating) filter.rating = parseInt(rating);

    // Get feedback with pagination
    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("respondedBy", "name email")
        .lean(),
      Feedback.countDocuments(filter),
    ]);

    // Get summary statistics
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          newFeedback: {
            $sum: {
              $cond: [{ $eq: ["$status", "new"] }, 1, 0],
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

    const categoryStats = await Feedback.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const ratingDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
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
        newFeedback: 0,
        resolvedFeedback: 0,
      },
      categoryStats,
      ratingDistribution,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
