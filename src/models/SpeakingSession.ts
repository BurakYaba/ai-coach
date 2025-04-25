import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISpeakingSession extends Document {
  user: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  voice: string;
  modelName: string;
  status: "active" | "completed" | "interrupted";
  evaluationProgress?: number; // 0-100 evaluation progress percentage
  transcripts: Array<{
    role: "user" | "assistant";
    text: string;
    timestamp: Date;
    metadata?: any; // Add metadata field for additional analysis
  }>;
  metrics?: {
    userSpeakingTime?: number; // total time user spent speaking (seconds)
    assistantSpeakingTime?: number; // total time assistant spent speaking (seconds)
    turnsCount?: number; // total number of conversation turns
    uniqueWords?: number; // count of unique words used by user
  };
  feedback?: {
    fluencyScore?: number; // 1-10 rating of speaking fluency
    accuracyScore?: number; // 1-10 rating of grammatical accuracy
    vocabularyScore?: number; // 1-10 rating of vocabulary usage
    pronunciationScore?: number; // 1-10 rating of pronunciation quality
    completenessScore?: number; // 1-10 rating of sentence completeness
    grammarScore?: number; // 1-10 rating of grammatical correctness
    prosodyScore?: number; // 1-10 rating of intonation and rhythm
    speakingRate?: number; // words per minute speaking rate
    overallScore?: number; // 1-10 overall rating
    strengths?: string[]; // areas where the user performed well
    areasForImprovement?: string[]; // areas that need improvement
    suggestions?: string; // suggestions for improvement
    grammarIssues?: Array<{
      text: string; // the problematic text
      issue: string; // description of the grammar issue
      correction: string; // corrected version
      explanation: string; // explanation of the grammar rule
    }>;
    mispronunciations?: Array<{
      word: string; // the mispronounced word
      phonemes?: Array<{
        phoneme: string; // the phoneme that was mispronounced
        score: number; // score for this phoneme (0-100)
      }>;
      pronunciationScore: number; // score for this word (0-100)
      offset: number; // offset in milliseconds from the start of the audio
      duration: number; // duration of the word in milliseconds
    }>;
  };
  metadata?: {
    mode?: "realtime" | "turn-based";
    scenario?: string;
    level?: string;
    audioUrls?: string[]; // Array of audio recording URLs for this session
    systemPrompt?: string; // Store the system prompt to avoid regenerating it
  };
  createdAt: Date;
  updatedAt: Date;
}

const speakingSessionSchema = new Schema<ISpeakingSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
    voice: {
      type: String,
      required: true,
      enum: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
      default: "alloy",
    },
    modelName: {
      type: String,
      required: true,
      default: "gpt-4o-realtime-preview-2024-12-17",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "completed", "interrupted"],
      default: "active",
    },
    evaluationProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    transcripts: [
      {
        role: {
          type: String,
          required: true,
          enum: ["user", "assistant"],
        },
        text: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
          default: Date.now,
        },
        metadata: {
          type: Schema.Types.Mixed,
          required: false,
        },
      },
    ],
    metrics: {
      userSpeakingTime: {
        type: Number,
        required: false,
      },
      assistantSpeakingTime: {
        type: Number,
        required: false,
      },
      turnsCount: {
        type: Number,
        required: false,
      },
      uniqueWords: {
        type: Number,
        required: false,
      },
    },
    feedback: {
      fluencyScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      accuracyScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      vocabularyScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      pronunciationScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      completenessScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      prosodyScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      speakingRate: {
        type: Number,
        required: false,
      },
      grammarScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      overallScore: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
      },
      strengths: [
        {
          type: String,
          required: false,
        },
      ],
      areasForImprovement: [
        {
          type: String,
          required: false,
        },
      ],
      suggestions: {
        type: String,
        required: false,
      },
      grammarIssues: [
        {
          text: {
            type: String,
            required: false,
          },
          issue: {
            type: String,
            required: false,
          },
          correction: {
            type: String,
            required: false,
          },
          explanation: {
            type: String,
            required: false,
          },
        },
      ],
      mispronunciations: [
        {
          word: {
            type: String,
            required: false,
          },
          phonemes: [
            {
              phoneme: {
                type: String,
                required: false,
              },
              score: {
                type: Number,
                required: false,
              },
            },
          ],
          pronunciationScore: {
            type: Number,
            required: false,
          },
          offset: {
            type: Number,
            required: false,
          },
          duration: {
            type: Number,
            required: false,
          },
        },
      ],
    },
    metadata: {
      mode: {
        type: String,
        enum: ["realtime", "turn-based"],
        required: false,
      },
      scenario: {
        type: String,
        required: false,
      },
      level: {
        type: String,
        required: false,
      },
      audioUrls: [
        {
          type: String,
          required: false,
        },
      ],
      systemPrompt: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common query patterns
speakingSessionSchema.index({ user: 1, startTime: -1 });
speakingSessionSchema.index({ status: 1 });

const SpeakingSession =
  (mongoose.models.SpeakingSession as Model<ISpeakingSession>) ||
  mongoose.model<ISpeakingSession>("SpeakingSession", speakingSessionSchema);

export default SpeakingSession;
