import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { updateExpiredSubscriptions } from "@/lib/subscription";

export const dynamic = "force-dynamic";

// API endpoint to update all expired subscriptions (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin permission
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Update all expired subscriptions
    const result = await updateExpiredSubscriptions();

    return NextResponse.json({
      success: true,
      message: "Expired subscriptions updated successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error in subscription update endpoint:", error);
    return NextResponse.json(
      { error: "Failed to update expired subscriptions" },
      { status: 500 }
    );
  }
}
