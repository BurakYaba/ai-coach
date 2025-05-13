import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISchool extends Document {
  name: string;
  location: {
    address?: string;
    city?: string;
    country?: string;
  };
  subscription: {
    type: "free" | "monthly" | "annual";
    maxUsers: number;
    startDate?: Date;
    endDate?: Date;
    status: "active" | "expired" | "pending";
  };
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
  };
  admins: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  hasActiveSubscription(): boolean;
  canAddMoreUsers(currentUserCount: number): boolean;
}

const schoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
    },
    subscription: {
      type: {
        type: String,
        enum: ["free", "monthly", "annual"],
        default: "free",
      },
      maxUsers: {
        type: Number,
        default: 0,
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
    },
    primaryContact: {
      name: {
        type: String,
        required: [true, "Primary contact name is required"],
      },
      email: {
        type: String,
        required: [true, "Primary contact email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      },
      phone: {
        type: String,
        required: false,
      },
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if school has an active subscription
schoolSchema.methods.hasActiveSubscription = function (): boolean {
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

// Check if school can add more users based on subscription limit
schoolSchema.methods.canAddMoreUsers = function (
  currentUserCount: number
): boolean {
  if (!this.hasActiveSubscription()) {
    return false;
  }

  // If maxUsers is 0, there's no limit
  if (this.subscription.maxUsers === 0) {
    return true;
  }

  return currentUserCount < this.subscription.maxUsers;
};

// Add indexes for common query patterns
schoolSchema.index({ "subscription.status": 1 });
schoolSchema.index({ "primaryContact.email": 1 });
schoolSchema.index({ admins: 1 });

const School =
  (mongoose.models.School as Model<ISchool>) ||
  mongoose.model<ISchool>("School", schoolSchema);

export default School;
