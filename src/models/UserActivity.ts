import mongoose, { Document, Schema } from "mongoose";

export interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: string;
  module: string;
  xpEarned: number;
  metadata: Record<string, any>;
  createdAt: Date;
}

const UserActivitySchema = new Schema<IUserActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    xpEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for efficient queries
UserActivitySchema.index({ userId: 1, createdAt: -1 });
UserActivitySchema.index({ userId: 1, module: 1, activityType: 1 });

// Default export handling for Next.js dynamic imports
let UserActivity: mongoose.Model<IUserActivity>;

try {
  // Try to get the existing model to prevent OverwriteModelError
  UserActivity = mongoose.model<IUserActivity>("UserActivity");
} catch (error) {
  // Model doesn't exist yet, so create it
  UserActivity = mongoose.model<IUserActivity>(
    "UserActivity",
    UserActivitySchema
  );
}

export default UserActivity;
