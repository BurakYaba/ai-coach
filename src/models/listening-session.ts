import mongoose, { Schema, Document } from "mongoose";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  example?: string;
  partOfSpeech?: string;
}

export interface Speaker {
  speakerIndex: number;
  speakerName: string;
  detectedGender?: "male" | "female" | "unknown";
}

export interface ListeningSessionDocument extends Document {
  title: string;
  description?: string;
  transcript: string;
  audioUrl: string;
  audioPublicId?: string;
  level: string;
  topic: string;
  contentType: string;
  duration: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
  vocabulary: VocabularyItem[];
  relatedTopics?: string[];
  userProgress?: {
    isCompleted: boolean;
    score?: number;
    listenedCount: number;
    lastListenedAt?: Date;
    comprehensionScore?: number;
    vocabularyScore?: number;
  };
  aiAnalysis?: {
    complexity: number;
    speakerCount: number;
    speakers?: Speaker[];
    wordCount: number;
    avgSentenceLength: number;
    topicRelevance: number;
  };
}

const ListeningSessionSchema = new Schema<ListeningSessionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    transcript: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    audioPublicId: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    topic: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ["dialogue", "monologue", "interview", "news"],
    },
    duration: {
      type: Number,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [String],
        correctAnswer: {
          type: String,
          required: true,
        },
        explanation: String,
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
        example: String,
        partOfSpeech: String,
      },
    ],
    relatedTopics: [String],
    userProgress: {
      isCompleted: {
        type: Boolean,
        default: false,
      },
      score: Number,
      listenedCount: {
        type: Number,
        default: 0,
      },
      lastListenedAt: Date,
      comprehensionScore: Number,
      vocabularyScore: Number,
    },
    aiAnalysis: {
      complexity: { type: Number },
      speakerCount: { type: Number },
      speakers: [
        {
          speakerIndex: { type: Number, required: true },
          speakerName: { type: String, required: true },
          detectedGender: {
            type: String,
            enum: ["male", "female", "unknown"],
            default: "unknown",
          },
        },
      ],
      wordCount: { type: Number },
      avgSentenceLength: { type: Number },
      topicRelevance: { type: Number },
    },
  },
  { timestamps: true }
);

// Create and export the model
const ListeningSession =
  mongoose.models.ListeningSession ||
  mongoose.model<ListeningSessionDocument>(
    "ListeningSession",
    ListeningSessionSchema
  );

export default ListeningSession;
