import mongoose, { Document, Schema } from 'mongoose';

export interface IWritingPrompt extends Document {
  type: 'essay' | 'letter' | 'story' | 'argument';
  level: string;
  topic: string;
  text: string;
  requirements: string[];
  suggestedLength: {
    min: number;
    max: number;
  };
  timeLimit?: number;
  resources?: Array<{
    type: string;
    content: string;
  }>;
  rubric: Array<{
    criterion: string;
    description: string;
    weight: number;
  }>;
}

const ResourceSchema = new Schema({
  type: { type: String, required: true },
  content: { type: String, required: true },
});

const RubricItemSchema = new Schema({
  criterion: { type: String, required: true },
  description: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 100 },
});

const WritingPromptSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['essay', 'letter', 'story', 'argument'],
    },
    level: {
      type: String,
      required: true,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    topic: { type: String, required: true },
    text: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    suggestedLength: {
      min: { type: Number, required: true, min: 50 },
      max: { type: Number, required: true },
    },
    timeLimit: { type: Number },
    resources: [ResourceSchema],
    rubric: [RubricItemSchema],
  },
  { timestamps: true }
);

// Create indexes for efficient querying
WritingPromptSchema.index({ level: 1, type: 1 });
WritingPromptSchema.index({ topic: 1 });

export default mongoose.models.WritingPrompt ||
  mongoose.model<IWritingPrompt>('WritingPrompt', WritingPromptSchema);
