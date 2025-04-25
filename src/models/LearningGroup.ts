import mongoose, { Document, Schema } from "mongoose";

export interface ILearningGroup extends Document {
  name: string;
  description: string;
  members: Array<{
    userId: mongoose.Types.ObjectId;
    role: "admin" | "member";
    joinedAt: Date;
  }>;
  settings: {
    isPrivate: boolean;
    joinRequireApproval: boolean;
  };
  stats: {
    totalXP: number;
    activeMembers: number;
    averageStreak: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LearningGroupSchema = new Schema<ILearningGroup>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: () => new Date(),
        },
      },
    ],
    settings: {
      isPrivate: {
        type: Boolean,
        default: false,
      },
      joinRequireApproval: {
        type: Boolean,
        default: true,
      },
    },
    stats: {
      totalXP: {
        type: Number,
        default: 0,
      },
      activeMembers: {
        type: Number,
        default: 0,
      },
      averageStreak: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indices for efficient queries
LearningGroupSchema.index({ name: "text", description: "text" });
LearningGroupSchema.index({ "members.userId": 1 });
LearningGroupSchema.index({ "settings.isPrivate": 1 });

// Default export handling for Next.js dynamic imports
let LearningGroup: mongoose.Model<ILearningGroup>;

try {
  // Try to get the existing model to prevent OverwriteModelError
  LearningGroup = mongoose.model<ILearningGroup>("LearningGroup");
} catch (error) {
  // Model doesn't exist yet, so create it
  LearningGroup = mongoose.model<ILearningGroup>(
    "LearningGroup",
    LearningGroupSchema
  );
}

export default LearningGroup;
