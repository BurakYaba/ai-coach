import mongoose, { Document, Schema } from 'mongoose';

export interface IReadingSession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  level: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
  questions: Array<{
    id: string;
    type: 'multiple-choice' | 'true-false' | 'fill-blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  vocabulary: Array<{
    word: string;
    definition: string;
    context: string;
    examples: string[];
    difficulty: number;
  }>;
  grammarFocus: Array<{
    pattern: string;
    explanation: string;
    examples: string[];
  }>;
  userProgress: {
    startTime: Date;
    completionTime?: Date;
    timeSpent: number;
    questionsAnswered: number;
    correctAnswers: number;
    vocabularyReviewed: string[];
    comprehensionScore: number;
    userAnswers?: Record<string, string>;
    vocabularyBankAdded?: string[];
  };
  aiAnalysis: {
    readingLevel: number;
    complexityScore: number;
    topicRelevance: number;
    suggestedNextTopics: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReadingSessionSchema = new Schema<IReadingSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    topic: {
      type: String,
      required: true,
      index: true,
    },
    wordCount: {
      type: Number,
      required: true,
    },
    estimatedReadingTime: {
      type: Number,
      required: true,
    },
    questions: [
      {
        id: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['multiple-choice', 'true-false', 'fill-blank'],
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        options: [String],
        correctAnswer: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
          required: true,
        },
      },
    ],
    vocabulary: [
      {
        word: {
          type: String,
          required: true,
        },
        definition: {
          type: String,
          required: true,
        },
        context: {
          type: String,
          required: true,
        },
        examples: [String],
        difficulty: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
      },
    ],
    grammarFocus: [
      {
        pattern: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
          required: true,
        },
        examples: [String],
      },
    ],
    userProgress: {
      startTime: {
        type: Date,
        required: true,
        default: Date.now,
      },
      completionTime: Date,
      timeSpent: {
        type: Number,
        default: 0,
      },
      questionsAnswered: {
        type: Number,
        default: 0,
      },
      correctAnswers: {
        type: Number,
        default: 0,
      },
      vocabularyReviewed: [String],
      comprehensionScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      userAnswers: {
        type: Map,
        of: String,
      },
      vocabularyBankAdded: [String],
    },
    aiAnalysis: {
      readingLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      complexityScore: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      topicRelevance: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      suggestedNextTopics: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ReadingSessionSchema.index({ userId: 1, createdAt: -1 });
ReadingSessionSchema.index({ level: 1, topic: 1 });
ReadingSessionSchema.index({ 'userProgress.comprehensionScore': 1 });

// Ensure the model isn't already defined before creating it
export const ReadingSession =
  mongoose.models.ReadingSession ||
  mongoose.model<IReadingSession>('ReadingSession', ReadingSessionSchema);

export default ReadingSession;
