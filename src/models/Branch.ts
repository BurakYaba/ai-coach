import mongoose, { Document, Model, Schema } from "mongoose";
import { generateUniqueCode } from "@/lib/utils";

export interface IBranch extends Document {
  name: string;
  school: mongoose.Types.ObjectId;
  location: {
    address?: string;
    city?: string;
    country?: string;
  };
  contactInfo?: {
    name?: string;
    email?: string;
  };
  registrationCode: string;
  admins: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
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
    contactInfo: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
    },
    registrationCode: {
      type: String,
      required: true,
      unique: true,
      default: () => generateUniqueCode(6),
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

// Add indexes for common query patterns
branchSchema.index({ school: 1 });
branchSchema.index({ registrationCode: 1 }, { unique: true });
branchSchema.index({ admins: 1 });

const Branch =
  (mongoose.models.Branch as Model<IBranch>) ||
  mongoose.model<IBranch>("Branch", branchSchema);

export default Branch;
