import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import School from "@/models/School";
import Branch from "@/models/Branch";
import Feedback from "@/models/Feedback";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
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

    // Time periods for analytics
    const today = startOfDay(new Date());
    const thisWeek = startOfWeek(new Date());
    const thisMonth = startOfMonth(new Date());

    // Get user statistics
    const [
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      activeUsersToday,
      activeUsersThisWeek,
      activeUsersThisMonth,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: thisWeek } }),
      User.countDocuments({ createdAt: { $gte: thisMonth } }),
      User.countDocuments({ lastActive: { $gte: today } }),
      User.countDocuments({ lastActive: { $gte: thisWeek } }),
      User.countDocuments({ lastActive: { $gte: thisMonth } }),
    ]);

    // Get monthly user growth for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get school statistics
    const [totalSchools, activeSchools, totalBranches, totalStudents] =
      await Promise.all([
        School.countDocuments(),
        School.countDocuments({ "subscription.status": "active" }),
        Branch.countDocuments(),
        User.countDocuments({ school: { $exists: true } }),
      ]);

    // Get feedback statistics
    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unresolved: {
            $sum: {
              $cond: [{ $in: ["$status", ["new", "in_progress"]] }, 1, 0],
            },
          },
          totalRating: { $sum: "$rating" },
          ratingCount: {
            $sum: {
              $cond: [{ $gt: ["$rating", 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    const feedbackData = feedbackStats[0] || {
      total: 0,
      unresolved: 0,
      totalRating: 0,
      ratingCount: 0,
    };

    return NextResponse.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
        activeToday: activeUsersToday,
        activeThisWeek: activeUsersThisWeek,
        activeThisMonth: activeUsersThisMonth,
        growth: userGrowth,
      },
      schools: {
        total: totalSchools,
        active: activeSchools,
        branches: totalBranches,
        studentsTotal: totalStudents,
      },
      feedback: {
        total: feedbackData.total,
        unresolved: feedbackData.unresolved,
        averageRating:
          feedbackData.ratingCount > 0
            ? Math.round(
                (feedbackData.totalRating / feedbackData.ratingCount) * 10
              ) / 10
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
