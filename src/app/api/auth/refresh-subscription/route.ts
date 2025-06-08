import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get fresh user data from database
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the fresh subscription data
    const subscriptionData = {
      status: user.subscription?.status || "pending",
      type: user.subscription?.type || "free",
      endDate: user.subscription?.endDate?.toISOString(),
      isActive:
        user.subscription?.status === "active" &&
        (!user.subscription?.endDate ||
          new Date(user.subscription.endDate) > new Date()),
    };

    return NextResponse.json({
      success: true,
      subscription: subscriptionData,
    });
  } catch (error) {
    console.error("Error refreshing subscription:", error);
    return NextResponse.json(
      { error: "Failed to refresh subscription" },
      { status: 500 }
    );
  }
}
