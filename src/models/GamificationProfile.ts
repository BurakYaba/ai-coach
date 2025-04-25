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
      default: 100, // Initial XP needed for level 2
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
