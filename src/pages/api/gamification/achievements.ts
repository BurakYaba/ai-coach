import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GamificationService } from "@/lib/gamification/gamification-service";

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

    // Get user's achievements (creates profile if it doesn't exist)
    const achievements = await GamificationService.getUserAchievements(userId);

    // Return the achievements (empty array if no achievements yet)
    return res.status(200).json({ achievements: achievements || [] });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return res.status(500).json({ error: "Failed to fetch achievements" });
  }
}
