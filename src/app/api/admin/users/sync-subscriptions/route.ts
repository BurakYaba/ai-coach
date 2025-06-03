import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// Sync all user subscriptions - update expired ones
export async function POST(request: NextRequest) {
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

    // Find all users with active subscriptions that have actually expired
    const expiredUsers = await User.find({
      "subscription.status": "active",
      "subscription.endDate": { $lt: new Date() },
    });

    console.log(
      `Found ${expiredUsers.length} users with expired subscriptions`
    );

    // Update all expired subscriptions
    const updateResult = await User.updateMany(
      {
        "subscription.status": "active",
        "subscription.endDate": { $lt: new Date() },
      },
      {
        $set: { "subscription.status": "expired" },
      }
    );

    return NextResponse.json({
      message: "Subscription sync completed",
      usersFound: expiredUsers.length,
      usersUpdated: updateResult.modifiedCount,
      updatedUsers: expiredUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        endDate: user.subscription?.endDate,
      })),
    });
  } catch (error) {
    console.error("Error syncing subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to sync subscriptions" },
      { status: 500 }
    );
  }
}
