import { dbConnect } from "@/lib/db";
import LearningGroup, { ILearningGroup } from "@/models/LearningGroup";
import GamificationProfile from "@/models/GamificationProfile";
import mongoose, { Document } from "mongoose";

// Types for better readability
type GroupMember = {
  userId: mongoose.Types.ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
};

export class LearningGroupService {
  // Create a new learning group
  static async createGroup(
    name: string,
    description: string,
    creatorId: string,
    isPrivate: boolean = false,
    joinRequireApproval: boolean = true
  ): Promise<(Document<unknown, any, ILearningGroup> & ILearningGroup) | null> {
    await dbConnect();
    const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

    try {
      // Create new group
      const group = await LearningGroup.create({
        name,
        description,
        members: [
          {
            userId: creatorObjectId,
            role: "admin",
            joinedAt: new Date(),
          },
        ],
        settings: {
          isPrivate,
          joinRequireApproval,
        },
        stats: {
          totalXP: 0,
          activeMembers: 1,
          averageStreak: 0,
        },
      });

      // Calculate initial stats
      await this.updateGroupStats(group._id.toString());

      return group;
    } catch (error) {
      console.error("Error creating learning group:", error);
      return null;
    }
  }

  // Get a group by ID
  static async getGroup(
    groupId: string
  ): Promise<(Document<unknown, any, ILearningGroup> & ILearningGroup) | null> {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(groupId);

    return LearningGroup.findById(objectId);
  }

  // Get all public groups (for discovery)
  static async getPublicGroups(
    limit: number = 20,
    skip: number = 0
  ): Promise<(Document<unknown, any, ILearningGroup> & ILearningGroup)[]> {
    await dbConnect();

    return LearningGroup.find({
      "settings.isPrivate": false,
    })
      .sort({ "stats.activeMembers": -1 })
      .skip(skip)
      .limit(limit);
  }

  // Search for groups
  static async searchGroups(
    query: string,
    limit: number = 20
  ): Promise<(Document<unknown, any, ILearningGroup> & ILearningGroup)[]> {
    await dbConnect();

    return LearningGroup.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      "settings.isPrivate": false,
    }).limit(limit);
  }

  // Get groups a user is a member of
  static async getUserGroups(
    userId: string
  ): Promise<(Document<unknown, any, ILearningGroup> & ILearningGroup)[]> {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);

    return LearningGroup.find({
      "members.userId": objectId,
    });
  }

  // Check if a user is a member of a group
  static async isGroupMember(
    userId: string,
    groupId: string
  ): Promise<boolean> {
    await dbConnect();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    const group = await LearningGroup.findOne({
      _id: groupObjectId,
      "members.userId": userObjectId,
    });

    return !!group;
  }

  // Check if a user is an admin of a group
  static async isGroupAdmin(userId: string, groupId: string): Promise<boolean> {
    await dbConnect();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    const group = await LearningGroup.findOne({
      _id: groupObjectId,
      members: { $elemMatch: { userId: userObjectId, role: "admin" } },
    });

    return !!group;
  }

  // Join a group
  static async joinGroup(
    userId: string,
    groupId: string
  ): Promise<{ success: boolean; message: string; pending?: boolean }> {
    await dbConnect();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    // Check if group exists
    const group = await LearningGroup.findById(groupObjectId);
    if (!group) {
      return { success: false, message: "Group not found" };
    }

    // Check if user is already a member
    if (
      group.members.some(
        member => member.userId.toString() === userObjectId.toString()
      )
    ) {
      return {
        success: false,
        message: "User is already a member of this group",
      };
    }

    // If group requires approval or is private, create a pending request
    if (group.settings.joinRequireApproval || group.settings.isPrivate) {
      // TODO: Create a join request model and handle join requests
      return {
        success: true,
        message: "Join request sent. Waiting for admin approval.",
        pending: true,
      };
    }

    // Otherwise, add user as a member directly
    group.members.push({
      userId: userObjectId,
      role: "member",
      joinedAt: new Date(),
    });

    // Update stats
    group.stats.activeMembers = group.members.length;
    await group.save();

    // Update group stats
    await this.updateGroupStats(groupId);

    return { success: true, message: "Successfully joined group" };
  }

  // Leave a group
  static async leaveGroup(
    userId: string,
    groupId: string
  ): Promise<{ success: boolean; message: string }> {
    await dbConnect();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    // Find the group
    const group = await LearningGroup.findById(groupObjectId);
    if (!group) {
      return { success: false, message: "Group not found" };
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(
      member => member.userId.toString() === userObjectId.toString()
    );

    if (memberIndex === -1) {
      return { success: false, message: "User is not a member of this group" };
    }

    // Check if user is the only admin
    const isAdmin = group.members[memberIndex].role === "admin";
    const adminCount = group.members.filter(
      member => member.role === "admin"
    ).length;

    if (isAdmin && adminCount === 1 && group.members.length > 1) {
      return {
        success: false,
        message:
          "You are the only admin. Please promote another member to admin before leaving.",
      };
    }

    // Remove user from members
    group.members.splice(memberIndex, 1);

    // If no members left, delete the group
    if (group.members.length === 0) {
      await LearningGroup.deleteOne({ _id: groupObjectId });
      return {
        success: true,
        message: "Group deleted as it has no members left",
      };
    }

    // Update stats
    group.stats.activeMembers = group.members.length;
    await group.save();

    // Update group stats
    await this.updateGroupStats(groupId);

    return { success: true, message: "Successfully left group" };
  }

  // Change a member's role
  static async changeRole(
    adminId: string,
    targetUserId: string,
    groupId: string,
    newRole: "admin" | "member"
  ): Promise<{ success: boolean; message: string }> {
    await dbConnect();
    const adminObjectId = new mongoose.Types.ObjectId(adminId);
    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    // Check if admin has permission
    const isAdmin = await this.isGroupAdmin(adminId, groupId);
    if (!isAdmin) {
      return {
        success: false,
        message: "You don't have permission to change roles",
      };
    }

    // Find the group
    const group = await LearningGroup.findById(groupObjectId);
    if (!group) {
      return { success: false, message: "Group not found" };
    }

    // Find the target member
    const targetMember = group.members.find(
      member => member.userId.toString() === targetObjectId.toString()
    );

    if (!targetMember) {
      return {
        success: false,
        message: "Target user is not a member of the group",
      };
    }

    // If demoting an admin, make sure there's at least one admin left
    if (targetMember.role === "admin" && newRole === "member") {
      const adminCount = group.members.filter(
        member => member.role === "admin"
      ).length;

      if (adminCount === 1) {
        return {
          success: false,
          message:
            "Cannot demote the only admin. Promote another member first.",
        };
      }
    }

    // Update role
    targetMember.role = newRole;
    await group.save();

    return {
      success: true,
      message: `Successfully changed role to ${newRole}`,
    };
  }

  // Update group settings
  static async updateGroupSettings(
    adminId: string,
    groupId: string,
    settings: {
      name?: string;
      description?: string;
      isPrivate?: boolean;
      joinRequireApproval?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> {
    await dbConnect();
    const adminObjectId = new mongoose.Types.ObjectId(adminId);
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    // Check if admin has permission
    const isAdmin = await this.isGroupAdmin(adminId, groupId);
    if (!isAdmin) {
      return {
        success: false,
        message: "You don't have permission to change settings",
      };
    }

    // Find the group
    const group = await LearningGroup.findById(groupObjectId);
    if (!group) {
      return { success: false, message: "Group not found" };
    }

    // Update settings
    if (settings.name) group.name = settings.name;
    if (settings.description) group.description = settings.description;
    if (settings.isPrivate !== undefined)
      group.settings.isPrivate = settings.isPrivate;
    if (settings.joinRequireApproval !== undefined)
      group.settings.joinRequireApproval = settings.joinRequireApproval;

    await group.save();

    return { success: true, message: "Group settings updated successfully" };
  }

  // Update group stats
  static async updateGroupStats(groupId: string): Promise<boolean> {
    await dbConnect();
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    // Find the group
    const group = await LearningGroup.findById(groupObjectId);
    if (!group) return false;

    // Get member user IDs
    const memberIds = group.members.map(member => member.userId);

    // Calculate total XP and average streak
    const profiles = await GamificationProfile.find({
      userId: { $in: memberIds },
    });

    let totalXP = 0;
    let totalStreak = 0;

    profiles.forEach(profile => {
      totalXP += profile.stats.totalXP;
      totalStreak += profile.streak.current;
    });

    // Update group stats
    group.stats.totalXP = totalXP;
    group.stats.activeMembers = group.members.length;
    group.stats.averageStreak =
      profiles.length > 0 ? Math.round(totalStreak / profiles.length) : 0;

    await group.save();
    return true;
  }

  // List members of a group with their profile data
  static async getGroupMembers(groupId: string): Promise<
    Array<{
      userId: mongoose.Types.ObjectId;
      role: string;
      joinedAt: Date;
      level: number;
      streak: number;
      totalXP: number;
    }>
  > {
    await dbConnect();
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    // Find the group
    const group = await LearningGroup.findById(groupObjectId);
    if (!group) return [];

    // Get member profiles
    const memberIds = group.members.map(member => member.userId);
    const profiles = await GamificationProfile.find({
      userId: { $in: memberIds },
    });

    // Combine member data with profile data
    return group.members.map(member => {
      const profile = profiles.find(
        p => p.userId.toString() === member.userId.toString()
      );

      return {
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
        level: profile?.level || 1,
        streak: profile?.streak.current || 0,
        totalXP: profile?.stats.totalXP || 0,
      };
    });
  }
}
