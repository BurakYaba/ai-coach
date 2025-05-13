import dbConnect from "./db";
import { Model } from "mongoose";

// Function to update all expired subscriptions
export async function updateExpiredSubscriptions(): Promise<{
  usersUpdated: number;
  schoolsUpdated: number;
}> {
  try {
    await dbConnect();

    const User = (await import("@/models/User")).default;
    const School = (await import("@/models/School")).default;

    // Current date
    const now = new Date();

    // Update expired user subscriptions
    const userResult = await User.updateMany(
      {
        "subscription.status": "active",
        "subscription.endDate": { $lt: now },
      },
      {
        $set: { "subscription.status": "expired" },
      }
    );

    // Update expired school subscriptions
    const schoolResult = await School.updateMany(
      {
        "subscription.status": "active",
        "subscription.endDate": { $lt: now },
      },
      {
        $set: { "subscription.status": "expired" },
      }
    );

    return {
      usersUpdated: userResult.modifiedCount || 0,
      schoolsUpdated: schoolResult.modifiedCount || 0,
    };
  } catch (error) {
    console.error("Error updating expired subscriptions:", error);
    return { usersUpdated: 0, schoolsUpdated: 0 };
  }
}

// Function to check if a specific user's subscription is expired and update if needed
export async function checkAndUpdateUserSubscription(
  userId: string
): Promise<boolean> {
  try {
    await dbConnect();

    const User = (await import("@/models/User")).default;
    const user = await User.findById(userId);

    if (!user) return false;

    // Check if user subscription is expired but still marked as active
    if (
      user.subscription?.status === "active" &&
      user.subscription.endDate &&
      new Date(user.subscription.endDate) < new Date()
    ) {
      // Update subscription status to expired
      await User.findByIdAndUpdate(userId, {
        $set: { "subscription.status": "expired" },
      });
      return true; // Subscription was expired and was updated
    }

    return false; // No update needed
  } catch (error) {
    console.error(`Error checking user subscription (${userId}):`, error);
    return false;
  }
}
