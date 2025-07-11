import dbConnect from "@/lib/db";
import { GamificationService } from "@/lib/gamification/gamification-service";
import UserActivity from "@/models/UserActivity";
import { IGamificationProfile } from "@/models/GamificationProfile";
import User from "@/models/User";

export interface WeeklyProgressData {
  actualStudyTime: number;
  weeklyGoal: number;
  completedSessions: number;
  streakCount: number;
  xpEarned: number;
  level: number;
  strongestSkill: string;
  improvementArea: string;
  achievements: string[];
  moduleBreakdown: {
    reading: number;
    writing: number;
    listening: number;
    speaking: number;
    vocabulary: number;
    grammar: number;
    games: number;
  };
  dailyActivity: Array<{
    date: string;
    sessions: number;
    xp: number;
    timeSpent: number;
  }>;
  weekStartDate: Date;
  weekEndDate: Date;
}

export async function calculateWeeklyProgress(
  userId: string
): Promise<WeeklyProgressData> {
  await dbConnect();

  // Calculate the week range (Monday to Sunday)
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  // Get user data
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Get gamification profile
  const gamificationProfile = await GamificationService.getUserProfile(userId);

  // Get user activities for this week
  const weeklyActivities = await UserActivity.find({
    userId,
    createdAt: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  }).sort({ createdAt: 1 });

  // Calculate XP earned this week
  const xpEarned = weeklyActivities.reduce(
    (total, activity) => total + activity.xpEarned,
    0
  );

  // Count completed sessions by module
  const moduleBreakdown = {
    reading: 0,
    writing: 0,
    listening: 0,
    speaking: 0,
    vocabulary: 0,
    grammar: 0,
    games: 0,
  };

  const sessionActivities = weeklyActivities.filter(
    activity =>
      activity.activityType === "complete_session" ||
      activity.activityType === "conversation_session"
  );

  sessionActivities.forEach(activity => {
    if (activity.module in moduleBreakdown) {
      moduleBreakdown[activity.module as keyof typeof moduleBreakdown]++;
    }
  });

  const completedSessions = sessionActivities.length;

  // Calculate estimated study time based on activities and average session durations
  const estimatedStudyTime = calculateEstimatedStudyTime(weeklyActivities);

  // Group activities by day
  const dailyActivity = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);

    const dayStart = new Date(currentDay);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(currentDay);
    dayEnd.setHours(23, 59, 59, 999);

    const dayActivities = weeklyActivities.filter(
      activity => activity.createdAt >= dayStart && activity.createdAt <= dayEnd
    );

    const daySessions = dayActivities.filter(
      activity =>
        activity.activityType === "complete_session" ||
        activity.activityType === "conversation_session"
    ).length;

    const dayXP = dayActivities.reduce(
      (total, activity) => total + activity.xpEarned,
      0
    );
    const dayTimeSpent = calculateEstimatedStudyTime(dayActivities);

    dailyActivity.push({
      date: currentDay.toISOString().split("T")[0],
      sessions: daySessions,
      xp: dayXP,
      timeSpent: dayTimeSpent,
    });
  }

  // Find strongest skill and improvement area
  const { strongestSkill, improvementArea } = analyzeSkillPerformance(
    moduleBreakdown,
    user
  );

  // Get new achievements this week
  const newAchievements = getNewAchievementsThisWeek(
    gamificationProfile,
    startOfWeek
  );

  return {
    actualStudyTime: estimatedStudyTime,
    weeklyGoal: user.onboarding?.weeklyStudyTimeGoal || 210, // Default 30 min * 7 days
    completedSessions,
    streakCount: gamificationProfile.streak?.current || 0,
    xpEarned,
    level: gamificationProfile.level,
    strongestSkill,
    improvementArea,
    achievements: newAchievements,
    moduleBreakdown,
    dailyActivity,
    weekStartDate: startOfWeek,
    weekEndDate: endOfWeek,
  };
}

function calculateEstimatedStudyTime(activities: any[]): number {
  // Estimate study time based on activity types and typical session durations
  const sessionEstimates = {
    complete_session: 15, // Average 15 minutes per session
    conversation_session: 20, // Speaking sessions tend to be longer
    correct_answer: 0.5, // 30 seconds per correct answer
    vocabulary_review: 0.25, // 15 seconds per vocabulary review
    writing_submission: 10, // 10 minutes for writing
  };

  return activities.reduce((total, activity) => {
    const estimate =
      sessionEstimates[
        activity.activityType as keyof typeof sessionEstimates
      ] || 1;
    return total + estimate;
  }, 0);
}

function analyzeSkillPerformance(
  moduleBreakdown: any,
  user: any
): { strongestSkill: string; improvementArea: string } {
  // Find the module with most activity this week
  const modules = Object.entries(moduleBreakdown) as [string, number][];
  const sortedByActivity = modules.sort(([, a], [, b]) => b - a);

  const strongestSkill = sortedByActivity[0]?.[0] || "reading";

  // Suggest improvement area based on user's skill assessment and low activity
  const skillAssessment = user.onboarding?.skillAssessment?.scores || {};
  const weakestAssessedSkill = Object.entries(skillAssessment).sort(
    ([, a], [, b]) => (a as number) - (b as number)
  )[0]?.[0];

  // If user hasn't practiced their weakest skill much this week, suggest it
  const leastPracticedSkill =
    sortedByActivity[sortedByActivity.length - 1]?.[0];

  const improvementArea =
    weakestAssessedSkill || leastPracticedSkill || "vocabulary";

  return {
    strongestSkill: formatSkillName(strongestSkill),
    improvementArea: formatSkillName(improvementArea),
  };
}

function formatSkillName(skill: string): string {
  const skillNames: { [key: string]: string } = {
    reading: "Reading",
    writing: "Writing",
    listening: "Listening",
    speaking: "Speaking",
    vocabulary: "Vocabulary",
    grammar: "Grammar",
    games: "Games",
  };

  return skillNames[skill] || skill;
}

function getNewAchievementsThisWeek(
  profile: IGamificationProfile,
  weekStart: Date
): string[] {
  if (!profile.achievements) return [];

  return profile.achievements
    .filter(achievement => new Date(achievement.unlockedAt) >= weekStart)
    .map(achievement => achievement.id)
    .slice(0, 3); // Limit to 3 achievements to keep email concise
}

// Calculate progress percentage for goal achievement
export function calculateGoalProgress(
  actualTime: number,
  goalTime: number
): number {
  return Math.min(Math.round((actualTime / goalTime) * 100), 100);
}

// Get motivational message based on progress
export function getMotivationalMessage(progressPercentage: number): string {
  if (progressPercentage >= 100) {
    return "🎉 Outstanding! You've exceeded your weekly goal. You're on fire!";
  } else if (progressPercentage >= 80) {
    return "💪 Excellent progress! You're so close to reaching your goal.";
  } else if (progressPercentage >= 60) {
    return "👏 Good work! Keep up the momentum to reach your goal.";
  } else if (progressPercentage >= 40) {
    return "📚 You're making progress! A few more sessions will get you there.";
  } else if (progressPercentage >= 20) {
    return "🌱 Every step counts! Small consistent efforts lead to big results.";
  } else {
    return "🚀 Ready for a fresh start? This week is a new opportunity to learn!";
  }
}
