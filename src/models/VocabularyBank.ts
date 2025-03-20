import mongoose, { Document, Schema } from 'mongoose';

export interface IVocabularyBank extends Document {
  userId: mongoose.Types.ObjectId;
  words: Array<{
    word: string;
    definition: string;
    context: string[];
    examples: string[];
    pronunciation: string;
    partOfSpeech: string;
    difficulty: number;
    mastery: number;
    lastReviewed: Date;
    nextReview: Date;
    easinessFactor: number; // SM-2 algorithm parameter
    repetitions: number; // SM-2 algorithm parameter
    interval: number; // SM-2 algorithm parameter (in days)
    reviewHistory: Array<{
      date: Date;
      performance: number;
      context: string;
    }>;
    tags: string[];
    source: {
      type: string;
      id: mongoose.Types.ObjectId;
      title: string;
    };
  }>;
  stats: {
    totalWords: number;
    masteredWords: number;
    learningWords: number;
    needsReviewWords: number;
    averageMastery: number;
    lastStudySession: Date;
    studyStreak: number;
  };
  settings: {
    dailyWordGoal: number;
    reviewFrequency: 'daily' | 'spaced' | 'custom';
    customReviewIntervals?: number[];
    notificationsEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VocabularyBankSchema = new Schema<IVocabularyBank>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    words: [
      {
        word: {
          type: String,
          required: true,
          trim: true,
        },
        definition: {
          type: String,
          required: true,
        },
        context: [String],
        examples: [String],
        pronunciation: String,
        partOfSpeech: {
          type: String,
          enum: [
            'noun',
            'verb',
            'adjective',
            'adverb',
            'preposition',
            'conjunction',
            'interjection',
            'other',
          ],
          required: true,
        },
        difficulty: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
        mastery: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
          default: 0,
        },
        lastReviewed: {
          type: Date,
          default: Date.now,
        },
        nextReview: {
          type: Date,
          required: true,
          default: Date.now,
        },
        easinessFactor: {
          type: Number,
          default: 2.5,
          min: 1.3,
        },
        repetitions: {
          type: Number,
          default: 0,
          min: 0,
        },
        interval: {
          type: Number,
          default: 0,
          min: 0,
        },
        reviewHistory: [
          {
            date: {
              type: Date,
              required: true,
            },
            performance: {
              type: Number,
              required: true,
              min: 0,
              max: 4,
            },
            context: String,
          },
        ],
        tags: [String],
        source: {
          type: {
            type: String,
            enum: ['reading', 'writing', 'speaking', 'manual', 'other'],
            required: true,
          },
          id: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
        },
      },
    ],
    stats: {
      totalWords: {
        type: Number,
        default: 0,
      },
      masteredWords: {
        type: Number,
        default: 0,
      },
      learningWords: {
        type: Number,
        default: 0,
      },
      needsReviewWords: {
        type: Number,
        default: 0,
      },
      averageMastery: {
        type: Number,
        default: 0,
      },
      lastStudySession: {
        type: Date,
        default: Date.now,
      },
      studyStreak: {
        type: Number,
        default: 0,
      },
    },
    settings: {
      dailyWordGoal: {
        type: Number,
        default: 5,
        min: 1,
      },
      reviewFrequency: {
        type: String,
        enum: ['daily', 'spaced', 'custom'],
        default: 'spaced',
      },
      customReviewIntervals: [Number],
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
VocabularyBankSchema.index({ userId: 1 });
VocabularyBankSchema.index({ 'words.nextReview': 1 });
VocabularyBankSchema.index({ 'words.mastery': 1 });
VocabularyBankSchema.index({ 'words.tags': 1 });

// Virtual for getting words that need review
VocabularyBankSchema.virtual('wordsNeedingReview').get(function () {
  const now = new Date();
  return this.words.filter(word => word.nextReview <= now);
});

// Pre-save middleware to update stats
VocabularyBankSchema.pre('save', function (next) {
  if (this.isModified('words')) {
    const words = this.words;
    const now = new Date();

    // Calculate stats
    this.stats.totalWords = words.length;
    this.stats.masteredWords = words.filter(w => w.mastery >= 90).length;
    this.stats.learningWords = words.filter(
      w => w.mastery > 0 && w.mastery < 90
    ).length;
    this.stats.needsReviewWords = words.filter(w => w.nextReview <= now).length;

    // Calculate average mastery with proper handling for empty arrays
    const totalMastery = words.reduce((acc, w) => acc + (w.mastery || 0), 0);
    this.stats.averageMastery =
      words.length > 0 ? totalMastery / words.length : 0;

    // Round average mastery to 2 decimal places
    this.stats.averageMastery =
      Math.round(this.stats.averageMastery * 100) / 100;

    // Update last study session
    this.stats.lastStudySession = now;
  }
  next();
});

// Ensure the model isn't already defined before creating it
export const VocabularyBank =
  mongoose.models.VocabularyBank ||
  mongoose.model<IVocabularyBank>('VocabularyBank', VocabularyBankSchema);

export default VocabularyBank;
