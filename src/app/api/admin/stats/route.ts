import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ListeningSession from "@/models/ListeningSession";
import User from "@/models/User";

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

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get users registered today
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // Get users registered this week
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: thisWeek },
    });

    // Get users registered this month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth },
    });

    // Get total listening sessions
    const totalListeningSessions = await ListeningSession.countDocuments();

    // Get total library items
    const totalLibraryItems = await ListeningSession.countDocuments({
      isLibrary: true,
    });

    // Get public library items
    const publicLibraryItems = await ListeningSession.countDocuments({
      isLibrary: true,
      isPublic: true,
    });

    // Sessions stats
    const sessionsCreatedToday = await ListeningSession.countDocuments({
      createdAt: { $gte: today },
    });

    const sessionsCreatedThisWeek = await ListeningSession.countDocuments({
      createdAt: { $gte: thisWeek },
    });

    const sessionsCreatedThisMonth = await ListeningSession.countDocuments({
      createdAt: { $gte: thisMonth },
    });

    // Get sessions completed (where completionTime exists)
    const sessionsCompleted = await ListeningSession.countDocuments({
      "userProgress.completionTime": { $ne: null },
    });

    // Get sessions completed today
    const sessionsCompletedToday = await ListeningSession.countDocuments({
      "userProgress.completionTime": { $gte: today },
    });

    // Get active users by counting distinct users who created sessions today/this week/this month
    const activeUsersToday = await ListeningSession.distinct("userId", {
      createdAt: { $gte: today },
    });

    const activeUsersThisWeek = await ListeningSession.distinct("userId", {
      createdAt: { $gte: thisWeek },
    });

    const activeUsersThisMonth = await ListeningSession.distinct("userId", {
      createdAt: { $gte: thisMonth },
    });

    // Get count of listening sessions by level
    const sessionsByLevel = await ListeningSession.aggregate([
      { $group: { _id: "$level", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Get count of library items by level
    const libraryItemsByLevel = await ListeningSession.aggregate([
      { $match: { isLibrary: true } },
      { $group: { _id: "$level", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Get count of listening sessions by content type
    const sessionsByContentType = await ListeningSession.aggregate([
      { $group: { _id: "$contentType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
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

    // Calculate completion rate
    const completionRate =
      totalListeningSessions > 0
        ? Math.round((sessionsCompleted / totalListeningSessions) * 100)
        : 0;

    return NextResponse.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
        activeToday: activeUsersToday.length,
        activeThisWeek: activeUsersThisWeek.length,
        activeThisMonth: activeUsersThisMonth.length,
        growth: userGrowth,
      },
      sessions: {
        total: totalListeningSessions,
        createdToday: sessionsCreatedToday,
        createdThisWeek: sessionsCreatedThisWeek,
        createdThisMonth: sessionsCreatedThisMonth,
        completedTotal: sessionsCompleted,
        completedToday: sessionsCompletedToday,
        completionRate: completionRate,
        byLevel: sessionsByLevel,
        byContentType: sessionsByContentType,
      },
      library: {
        total: totalLibraryItems,
        public: publicLibraryItems,
        byLevel: libraryItemsByLevel,
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
