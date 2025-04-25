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

  // Get group ID from route
  const { id } = req.query;
  const groupId = id as string;

  try {
    // Handle GET request - get group details
    if (req.method === "GET") {
      const action = req.query.action as string;

      // Get group details
      if (!action) {
        const group = await LearningGroupService.getGroup(groupId);

        if (!group) {
          return res.status(404).json({ error: "Group not found" });
        }

        // Check if group is private and user is not a member
        if (
          group.settings.isPrivate &&
          !(await LearningGroupService.isGroupMember(userId, groupId))
        ) {
          return res.status(403).json({ error: "This group is private" });
        }

        return res.status(200).json({ group });
      }

      // Get group members
      if (action === "members") {
        // Check if user is a member or group is public
        const isMember = await LearningGroupService.isGroupMember(
          userId,
          groupId
        );
        const group = await LearningGroupService.getGroup(groupId);

        if (!group) {
          return res.status(404).json({ error: "Group not found" });
        }

        if (group.settings.isPrivate && !isMember) {
          return res.status(403).json({ error: "This group is private" });
        }

        const members = await LearningGroupService.getGroupMembers(groupId);
        return res.status(200).json({ members });
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    // Handle PATCH request - update group settings
    if (req.method === "PATCH") {
      // Check if user is an admin
      const isAdmin = await LearningGroupService.isGroupAdmin(userId, groupId);

      if (!isAdmin) {
        return res
          .status(403)
          .json({ error: "You don't have permission to update this group" });
      }

      const { name, description, isPrivate, joinRequireApproval } = req.body;

      // Update group settings
      const result = await LearningGroupService.updateGroupSettings(
        userId,
        groupId,
        {
          name,
          description,
          isPrivate,
          joinRequireApproval,
        }
      );

      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ error: result.message });
      }
    }

    // Handle POST request - join, leave, or change member role
    if (req.method === "POST") {
      const { action, targetUserId, newRole } = req.body;

      // Join a group
      if (action === "join") {
        const result = await LearningGroupService.joinGroup(userId, groupId);
        return res.status(result.success ? 200 : 400).json(result);
      }

      // Leave a group
      if (action === "leave") {
        const result = await LearningGroupService.leaveGroup(userId, groupId);
        return res.status(result.success ? 200 : 400).json(result);
      }

      // Change member role (admin only)
      if (action === "change-role" && targetUserId && newRole) {
        // Validate role
        if (newRole !== "admin" && newRole !== "member") {
          return res.status(400).json({ error: "Invalid role" });
        }

        const result = await LearningGroupService.changeRole(
          userId,
          targetUserId,
          groupId,
          newRole as "admin" | "member"
        );

        return res.status(result.success ? 200 : 400).json(result);
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    // Handle DELETE request - delete a group (admin only)
    if (req.method === "DELETE") {
      // Check if user is an admin
      const isAdmin = await LearningGroupService.isGroupAdmin(userId, groupId);

      if (!isAdmin) {
        return res
          .status(403)
          .json({ error: "You don't have permission to delete this group" });
      }

      // For safety, we'll use the leave group functionality for all members
      // This will automatically delete the group when no members are left
      const group = await LearningGroupService.getGroup(groupId);

      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Get all member IDs
      const memberIds = group.members.map(member => member.userId.toString());

      // Have all members leave the group (will delete it when empty)
      let success = true;

      for (const memberId of memberIds) {
        const result = await LearningGroupService.leaveGroup(memberId, groupId);
        if (!result.success) {
          success = false;
        }
      }

      if (success) {
        return res.status(200).json({ message: "Group deleted successfully" });
      } else {
        return res.status(500).json({ error: "Failed to delete group" });
      }
    }

    // Method not allowed
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error handling group request:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
