# AI Language Learning Platform

A comprehensive language learning platform powered by AI that helps users improve their reading, writing, and speaking skills in English.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Code Quality and Standards](#code-quality-and-standards)
- [Implementation Plan](#implementation-plan)
  - [Phase 1: Project Setup and Authentication](#phase-1-project-setup-and-authentication)
  - [Phase 2: Basic Dashboard Layout](#phase-2-basic-dashboard-layout)
  - [Phase 3: Reading Module](#phase-3-reading-module)
  - [Phase 4: Writing Module](#phase-4-writing-module)
  - [Phase 5: Speaking Module](#phase-5-speaking-module)
  - [Phase 6: Listening Module](#phase-6-listening-module)
  - [Phase 7: Dashboard Technical Implementation](#phase-7-dashboard-technical-implementation)
  - [Phase 8: AI Tutor Integration](#phase-8-ai-tutor-integration)
  - [Phase 9: Gamification System](#phase-9-gamification-system)
  - [Phase 10: Deployment and Optimization](#phase-10-deployment-and-optimization)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [AI Collaboration](#ai-collaboration)
- [Future Enhancements](#future-enhancements)

## Features

### Reading Practice ✅

- ✅ AI-generated reading passages tailored to user's level and interests
- ✅ Comprehension questions with automatic evaluation
- ✅ Grammar focus sections highlighting key language patterns
- ✅ Interactive word definitions
- ✅ Text-to-speech functionality
- ✅ Session tracking and progress monitoring

### Dashboard ✅

- ✅ Overview of learning statistics
- ✅ Recent activity tracking
- ✅ Session management (continue incomplete sessions or review completed ones)
- ✅ Performance metrics and progress visualization

### Gamification

- Experience points (XP) and leveling system
- Achievement badges and milestone rewards
- Daily, weekly, and monthly challenges
- Quest chains with progressive difficulty
- Virtual currency and reward system
- Streak tracking and consistency rewards
- Leaderboards and social competition
- Power-ups and learning boosters

### Writing Practice

- AI-generated writing prompts based on level and interests
- Rich text editor for writing submissions
- Automatic evaluation with detailed feedback
- Grammar and vocabulary suggestions
- Word count and time tracking
- Draft saving and session management

### Speaking Practice

- Speech recognition and pronunciation assessment
- Interactive conversations with AI language partner
- Role-play scenarios for real-world practice
- Fluency and grammar evaluation
- Progress tracking for speaking skills

### Listening Practice

- AI-generated dialogues and conversations
- Multiple-choice comprehension questions
- Interactive transcripts with synchronized highlighting
- Vocabulary and context explanations
- Progress tracking and difficulty adaptation
- Various real-life scenarios and topics

## Project Structure

```
src/
├── app/                  # Next.js app router pages
│   ├── (auth)/           # Authentication pages (login, register)
│   ├── dashboard/        # Dashboard and learning pages
│   │   ├── vocabulary/   # Vocabulary dashboard and review pages
│   │   ├── reading/      # Reading practice pages
│   │   └── layout.tsx    # Dashboard layout
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication API
│   │   ├── reading/      # Reading practice API
│   │   ├── vocabulary/   # Vocabulary API and word management
│   │   └── test-connection/ # Database connection test
│   ├── layout.tsx        # Root layout with SessionProvider
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── providers/        # Provider components (SessionProvider)
│   ├── reading/          # Reading practice components
│   └── ui/               # Shared UI components
├── hooks/                # Custom React hooks
│   └── use-toast.ts      # Toast notification hook
├── lib/                  # Utility functions and services
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   ├── spaced-repetition.ts # Spaced repetition algorithm
│   └── utils.ts          # General utilities
├── models/               # Mongoose models
│   ├── User.ts           # User model
│   ├── ReadingSession.ts # Reading session model
│   └── VocabularyBank.ts # Vocabulary bank model
└── types/                # TypeScript type definitions
```

## Code Quality and Standards

To ensure consistent code quality and prevent build issues, the project implements a comprehensive set of linting rules, code formatting standards, and quality checks.

### Configuration Files

The following configuration files are set up at the root of the project:

```
.eslintrc.js             # ESLint configuration
.prettierrc              # Prettier formatting rules
.prettierignore          # Files to be ignored by Prettier
.eslintignore            # Files to be ignored by ESLint
tsconfig.json            # TypeScript configuration
.editorconfig            # Editor configuration for consistency
jest.config.js           # Jest testing configuration
.husky/                  # Git hooks for pre-commit checks
```

### ESLint Configuration

The ESLint configuration extends recommended configurations and includes plugins for React, Next.js, and TypeScript:

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'next/core-web-vitals',
    'prettier', // Make sure prettier is last to override other configs
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'prettier',
  ],
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/prop-types': 'off', // We use TypeScript for prop validation
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Import rules
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    'jsx-a11y/anchor-is-valid': 'off', // Next.js uses <a> tags without href
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
```

### Prettier Configuration

Prettier is configured to ensure consistent code formatting:

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxBracketSameLine": false
}
```

### TypeScript Configuration

The TypeScript configuration ensures type safety and compatibility with Next.js:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Editor Configuration

The `.editorconfig` file ensures consistency across different editors:

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

### Git Hooks with Husky

Git hooks are set up to run linting and formatting checks before commits:

```json
// package.json (husky section)
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### VS Code Settings

For VS Code users, a `.vscode/settings.json` file is provided to ensure consistent editor behavior:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### NPM Scripts

The following scripts are added to `package.json` to facilitate code quality checks:

```json
// package.json (scripts section)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "prepare": "husky install"
  }
}
```

## Implementation Plan

### Phase 1: Project Setup and Authentication ✅

#### 1.1 Core Infrastructure ✅

##### Data Models ✅

```typescript
interface IUser extends Document {
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
}

interface IAuthSession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  device: string;
  lastActive: Date;
  expiresAt: Date;
}
```

##### Authentication System ✅

```typescript
class AuthService {
  async register(userData: RegisterDTO): Promise<IUser> {
    // Implementation
  }

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    // Implementation
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    // Implementation
  }

  async validateSession(token: string): Promise<boolean> {
    // Implementation
  }
}
```

#### 1.2 Technical Implementation ✅

1. **✅ Project Setup**

   - ✅ Initialize Next.js with TypeScript
   - ✅ Configure ESLint and Prettier
   - ✅ Set up Tailwind CSS
   - ✅ Implement MongoDB connection
   - ✅ Configure environment variables

2. **✅ Authentication Implementation**

   - ✅ Set up NextAuth.js
   - ✅ Create authentication middleware
   - ✅ Implement JWT token handling
   - ✅ Set up password hashing with bcrypt
   - ✅ Create protected route handlers

3. **✅ User Management**

   - ✅ Create user registration flow
   - ✅ Implement email verification
   - ✅ Set up password reset functionality
   - ✅ Create user profile management
   - ✅ Implement session handling

4. **Security Measures**
   - Implement rate limiting
   - Set up CSRF protection
   - Configure secure headers
   - Implement input validation
   - Set up error logging

### Phase 2: Basic Dashboard Layout ✅

#### 2.1 Core Infrastructure ✅

##### Data Models ✅

```typescript
interface IDashboardStats extends Document {
  userId: mongoose.Types.ObjectId;
  dailyStats: {
    date: Date;
    readingMinutes: number;
    writingMinutes: number;
    speakingMinutes: number;
    pointsEarned: number;
    exercisesCompleted: number;
  }[];
  weeklyGoals: {
    readingGoal: number;
    writingGoal: number;
    speakingGoal: number;
    progress: number;
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    earnedAt: Date;
  }[];
}

interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'reading' | 'writing' | 'speaking';
  action: string;
  details: Record<string, any>;
  timestamp: Date;
}
```

#### 2.2 Basic Layout Implementation ✅

1. **✅ Dashboard Layout**
   - ✅ Create responsive dashboard shell
   - ✅ Implement sidebar navigation
   - ✅ Design header with user info

### Phase 3: Reading Module ✅

#### 3.1 Core Infrastructure ✅

##### Data Models ✅

```typescript
interface IReadingSession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  level: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
  questions: Array<{
    id: string;
    type: 'multiple-choice' | 'true-false' | 'open-ended';
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

interface IVocabularyBank extends Document {
  userId: mongoose.Types.ObjectId;
  words: Array<{
    word: string;
    definition: string;
    context: string[];
    mastery: number;
    lastReviewed: Date;
    nextReview: Date;
  }>;
}
```

#### 3.2 Content Generation System ✅

```typescript
class ContentGenerator {
  async generateReadingPassage(params: {
    level: string;
    topic: string;
    targetLength: number;
    focusGrammar?: string[];
  }): Promise<{
    content: string;
    metadata: {
      complexity: number;
      topicRelevance: number;
      grammarPatterns: string[];
    };
  }> {
    // Implementation
  }

  async generateQuestions(
    content: string,
    level: string
  ): Promise<
    Array<{
      question: string;
      type: string;
      options?: string[];
      correctAnswer: string;
      explanation: string;
    }>
  > {
    // Implementation
  }

  async extractVocabulary(
    content: string,
    userLevel: string
  ): Promise<
    Array<{
      word: string;
      definition: string;
      context: string;
      examples: string[];
    }>
  > {
    // Implementation
  }
}
```

#### 3.3 Technical Implementation ✅

1. **✅ Content Management**

   - ✅ Implement AI content generation
   - ✅ Create content difficulty analyzer
   - ✅ Build topic categorization system
   - ✅ Implement content caching
   - ✅ Create content review system

2. **✅ Reading Interface**

   - ✅ Design responsive reading UI
   - ✅ Implement progress tracking
   - ✅ Create interactive vocabulary tooltips
   - ✅ Build text-to-speech integration
   - ✅ Implement reading speed calculator

3. **✅ Assessment System**

   - ✅ Create question generation engine
   - ✅ Implement answer evaluation
   - ✅ Build progress tracking
   - ✅ Create performance analytics
   - ✅ Implement adaptive difficulty

4. **✅ Vocabulary System**
   - ✅ Create vocabulary extraction
   - ✅ Implement spaced repetition
   - ✅ Build word mastery tracking
   - ✅ Create vocabulary review system
   - ✅ Implement word context analysis

### Phase 4: Writing Module ✅

#### 4.1 Core Infrastructure ✅

##### Data Models ✅

```typescript
interface IWritingSession extends Document {
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
    finalVersion: {
      content: string;
      submittedAt: Date;
      wordCount: number;
    };
  };
  analysis: {
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
}

interface IWritingPrompt extends Document {
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
```

#### 4.2 Writing Analysis System ✅

```typescript
class WritingAnalyzer {
  async analyzeSubmission(params: {
    content: string;
    prompt: IWritingPrompt;
    level: string;
  }): Promise<{
    scores: {
      grammar: number;
      vocabulary: number;
      coherence: number;
      style: number;
      overall: number;
    };
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
  }> {
    // Implementation
  }

  async generateFeedback(
    analysis: any,
    level: string
  ): Promise<{
    detailed: string;
    summary: string;
    nextSteps: string[];
  }> {
    // Implementation
  }
}
```

#### 4.3 Technical Implementation ✅

1. **Writing Interface** ✅

   - Create rich text editor ✅
   - Implement auto-save ✅
   - Build formatting tools ✅
   - Create word counter ✅
   - Implement draft management ✅

2. **Prompt System** ✅

   - Create prompt generator ✅
   - Implement difficulty scaling ✅
   - Build topic categorization ✅
   - Create requirement checker ✅
   - Implement resource suggestions ✅

3. **Analysis Engine** ✅

   - Implement grammar checking ✅
   - Create style analysis ✅
   - Build coherence evaluation ✅
   - Create vocabulary assessment ✅
   - Implement plagiarism detection ✅

4. **Feedback System** ✅
   - Create detailed feedback ✅
   - Implement suggestion generation ✅
   - Build improvement tracking ✅
   - Create progress visualization ✅
   - Implement peer review system ✅

### Phase 5: Speaking Module ⏳

#### 5.1 Core Infrastructure

##### Data Models

```typescript
interface ISpeakingSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionType: 'guided' | 'pronunciation' | 'conversation';
  level: string;
  topic: string;
  customTopic?: string;
  scenario?: string;

  // For guided speaking and pronunciation
  prompt?: string;
  recordings: Array<{
    recordingUrl: string;
    transcription: string;
    duration: number;
    timestamp: Date;
  }>;

  // For conversation
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    audioUrl?: string; // For user messages
  }>;

  analysis?: {
    grammarScore: number;
    fluencyScore: number;
    pronunciationScore: number;
    vocabularyScore: number;
    overallScore: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      suggestions: string[];
    };
    grammarIssues: Array<{
      text: string;
      issue: string;
      correction: string;
      explanation: string;
    }>;
    pronunciationIssues: Array<{
      word: string;
      correctPronunciation: string;
      userPronunciation: string;
      suggestion: string;
    }>;
  };

  // Usage tracking for Real-Time API
  realTimeUsage?: {
    duration: number;
    tokensUsed: number;
  };

  status: 'in-progress' | 'completed' | 'analyzed';
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 5.2 Technical Implementation

##### 5.2.1 WebRTC-Based Implementation

The Speaking module will use WebRTC for real-time audio communication with OpenAI's Real-Time API, providing low-latency, high-quality audio streaming:

1. **Core WebRTC Service**

   ```typescript
   class RealtimeAudioService {
     private peerConnection: RTCPeerConnection | null = null;
     private dataChannel: RTCDataChannel | null = null;
     private audioContext: AudioContext | null = null;
     private mediaStream: MediaStream | null = null;
     private isConnected = false;

     constructor(private apiKey: string) {
       this.initializeAudioContext();
     }

     private initializeAudioContext() {
       this.audioContext = new (window.AudioContext ||
         (window as any).webkitAudioContext)();
     }

     async connect() {
       try {
         // Initialize WebRTC connection
         this.peerConnection = new RTCPeerConnection({
           iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
         });

         // Set up data channel for control messages
         this.setupDataChannel();

         // Get user's audio stream with optimized settings
         this.mediaStream = await navigator.mediaDevices.getUserMedia({
           audio: {
             echoCancellation: true,
             noiseSuppression: true,
             autoGainControl: true,
           },
         });

         // Add audio tracks to connection
         this.mediaStream.getTracks().forEach(track => {
           this.peerConnection?.addTrack(track, this.mediaStream!);
         });

         // Handle incoming audio
         this.peerConnection.ontrack = this.handleIncomingAudio.bind(this);

         // Create and send offer
         const offer = await this.peerConnection.createOffer();
         await this.peerConnection.setLocalDescription(offer);

         // Get signaling data from server
         const signalingData = await this.getSignalingData(offer);

         // Set remote description
         await this.peerConnection.setRemoteDescription(
           new RTCSessionDescription(signalingData.answer)
         );

         // Handle ICE candidates
         this.handleIceCandidates(signalingData.iceCandidates);

         this.isConnected = true;
       } catch (error) {
         console.error('Connection error:', error);
         throw error;
       }
     }

     private setupDataChannel() {
       this.dataChannel = this.peerConnection!.createDataChannel('control');

       this.dataChannel.onmessage = event => {
         const data = JSON.parse(event.data);
         this.handleControlMessage(data);
       };

       this.dataChannel.onopen = () => {
         console.log('Data channel opened');
       };
     }

     private handleIncomingAudio(event: RTCTrackEvent) {
       if (!this.audioContext) return;

       const audioTrack = event.track;
       const audioElement = new Audio();
       audioElement.srcObject = new MediaStream([audioTrack]);
       audioElement.play();
     }

     private handleControlMessage(data: any) {
       switch (data.type) {
         case 'transcription':
           this.handleTranscription(data.text);
           break;
         case 'error':
           this.handleError(data.error);
           break;
         case 'status':
           this.handleStatus(data.status);
           break;
       }
     }

     private async getSignalingData(offer: RTCSessionDescription) {
       const response = await fetch('https://api.openai.com/v1/audio/speech', {
         method: 'POST',
         headers: {
           Authorization: `Bearer ${this.apiKey}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           offer: offer.toJSON(),
           model: 'gpt-4-turbo-preview',
         }),
       });

       if (!response.ok) {
         throw new Error('Failed to get signaling data');
       }

       return await response.json();
     }

     private async handleIceCandidates(candidates: RTCIceCandidate[]) {
       for (const candidate of candidates) {
         await this.peerConnection?.addIceCandidate(
           new RTCIceCandidate(candidate)
         );
       }
     }

     private handleError(error: any) {
       console.error('Error from server:', error);
       // Implement error recovery logic
     }

     disconnect() {
       if (this.mediaStream) {
         this.mediaStream.getTracks().forEach(track => track.stop());
         this.mediaStream = null;
       }

       if (this.dataChannel) {
         this.dataChannel.close();
         this.dataChannel = null;
       }

       if (this.peerConnection) {
         this.peerConnection.close();
         this.peerConnection = null;
       }

       if (this.audioContext) {
         this.audioContext.close();
         this.audioContext = null;
       }

       this.isConnected = false;
     }
   }
   ```

2. **Real-Time Conversation System**

   - Implement WebRTC-based audio streaming for natural conversational practice
   - Create role-play scenarios with contextual prompts
   - Develop real-time pronunciation feedback during conversations
   - Implement usage monitoring and limits (monthly allowance per user)
   - Create conversation history recording for later assessment

3. **Comprehensive Assessment System**

   - Use Whisper API for detailed transcription of recorded speech
   - Implement GPT-4 analysis for grammar, vocabulary, and content evaluation
   - Create detailed feedback generation with improvement suggestions
   - Develop pronunciation scoring based on transcription accuracy
   - Implement TTS for reference pronunciations of problem words

4. **Integrated Practice Experience**

   - Design unified interface for both real-time and assessment modes
   - Create seamless transitions between conversation and feedback
   - Implement progress tracking across both modes
   - Develop adaptive difficulty based on performance metrics
   - Create personalized practice recommendations

#### 5.3 Implementation Phases

1. **Phase 1: Core Infrastructure (1 week)**

   - Implement SpeakingSession model
   - Update User model with speaking settings
   - Create database indexes for efficient queries
   - Set up WebRTC service infrastructure
   - Implement basic audio processing

2. **Phase 2: Guided Speaking Implementation (1 week)**

   - Implement topic selection UI
   - Create prompt generation API using GPT-4
   - Implement level-appropriate content generation
   - Set up audio recording with WebRTC
   - Create transcription and analysis pipeline

3. **Phase 3: Pronunciation Practice (1 week)**

   - Create pronunciation exercise templates
   - Implement minimal pairs and consonant clusters
   - Design level-appropriate exercises
   - Set up real-time pronunciation feedback
   - Implement progress tracking

4. **Phase 4: Free Conversation (2 weeks)**

   - Set up OpenAI Real-Time API with WebRTC
   - Implement streaming audio processing
   - Create fallback mechanisms for connection issues
   - Implement role-play scenarios
   - Set up usage tracking and limits

5. **Phase 5: Testing and Refinement (1 week)**

   - Conduct internal testing
   - Fix identified issues
   - Optimize performance
   - Implement error recovery
   - Add monitoring and logging

### API Endpoints

1. **Session Management**

   - `POST /api/speaking/sessions` - Create a new speaking session
   - `GET /api/speaking/sessions` - Get all speaking sessions for the user
   - `GET /api/speaking/sessions/:id` - Get a specific speaking session
   - `DELETE /api/speaking/sessions/:id` - Delete a speaking session

2. **Guided Speaking**

   - `POST /api/speaking/generate-prompt` - Generate a speaking prompt
   - `POST /api/speaking/transcribe` - Transcribe audio using Whisper API
   - `POST /api/speaking/analyze` - Analyze speaking performance

3. **Pronunciation Practice**

   - `GET /api/speaking/pronunciation/exercises` - Get pronunciation exercises
   - `POST /api/speaking/pronunciation/analyze` - Analyze pronunciation

4. **Free Conversation**
   - `GET /api/speaking/usage` - Get user's Real-Time API usage
   - `POST /api/speaking/conversation/start` - Start a conversation session
   - `POST /api/speaking/conversation/end` - End a conversation session

### User Interface Components

1. **Session List Page**

   - Display all speaking sessions with type, date, and score
   - Filter by session type (guided, pronunciation, conversation)
   - Sort by date, score, or duration
   - "New Session" button

2. **New Session Page**

   - Tab navigation for session types
   - Level selection dropdown
   - Topic selection with custom input option
   - Role-play scenario selection for conversation

3. **Guided Speaking Interface**

   - Prompt display
   - Record button with visual feedback
   - Playback of recording
   - Analysis results with detailed feedback
   - Retry option

4. **Pronunciation Practice Interface**

   - Exercise display with examples
   - Record button with visual feedback
   - Word-by-word pronunciation feedback
   - Visual pronunciation guide
   - Practice history

5. **Conversation Interface**
   - Role display (user and AI)
   - Real-time transcription display
   - Visual indicator for speaking/listening
   - Connection status indicator
   - End conversation button
   - Usage meter

### Monthly Usage Management

1. **Usage Tracking**

   - Track Real-Time API usage in minutes
   - Reset usage counter monthly
   - Store usage data in user profile

2. **Usage Limits**

   - Set default monthly allowance (e.g., 30 minutes)
   - Implement graceful degradation when limit is reached
   - Provide clear feedback on remaining usage

3. **Usage Display**
   - Show usage meter in conversation interface
   - Display monthly usage statistics in user profile
   - Send notifications when approaching limit

### Testing Strategy

1. **Unit Testing**

   - Test individual components and functions
   - Mock API responses for consistent testing
   - Test error handling and edge cases
   - Test WebRTC connection handling

2. **Integration Testing**

   - Test API endpoints with mock requests
   - Verify database operations
   - Test authentication and authorization
   - Test WebRTC signaling process

3. **End-to-End Testing**
   - Test complete user flows
   - Verify audio recording and processing
   - Test real-time conversation functionality
   - Test connection recovery scenarios

### Deployment Considerations

1. **API Keys and Security**

   - Secure storage of OpenAI API keys
   - Implement rate limiting
   - Validate all user inputs
   - Secure WebRTC signaling

2. **Performance Optimization**

   - Optimize audio processing
   - Implement efficient WebRTC handling
   - Use appropriate caching strategies
   - Monitor bandwidth usage

3. **Error Handling**
   - Implement comprehensive error handling
   - Provide user-friendly error messages
   - Log errors for debugging
   - Implement connection recovery

### Timeline

- **Week 1**: Core infrastructure and WebRTC setup
- **Week 2**: Guided speaking implementation
- **Week 3**: Pronunciation practice implementation
- **Weeks 4-5**: Free conversation implementation
- **Week 6**: Testing, refinement, and documentation

This implementation plan provides a structured approach to building the speaking module while maintaining consistency with the existing application architecture and keeping the implementation straightforward and robust.

### Phase 6: Listening Module ⏳

#### 6.1 Core Infrastructure

##### Data Models

```typescript
interface IListeningSession extends Document {
  userId: mongoose.Types.ObjectId;
  audioContent: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    type: 'dialogue' | 'monologue' | 'news' | 'interview';
    scenario: string;
    transcript: string;
    audioUrl: string;
    metadata: {
      topics: string[];
      keywords: string[];
      speakerCount?: number;
    };
  };
  exercises: Array<{
    type: 'multiple-choice' | 'true-false' | 'fill-blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    userAnswer?: string;
    timestamp: number;
    points: number;
  }>;
  progress: {
    completedSegments: number[];
    currentPosition: number;
    score: number;
    accuracy: number;
    comprehensionRate: number;
  };
  performance: {
    startTime: Date;
    endTime?: Date;
    pauseDuration: number;
    replays: Array<{
      segment: [number, number];
      count: number;
    }>;
    difficultSegments: number[];
  };
}

interface IListeningProgress extends Document {
  userId: mongoose.Types.ObjectId;
  overallStats: {
    totalSessions: number;
    totalListeningTime: number;
    averageAccuracy: number;
    strongTopics: string[];
    weakTopics: string[];
  };
  skillLevels: {
    comprehension: number;
    vocabularyRecognition: number;
    contextualUnderstanding: number;
  };
  topicMastery: Record<string, number>;
}
```

#### 6.2 Technical Implementation

1. **Dialogue Generation System**

   - OpenAI GPT-4 integration for dialogue creation
   - Context-aware content generation
   - Difficulty level management
   - Topic and scenario variety
   - Natural conversation flow

2. **Audio Generation System**

   - OpenAI TTS API integration
   - Audio file management and caching
   - Multiple speaker voice mapping
   - Audio quality optimization
   - Segment timing management

3. **Exercise Generation**

   - AI-powered question generation
   - Multiple question types
   - Answer validation system
   - Difficulty adaptation
   - Progress tracking

4. **Interactive Interface**
   - Custom audio player
   - Interactive transcript
   - Real-time progress tracking
   - Exercise interface
   - Performance feedback

#### 6.3 Integration Features

1. **Content Management**

   - Audio content generation and storage
   - Transcript synchronization
   - Exercise management
   - Performance analytics
   - Content caching system

2. **User Experience**

   - Responsive audio player
   - Interactive exercises
   - Progress visualization
   - Performance feedback
   - Adaptive difficulty

3. **Learning Analytics**

   - Comprehension tracking
   - Performance metrics
   - Progress visualization
   - Difficulty adaptation
   - Personalized recommendations

4. **System Integration**
   - Session management
   - User progress tracking
   - Gamification integration
   - AI tutor feedback
   - Cross-module learning paths

### Phase 7: Dashboard Technical Implementation ⏳

#### 7.1 Statistics System

1. **Create data aggregation services**
2. **Implement real-time updates**
3. **Design progress visualization**
4. **Create achievement system**
5. **Implement streak tracking**

#### 7.2 Activity Tracking

1. **Create activity logging system**
2. **Implement session analytics**
3. **Design activity feed**
4. **Create notification system**
5. **Implement data export**

#### 7.3 Performance Optimization

1. **Implement data caching**
2. **Set up incremental static regeneration**
3. **Optimize database queries**
4. **Implement lazy loading**
5. **Set up performance monitoring**

### Phase 8: AI Tutor Integration ⏳

#### 8.1 Core Infrastructure

##### Data Models

```typescript
interface IAITutor extends Document {
  userId: mongoose.Types.ObjectId;
  personality: {
    name: string;
    style: string;
    expertise: string[];
    adaptiveLevel: number;
  };
  conversationHistory: Array<{
    sessionId: string;
    messages: Array<{
      role: 'user' | 'tutor';
      content: string;
      timestamp: Date;
      context?: {
        exercise: string;
        topic: string;
        skill: string;
      };
    }>;
    feedback: {
      helpful: boolean;
      comments?: string;
    };
  }>;
  learningProfile: {
    strengths: string[];
    weaknesses: string[];
    preferences: string[];
    adaptations: Array<{
      trigger: string;
      adjustment: string;
      effectiveness: number;
    }>;
  };
}

interface ITutorSession extends Document {
  userId: mongoose.Types.ObjectId;
  tutorId: mongoose.Types.ObjectId;
  type: 'lesson' | 'review' | 'practice' | 'conversation';
  status: 'active' | 'completed' | 'scheduled';
  focus: {
    skill: string;
    topic: string;
    level: string;
  };
  progress: {
    completed: number;
    remaining: number;
    currentTopic: string;
  };
  feedback: {
    userRating: number;
    comments: string;
    improvements: string[];
  };
}
```

#### 8.2 Technical Implementation

1. **AI Tutor Engine**

   - Implement personality system
   - Create adaptive responses
   - Build context awareness
   - Implement learning style adaptation
   - Create emotional intelligence

2. **Conversation System**

   - Create natural language processing
   - Implement context management
   - Build response generation
   - Create conversation flow
   - Implement error recovery

3. **Learning Management**

   - Create personalized paths
   - Implement progress tracking
   - Build difficulty adaptation
   - Create resource suggestion
   - Implement review scheduling

4. **Integration Features**
   - Create seamless module integration
   - Implement cross-module learning
   - Build unified progress tracking
   - Create comprehensive reporting
   - Implement feedback loop

### Phase 9: Gamification System ⏳

#### 9.1 Core Infrastructure

##### Data Models

```typescript
interface IGamificationProfile extends Document {
  userId: mongoose.Types.ObjectId;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalPoints: number;
  currency: {
    coins: number;
    gems: number;
  };
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
    protected: boolean; // Streak protection power-up
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    earnedAt: Date;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    progress?: {
      current: number;
      target: number;
    };
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
    points: number;
    isSecret: boolean;
  }>;
  inventory: Array<{
    id: string;
    type: 'powerup' | 'customization' | 'booster';
    name: string;
    description: string;
    icon: string;
    quantity: number;
    expiresAt?: Date;
  }>;
  challenges: Array<{
    id: string;
    name: string;
    description: string;
    type: 'daily' | 'weekly' | 'monthly' | 'special';
    progress: number;
    target: number;
    reward: {
      experience: number;
      coins: number;
      gems?: number;
      items?: Array<{
        id: string;
        quantity: number;
      }>;
    };
    startedAt: Date;
    expiresAt: Date;
    completedAt?: Date;
  }>;
  quests: Array<{
    id: string;
    name: string;
    description: string;
    steps: Array<{
      id: string;
      description: string;
      completed: boolean;
    }>;
    progress: number;
    reward: {
      experience: number;
      coins: number;
      gems?: number;
      items?: Array<{
        id: string;
        quantity: number;
      }>;
    };
    completedAt?: Date;
  }>;
  leaderboard: {
    globalRank?: number;
    friendsRank?: number;
    weeklyPoints: number;
    allTimePoints: number;
  };
}

interface IRewardEvent extends Document {
  userId: mongoose.Types.ObjectId;
  type:
    | 'experience'
    | 'currency'
    | 'item'
    | 'badge'
    | 'achievement'
    | 'level_up';
  amount?: number;
  itemId?: string;
  reason: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

interface IGamificationRule extends Document {
  type: 'action' | 'milestone' | 'streak' | 'challenge';
  trigger: {
    action?: string;
    milestone?: {
      metric: string;
      threshold: number;
    };
    streak?: number;
    challengeId?: string;
  };
  reward: {
    experience?: number;
    coins?: number;
    gems?: number;
    items?: Array<{
      id: string;
      probability: number; // 0-1
      quantity: number;
    }>;
    badges?: string[];
    achievements?: string[];
  };
  cooldown?: number; // In seconds
  maxOccurrences?: number;
  active: boolean;
}
```

#### 9.2 Gamification Engine

```typescript
class GamificationEngine {
  async processAction(params: {
    userId: string;
    action: string;
    metadata?: Record<string, any>;
  }): Promise<{
    rewards: Array<{
      type: string;
      amount?: number;
      itemId?: string;
      name: string;
      description?: string;
    }>;
    levelUp?: {
      newLevel: number;
      rewards: Array<{
        type: string;
        amount?: number;
        itemId?: string;
      }>;
    };
    streakUpdate?: {
      current: number;
      isIncreased: boolean;
    };
    challengesUpdated: string[];
    questsUpdated: string[];
  }> {
    // Implementation
  }

  async calculateRewards(
    action: string,
    metadata: Record<string, any>
  ): Promise<
    Array<{
      type: string;
      amount?: number;
      itemId?: string;
    }>
  > {
    // Implementation
  }

  async updateChallenges(
    userId: string,
    action: string,
    metadata: Record<string, any>
  ): Promise<string[]> {
    // Implementation
  }

  async checkLevelUp(userId: string): Promise<{
    leveledUp: boolean;
    newLevel?: number;
    rewards?: Array<{
      type: string;
      amount?: number;
      itemId?: string;
    }>;
  }> {
    // Implementation
  }
}
```

#### 9.3 Technical Implementation

1. **Points and Progression System**

   - Implement experience points (XP) for all learning activities
   - Create leveling system with increasing difficulty curve
   - Design virtual currency system (coins for regular rewards, gems as premium currency)
   - Implement progress bars for all trackable metrics
   - Create milestone rewards for significant achievements

2. **Achievement System**

   - Design badge system with multiple categories (learning, consistency, exploration)
   - Implement achievement tracking for all platform activities
   - Create tiered achievements with increasing difficulty
   - Design visual reward animations and notifications
   - Implement achievement showcase on user profiles

3. **Challenge and Quest System**

   - Create daily, weekly, and monthly challenges
   - Implement quest chains with progressive rewards
   - Design special event challenges tied to holidays or themes
   - Create challenge notification and reminder system
   - Implement challenge history and statistics

4. **Streak and Consistency Mechanics**

   - Implement daily streak counter with visual calendar
   - Create streak protection items (freeze a streak when missing a day)
   - Design streak milestone rewards
   - Implement streak recovery mechanics
   - Create streak leaderboards

5. **Social and Competitive Features**

   - Implement global and friend leaderboards
   - Create language learning clubs/teams
   - Design collaborative challenges
   - Implement friend progress comparison
   - Create social sharing of achievements

6. **Reward and Incentive System**

   - Design reward schedule with variable reinforcement
   - Implement virtual item shop for spending earned currency
   - Create special power-ups that enhance learning (hint tokens, time boosters)
   - Design customization rewards (profile themes, avatars)
   - Implement surprise rewards and bonus opportunities

7. **UI/UX Implementation**
   - Create engaging animations for rewards and level-ups
   - Design gamification dashboard with progress visualization
   - Implement notification system for achievements and rewards
   - Create intuitive navigation for gamification features
   - Design consistent visual language for gamification elements

#### 9.4 Integration with Learning Modules

1. **Reading Module Integration**

   - Award XP based on passage difficulty and comprehension score
   - Create reading-specific achievements (vocabulary master, speed reader)
   - Implement reading streaks and milestones
   - Design reading challenges (genre explorer, topic master)
   - Create power-ups specific to reading (definition hints, extra time)

2. **Writing Module Integration**

   - Award XP based on writing length, quality, and complexity
   - Create writing-specific achievements (essay master, creative writer)
   - Implement writing streaks and consistency rewards
   - Design writing challenges (genre challenges, timed writing)
   - Create power-ups specific to writing (grammar hints, vocabulary suggestions)

3. **Speaking Module Integration**

   - Award XP based on pronunciation accuracy and conversation length
   - Create speaking-specific achievements (fluency master, accent improver)
   - Implement speaking practice streaks
   - Design speaking challenges (accent challenges, conversation topics)
   - Create power-ups specific to speaking (pronunciation hints, retry tokens)

4. **AI Tutor Integration**
   - Personalize challenge recommendations based on learning needs
   - Create tutor-specific achievements (mentor connection, feedback implementer)
   - Design tutor interaction rewards
   - Implement special tutor challenges
   - Create tutor-guided quests with progressive difficulty

### Phase 10: Deployment and Optimization ⏳

#### 10.1 Infrastructure Setup

```typescript
interface IDeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  scaling: {
    minInstances: number;
    maxInstances: number;
    targetCPUUtilization: number;
  };
  monitoring: {
    metrics: string[];
    alerts: Array<{
      metric: string;
      threshold: number;
      action: string;
    }>;
  };
  backup: {
    frequency: string;
    retention: number;
    type: 'full' | 'incremental';
  };
}
```

#### 10.2 Technical Implementation

1. **Performance Optimization**

   - Implement code splitting
   - Create asset optimization
   - Build caching strategy
   - Implement lazy loading
   - Create performance monitoring

2. **Deployment Pipeline**

   - Create CI/CD pipeline
   - Implement automated testing
   - Build deployment automation
   - Create rollback procedures
   - Implement blue-green deployment

3. **Monitoring System**

   - Create performance monitoring
   - Implement error tracking
   - Build usage analytics
   - Create alert system
   - Implement log management

4. **Security Measures**
   - Implement security audit
   - Create penetration testing
   - Build backup system
   - Create disaster recovery
   - Implement compliance checks

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
OPENAI_API_KEY=your_openai_api_key
```

## AI Collaboration

This project is designed to be developed with AI assistance. To ensure consistent, high-quality implementation:

1. **Project Guidelines**: All AI assistance follows the standards in `DEVELOPMENT_GUIDELINES.md`

2. **Implementation Checklist**: Features are implemented according to `IMPLEMENTATION_CHECKLIST.md`

3. **AI Interaction**: For structured AI interactions, templates are available in `AI_INTERACTION_TEMPLATE.md`

4. **Continuous Context**: The `.ai-prompt` file contains project context for AI assistants

When working with AI on this project, you don't need to explicitly remind the AI of these guidelines in every interaction. The AI should proactively follow them for all responses related to this project.

## Future Enhancements

- Enhanced AI conversation capabilities
- Mobile application development
- Integration with language certification programs
- Peer learning and language exchange features
- Virtual reality speaking practice
- Integration with popular language learning apps
- Augmented reality pronunciation visualization
- Personalized learning path optimization using ML
- Offline learning mode with sync capabilities
- Multi-language support beyond English

## Implementation Progress and Next Steps

### Completed Features

#### Spaced Repetition System ✅

We have successfully implemented a comprehensive spaced repetition system for vocabulary learning:

1. **✅ SM-2 Algorithm Implementation**

   - ✅ Created the core spaced repetition algorithm in `src/lib/spaced-repetition.ts`
   - ✅ Implemented performance rating system (0-4 scale)
   - ✅ Added easiness factor, interval, and repetition count calculations
   - ✅ Developed mastery level tracking (0-100%)

2. **✅ Vocabulary Bank Model**

   - ✅ Designed and implemented `VocabularyBank` model with MongoDB
   - ✅ Added support for word metadata (definition, context, examples)
   - ✅ Implemented review history tracking
   - ✅ Added next review date scheduling

3. **✅ Review Interface**

   - ✅ Created vocabulary review page with performance rating options
   - ✅ Implemented session management for reviewing words
   - ✅ Added progress tracking during review sessions
   - ✅ Implemented mastery visualization

4. **✅ API Integration**
   - ✅ Created API endpoints for vocabulary management
   - ✅ Implemented word update with spaced repetition calculations
   - ✅ Added session authentication and security
   - ✅ Implemented error handling and validation

### Next Steps

#### 1. Content Caching

To improve performance and reduce API calls, we need to implement caching mechanisms:

- [x] **Client-side Caching**

  - [x] Implement React Query for data fetching and caching
  - [x] Add local storage caching for vocabulary data
  - [x] Implement optimistic updates for better UX

- [ ] **Server-side Caching**

  - [ ] Add Redis caching for frequently accessed data
  - [ ] Implement cache invalidation strategies
  - [x] Add cache headers for HTTP responses

- [ ] **Static Generation**
  - [ ] Use Next.js ISR for static pages with dynamic data
  - [ ] Implement revalidation strategies
  - [x] Add loading states and skeleton screens

#### 2. Adaptive Difficulty

Enhance the system to adapt difficulty based on user performance:

- [ ] **Dynamic Difficulty Adjustment**

  - [ ] Implement algorithm to adjust content difficulty based on performance
  - [ ] Create difficulty progression paths
  - [ ] Add personalized difficulty recommendations

- [ ] **User Performance Analysis**

  - [ ] Implement analytics to track user performance patterns
  - [ ] Create visualization of learning progress
  - [ ] Add insights and recommendations based on performance

- [ ] **Content Selection**
  - [ ] Implement smart content selection based on difficulty level
  - [ ] Add variety in content to maintain engagement
  - [ ] Create challenge content for advanced users

#### 3. Advanced Vocabulary Features ✅

Complete the implementation of the vocabulary bank with additional features:

- [x] **Word Relationships**

  - [x] Add synonyms and antonyms
  - [x] Implement word families and related terms
  - [x] Create semantic networks of related vocabulary

- [x] **Learning Modes**

  - [x] Add flashcard mode for quick review
  - [x] Implement quiz mode for testing knowledge
  - [x] Create writing practice with vocabulary words

- [x] **Progress Visualization**

  - [x] Add detailed statistics dashboard
  - [x] Implement heatmap for review activity
  - [x] Create mastery level visualization

- [ ] **Export and Sharing**
  - [ ] Add export functionality for vocabulary lists
  - [ ] Implement sharing of vocabulary collections
  - [ ] Create printable study materials

## Speaking Module Implementation Plan

### Overview

The Speaking Module will provide users with three main features:

1. **Guided Speaking Practice**: Structured speaking exercises with AI feedback
2. **Pronunciation Practice**: Focused practice on specific pronunciation challenges
3. **Free Conversation**: Natural conversation with AI using OpenAI's Real-Time API

### Core Infrastructure

#### Data Model

```typescript
interface ISpeakingSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionType: 'guided' | 'pronunciation' | 'conversation';
  level: string;
  topic: string;
  customTopic?: string;
  scenario?: string;

  // For guided speaking and pronunciation
  prompt?: string;
  recordings: Array<{
    recordingUrl: string;
    transcription: string;
    duration: number;
    timestamp: Date;
  }>;

  // For conversation
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    audioUrl?: string; // For user messages
  }>;

  analysis?: {
    grammarScore: number;
    fluencyScore: number;
    pronunciationScore: number;
    vocabularyScore: number;
    overallScore: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      suggestions: string[];
    };
    grammarIssues: Array<{
      text: string;
      issue: string;
      correction: string;
      explanation: string;
    }>;
    pronunciationIssues: Array<{
      word: string;
      correctPronunciation: string;
      userPronunciation: string;
      suggestion: string;
    }>;
  };

  // Usage tracking for Real-Time API
  realTimeUsage?: {
    duration: number;
    tokensUsed: number;
  };

  status: 'in-progress' | 'completed' | 'analyzed';
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### User Settings Model Extension

```typescript
// Add to User model
interface IUser {
  // ... existing fields
  speakingSettings: {
    realTimeApiMonthlyAllowance: number;
    realTimeApiUsedThisMonth: number;
    lastResetDate: Date;
    preferredVoice: string;
    autoTranscribe: boolean;
  };
}
```

### Implementation Phases

#### Phase 1: Core Infrastructure (1 week)

1. **Create Data Models**

   - Implement SpeakingSession model
   - Update User model with speaking settings
   - Create database indexes for efficient queries

2. **Set Up API Routes**

   - Create session management endpoints
   - Implement authentication middleware
   - Set up error handling

3. **Create Basic UI Components**
   - Implement session list page
   - Create new session page with tabs
   - Implement basic recording functionality

#### Phase 2: Guided Speaking Implementation (1 week)

1. **Prompt Generation**

   - Implement topic selection UI
   - Create prompt generation API using GPT-4
   - Implement level-appropriate content generation

2. **Recording and Transcription**

   - Implement audio recording with proper error handling
   - Set up Whisper API integration for transcription
   - Create audio storage and retrieval system

3. **Analysis and Feedback**
   - Implement speech analysis using GPT-4
   - Create detailed feedback generation
   - Design feedback display UI

#### Phase 3: Pronunciation Practice (1 week)

1. **Exercise Generation**

   - Create pronunciation exercise templates
   - Implement minimal pairs and consonant clusters
   - Design level-appropriate exercises

2. **Pronunciation Analysis**

   - Implement detailed pronunciation assessment
   - Create word-level feedback
   - Design visual pronunciation feedback

3. **Progress Tracking**
   - Implement pronunciation improvement tracking
   - Create progress visualization
   - Design targeted practice recommendations

#### Phase 4: Free Conversation (2 weeks)

1. **Real-Time API Integration**

   - Set up OpenAI Real-Time API with WebRTC
   - Implement streaming audio processing
   - Create fallback mechanisms for connection issues
   - Implement role-play scenarios
   - Set up usage tracking and limits

2. **Role-Play Scenarios**

   - Create pre-defined role-play templates
   - Implement custom scenario input
   - Design role-play UI with clear role indicators

3. **Usage Management**
   - Implement monthly usage tracking
   - Create usage limit enforcement
   - Design user-friendly usage display

#### Phase 5: Testing and Refinement (1 week)

1. **User Testing**

   - Conduct internal testing
   - Fix identified issues
   - Optimize performance
   - Implement error recovery
   - Add monitoring and logging

2. **Documentation**

   - Create user documentation
   - Document API endpoints
   - Create developer documentation

3. **Final Polishing**
   - Improve UI/UX
   - Optimize API calls
   - Enhance error handling

### Technical Implementation Details

#### Audio Recording and Processing

```typescript
// Audio recording hook
function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = e => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach(track => track.stop());
    }
  }, [isRecording]);

  return { isRecording, audioBlob, startRecording, stopRecording };
}
```

#### Whisper API Integration

```typescript
// Transcription service
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-1');

  try {
    const response = await fetch('/api/speaking/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}
```

#### Real-Time API Integration

```typescript
// Real-time conversation service
class RealTimeConversationService {
  private socket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;

  // Event callbacks
  private onMessageCallback: ((message: string) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }

  public async startConversation(
    sessionId: string,
    level: string,
    scenario?: string
  ) {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Connect to WebSocket server
      this.socket = new WebSocket(
        `wss://${window.location.host}/api/speaking/realtime?sessionId=${sessionId}&level=${level}${scenario ? `&scenario=${encodeURIComponent(scenario)}` : ''}`
      );

      // Set up WebSocket event handlers
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onopen = this.startRecording.bind(this);
      this.socket.onclose = this.cleanup.bind(this);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private startRecording() {
    if (!this.stream) return;

    this.mediaRecorder = new MediaRecorder(this.stream);

    // Send audio data to server when available
    this.mediaRecorder.ondataavailable = event => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(event.data);
      }
    };

    // Start recording with small time slices for real-time processing
    this.mediaRecorder.start(100);
  }

  public stopConversation() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }

    if (this.socket) {
      this.socket.close();
    }

    this.cleanup();
  }

  private cleanup() {
    // Stop all tracks in the stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.mediaRecorder = null;
    this.socket = null;
  }

  private handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

    if (data.type === 'transcript') {
      // Handle transcription
      if (this.onMessageCallback) {
        this.onMessageCallback(data.content);
      }
    } else if (data.type === 'audio') {
      // Handle audio response (play it)
      this.playAudioResponse(data.content);
    }
  }

  private async playAudioResponse(audioBase64: string) {
    if (!this.audioContext) return;

    try {
      // Convert base64 to ArrayBuffer
      const binaryString = window.atob(audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer);

      // Play audio
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio response:', error);
    }
  }

  private handleError(error: Error) {
    console.error('Real-time conversation error:', error);
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
    this.cleanup();
  }

  public onMessage(callback: (message: string) => void) {
    this.onMessageCallback = callback;
  }

  public onError(callback: (error: Error) => void) {
    this.onErrorCallback = callback;
  }
}
```

### API Endpoints

1. **Session Management**

   - `POST /api/speaking/sessions` - Create a new speaking session
   - `GET /api/speaking/sessions` - Get all speaking sessions for the user
   - `GET /api/speaking/sessions/:id` - Get a specific speaking session
   - `DELETE /api/speaking/sessions/:id` - Delete a speaking session

2. **Guided Speaking**

   - `POST /api/speaking/generate-prompt` - Generate a speaking prompt
   - `POST /api/speaking/transcribe` - Transcribe audio using Whisper API
   - `POST /api/speaking/analyze` - Analyze speaking performance

3. **Pronunciation Practice**

   - `GET /api/speaking/pronunciation/exercises` - Get pronunciation exercises
   - `POST /api/speaking/pronunciation/analyze` - Analyze pronunciation

4. **Free Conversation**
   - `GET /api/speaking/usage` - Get user's Real-Time API usage
   - `POST /api/speaking/conversation/start` - Start a conversation session
   - `POST /api/speaking/conversation/end` - End a conversation session

### User Interface Components

1. **Session List Page**

   - Display all speaking sessions with type, date, and score
   - Filter by session type (guided, pronunciation, conversation)
   - Sort by date, score, or duration
   - "New Session" button

2. **New Session Page**

   - Tab navigation for session types
   - Level selection dropdown
   - Topic selection with custom input option
   - Role-play scenario selection for conversation

3. **Guided Speaking Interface**

   - Prompt display
   - Record button with visual feedback
   - Playback of recording
   - Analysis results with detailed feedback
   - Retry option

4. **Pronunciation Practice Interface**

   - Exercise display with examples
   - Record button with visual feedback
   - Word-by-word pronunciation feedback
   - Visual pronunciation guide
   - Practice history

5. **Conversation Interface**
   - Role display (user and AI)
   - Real-time transcription display
   - Visual indicator for speaking/listening
   - Connection status indicator
   - End conversation button
   - Usage meter

### Monthly Usage Management

1. **Usage Tracking**

   - Track Real-Time API usage in minutes
   - Reset usage counter monthly
   - Store usage data in user profile

2. **Usage Limits**

   - Set default monthly allowance (e.g., 30 minutes)
   - Implement graceful degradation when limit is reached
   - Provide clear feedback on remaining usage

3. **Usage Display**
   - Show usage meter in conversation interface
   - Display monthly usage statistics in user profile
   - Send notifications when approaching limit

### Testing Strategy

1. **Unit Testing**

   - Test individual components and functions
   - Mock API responses for consistent testing
   - Test error handling and edge cases
   - Test WebRTC connection handling

2. **Integration Testing**

   - Test API endpoints with mock requests
   - Verify database operations
   - Test authentication and authorization
   - Test WebRTC signaling process

3. **End-to-End Testing**
   - Test complete user flows
   - Verify audio recording and processing
   - Test real-time conversation functionality
   - Test connection recovery scenarios

### Deployment Considerations

1. **API Keys and Security**

   - Secure storage of OpenAI API keys
   - Implement rate limiting
   - Validate all user inputs
   - Secure WebRTC signaling

2. **Performance Optimization**

   - Optimize audio processing
   - Implement efficient WebRTC handling
   - Use appropriate caching strategies
   - Monitor bandwidth usage

3. **Error Handling**
   - Implement comprehensive error handling
   - Provide user-friendly error messages
   - Log errors for debugging
   - Implement connection recovery

### Timeline

- **Week 1**: Core infrastructure and WebRTC setup
- **Week 2**: Guided speaking implementation
- **Week 3**: Pronunciation practice implementation
- **Weeks 4-5**: Free conversation implementation
- **Week 6**: Testing, refinement, and documentation

This implementation plan provides a structured approach to building the speaking module while maintaining consistency with the existing application architecture and keeping the implementation straightforward and robust.
