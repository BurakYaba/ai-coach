import mongoose, { Document, Schema } from 'mongoose';

export interface IGrammarLesson extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: string; // Grammar category: tenses, articles, prepositions, etc.
  ceferLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  content: {
    explanation: string; // Detailed explanation of the grammar rule
    examples: Array<{
      correct: string;
      incorrect: string;
      explanation: string;
    }>;
    exercises: Array<{
      question: string;
      options?: string[]; // For multiple choice questions
      correctAnswer: string;
      explanation: string;
    }>;
  };
  relatedIssues: mongoose.Types.ObjectId[]; // References to GrammarIssue documents
  completed: boolean; // Whether the user has completed this lesson
  score?: number; // User's score on the exercises
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema({
  correct: {
    type: String,
    required: true,
  },
  incorrect: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const ExerciseSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: false,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const GrammarLessonSchema = new Schema<IGrammarLesson>(
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
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    ceferLevel: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
    },
    content: {
      explanation: {
        type: String,
        required: true,
      },
      examples: [ExampleSchema],
      exercises: [ExerciseSchema],
    },
    relatedIssues: [
      {
        type: Schema.Types.ObjectId,
        ref: 'GrammarIssue',
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: false,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
GrammarLessonSchema.index({ userId: 1, category: 1 });
GrammarLessonSchema.index({ userId: 1, ceferLevel: 1 });
GrammarLessonSchema.index({ userId: 1, completed: 1 });

const GrammarLesson =
  (mongoose.models.GrammarLesson as mongoose.Model<IGrammarLesson>) ||
  mongoose.model<IGrammarLesson>('GrammarLesson', GrammarLessonSchema);

export default GrammarLesson;
