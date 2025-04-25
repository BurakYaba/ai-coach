import mongoose, { Document, Schema } from "mongoose";

export interface ILeaderboard extends Document {
  type: "weekly" | "monthly" | "all-time";
  category: "xp" | "streak" | "module-specific";
  moduleType?: string; // For module-specific leaderboards
  entries: Array<{
    userId: mongoose.Types.ObjectId;
    username: string;
    avatarUrl?: string;
    value: number;
    rank: number;
  }>;
  refreshedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    type: {
      type: String,
      required: true,
      enum: ["weekly", "monthly", "all-time"],
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["xp", "streak", "module-specific"],
      index: true,
    },
    moduleType: {
      type: String,
      required: false,
    },
    entries: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        avatarUrl: {
          type: String,
        },
        value: {
          type: Number,
          required: true,
        },
        rank: {
          type: Number,
          required: true,
        },
      },
    ],
    refreshedAt: {
      type: Date,
      default: () => new Date(),
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indices for efficient queries
LeaderboardSchema.index({ type: 1, category: 1 });
LeaderboardSchema.index({ type: 1, category: 1, moduleType: 1 });

// Default export handling for Next.js dynamic imports
let Leaderboard: mongoose.Model<ILeaderboard>;

try {
  // Try to get the existing model to prevent OverwriteModelError
  Leaderboard = mongoose.model<ILeaderboard>("Leaderboard");
} catch (error) {
  // Model doesn't exist yet, so create it
  Leaderboard = mongoose.model<ILeaderboard>("Leaderboard", LeaderboardSchema);
}

export default Leaderboard;
