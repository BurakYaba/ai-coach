// Properly refactored to address function name conflicts and type issues

import { dbConnect } from "@/lib/db";
import Challenge, { IChallenge } from "@/models/Challenge";
import UserActivity from "@/models/UserActivity";
import mongoose, { Document } from "mongoose";
import { GamificationService } from "./gamification-service";
import GamificationProfile from "@/models/GamificationProfile";
// import { DAILY_CHALLENGE_TEMPLATES, WEEKLY_CHALLENGE_TEMPLATES } from "./challenge-templates";

// Define challenge templates
interface ChallengeTemplate {
  id: string;
  description: string;
  module: string;
  targetMin: number;
  targetMax: number;
  xpReward: number;
  activityType?: string;
}

// Challenge types
interface ChallengeData {
  id: string;
  description: string;
  module: string;
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
}

interface ChallengeSet {
  userId: mongoose.Types.ObjectId;
  challengeType: "daily" | "weekly";
  challenges: ChallengeData[];
  refreshedAt: Date;
  expiresAt: Date;
}

// Challenge templates for different modules
const DAILY_CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // Reading challenges
  {
    id: "daily_reading_sessions",
    description: "Complete {target} reading sessions",
    module: "reading",
    targetMin: 1,
    targetMax: 3,
    xpReward: 50,
    activityType: "complete_session",
  },
  {
    id: "daily_reading_comprehension",
    description: "Answer {target} reading comprehension questions correctly",
    module: "reading",
    targetMin: 5,
    targetMax: 15,
    xpReward: 30,
    activityType: "correct_answer",
  },

  // Writing challenges
  {
    id: "daily_writing_sessions",
    description: "Complete {target} writing sessions",
    module: "writing",
    targetMin: 1,
    targetMax: 2,
    xpReward: 50,
    activityType: "complete_session",
  },

  // Listening challenges
  {
    id: "daily_listening_sessions",
    description: "Complete {target} listening sessions",
    module: "listening",
    targetMin: 1,
    targetMax: 3,
    xpReward: 50,
    activityType: "complete_session",
  },

  // Speaking challenges
  {
    id: "daily_speaking_sessions",
    description: "Complete {target} speaking sessions",
    module: "speaking",
    targetMin: 1,
    targetMax: 2,
    xpReward: 50,
    activityType: "complete_session",
  },

  // Vocabulary challenges
  {
    id: "daily_vocabulary_review",
    description: "Review {target} vocabulary words",
    module: "vocabulary",
    targetMin: 10,
    targetMax: 30,
    xpReward: 40,
    activityType: "review_word",
  },

  // Grammar challenges
  {
    id: "daily_grammar_exercises",
    description: "Complete {target} grammar exercises",
    module: "grammar",
    targetMin: 1,
    targetMax: 3,
    xpReward: 40,
    activityType: "complete_exercise",
  },

  // Game challenges
  {
    id: "daily_games",
    description: "Complete {target} language games",
    module: "games",
    targetMin: 1,
    targetMax: 3,
    xpReward: 40,
    activityType: "complete_game",
  },
];

const WEEKLY_CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // Reading challenges
  {
    id: "weekly_reading_sessions",
    description: "Complete {target} reading sessions this week",
    module: "reading",
    targetMin: 3,
    targetMax: 10,
    xpReward: 150,
    activityType: "complete_session",
  },

  // Writing challenges
  {
    id: "weekly_writing_sessions",
    description: "Complete {target} writing sessions this week",
    module: "writing",
    targetMin: 2,
    targetMax: 7,
    xpReward: 150,
    activityType: "complete_session",
  },

  // Listening challenges
  {
    id: "weekly_listening_sessions",
    description: "Complete {target} listening sessions this week",
    module: "listening",
    targetMin: 3,
    targetMax: 10,
    xpReward: 150,
    activityType: "complete_session",
  },

  // Speaking challenges
  {
    id: "weekly_speaking_sessions",
    description: "Complete {target} speaking sessions this week",
    module: "speaking",
    targetMin: 2,
    targetMax: 7,
    xpReward: 150,
    activityType: "complete_session",
  },

  // Cross-module challenges
  {
    id: "weekly_variety_challenge",
    description: "Complete activities in {target} different modules this week",
    module: "cross-module",
    targetMin: 3,
    targetMax: 7,
    xpReward: 200,
  },

  // Streak challenge
  {
    id: "weekly_streak_challenge",
    description: "Maintain a {target}-day streak this week",
    module: "cross-module",
    targetMin: 3,
    targetMax: 7,
    xpReward: 200,
  },
];

export class ChallengeService {
  // Helper function to get random items from an array
  private static getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Helper function to get a random integer between min and max (inclusive)
  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate in-memory challenge data from templates (for preview/mock purposes)
  private static generateChallengeDataFromTemplate(
    templateType: "daily" | "weekly",
    userId: string
  ): ChallengeData[] {
    const templates =
      templateType === "daily"
        ? DAILY_CHALLENGE_TEMPLATES
        : WEEKLY_CHALLENGE_TEMPLATES;

    const count = templateType === "daily" ? 3 : 4;
    const selectedTemplates = this.getRandomItems(templates, count);

    return selectedTemplates.map(template => {
      const target = this.getRandomInt(template.targetMin, template.targetMax);
      return {
        id: `${template.id}_${Date.now()}`,
        description: template.description.replace(
          "{target}",
          target.toString()
        ),
        module: template.module,
        target,
        progress: 0,
        completed: false,
        xpReward: template.xpReward,
      };
    });
  }

  // Get user's current challenges
  static async getUserChallenges(userId: string): Promise<{
    daily: ChallengeData[];
    weekly: ChallengeData[];
    refreshedAt: Date;
    expiresAt: Date;
  }> {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);

    // Default values
    const refreshedAt = new Date();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Default 1 day from now

    // Fetch daily challenges
    const dailyChallenge = await this.getDailyChallenges(userId);
    let dailyChallenges: ChallengeData[] = [];
    if (dailyChallenge) {
      dailyChallenges = [...dailyChallenge.challenges];
    } else {
      // Generate mock challenges if none found
      dailyChallenges = this.generateChallengeDataFromTemplate("daily", userId);
    }

    // Fetch weekly challenges
    const weeklyChallenge = await this.getWeeklyChallenges(userId);
    let weeklyChallenges: ChallengeData[] = [];
    if (weeklyChallenge) {
      weeklyChallenges = [...weeklyChallenge.challenges];
    } else {
      // Generate mock challenges if none found
      weeklyChallenges = this.generateChallengeDataFromTemplate(
        "weekly",
        userId
      );
    }

    return {
      daily: dailyChallenges,
      weekly: weeklyChallenges,
      refreshedAt,
      expiresAt,
    };
  }

  // Get or generate daily challenges for a user
  static async getDailyChallenges(
    userId: string
  ): Promise<
    | (Document<unknown, object, IChallenge> &
        IChallenge & { _id: mongoose.Types.ObjectId })
    | null
  > {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);

    // Check if user already has active daily challenges
    let dailyChallenge = await Challenge.findOne({
      userId: objectId,
      challengeType: "daily",
      expiresAt: { $gt: new Date() },
    });

    // If no active challenges, generate new ones
    if (!dailyChallenge) {
      dailyChallenge = await this.createDailyChallengeDocument(userId);
    }

    return dailyChallenge;
  }

  // Get or generate weekly challenges for a user
  static async getWeeklyChallenges(
    userId: string
  ): Promise<
    | (Document<unknown, object, IChallenge> &
        IChallenge & { _id: mongoose.Types.ObjectId })
    | null
  > {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);

    // Check if user already has active weekly challenges
    let weeklyChallenge = await Challenge.findOne({
      userId: objectId,
      challengeType: "weekly",
      expiresAt: { $gt: new Date() },
    });

    // If no active challenges, generate new ones
    if (!weeklyChallenge) {
      weeklyChallenge = await this.createWeeklyChallengeDocument(userId);
    }

    return weeklyChallenge;
  }

  // Generate and persist new daily challenges
  private static async createDailyChallengeDocument(
    userId: string
  ): Promise<
    | (Document<unknown, object, IChallenge> &
        IChallenge & { _id: mongoose.Types.ObjectId })
    | null
  > {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Get user profile to personalize challenges
    const profile = await GamificationService.getUserProfile(userId);

    // Select 3 random challenges from templates
    const selectedChallenges = this.selectRandomChallenges(
      DAILY_CHALLENGE_TEMPLATES,
      3,
      profile
    );

    // Calculate expiration (end of day)
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setHours(23, 59, 59, 999);

    // Create challenge document
    try {
      const dailyChallenge = await Challenge.create({
        userId: objectId,
        challengeType: "daily",
        challenges: selectedChallenges,
        refreshedAt: now,
        expiresAt,
      });

      return dailyChallenge;
    } catch (error) {
      console.error("Error generating daily challenges:", error);
      return null;
    }
  }

  // Generate and persist new weekly challenges
  private static async createWeeklyChallengeDocument(
    userId: string
  ): Promise<
    | (Document<unknown, object, IChallenge> &
        IChallenge & { _id: mongoose.Types.ObjectId })
    | null
  > {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Get user profile to personalize challenges
    const profile = await GamificationService.getUserProfile(userId);

    // Select 5 random challenges from templates
    const selectedChallenges = this.selectRandomChallenges(
      WEEKLY_CHALLENGE_TEMPLATES,
      5,
      profile
    );

    // Calculate expiration (end of week - Sunday 23:59:59)
    const now = new Date();
    const expiresAt = new Date(now);
    const daysToSunday = 7 - expiresAt.getDay(); // 0 is Sunday
    expiresAt.setDate(
      expiresAt.getDate() + (daysToSunday === 0 ? 7 : daysToSunday)
    );
    expiresAt.setHours(23, 59, 59, 999);

    // Create challenge document
    try {
      const weeklyChallenge = await Challenge.create({
        userId: objectId,
        challengeType: "weekly",
        challenges: selectedChallenges,
        refreshedAt: now,
        expiresAt,
      });

      return weeklyChallenge;
    } catch (error) {
      console.error("Error generating weekly challenges:", error);
      return null;
    }
  }

  // Select random challenges and personalize them
  private static selectRandomChallenges(
    templates: ChallengeTemplate[],
    count: number,
    profile: Record<string, any>
  ): Array<ChallengeData> {
    // Shuffle templates
    const shuffled = [...templates].sort(() => 0.5 - Math.random());

    // Take first 'count' templates
    const selected = shuffled.slice(0, count);

    // Personalize challenges
    return selected.map(template => {
      // Determine an appropriate target based on user level and template range
      const levelFactor = Math.min(profile.level / 10, 1); // 0.1 to 1
      const targetRange = template.targetMax - template.targetMin;
      const targetBonus = Math.floor(targetRange * levelFactor);
      const target = template.targetMin + targetBonus;

      // Replace {target} in description
      const description = template.description.replace(
        "{target}",
        target.toString()
      );

      return {
        id: template.id,
        description,
        module: template.module,
        target,
        progress: 0,
        completed: false,
        xpReward: template.xpReward,
      };
    });
  }

  // Update challenge progress based on user activity
  static async updateActivityChallengeProgress(
    userId: string,
    module: string,
    activityType: string,
    count: number = 1
  ): Promise<{
    dailyChallengesUpdated: boolean;
    weeklyChallengesUpdated: boolean;
    completedChallenges: Array<{ id: string; xpReward: number }>;
  }> {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);
    const completedChallenges: Array<{ id: string; xpReward: number }> = [];

    // Get active challenges
    const dailyChallenge = await Challenge.findOne({
      userId: objectId,
      challengeType: "daily",
      expiresAt: { $gt: new Date() },
    });

    const weeklyChallenge = await Challenge.findOne({
      userId: objectId,
      challengeType: "weekly",
      expiresAt: { $gt: new Date() },
    });

    let dailyChallengesUpdated = false;
    let weeklyChallengesUpdated = false;

    // Update daily challenges
    if (dailyChallenge) {
      dailyChallengesUpdated = this.updateChallengeDocument(
        dailyChallenge,
        module,
        activityType,
        count,
        completedChallenges
      );

      if (dailyChallengesUpdated) {
        await dailyChallenge.save();
      }
    }

    // Update weekly challenges
    if (weeklyChallenge) {
      weeklyChallengesUpdated = this.updateChallengeDocument(
        weeklyChallenge,
        module,
        activityType,
        count,
        completedChallenges
      );

      // Special case for weekly variety challenge
      if (
        module &&
        weeklyChallenge.challenges.some(
          c => c.id === "weekly_variety_challenge" && !c.completed
        )
      ) {
        const varietyChallenge = weeklyChallenge.challenges.find(
          c => c.id === "weekly_variety_challenge"
        );
        if (varietyChallenge) {
          // Get unique modules the user has been active in this week
          const uniqueModules = new Set<string>();

          // Add current module
          uniqueModules.add(module);

          // Get other modules from recent activity
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          startOfWeek.setHours(0, 0, 0, 0);

          const recentActivities = await UserActivity.find({
            userId: objectId,
            createdAt: { $gte: startOfWeek },
          }).distinct("module");

          recentActivities.forEach(m => uniqueModules.add(m as string));

          // Update progress
          varietyChallenge.progress = uniqueModules.size;

          // Check if completed
          if (
            varietyChallenge.progress >= varietyChallenge.target &&
            !varietyChallenge.completed
          ) {
            varietyChallenge.completed = true;
            completedChallenges.push({
              id: varietyChallenge.id,
              xpReward: varietyChallenge.xpReward,
            });
          }

          weeklyChallengesUpdated = true;
        }
      }

      // Special case for streak challenge
      if (
        weeklyChallenge.challenges.some(
          c => c.id === "weekly_streak_challenge" && !c.completed
        )
      ) {
        const streakChallenge = weeklyChallenge.challenges.find(
          c => c.id === "weekly_streak_challenge"
        );
        if (streakChallenge) {
          // Get current streak
          const profile = await GamificationService.getUserProfile(userId);
          streakChallenge.progress = profile.streak.current;

          // Check if completed
          if (
            streakChallenge.progress >= streakChallenge.target &&
            !streakChallenge.completed
          ) {
            streakChallenge.completed = true;
            completedChallenges.push({
              id: streakChallenge.id,
              xpReward: streakChallenge.xpReward,
            });
          }

          weeklyChallengesUpdated = true;
        }
      }

      if (weeklyChallengesUpdated) {
        await weeklyChallenge.save();
      }
    }

    // If any challenges completed, award XP
    if (completedChallenges.length > 0) {
      const totalXP = completedChallenges.reduce(
        (sum, challenge) => sum + challenge.xpReward,
        0
      );

      // Award XP as a challenge completion bonus
      await GamificationService.awardXP(
        userId,
        "challenges",
        "complete_challenge",
        {
          completedChallenges,
          xpReward: totalXP,
        }
      );
    }

    return {
      dailyChallengesUpdated,
      weeklyChallengesUpdated,
      completedChallenges,
    };
  }

  // Helper to update challenge document
  private static updateChallengeDocument(
    challenge: Document<unknown, object, IChallenge> & IChallenge,
    module: string,
    activityType: string,
    count: number,
    completedChallenges: Array<{ id: string; xpReward: number }>
  ): boolean {
    let updated = false;

    // Loop through challenges
    for (const challengeItem of challenge.challenges) {
      // Skip completed challenges
      if (challengeItem.completed) continue;

      // Check if this activity applies to this challenge
      const isRelevant =
        // For module-specific challenges
        challengeItem.module === module ||
        // For cross-module challenges
        challengeItem.module === "cross-module";

      if (isRelevant) {
        // Update progress
        challengeItem.progress += count;
        updated = true;

        // Check if completed
        if (
          challengeItem.progress >= challengeItem.target &&
          !challengeItem.completed
        ) {
          challengeItem.completed = true;
          completedChallenges.push({
            id: challengeItem.id,
            xpReward: challengeItem.xpReward,
          });
        }
      }
    }

    return updated;
  }

  // Mark a specific challenge as complete manually
  static async completeChallenge(
    userId: string,
    challengeType: "daily" | "weekly",
    challengeId: string
  ): Promise<boolean> {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find the challenge document
    const challenge = await Challenge.findOne({
      userId: objectId,
      challengeType,
      expiresAt: { $gt: new Date() },
      "challenges.id": challengeId,
    });

    if (!challenge) return false;

    // Find the specific challenge item
    const challengeItem = challenge.challenges.find(c => c.id === challengeId);
    if (!challengeItem || challengeItem.completed) return false;

    // Mark as completed
    challengeItem.completed = true;
    challengeItem.progress = challengeItem.target;

    // Save changes
    await challenge.save();

    // Award XP
    await GamificationService.awardXP(
      userId,
      "challenges",
      "complete_challenge",
      {
        completedChallenges: [
          { id: challengeId, xpReward: challengeItem.xpReward },
        ],
        xpReward: challengeItem.xpReward,
      }
    );

    return true;
  }
}
