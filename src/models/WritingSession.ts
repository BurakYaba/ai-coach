import mongoose, { Document, Schema } from 'mongoose';

export interface IWritingSession extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: {
    text: string;
    type: 'essay' | 'letter' | 'story' | 'argument';
    topic: string;
    targetLength: number;
    requirements: string[];
  };
  submission: {
    content: string;
    drafts: Array<{
      content: string;
      timestamp: Date;
      wordCount: number;
    }>;
    finalVersion?: {
      content: string;
      submittedAt: Date;
      wordCount: number;
    };
  };
  analysis?: {
    grammarScore: number;
    vocabularyScore: number;
    coherenceScore: number;
    styleScore: number;
    overallScore: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      suggestions: string[];
    };
    grammarIssues: Array<{
      type: string;
      context: string;
      suggestion: string;
      explanation: string;
    }>;
    vocabularyAnalysis: {
      uniqueWords: number;
      complexityScore: number;
      suggestions: Array<{
        original: string;
        alternatives: string[];
        context: string;
      }>;
    };

    summaryFeedback: string;
    lengthAssessment: {
      assessment: string;
      feedback: string;
    };
    strengths: string[];
    improvements: string[];
    details: {
      grammar: {
        score: number;
        errorList: Array<{
          type: string;
          context: string;
          suggestion: string;
          explanation: string;
        }>;
        suggestions: string[];
        strengths: string[];
        improvements: string[];
      };
      vocabulary: {
        score: number;
        level: string;
        strengths: string[];
        improvements: string[];
        wordFrequency: Array<{
          word: string;
          count: number;
          category: string;
        }>;
      };
      structure: {
        score: number;
        strengths: string[];
        improvements: string[];
      };
      content: {
        score: number;
        relevance: number;
        depth: number;
        strengths: string[];
        improvements: string[];
      };
    };
    timestamp: Date;
  };
  timeTracking: {
    startTime: Date;
    endTime?: Date;
    totalTime: number;
    activePeriods: Array<{
      start: Date;
      end: Date;
      duration: number;
    }>;
  };
  status: 'draft' | 'submitted' | 'analyzed' | 'completed';
  analyzedAt?: Date;
}

const DraftSchema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  wordCount: { type: Number, required: true, min: 0 },
});

const FinalVersionSchema = new Schema({
  content: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  wordCount: { type: Number, required: true, min: 0 },
});

const GrammarIssueSchema = new Schema({
  type: { type: String, required: true },
  context: { type: String, required: true },
  suggestion: { type: String, required: true },
  explanation: { type: String, required: true },
});

const VocabularySuggestionSchema = new Schema({
  original: { type: String, required: true },
  alternatives: [{ type: String, required: true }],
  context: { type: String, required: true },
});

const WordFrequencySchema = new Schema({
  word: { type: String, required: true },
  count: { type: Number, required: true },
  category: { type: String, required: true },
});

const LengthAssessmentSchema = new Schema({
  assessment: { type: String, required: true },
  feedback: { type: String, required: true },
});

const GrammarDetailsSchema = new Schema({
  score: { type: Number, min: 0, max: 100 },
  errorList: [GrammarIssueSchema],
  suggestions: [{ type: String }],
  strengths: [{ type: String }],
  improvements: [{ type: String }],
});

const VocabularyDetailsSchema = new Schema({
  score: { type: Number, min: 0, max: 100 },
  level: { type: String },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  wordFrequency: [WordFrequencySchema],
});

const StructureDetailsSchema = new Schema({
  score: { type: Number, min: 0, max: 100 },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
});

const ContentDetailsSchema = new Schema({
  score: { type: Number, min: 0, max: 100 },
  relevance: { type: Number, min: 0, max: 100 },
  depth: { type: Number, min: 0, max: 100 },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
});

const DetailsSchema = new Schema({
  grammar: GrammarDetailsSchema,
  vocabulary: VocabularyDetailsSchema,
  structure: StructureDetailsSchema,
  content: ContentDetailsSchema,
});

const ActivePeriodSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true, min: 0 },
});

const WritingSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      text: { type: String, required: true },
      type: {
        type: String,
        required: true,
        enum: ['essay', 'letter', 'story', 'argument'],
      },
      topic: { type: String, required: true },
      targetLength: { type: Number, required: true, min: 50 },
      requirements: [{ type: String, required: true }],
    },
    submission: {
      content: { type: String, default: '' },
      drafts: [DraftSchema],
      finalVersion: FinalVersionSchema,
    },
    analysis: {
      grammarScore: { type: Number, min: 0, max: 100 },
      vocabularyScore: { type: Number, min: 0, max: 100 },
      coherenceScore: { type: Number, min: 0, max: 100 },
      styleScore: { type: Number, min: 0, max: 100 },
      overallScore: { type: Number, min: 0, max: 100 },
      feedback: {
        strengths: [{ type: String }],
        improvements: [{ type: String }],
        suggestions: [{ type: String }],
      },
      grammarIssues: [GrammarIssueSchema],
      vocabularyAnalysis: {
        uniqueWords: { type: Number, min: 0 },
        complexityScore: { type: Number, min: 0, max: 100 },
        suggestions: [VocabularySuggestionSchema],
      },

      summaryFeedback: { type: String },
      lengthAssessment: LengthAssessmentSchema,
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      details: DetailsSchema,
      timestamp: { type: Date, default: Date.now },
    },
    timeTracking: {
      startTime: { type: Date, required: true, default: Date.now },
      endTime: { type: Date },
      totalTime: { type: Number, default: 0, min: 0 },
      activePeriods: [ActivePeriodSchema],
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'submitted', 'analyzed', 'completed'],
      default: 'draft',
    },
    analyzedAt: { type: Date },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
WritingSessionSchema.index({ userId: 1, status: 1 });
WritingSessionSchema.index({ userId: 1, 'prompt.type': 1 });
WritingSessionSchema.index({ createdAt: -1 });

export default mongoose.models.WritingSession ||
  mongoose.model<IWritingSession>('WritingSession', WritingSessionSchema);
