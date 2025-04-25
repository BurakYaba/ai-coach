import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LearningGroupService } from "@/lib/gamification/learning-group-service";

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
    // Handle GET request - list groups
    if (req.method === "GET") {
      const { mine, search, limit = "20", skip = "0" } = req.query;

      // Convert limit and skip to numbers
      const limitNum = parseInt(limit as string, 10);
      const skipNum = parseInt(skip as string, 10);

      // If mine=true, get user's groups
      if (mine === "true") {
        const userGroups = await LearningGroupService.getUserGroups(userId);
        return res.status(200).json({ groups: userGroups });
      }

      // If search is provided, search for groups
      if (search && typeof search === "string") {
        const searchResults = await LearningGroupService.searchGroups(
          search,
          limitNum
        );
        return res.status(200).json({ groups: searchResults });
      }

      // Otherwise, get public groups
      const publicGroups = await LearningGroupService.getPublicGroups(
        limitNum,
        skipNum
      );
      return res.status(200).json({ groups: publicGroups });
    }

    // Handle POST request - create a new group
    if (req.method === "POST") {
      const { name, description, isPrivate, joinRequireApproval } = req.body;

      // Validate name
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "Group name is required" });
      }

      // Create the group
      const newGroup = await LearningGroupService.createGroup(
        name,
        description || "",
        userId,
        isPrivate === true,
        joinRequireApproval !== false // Default to true
      );

      if (newGroup) {
        return res.status(201).json({ group: newGroup });
      } else {
        return res.status(500).json({ error: "Failed to create group" });
      }
    }

    // Method not allowed
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error handling learning groups:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
