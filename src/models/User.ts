import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  languageLevel: string;
  learningPreferences: {
    topics: string[];
    dailyGoal: number;
    preferredLearningTime: string[];
  };
  progress: {
    readingLevel: number;
    writingLevel: number;
    speakingLevel: number;
    totalPoints: number;
    streak: number;
  };
  settings: {
    emailNotifications: boolean;
    progressReminders: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    languageLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    learningPreferences: {
      topics: [
        {
          type: String,
          enum: [
            'general',
            'business',
            'academic',
            'travel',
            'culture',
            'technology',
          ],
        },
      ],
      dailyGoal: {
        type: Number,
        default: 30, // minutes
      },
      preferredLearningTime: [
        {
          type: String,
          enum: ['morning', 'afternoon', 'evening', 'night'],
        },
      ],
    },
    progress: {
      readingLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      writingLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      speakingLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      totalPoints: {
        type: Number,
        default: 0,
      },
      streak: {
        type: Number,
        default: 0,
      },
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      progressReminders: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Delete password when converting to JSON
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', userSchema);

export default User;
