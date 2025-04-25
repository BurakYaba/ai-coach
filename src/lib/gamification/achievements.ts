// Achievement configuration

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "progress" | "milestone" | "activity" | "skill" | "special";
  icon: string;
  xpReward: number;
  requirement: {
    type: string;
    value: number;
    module?: string;
  };
}

// Progress achievements - Based on completing a number of activities
const progressAchievements: Achievement[] = [
  // Reading achievements
  {
    id: "reading_enthusiast_1",
    name: "Reading Enthusiast I",
    description: "Complete 5 reading sessions",
    category: "progress",
    icon: "book",
    xpReward: 50,
    requirement: {
      type: "completion_count",
      value: 5,
      module: "reading",
    },
  },
  {
    id: "reading_enthusiast_2",
    name: "Reading Enthusiast II",
    description: "Complete 25 reading sessions",
    category: "progress",
    icon: "book",
    xpReward: 100,
    requirement: {
      type: "completion_count",
      value: 25,
      module: "reading",
    },
  },

  // Writing achievements
  {
    id: "writer_1",
    name: "Writer I",
    description: "Complete 5 writing sessions",
    category: "progress",
    icon: "pen",
    xpReward: 50,
    requirement: {
      type: "completion_count",
      value: 5,
      module: "writing",
    },
  },
  {
    id: "writer_2",
    name: "Writer II",
    description: "Complete 25 writing sessions",
    category: "progress",
    icon: "pen",
    xpReward: 100,
    requirement: {
      type: "completion_count",
      value: 25,
      module: "writing",
    },
  },

  // Listening achievements
  {
    id: "listener_1",
    name: "Listener I",
    description: "Complete 5 listening sessions",
    category: "progress",
    icon: "headphones",
    xpReward: 50,
    requirement: {
      type: "completion_count",
      value: 5,
      module: "listening",
    },
  },
  {
    id: "listener_2",
    name: "Listener II",
    description: "Complete 25 listening sessions",
    category: "progress",
    icon: "headphones",
    xpReward: 100,
    requirement: {
      type: "completion_count",
      value: 25,
      module: "listening",
    },
  },

  // Speaking achievements
  {
    id: "speaker_1",
    name: "Speaker I",
    description: "Complete 5 speaking sessions",
    category: "progress",
    icon: "mic",
    xpReward: 50,
    requirement: {
      type: "completion_count",
      value: 5,
      module: "speaking",
    },
  },
  {
    id: "speaker_2",
    name: "Speaker II",
    description: "Complete 25 speaking sessions",
    category: "progress",
    icon: "mic",
    xpReward: 100,
    requirement: {
      type: "completion_count",
      value: 25,
      module: "speaking",
    },
  },
];

// Milestone achievements - Based on reaching specific milestones
const milestoneAchievements: Achievement[] = [
  // Vocabulary milestones
  {
    id: "vocabulary_master_1",
    name: "Vocabulary Master I",
    description: "Master 50 vocabulary words",
    category: "milestone",
    icon: "book-open",
    xpReward: 100,
    requirement: {
      type: "mastered_words",
      value: 50,
    },
  },
  {
    id: "vocabulary_master_2",
    name: "Vocabulary Master II",
    description: "Master 200 vocabulary words",
    category: "milestone",
    icon: "book-open",
    xpReward: 250,
    requirement: {
      type: "mastered_words",
      value: 200,
    },
  },

  // Level milestones
  {
    id: "level_5",
    name: "Rising Star",
    description: "Reach level 5",
    category: "milestone",
    icon: "star",
    xpReward: 150,
    requirement: {
      type: "level",
      value: 5,
    },
  },
  {
    id: "level_10",
    name: "Language Explorer",
    description: "Reach level 10",
    category: "milestone",
    icon: "star",
    xpReward: 300,
    requirement: {
      type: "level",
      value: 10,
    },
  },

  // XP milestones
  {
    id: "xp_1000",
    name: "Experience Collector",
    description: "Earn 1000 XP",
    category: "milestone",
    icon: "award",
    xpReward: 100,
    requirement: {
      type: "total_xp",
      value: 1000,
    },
  },
  {
    id: "xp_5000",
    name: "XP Hunter",
    description: "Earn 5000 XP",
    category: "milestone",
    icon: "award",
    xpReward: 200,
    requirement: {
      type: "total_xp",
      value: 5000,
    },
  },
];

// Activity achievements - Based on specific actions
const activityAchievements: Achievement[] = [
  // Streak achievements
  {
    id: "consistent_learner_1",
    name: "Consistent Learner I",
    description: "Achieve a 7-day learning streak",
    category: "activity",
    icon: "calendar",
    xpReward: 75,
    requirement: {
      type: "streak",
      value: 7,
    },
  },
  {
    id: "consistent_learner_2",
    name: "Consistent Learner II",
    description: "Achieve a 30-day learning streak",
    category: "activity",
    icon: "calendar",
    xpReward: 200,
    requirement: {
      type: "streak",
      value: 30,
    },
  },

  // Daily activity
  {
    id: "daily_dedicated",
    name: "Daily Dedicated",
    description: "Complete activities on 20 different days",
    category: "activity",
    icon: "clock",
    xpReward: 100,
    requirement: {
      type: "active_days",
      value: 20,
    },
  },

  // Game achievements
  {
    id: "word_scrambler_1",
    name: "Word Scrambler I",
    description: "Complete 10 word scramble games",
    category: "activity",
    icon: "puzzle",
    xpReward: 50,
    requirement: {
      type: "game_completions",
      value: 10,
      module: "word-scramble",
    },
  },
];

// Skill achievements - Based on demonstrating skill mastery
const skillAchievements: Achievement[] = [
  // Reading comprehension
  {
    id: "comprehension_master",
    name: "Comprehension Master",
    description: "Achieve 90% or higher comprehension in 5 reading sessions",
    category: "skill",
    icon: "brain",
    xpReward: 150,
    requirement: {
      type: "high_comprehension",
      value: 5,
    },
  },

  // Grammar skills
  {
    id: "grammar_expert",
    name: "Grammar Expert",
    description: "Complete 10 grammar exercises with 90% or higher accuracy",
    category: "skill",
    icon: "check-square",
    xpReward: 150,
    requirement: {
      type: "high_grammar_accuracy",
      value: 10,
    },
  },

  // Speaking skills
  {
    id: "fluent_speaker",
    name: "Fluent Speaker",
    description: "Achieve excellent fluency scores in 5 speaking sessions",
    category: "skill",
    icon: "mic",
    xpReward: 200,
    requirement: {
      type: "high_fluency",
      value: 5,
    },
  },
];

// Special achievements - Unique achievements
const specialAchievements: Achievement[] = [
  {
    id: "all_rounder",
    name: "All-Rounder",
    description: "Complete at least one session in each learning module",
    category: "special",
    icon: "award",
    xpReward: 200,
    requirement: {
      type: "all_modules",
      value: 1,
    },
  },
  {
    id: "tenacious_learner",
    name: "Tenacious Learner",
    description: "Complete 100 total learning activities",
    category: "special",
    icon: "trending-up",
    xpReward: 250,
    requirement: {
      type: "total_activities",
      value: 100,
    },
  },
];

// Combine all achievements
export const achievements: Achievement[] = [
  ...progressAchievements,
  ...milestoneAchievements,
  ...activityAchievements,
  ...skillAchievements,
  ...specialAchievements,
];

// Helper function to lookup an achievement by ID
export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(achievement => achievement.id === id);
}

// Export achievement categories for filtering
export const achievementCategories = {
  progress: progressAchievements,
  milestone: milestoneAchievements,
  activity: activityAchievements,
  skill: skillAchievements,
  special: specialAchievements,
};
