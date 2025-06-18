import mongoose, { Document, Schema, Model } from "mongoose";
import dbConnect from "@/lib/db";

export interface IUserSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionToken: string; // Unique identifier for this session
  deviceInfo: {
    userAgent: string;
    ip: string;
    deviceType: "desktop" | "mobile" | "tablet" | "unknown";
    browser: string;
    os: string;
    location?: {
      country?: string;
      city?: string;
    };
  };
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isActive: boolean;
  terminatedAt?: Date;
  terminationReason?: "logout" | "concurrent_login" | "expired" | "forced";

  // Instance methods
  isValidSession(): boolean;
  updateActivity(): Promise<void>;
}

// Interface for static methods
export interface IUserSessionModel extends Model<IUserSession> {
  getActiveSession(userId: string): Promise<IUserSession | null>;
  terminateSession(sessionToken: string, reason?: string): Promise<boolean>;
  cleanupExpiredSessions(): Promise<number>;
}

const userSessionSchema = new Schema<IUserSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deviceInfo: {
      userAgent: {
        type: String,
        required: true,
      },
      ip: {
        type: String,
        required: true,
      },
      deviceType: {
        type: String,
        enum: ["desktop", "mobile", "tablet", "unknown"],
        default: "unknown",
      },
      browser: {
        type: String,
        required: true,
      },
      os: {
        type: String,
        required: true,
      },
      location: {
        country: {
          type: String,
          required: false,
        },
        city: {
          type: String,
          required: false,
        },
      },
    },
    lastActivity: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    terminatedAt: {
      type: Date,
      required: false,
    },
    terminationReason: {
      type: String,
      enum: ["logout", "concurrent_login", "expired", "forced"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
userSessionSchema.index({ userId: 1, isActive: 1 });
userSessionSchema.index({ userId: 1, createdAt: -1 });
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired sessions

// Pre-save middleware to ensure only one active session per user
// Now that we have proper logout and browser close cleanup, this is safe to use
userSessionSchema.pre("save", async function (next) {
  if (this.isNew && this.isActive) {
    // Terminate all other active sessions for this user
    await this.model("UserSession").updateMany(
      {
        userId: this.userId,
        _id: { $ne: this._id },
        isActive: true,
      },
      {
        $set: {
          isActive: false,
          terminatedAt: new Date(),
          terminationReason: "concurrent_login",
        },
      }
    );
  }
  next();
});

// Method to check if session is still valid
userSessionSchema.methods.isValidSession = function (): boolean {
  const now = new Date();
  const lastActivityThreshold = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago (much shorter)

  return (
    this.isActive &&
    now < this.expiresAt &&
    this.lastActivity > lastActivityThreshold
  );
};

// Method to update last activity
userSessionSchema.methods.updateActivity = async function (): Promise<void> {
  this.lastActivity = new Date();
  await this.save();
};

// Static method to get active session for user
userSessionSchema.statics.getActiveSession = async function (
  userId: string
): Promise<IUserSession | null> {
  return this.findOne({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
};

// Static method to terminate session
userSessionSchema.statics.terminateSession = async function (
  sessionToken: string,
  reason: string = "logout"
): Promise<boolean> {
  const result = await this.updateOne(
    { sessionToken, isActive: true },
    {
      $set: {
        isActive: false,
        terminatedAt: new Date(),
        terminationReason: reason,
      },
    }
  );

  return result.modifiedCount > 0;
};

// Static method to cleanup expired sessions
userSessionSchema.statics.cleanupExpiredSessions =
  async function (): Promise<number> {
    const result = await this.updateMany(
      {
        $or: [
          { expiresAt: { $lt: new Date() } },
          {
            lastActivity: {
              $lt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours (updated from 24 hours)
            },
            isActive: true,
          },
        ],
      },
      {
        $set: {
          isActive: false,
          terminatedAt: new Date(),
          terminationReason: "expired",
        },
      }
    );

    return result.modifiedCount;
  };

// Function to get UserSession model with proper connection
const getUserSessionModel = async () => {
  await dbConnect();
  return (mongoose.models?.UserSession ||
    mongoose.model<IUserSession, IUserSessionModel>(
      "UserSession",
      userSessionSchema
    )) as IUserSessionModel;
};

const UserSession = (mongoose.models?.UserSession ||
  mongoose.model<IUserSession, IUserSessionModel>(
    "UserSession",
    userSessionSchema
  )) as IUserSessionModel;

export default UserSession;
export { getUserSessionModel };
