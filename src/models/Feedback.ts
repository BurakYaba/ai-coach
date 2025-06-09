import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  user: {
    name: string;
    email: string;
  };
  rating: number; // 1-5 star rating
  category:
    | "general"
    | "features"
    | "usability"
    | "content"
    | "performance"
    | "bug_report";
  subject: string;
  message: string;
  status: "new" | "in_review" | "resolved" | "dismissed";
  adminNotes?: string;
  adminResponse?: string;
  respondedAt?: Date;
  respondedBy?: mongoose.Types.ObjectId;
  metadata: {
    userAgent?: string;
    currentPage?: string;
    deviceInfo?: string;
    appVersion?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    user: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "general",
        "features",
        "usability",
        "content",
        "performance",
        "bug_report",
      ],
      default: "general",
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["new", "in_review", "resolved", "dismissed"],
      default: "new",
      index: true,
    },
    adminNotes: {
      type: String,
      required: false,
      maxlength: 1000,
    },
    adminResponse: {
      type: String,
      required: false,
      maxlength: 1000,
    },
    respondedAt: {
      type: Date,
      required: false,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    metadata: {
      userAgent: {
        type: String,
        required: false,
      },
      currentPage: {
        type: String,
        required: false,
      },
      deviceInfo: {
        type: String,
        required: false,
      },
      appVersion: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient queries
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ rating: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, createdAt: -1 });

const Feedback =
  (mongoose.models.Feedback as Model<IFeedback>) ||
  mongoose.model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;
