import mongoose, { Document, Schema } from "mongoose";

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  challengeType: "daily" | "weekly";
  challenges: Array<{
    id: string;
    description: string;
    module: string;
    target: number;
    progress: number;
    completed: boolean;
    xpReward: number;
  }>;
  refreshedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    challengeType: {
      type: String,
      required: true,
      enum: ["daily", "weekly"],
      index: true,
    },
    challenges: [
      {
        id: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        module: {
          type: String,
          required: true,
        },
        target: {
          type: Number,
          required: true,
        },
        progress: {
          type: Number,
          default: 0,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        xpReward: {
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

// Create indices for efficient queries
ChallengeSchema.index({ userId: 1, challengeType: 1 });
ChallengeSchema.index({ expiresAt: 1 });

// Default export handling for Next.js dynamic imports
let Challenge: mongoose.Model<IChallenge>;

try {
  // Try to get the existing model to prevent OverwriteModelError
  Challenge = mongoose.model<IChallenge>("Challenge");
} catch (error) {
  // Model doesn't exist yet, so create it
  Challenge = mongoose.model<IChallenge>("Challenge", ChallengeSchema);
}

export default Challenge;
