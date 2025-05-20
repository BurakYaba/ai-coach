import dbConnect from "./db";
import { Model } from "mongoose";

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
