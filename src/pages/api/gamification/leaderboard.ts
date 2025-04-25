import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LeaderboardService } from "@/lib/gamification/leaderboard-service";

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

  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { type, category, module } = req.query;

    // Validate parameters
    if (!type || !category) {
      return res.status(400).json({
        error: "Missing required parameters",
        message: "Both 'type' and 'category' are required",
      });
    }

    // Validate type
    if (type !== "weekly" && type !== "monthly" && type !== "all-time") {
      return res.status(400).json({
        error: "Invalid type",
        message: "Type must be 'weekly', 'monthly', or 'all-time'",
      });
    }

    // Validate category
    if (
      category !== "xp" &&
      category !== "streak" &&
      category !== "module-specific"
    ) {
      return res.status(400).json({
        error: "Invalid category",
        message: "Category must be 'xp', 'streak', or 'module-specific'",
      });
    }

    // For module-specific leaderboards, module is required
    if (category === "module-specific" && !module) {
      return res.status(400).json({
        error: "Missing module parameter",
        message:
          "Module parameter is required for module-specific leaderboards",
      });
    }

    // Get the leaderboard
    const leaderboard = await LeaderboardService.getLeaderboard(
      type as "weekly" | "monthly" | "all-time",
      category as "xp" | "streak" | "module-specific",
      module as string | undefined
    );

    // Return the leaderboard
    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
