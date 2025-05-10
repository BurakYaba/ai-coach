import mongoose, { Document, Schema } from "mongoose";

export interface IGamificationProfile extends Document {
  userId: mongoose.Types.ObjectId;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
  achievements: Array<{
    id: string;
    unlockedAt: Date;
  }>;
  badges: Array<{
    id: string;
    unlockedAt: Date;
  }>;
  stats: {
    totalXP: number;
    activeDays: number;
    moduleActivity: {
      reading: number;
      writing: number;
      listening: number;
      speaking: number;
      vocabulary: number;
      grammar: number;
      games: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Local implementation of XP calculation to avoid circular dependency
function xpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 0; // Level 1 starts at 0 XP
  if (level === 2) return 100; // Level 2 starts at 100 XP

  // For Level 3 and above, use increasing XP requirements
  // Level 3: 250 XP (100 + 150)
  // Level 4: 450 XP (100 + 150 + 200)
  // Level 5: 700 XP (100 + 150 + 200 + 250)
  // And so on...

  let totalXP = 100; // Starting with requirement for Level 2
  let increment = 150; // Initial increment (for Level 3)

  for (let i = 3; i <= level; i++) {
    totalXP += increment;
    increment += 50; // Each level requires 50 more XP than the previous increment
  }

  return totalXP;
}

// Local implementation of level calculation to avoid circular dependency
function calculateLevelFromXP(xp: number): {
  level: number;
  experienceToNextLevel: number;
} {
  // Handle special case of 0 XP
  if (xp === 0) {
    return {
      level: 1,
      experienceToNextLevel: 100,
    };
  }

  // Find the level where user's XP puts them
  let level = 1;

  // Keep incrementing level as long as XP is >= the threshold for that level
  while (xp >= xpForLevel(level)) {
    level++;
  }

  // Adjust back since we went one level too far
  level--;

  // Add 1 to level to match user expectations (100 XP = Level 2, not Level 1)
  level += 1;

  // Ensure level is at least 1
  level = Math.max(level, 1);

  // Calculate XP thresholds based on the adjusted level
  const currentLevelXP = xpForLevel(level - 1); // XP threshold for current level
  const nextLevelXP = xpForLevel(level); // XP threshold for next level

  // Calculate XP needed for the next level
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;

  return {
    level,
    experienceToNextLevel: xpNeededForNextLevel,
  };
}

const GamificationProfileSchema = new Schema<IGamificationProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    experienceToNextLevel: {
      type: Number,
      default: 100, // Level 1 requires 100 XP based on the new formula
    },
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastActivity: {
        type: Date,
        default: () => new Date(),
      },
    },
    achievements: [
      {
        id: {
          type: String,
          required: true,
        },
        unlockedAt: {
          type: Date,
          default: () => new Date(),
        },
      },
    ],
    badges: [
      {
        id: {
          type: String,
          required: true,
        },
        unlockedAt: {
          type: Date,
          default: () => new Date(),
        },
      },
    ],
    stats: {
      totalXP: {
        type: Number,
        default: 0,
      },
      activeDays: {
        type: Number,
        default: 0,
      },
      moduleActivity: {
        reading: {
          type: Number,
          default: 0,
        },
        writing: {
          type: Number,
          default: 0,
        },
        listening: {
          type: Number,
          default: 0,
        },
        speaking: {
          type: Number,
          default: 0,
        },
        vocabulary: {
          type: Number,
          default: 0,
        },
        grammar: {
          type: Number,
          default: 0,
        },
        games: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to ensure level is calculated correctly
GamificationProfileSchema.pre("save", function (next) {
  // Only recalculate if experience field has been modified
  if (this.isModified("experience")) {
    try {
      // Get the calculated level based on current experience
      const { level, experienceToNextLevel } = calculateLevelFromXP(
        this.experience
      );

      // Update the level and experienceToNextLevel
      this.level = level;
      this.experienceToNextLevel = experienceToNextLevel;

      console.log(
        `Pre-save: Updated level to ${level} based on XP ${this.experience}`
      );
    } catch (error) {
      console.error("Error calculating level in pre-save hook:", error);
    }
  }

  next();
});

// Default export handling for Next.js dynamic imports
let GamificationProfile: mongoose.Model<IGamificationProfile>;

try {
  // Try to get the existing model to prevent OverwriteModelError
  GamificationProfile = mongoose.model<IGamificationProfile>(
    "GamificationProfile"
  );
} catch (error) {
  // Model doesn't exist yet, so create it
  GamificationProfile = mongoose.model<IGamificationProfile>(
    "GamificationProfile",
    GamificationProfileSchema
  );
}

export default GamificationProfile;
