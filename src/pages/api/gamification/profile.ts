import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  GamificationService,
  calculateLevelFromXP,
} from "@/lib/gamification/gamification-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the user session
  const session = await getServerSession(req, res, authOptions);

  // Check if user is authenticated
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get user ID from session
  const userId = session.user.id;

  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Get user's gamification profile (creates one if it doesn't exist)
    const profile = await GamificationService.getUserProfile(userId);

    if (!profile) {
      console.error(
        "Failed to create or retrieve gamification profile for user:",
        userId
      );
      return res
        .status(500)
        .json({ error: "Failed to create gamification profile" });
    }

    // Recalculate level based on current XP to ensure it's up-to-date
    const { level, experienceToNextLevel } = calculateLevelFromXP(
      profile.experience
    );

    // If the calculated level is different from the stored level, update it
    if (level !== profile.level) {
      console.log(
        `Updating level for user ${userId}: ${profile.level} → ${level} (XP: ${profile.experience})`
      );
      profile.level = level;
      profile.experienceToNextLevel = experienceToNextLevel;
      await profile.save();
    }

    // Return the profile
    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching gamification profile:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch gamification profile" });
  }
}
