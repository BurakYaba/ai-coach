import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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
    // Handle GET request - fetch challenges
    if (req.method === "GET") {
      const { type } = req.query;

      // Validate challenge type
      if (type && type !== "daily" && type !== "weekly") {
        return res.status(400).json({ error: "Invalid challenge type" });
      }

      // Get daily challenges
      if (!type || type === "daily") {
        const dailyChallenges =
          await ChallengeService.getDailyChallenges(userId);

        if (type === "daily") {
          return res.status(200).json({ challenges: dailyChallenges });
        }

        // If no specific type requested, get both daily and weekly
        const weeklyChallenges =
          await ChallengeService.getWeeklyChallenges(userId);
        return res.status(200).json({
          daily: dailyChallenges,
          weekly: weeklyChallenges,
        });
      }

      // Get weekly challenges
      if (type === "weekly") {
        const weeklyChallenges =
          await ChallengeService.getWeeklyChallenges(userId);
        return res.status(200).json({ challenges: weeklyChallenges });
      }
    }

    // Handle POST request - complete a challenge
    if (req.method === "POST") {
      const { challengeId, challengeType } = req.body;

      // Validate parameters
      if (!challengeId || !challengeType) {
        return res
          .status(400)
          .json({ error: "Missing challengeId or challengeType" });
      }

      if (challengeType !== "daily" && challengeType !== "weekly") {
        return res.status(400).json({ error: "Invalid challenge type" });
      }

      // Complete the challenge
      const result = await ChallengeService.completeChallenge(
        userId,
        challengeType,
        challengeId
      );

      if (result) {
        return res
          .status(200)
          .json({ success: true, message: "Challenge completed successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Failed to complete challenge" });
      }
    }

    // Method not allowed
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error handling challenges:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
