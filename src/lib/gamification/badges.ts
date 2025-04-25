// Badge configuration

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  category: string;
}

// Module-specific badges
const moduleBadges: Badge[] = [
  // Reading badges
  {
    id: "reading_bronze",
    name: "Reading Enthusiast",
    description: "Demonstrated dedication to reading practice",
    icon: "book",
    tier: "bronze",
    category: "reading",
  },
  {
    id: "reading_silver",
    name: "Reading Specialist",
    description: "Achieved excellence in reading comprehension",
    icon: "book",
    tier: "silver",
    category: "reading",
  },
  {
    id: "reading_gold",
    name: "Reading Expert",
    description: "Mastered advanced reading skills",
    icon: "book",
    tier: "gold",
    category: "reading",
  },

  // Writing badges
  {
    id: "writing_bronze",
    name: "Writing Enthusiast",
    description: "Demonstrated dedication to writing practice",
    icon: "pen",
    tier: "bronze",
    category: "writing",
  },
  {
    id: "writing_silver",
    name: "Writing Specialist",
    description: "Achieved excellence in writing skills",
    icon: "pen",
    tier: "silver",
    category: "writing",
  },
  {
    id: "writing_gold",
    name: "Writing Expert",
    description: "Mastered advanced writing skills",
    icon: "pen",
    tier: "gold",
    category: "writing",
  },

  // Listening badges
  {
    id: "listening_bronze",
    name: "Listening Enthusiast",
    description: "Demonstrated dedication to listening practice",
    icon: "headphones",
    tier: "bronze",
    category: "listening",
  },
  {
    id: "listening_silver",
    name: "Listening Specialist",
    description: "Achieved excellence in listening comprehension",
    icon: "headphones",
    tier: "silver",
    category: "listening",
  },
  {
    id: "listening_gold",
    name: "Listening Expert",
    description: "Mastered advanced listening skills",
    icon: "headphones",
    tier: "gold",
    category: "listening",
  },

  // Speaking badges
  {
    id: "speaking_bronze",
    name: "Speaking Enthusiast",
    description: "Demonstrated dedication to speaking practice",
    icon: "mic",
    tier: "bronze",
    category: "speaking",
  },
  {
    id: "speaking_silver",
    name: "Speaking Specialist",
    description: "Achieved excellence in speaking fluency",
    icon: "mic",
    tier: "silver",
    category: "speaking",
  },
  {
    id: "speaking_gold",
    name: "Speaking Expert",
    description: "Mastered advanced speaking skills",
    icon: "mic",
    tier: "gold",
    category: "speaking",
  },

  // Vocabulary badges
  {
    id: "vocabulary_bronze",
    name: "Vocabulary Enthusiast",
    description: "Built a solid foundation of vocabulary",
    icon: "book-open",
    tier: "bronze",
    category: "vocabulary",
  },
  {
    id: "vocabulary_silver",
    name: "Vocabulary Specialist",
    description: "Expanded vocabulary knowledge significantly",
    icon: "book-open",
    tier: "silver",
    category: "vocabulary",
  },
  {
    id: "vocabulary_gold",
    name: "Vocabulary Expert",
    description: "Mastered an extensive vocabulary",
    icon: "book-open",
    tier: "gold",
    category: "vocabulary",
  },

  // Grammar badges
  {
    id: "grammar_bronze",
    name: "Grammar Enthusiast",
    description: "Built a solid foundation of grammar knowledge",
    icon: "check-square",
    tier: "bronze",
    category: "grammar",
  },
  {
    id: "grammar_silver",
    name: "Grammar Specialist",
    description: "Achieved excellence in grammar application",
    icon: "check-square",
    tier: "silver",
    category: "grammar",
  },
  {
    id: "grammar_gold",
    name: "Grammar Expert",
    description: "Mastered advanced grammar concepts",
    icon: "check-square",
    tier: "gold",
    category: "grammar",
  },

  // Games badges
  {
    id: "games_bronze",
    name: "Game Enthusiast",
    description: "Enjoyed learning through games",
    icon: "puzzle",
    tier: "bronze",
    category: "games",
  },
  {
    id: "games_silver",
    name: "Game Specialist",
    description: "Achieved high scores in multiple games",
    icon: "puzzle",
    tier: "silver",
    category: "games",
  },
  {
    id: "games_gold",
    name: "Game Expert",
    description: "Mastered all language learning games",
    icon: "puzzle",
    tier: "gold",
    category: "games",
  },
];

// Cross-module badges
const crossModuleBadges: Badge[] = [
  {
    id: "all_rounder_bronze",
    name: "All-Rounder",
    description: "Balanced practice across all learning modules",
    icon: "star",
    tier: "bronze",
    category: "cross-module",
  },
  {
    id: "all_rounder_silver",
    name: "Versatile Learner",
    description: "Achieved excellence across all learning modules",
    icon: "star",
    tier: "silver",
    category: "cross-module",
  },
  {
    id: "all_rounder_gold",
    name: "Language Master",
    description: "Mastered all aspects of language learning",
    icon: "star",
    tier: "gold",
    category: "cross-module",
  },
  {
    id: "all_rounder_platinum",
    name: "Polyglot",
    description:
      "Achieved extraordinary proficiency across all language skills",
    icon: "award",
    tier: "platinum",
    category: "cross-module",
  },
  {
    id: "streak_master_bronze",
    name: "Streak Master",
    description: "Maintained a consistent learning habit",
    icon: "calendar",
    tier: "bronze",
    category: "cross-module",
  },
  {
    id: "streak_master_silver",
    name: "Habit Builder",
    description: "Built a strong, consistent learning routine",
    icon: "calendar",
    tier: "silver",
    category: "cross-module",
  },
  {
    id: "streak_master_gold",
    name: "Dedication Champion",
    description: "Demonstrated exceptional dedication to daily learning",
    icon: "calendar",
    tier: "gold",
    category: "cross-module",
  },
];

// Special badges
const specialBadges: Badge[] = [
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Joined the AI Coach platform in its early days",
    icon: "flag",
    tier: "bronze",
    category: "special",
  },
  {
    id: "challenge_champion",
    name: "Challenge Champion",
    description: "Completed 50 daily challenges",
    icon: "target",
    tier: "silver",
    category: "special",
  },
  {
    id: "feedback_contributor",
    name: "Feedback Contributor",
    description: "Provided valuable feedback to improve the platform",
    icon: "message-square",
    tier: "bronze",
    category: "special",
  },
];

// Combine all badges
export const badges: Badge[] = [
  ...moduleBadges,
  ...crossModuleBadges,
  ...specialBadges,
];

// Helper function to lookup a badge by ID
export function getBadgeById(id: string): Badge | undefined {
  return badges.find(badge => badge.id === id);
}

// Get badges by category
export function getBadgesByCategory(category: string): Badge[] {
  return badges.filter(badge => badge.category === category);
}

// Get badges by tier
export function getBadgesByTier(
  tier: "bronze" | "silver" | "gold" | "platinum"
): Badge[] {
  return badges.filter(badge => badge.tier === tier);
}

// Export badge categories for filtering
export const badgeCategories = {
  module: moduleBadges,
  crossModule: crossModuleBadges,
  special: specialBadges,
};
