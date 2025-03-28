import mongoose, { Document, Schema } from 'mongoose';

export interface IListeningStats extends Document {
  userId: mongoose.Types.ObjectId;
  overallStats: {
    totalSessions: number;
    totalListeningTime: number;
    averageAccuracy: number;
    completedExercises: number;
    strongTopics: string[];
    weakTopics: string[];
  };
  progressByLevel: Record<
    string,
    {
      sessionsCompleted: number;
      averageScore: number;
      timeSpent: number;
    }
  >;
  progressByContentType: Record<
    string,
    {
      sessionsCompleted: number;
      averageScore: number;
      timeSpent: number;
    }
  >;
  recentActivity: Array<{
    sessionId: mongoose.Types.ObjectId;
    title: string;
    score: number;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ListeningStatsSchema = new Schema<IListeningStats>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    overallStats: {
      totalSessions: {
        type: Number,
        default: 0,
      },
      totalListeningTime: {
        type: Number,
        default: 0,
      },
      averageAccuracy: {
        type: Number,
        default: 0,
      },
      completedExercises: {
        type: Number,
        default: 0,
      },
      strongTopics: [String],
      weakTopics: [String],
    },
    progressByLevel: {
      type: Map,
      of: {
        sessionsCompleted: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
        timeSpent: {
          type: Number,
          default: 0,
        },
      },
      default: {},
    },
    progressByContentType: {
      type: Map,
      of: {
        sessionsCompleted: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
        timeSpent: {
          type: Number,
          default: 0,
        },
      },
      default: {},
    },
    recentActivity: [
      {
        sessionId: {
          type: Schema.Types.ObjectId,
          ref: 'ListeningSession',
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Limit the number of recent activities
ListeningStatsSchema.pre('save', function (next) {
  if (this.recentActivity && this.recentActivity.length > 10) {
    // Sort by date descending and keep only the 10 most recent
    this.recentActivity.sort((a, b) => b.date.getTime() - a.date.getTime());
    this.recentActivity = this.recentActivity.slice(0, 10);
  }
  next();
});

// Ensure the model isn't already defined before creating it
export const ListeningStats =
  mongoose.models.ListeningStats ||
  mongoose.model<IListeningStats>('ListeningStats', ListeningStatsSchema);

export default ListeningStats;
