import mongoose, { Document, Schema } from 'mongoose';

export interface IListeningSession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: {
    transcript: string;
    audioUrl: string;
    cloudinaryPublicId?: string;
  };
  level: string; // 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
  topic: string;
  duration: number;
  contentType: 'dialogue' | 'monologue' | 'news' | 'interview';
  questions: Array<{
    id: string;
    type: 'multiple-choice' | 'true-false' | 'fill-blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    timestamp: number;
  }>;
  vocabulary: Array<{
    word: string;
    definition: string;
    context: string;
    examples: string[];
    difficulty: number;
    timestamp: number;
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
    listenedSegments: Array<[number, number]>;
    replays: Array<{
      segment: [number, number];
      count: number;
    }>;
  };
  aiAnalysis: {
    listeningLevel: number;
    complexityScore: number;
    topicRelevance: number;
    suggestedNextTopics: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ListeningSessionSchema = new Schema<IListeningSession>(
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
      transcript: {
        type: String,
        required: true,
      },
      audioUrl: {
        type: String,
        required: true,
      },
      cloudinaryPublicId: String,
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
    duration: {
      type: Number,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['dialogue', 'monologue', 'news', 'interview'],
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
        timestamp: {
          type: Number,
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
        timestamp: {
          type: Number,
          required: true,
        },
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
      listenedSegments: {
        type: [[Number]],
        default: [],
      },
      replays: [
        {
          segment: {
            type: [Number],
            required: true,
            validate: {
              validator: function (v: number[]) {
                return v.length === 2 && v[0] <= v[1];
              },
              message:
                'Segment must be [startTime, endTime] with startTime <= endTime',
            },
          },
          count: {
            type: Number,
            required: true,
            default: 1,
          },
        },
      ],
    },
    aiAnalysis: {
      listeningLevel: {
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
ListeningSessionSchema.index({ userId: 1, createdAt: -1 });
ListeningSessionSchema.index({ level: 1, topic: 1 });
ListeningSessionSchema.index({ 'userProgress.comprehensionScore': 1 });
ListeningSessionSchema.index({ contentType: 1 });

// Ensure the model isn't already defined before creating it
export const ListeningSession =
  mongoose.models.ListeningSession ||
  mongoose.model<IListeningSession>('ListeningSession', ListeningSessionSchema);

export default ListeningSession;
