import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  image?: string;
  role: "user" | "school_admin" | "admin";
  school?: mongoose.Types.ObjectId;
  branch?: mongoose.Types.ObjectId;
  languageLevel: string;
  learningPreferences: {
    topics: string[];
    dailyGoal: number;
    preferredLearningTime: string[];
  };
  progress: {
    readingLevel: number;
    writingLevel: number;
    speakingLevel: number;
    totalPoints: number;
    streak: number;
  };
  subscription: {
    type: "free" | "monthly" | "annual";
    startDate?: Date;
    endDate?: Date;
    status: "active" | "expired" | "pending";
    managedBy?: mongoose.Types.ObjectId;
  };
  settings: {
    emailNotifications: boolean;
    progressReminders: boolean;
    theme: "light" | "dark" | "system";
  };
  // Grammar-specific fields
  grammarProgress: {
    badges: {
      name: string;
      category: string;
      level: string;
      earnedAt: Date;
    }[];
    mastery: {
      category: string;
      level: number; // 1-5 scale
      lastPracticed: Date;
    }[];
    lastDailyChallenge?: Date;
    challengeStreak: number;
    savedFlashcards?: string[]; // IDs of saved flashcards
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasActiveSubscription(): boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "school_admin", "admin"],
      default: "user",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: false,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: false,
    },
    languageLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    learningPreferences: {
      topics: [
        {
          type: String,
          enum: [
            "general",
            "business",
            "academic",
            "travel",
            "culture",
            "technology",
          ],
        },
      ],
      dailyGoal: {
        type: Number,
        default: 30, // minutes
      },
      preferredLearningTime: [
        {
          type: String,
          enum: ["morning", "afternoon", "evening", "night"],
        },
      ],
    },
    progress: {
      readingLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      writingLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      speakingLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      totalPoints: {
        type: Number,
        default: 0,
      },
      streak: {
        type: Number,
        default: 0,
      },
    },
    subscription: {
      type: {
        type: String,
        enum: ["free", "monthly", "annual"],
        default: "free",
      },
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      status: {
        type: String,
        enum: ["active", "expired", "pending"],
        default: "pending",
      },
      managedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      progressReminders: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    // Grammar-specific progress fields
    grammarProgress: {
      badges: [
        {
          name: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            required: true,
          },
          level: {
            type: String,
            enum: ["bronze", "silver", "gold"],
            default: "bronze",
          },
          earnedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      mastery: [
        {
          category: {
            type: String,
            required: true,
          },
          level: {
            type: Number,
            min: 1,
            max: 5,
            default: 1,
          },
          lastPracticed: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      lastDailyChallenge: {
        type: Date,
        default: null,
      },
      challengeStreak: {
        type: Number,
        default: 0,
      },
      savedFlashcards: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for common query patterns
userSchema.index({ email: 1, createdAt: 1 });
userSchema.index({ "grammarProgress.lastDailyChallenge": 1 }); // For daily challenge queries
userSchema.index({ school: 1, role: 1 }); // For querying users by school and role
userSchema.index({ branch: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has an active subscription
userSchema.methods.hasActiveSubscription = function (): boolean {
  // First, check if endDate is in the past
  if (
    this.subscription.endDate &&
    new Date(this.subscription.endDate) < new Date()
  ) {
    // If subscription has expired, it should not be considered active regardless of status
    return false;
  }

  // Then check if status is active and either no endDate or endDate is in the future
  return (
    this.subscription.status === "active" &&
    (!this.subscription.endDate ||
      new Date(this.subscription.endDate) > new Date())
  );
};

// Delete password when converting to JSON
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
