import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISkillAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  questions: Array<{
    id: string;
    type: "reading" | "grammar" | "vocabulary" | "listening";
    question: string;
    passage?: string; // For reading questions
    options?: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
    difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    timeSpent?: number; // in seconds
  }>;
  results: {
    totalQuestions: number;
    correctAnswers: number;
    overallScore: number; // percentage
    skillScores: {
      reading: number;
      grammar: number;
      vocabulary: number;
      listening: number;
    };
    recommendedLevel: string;
    weakAreas: string[];
    strengths: string[];
    timeSpent: number; // total time in seconds
  };
  status: "in_progress" | "completed" | "abandoned";
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const skillAssessmentSchema = new Schema<ISkillAssessment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questions: [
      {
        id: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["reading", "grammar", "vocabulary", "listening"],
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        passage: {
          type: String,
          required: false, // Only for reading questions
        },
        options: {
          type: [String],
          required: false, // Not all questions have multiple choice
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        userAnswer: {
          type: String,
          required: false,
        },
        isCorrect: {
          type: Boolean,
          required: false,
        },
        difficulty: {
          type: String,
          enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
          required: true,
        },
        timeSpent: {
          type: Number,
          required: false,
          default: 0,
        },
      },
    ],
    results: {
      totalQuestions: {
        type: Number,
        required: true,
        default: 0,
      },
      correctAnswers: {
        type: Number,
        required: true,
        default: 0,
      },
      overallScore: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100,
      },
      skillScores: {
        reading: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        grammar: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        vocabulary: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        listening: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
      recommendedLevel: {
        type: String,
        enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
        required: true,
        default: "B1",
      },
      weakAreas: {
        type: [String],
        default: [],
      },
      strengths: {
        type: [String],
        default: [],
      },
      timeSpent: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
skillAssessmentSchema.index({ userId: 1, createdAt: -1 });
skillAssessmentSchema.index({ status: 1 });
skillAssessmentSchema.index({ "results.recommendedLevel": 1 });

const SkillAssessment =
  (mongoose.models.SkillAssessment as Model<ISkillAssessment>) ||
  mongoose.model<ISkillAssessment>("SkillAssessment", skillAssessmentSchema);

export default SkillAssessment;
