import mongoose, { Document, Schema } from 'mongoose';

export interface IGrammarIssue extends Document {
  userId: mongoose.Types.ObjectId;
  sourceModule: 'writing' | 'speaking';
  sourceSessionId: mongoose.Types.ObjectId;
  issue: {
    type: string; // e.g., 'subject-verb agreement', 'tense error', etc.
    text: string; // The text that contains the error
    correction: string; // The corrected text
    explanation: string; // Explanation of the grammar rule
  };
  ceferLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string; // Grammar category: tenses, articles, prepositions, etc.
  resolved: boolean; // Whether the user has marked this as resolved
  reviewSchedule: {
    nextReviewDate: Date; // When this issue should be reviewed next
    reviewCount: number; // How many times it has been reviewed
    lastReviewedAt?: Date; // When it was last reviewed
    interval: number; // Current interval in days for spaced repetition
  };
  priority: number; // Priority score (higher = more important to review)
  createdAt: Date;
  updatedAt: Date;
}

const GrammarIssueSchema = new Schema<IGrammarIssue>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sourceModule: {
      type: String,
      enum: ['writing', 'speaking'],
      required: true,
    },
    sourceSessionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    issue: {
      type: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      correction: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
    ceferLevel: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    reviewSchedule: {
      nextReviewDate: {
        type: Date,
        default: Date.now,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
      lastReviewedAt: {
        type: Date,
        default: null,
      },
      interval: {
        type: Number,
        default: 1, // Start with 1 day interval
      },
    },
    priority: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
GrammarIssueSchema.index({ userId: 1, category: 1 });
GrammarIssueSchema.index({ userId: 1, ceferLevel: 1 });
GrammarIssueSchema.index({ userId: 1, resolved: 1 });
GrammarIssueSchema.index({ userId: 1, 'reviewSchedule.nextReviewDate': 1 }); // For spaced repetition
GrammarIssueSchema.index({ userId: 1, priority: -1 }); // For finding high-priority issues

const GrammarIssue =
  (mongoose.models.GrammarIssue as mongoose.Model<IGrammarIssue>) ||
  mongoose.model<IGrammarIssue>('GrammarIssue', GrammarIssueSchema);

export default GrammarIssue;
