import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GamificationService } from "@/lib/gamification/gamification-service";
import { ChallengeService } from "@/lib/gamification/challenge-service";

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
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Get activity details from request body
    const { module, activityType, metadata = {} } = req.body;

    // Validate required fields
    if (!module || !activityType) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Both 'module' and 'activityType' are required",
      });
    }

    // Award XP for the activity
    const result = await GamificationService.awardXP(
      userId,
      module,
      activityType,
      metadata
    );

    // Update challenge progress
    const challengeResult =
      await ChallengeService.updateActivityChallengeProgress(
        userId,
        module,
        activityType
      );

    // Combine results
    const response = {
      ...result,
      challenges: {
        dailyChallengesUpdated: challengeResult.dailyChallengesUpdated,
        weeklyChallengesUpdated: challengeResult.weeklyChallengesUpdated,
        completedChallenges: challengeResult.completedChallenges,
      },
    };

    // Return the results
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error recording activity:", error);
    return res.status(500).json({ error: "Failed to record activity" });
  }
}
