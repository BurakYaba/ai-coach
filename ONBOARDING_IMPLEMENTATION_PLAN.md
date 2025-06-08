# Fluenta Onboarding Implementation Plan

## Overview

This document outlines the implementation plan for Phase 1 (Welcome & Assessment) and Phase 2 (Guided Module Introduction) of the Fluenta onboarding system. The plan is designed to integrate seamlessly with the existing codebase while providing a comprehensive first-time user experience.

## Table of Contents

- [Phase 1: Welcome & Assessment](#phase-1-welcome--assessment)
- [Phase 2: Guided Module Introduction](#phase-2-guided-module-introduction)
- [Database Schema Changes](#database-schema-changes)
- [API Routes](#api-routes)
- [Component Structure](#component-structure)
- [Implementation Timeline](#implementation-timeline)
- [Testing Strategy](#testing-strategy)
- [Integration Points](#integration-points)

## Phase 1: Welcome & Assessment

### 1.1 Database Schema Extensions

#### User Model Extension

Add onboarding fields to the existing User model:

```typescript
// src/models/User.ts - Add to existing interface
interface IUser extends Document {
  // ... existing fields
  onboarding: {
    completed: boolean;
    currentStep: number;
    skillAssessment: {
      completed: boolean;
      ceferLevel: string; // A1, A2, B1, B2, C1, C2
      weakAreas: string[]; // ['grammar', 'vocabulary', 'speaking', etc.]
      strengths: string[];
      assessmentDate: Date;
      scores: {
        reading: number;
        writing: number;
        listening: number;
        speaking: number;
        vocabulary: number;
        grammar: number;
      };
    };
    preferences: {
      learningGoals: string[]; // ['business', 'travel', 'academic', etc.]
      interests: string[];
      timeAvailable: string; // '15min', '30min', '60min', 'flexible'
      preferredTime: string; // 'morning', 'afternoon', 'evening'
      learningStyle: string; // 'visual', 'auditory', 'kinesthetic', 'mixed'
    };
    recommendedPath: {
      primaryFocus: string[]; // modules to focus on
      suggestedOrder: string[];
      estimatedWeeks: number;
    };
    completedAt?: Date;
  };
  // ... rest of existing fields
}
```

#### New Models

**SkillAssessment Model:**

```typescript
// src/models/SkillAssessment.ts
interface ISkillAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  questions: Array<{
    id: string;
    type: "reading" | "grammar" | "vocabulary" | "listening";
    question: string;
    options?: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
    difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  }>;
  results: {
    totalQuestions: number;
    correctAnswers: number;
    overallScore: number;
    skillScores: {
      reading: number;
      grammar: number;
      vocabulary: number;
      listening: number;
    };
    recommendedLevel: string;
    weakAreas: string[];
    strengths: string[];
  };
  completedAt: Date;
}
```

### 1.2 API Routes

#### Assessment API

```typescript
// src/app/api/onboarding/assessment/route.ts
export async function GET() {
  // Generate skill assessment questions
  // Mix of reading comprehension, grammar, vocabulary
  // 15-20 questions total, balanced across skills
}

export async function POST() {
  // Process assessment results
  // Calculate scores and CEFL level
  // Identify weak areas and strengths
  // Update user onboarding data
}
```

#### Onboarding Progress API

```typescript
// src/app/api/onboarding/progress/route.ts
export async function GET() {
  // Get current onboarding progress
}

export async function PATCH() {
  // Update onboarding step
  // Save preferences
  // Mark steps as completed
}
```

#### Learning Path API

```typescript
// src/app/api/onboarding/learning-path/route.ts
export async function POST() {
  // Generate personalized learning path
  // Based on assessment results and preferences
  // Return recommended module order and focus areas
}
```

### 1.3 Component Structure

#### Main Onboarding Flow

```
src/components/onboarding/
├── OnboardingFlow.tsx          # Main container component
├── steps/
│   ├── WelcomeStep.tsx         # Step 1: Welcome
│   ├── AssessmentStep.tsx      # Step 2: Skill assessment
│   ├── GoalsStep.tsx           # Step 3: Learning goals
│   ├── PreferencesStep.tsx     # Step 4: Learning preferences
│   └── PathStep.tsx            # Step 5: Recommended path
├── assessment/
│   ├── AssessmentQuestion.tsx  # Individual question component
│   ├── AssessmentProgress.tsx  # Progress indicator
│   └── AssessmentResults.tsx   # Results display
└── shared/
    ├── StepIndicator.tsx       # Progress stepper
    ├── NavigationButtons.tsx   # Next/Previous buttons
    └── OnboardingLayout.tsx    # Consistent layout
```

#### Welcome Step Component

```typescript
// src/components/onboarding/steps/WelcomeStep.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeStepProps {
  onNext: () => void;
  userName: string;
}

export function WelcomeStep({ onNext, userName }: WelcomeStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">
          Welcome to Fluenta, {userName}!
        </h1>
        <p className="text-xl text-muted-foreground">
          Let's set up your personalized English learning journey
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What You'll Get</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              icon="📚"
              title="Personalized Content"
              description="AI-generated lessons tailored to your level and interests"
            />
            <FeatureCard
              icon="🎯"
              title="Skill Assessment"
              description="Quick test to understand your current English level"
            />
            <FeatureCard
              icon="📈"
              title="Progress Tracking"
              description="Visual progress with XP, levels, and achievements"
            />
            <FeatureCard
              icon="🎮"
              title="Gamified Learning"
              description="Fun games and challenges to keep you motivated"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onNext} size="lg" className="px-8">
          Let's Get Started
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This will take about 5-10 minutes
        </p>
      </div>
    </div>
  );
}
```

#### Assessment Step Component

```typescript
// src/components/onboarding/steps/AssessmentStep.tsx
export function AssessmentStep({ onNext, onPrevious }: AssessmentStepProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["assessment-questions"],
    queryFn: () => fetch("/api/onboarding/assessment").then(res => res.json()),
  });

  const submitAssessment = useMutation({
    mutationFn: (data: any) =>
      fetch("/api/onboarding/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      onNext();
    },
  });

  // Component implementation...
}
```

### 1.4 Integration with Existing Dashboard

#### Dashboard Layout Modification

```typescript
// src/app/dashboard/layout.tsx - Add onboarding check
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const user = await User.findById(session.user.id);

  // Check if user needs onboarding
  if (!user?.onboarding?.completed) {
    redirect("/onboarding");
  }

  // ... rest of existing layout logic
}
```

#### Onboarding Page

```typescript
// src/app/onboarding/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const user = await User.findById(session.user.id);

  // If already onboarded, redirect to dashboard
  if (user?.onboarding?.completed) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <OnboardingFlow
        userId={session.user.id}
        currentStep={user?.onboarding?.currentStep || 0}
      />
    </div>
  );
}
```

## Phase 2: Guided Module Introduction

### 2.1 Tour System Architecture

#### Tour State Management

```typescript
// src/hooks/use-onboarding-tour.ts
export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right";
  action?: () => void;
}

export interface ModuleTour {
  moduleId: string;
  steps: TourStep[];
  completed: boolean;
}

export function useOnboardingTour() {
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTours, setCompletedTours] = useState<string[]>([]);

  // Tour management functions...
}
```

#### Tour Component

```typescript
// src/components/onboarding/tour/TourOverlay.tsx
import { createPortal } from 'react-dom';

interface TourOverlayProps {
  step: TourStep;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  stepNumber: number;
  totalSteps: number;
}

export function TourOverlay({ step, onNext, onPrevious, onSkip, isFirst, isLast, stepNumber, totalSteps }: TourOverlayProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.querySelector(step.target);
    setTargetElement(element as HTMLElement);
  }, [step.target]);

  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();

  return createPortal(
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" />

      {/* Highlight cutout */}
      <div
        className="fixed z-51 border-4 border-primary rounded-lg pointer-events-none"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      />

      {/* Tour popup */}
      <Card
        className="fixed z-52 max-w-sm"
        style={{
          top: step.placement === 'bottom' ? rect.bottom + 12 : rect.top - 12,
          left: step.placement === 'right' ? rect.right + 12 : rect.left,
          transform: step.placement === 'top' ? 'translateY(-100%)' : 'none',
        }}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip Tour
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{step.content}</p>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirst}
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={isLast ? step.action || onNext : onNext}
              size="sm"
            >
              {isLast ? 'Got it!' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>,
    document.body
  );
}
```

### 2.2 Module-Specific Tours

#### Dashboard Tour Configuration

```typescript
// src/lib/onboarding/tours/dashboard-tour.ts
export const dashboardTour: TourStep[] = [
  {
    id: "welcome-banner",
    target: '[data-tour="welcome-banner"]',
    title: "Welcome to Your Dashboard",
    content:
      "This is your learning hub where you can see your progress and access all learning modules.",
    placement: "bottom",
  },
  {
    id: "gamification-stats",
    target: '[data-tour="gamification-stats"]',
    title: "Your Learning Progress",
    content:
      "Track your XP, level, and learning streak. Complete activities to earn points and unlock achievements!",
    placement: "top",
  },
  {
    id: "navigation",
    target: '[data-tour="navigation"]',
    title: "Learning Modules",
    content:
      "Navigate between different skill areas: Reading, Writing, Listening, Speaking, Vocabulary, Grammar, and Games.",
    placement: "bottom",
  },
  {
    id: "reading-module",
    target: '[data-tour="nav-reading"]',
    title: "Reading Practice",
    content:
      "Improve comprehension with AI-generated passages tailored to your level and interests.",
    placement: "bottom",
    action: () => {
      // Will trigger reading module tour when user clicks
    },
  },
  // ... more steps
];
```

#### Reading Module Tour

```typescript
// src/lib/onboarding/tours/reading-tour.ts
export const readingTour: TourStep[] = [
  {
    id: "create-session",
    target: '[data-tour="create-reading-session"]',
    title: "Create Your First Reading Session",
    content:
      "Click here to generate a personalized reading passage with comprehension questions.",
    placement: "right",
  },
  {
    id: "session-options",
    target: '[data-tour="session-options"]',
    title: "Customize Your Content",
    content:
      "Choose topics you're interested in, set your difficulty level, and select passage length.",
    placement: "left",
  },
  {
    id: "progress-tracking",
    target: '[data-tour="reading-progress"]',
    title: "Track Your Progress",
    content:
      "See your completed sessions, scores, and vocabulary learned over time.",
    placement: "top",
  },
];
```

### 2.3 Integration with Existing Components

#### Add Tour Attributes to Navigation

```typescript
// src/components/dashboard/nav.tsx - Add data-tour attributes
export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2" data-tour="navigation">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          data-tour={`nav-${item.title.toLowerCase()}`}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted/50 hover:text-primary",
            // ... existing className logic
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
```

#### Add Tour Attributes to Dashboard

```typescript
// src/app/dashboard/page.tsx - Add data-tour attributes
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  // ... existing logic

  return (
    <div className="space-y-8">
      <div
        className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl backdrop-blur-sm border border-muted/10"
        data-tour="welcome-banner"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="text-gradient">{userName}</span>!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your language learning progress
        </p>
      </div>

      <div data-tour="gamification-stats">
        <GamificationProfileStats />
      </div>
    </div>
  );
}
```

#### Tour Provider and Context

```typescript
// src/components/providers/TourProvider.tsx
interface TourContextType {
  startTour: (tourId: string) => void;
  endTour: () => void;
  skipTour: () => void;
  currentTour: string | null;
  currentStep: number;
  isFirstVisit: (moduleId: string) => boolean;
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [tourState, setTourState] = useState<TourState>({
    currentTour: null,
    currentStep: 0,
    completedTours: [],
  });

  const { data: user } = useQuery({
    queryKey: ['user-tour-progress'],
    queryFn: () => fetch('/api/user/tour-progress').then(res => res.json()),
  });

  // Tour management logic...

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      {tourState.currentTour && (
        <TourManager
          tourId={tourState.currentTour}
          currentStep={tourState.currentStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipTour}
          onEnd={endTour}
        />
      )}
    </TourContext.Provider>
  );
}
```

### 2.4 First-Visit Detection and Auto-Tour Triggering

#### Module Visit Tracking

```typescript
// src/hooks/use-first-visit.ts
export function useFirstVisit(moduleId: string) {
  const { data: visitHistory } = useQuery({
    queryKey: ["visit-history", moduleId],
    queryFn: () =>
      fetch(`/api/user/visits/${moduleId}`).then(res => res.json()),
  });

  const markVisited = useMutation({
    mutationFn: () => fetch(`/api/user/visits/${moduleId}`, { method: "POST" }),
  });

  useEffect(() => {
    if (visitHistory?.isFirstVisit) {
      // Trigger tour after a short delay
      setTimeout(() => {
        startTour(`${moduleId}-tour`);
      }, 1000);

      // Mark as visited
      markVisited.mutate();
    }
  }, [visitHistory, moduleId]);

  return {
    isFirstVisit: visitHistory?.isFirstVisit || false,
    markVisited: markVisited.mutate,
  };
}
```

#### Reading Module Integration

```typescript
// src/app/dashboard/reading/page.tsx - Add first visit detection
export default function ReadingPage() {
  const { isFirstVisit } = useFirstVisit('reading');
  const { startTour } = useTour();

  useEffect(() => {
    if (isFirstVisit) {
      // Short delay to ensure page is fully loaded
      setTimeout(() => {
        startTour('reading-tour');
      }, 1500);
    }
  }, [isFirstVisit, startTour]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reading Practice</h1>
        <Button data-tour="create-reading-session">
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      <div data-tour="reading-progress">
        <ReadingProgress />
      </div>

      <div data-tour="session-list">
        <ReadingSessionList />
      </div>
    </div>
  );
}
```

## Database Schema Changes

### 1. User Model Updates

```typescript
// Add to existing User interface in src/models/User.ts
interface IUser extends Document {
  // ... existing fields
  onboarding: {
    completed: boolean;
    currentStep: number;
    skillAssessment: {
      completed: boolean;
      ceferLevel: string;
      weakAreas: string[];
      strengths: string[];
      assessmentDate: Date;
      scores: {
        reading: number;
        writing: number;
        listening: number;
        speaking: number;
        vocabulary: number;
        grammar: number;
      };
    };
    preferences: {
      learningGoals: string[];
      interests: string[];
      timeAvailable: string;
      preferredTime: string;
      learningStyle: string;
    };
    recommendedPath: {
      primaryFocus: string[];
      suggestedOrder: string[];
      estimatedWeeks: number;
    };
    tours: {
      completed: string[];
      skipped: string[];
    };
    moduleVisits: {
      [key: string]: {
        firstVisit: Date;
        totalVisits: number;
        lastVisit: Date;
      };
    };
    completedAt?: Date;
  };
}
```

### 2. Migration Script

```typescript
// src/scripts/migrate-onboarding.ts
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function migrateUsersForOnboarding() {
  await dbConnect();

  const users = await User.find({ onboarding: { $exists: false } });

  for (const user of users) {
    user.onboarding = {
      completed: true, // Existing users skip onboarding
      currentStep: 5,
      skillAssessment: {
        completed: false,
        ceferLevel: "B1", // Default level
        weakAreas: [],
        strengths: [],
        assessmentDate: new Date(),
        scores: {
          reading: 0,
          writing: 0,
          listening: 0,
          speaking: 0,
          vocabulary: 0,
          grammar: 0,
        },
      },
      preferences: {
        learningGoals: [],
        interests: [],
        timeAvailable: "flexible",
        preferredTime: "evening",
        learningStyle: "mixed",
      },
      recommendedPath: {
        primaryFocus: ["reading", "writing", "vocabulary"],
        suggestedOrder: ["reading", "vocabulary", "writing", "grammar"],
        estimatedWeeks: 12,
      },
      tours: {
        completed: [],
        skipped: [],
      },
      moduleVisits: {},
      completedAt: new Date(),
    };

    await user.save();
  }

  console.log(`Migrated ${users.length} users for onboarding`);
}
```

## API Routes

### 1. Assessment API

```typescript
// src/app/api/onboarding/assessment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Assessment questions pool
const ASSESSMENT_QUESTIONS = {
  reading: [
    // A1 level questions
    {
      id: "r1",
      difficulty: "A1",
      passage:
        "John is a teacher. He works at a school in London. He teaches English to young students.",
      question: "What does John teach?",
      options: ["Math", "English", "Science", "History"],
      correctAnswer: "English",
    },
    // B1 level questions
    {
      id: "r2",
      difficulty: "B1",
      passage:
        "The company announced significant changes to its environmental policy yesterday.",
      question: "When were the changes announced?",
      options: ["Today", "Yesterday", "Last week", "Last month"],
      correctAnswer: "Yesterday",
    },
    // More questions...
  ],
  grammar: [
    {
      id: "g1",
      difficulty: "A1",
      question: "She _____ to school every day.",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: "goes",
    },
    // More questions...
  ],
  vocabulary: [
    {
      id: "v1",
      difficulty: "A2",
      question: 'Choose the word that means "very big":',
      options: ["tiny", "huge", "small", "medium"],
      correctAnswer: "huge",
    },
    // More questions...
  ],
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a balanced set of questions
    const questions = [
      ...ASSESSMENT_QUESTIONS.reading.slice(0, 5),
      ...ASSESSMENT_QUESTIONS.grammar.slice(0, 5),
      ...ASSESSMENT_QUESTIONS.vocabulary.slice(0, 5),
    ].sort(() => Math.random() - 0.5); // Shuffle

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Assessment generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate assessment" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers } = await request.json();

    // Calculate scores
    const results = calculateAssessmentResults(answers);

    // Update user onboarding data
    await dbConnect();
    const user = await User.findById(session.user.id);

    user.onboarding.skillAssessment = {
      completed: true,
      ceferLevel: results.recommendedLevel,
      weakAreas: results.weakAreas,
      strengths: results.strengths,
      assessmentDate: new Date(),
      scores: results.skillScores,
    };

    await user.save();

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Assessment processing error:", error);
    return NextResponse.json(
      { error: "Failed to process assessment" },
      { status: 500 }
    );
  }
}

function calculateAssessmentResults(answers: Record<string, string>) {
  // Implementation for score calculation and level determination
  // Returns recommended CEFL level, weak areas, strengths, etc.
}
```

### 2. Onboarding Progress API

```typescript
// src/app/api/onboarding/progress/route.ts
export async function GET() {
  // Get current onboarding progress
}

export async function PATCH(request: NextRequest) {
  // Update onboarding step, preferences, etc.
}
```

### 3. Tour Progress API

```typescript
// src/app/api/user/tour-progress/route.ts
export async function GET() {
  // Get completed tours and current progress
}

export async function PATCH(request: NextRequest) {
  // Mark tours as completed or skipped
}
```

### 4. Module Visits API

```typescript
// src/app/api/user/visits/[moduleId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  // Check if this is user's first visit to module
}

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  // Record module visit
}
```

## Component Structure

```
src/components/onboarding/
├── OnboardingFlow.tsx              # Main container
├── steps/
│   ├── WelcomeStep.tsx            # Welcome and introduction
│   ├── AssessmentStep.tsx         # Skill assessment
│   ├── GoalsStep.tsx              # Learning goals selection
│   ├── PreferencesStep.tsx        # Time, style preferences
│   └── PathStep.tsx               # Recommended learning path
├── assessment/
│   ├── AssessmentQuestion.tsx     # Individual question component
│   ├── AssessmentProgress.tsx     # Progress indicator
│   ├── AssessmentResults.tsx      # Results display
│   └── SkillLevelDisplay.tsx      # CEFL level visualization
├── tour/
│   ├── TourOverlay.tsx            # Tour popup and highlighting
│   ├── TourManager.tsx            # Tour state management
│   ├── TourStep.tsx               # Individual tour step
│   └── TourProgress.tsx           # Tour progress indicator
├── shared/
│   ├── StepIndicator.tsx          # Progress stepper
│   ├── NavigationButtons.tsx      # Next/Previous buttons
│   ├── OnboardingLayout.tsx       # Consistent layout
│   └── FeatureCard.tsx            # Feature highlight cards
└── providers/
    ├── OnboardingProvider.tsx     # Onboarding state context
    └── TourProvider.tsx           # Tour state context
```

## Implementation Timeline

### Week 1: Phase 1 Foundation

- [ ] Database schema updates and migration
- [ ] User model extensions
- [ ] Assessment question pool creation
- [ ] Basic onboarding API routes

### Week 2: Phase 1 Components

- [ ] Onboarding flow components
- [ ] Assessment components
- [ ] Welcome and preference steps
- [ ] Learning path generation

### Week 3: Phase 1 Integration

- [ ] Dashboard layout modifications
- [ ] Onboarding page creation
- [ ] Assessment processing logic
- [ ] User experience testing

### Week 4: Phase 2 Foundation

- [ ] Tour system architecture
- [ ] Tour state management
- [ ] Tour overlay components
- [ ] Module visit tracking

### Week 5: Phase 2 Tours

- [ ] Dashboard tour implementation
- [ ] Reading module tour
- [ ] Writing module tour
- [ ] Navigation enhancements

### Week 6: Phase 2 Integration

- [ ] Remaining module tours
- [ ] First-visit detection
- [ ] Tour provider integration
- [ ] Cross-module coordination

### Week 7: Testing & Polish

- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] User experience refinement
- [ ] Documentation updates

## Testing Strategy

### Unit Tests

```typescript
// src/components/onboarding/__tests__/OnboardingFlow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingFlow } from '../OnboardingFlow';

describe('OnboardingFlow', () => {
  it('should render welcome step initially', () => {
    render(<OnboardingFlow userId="test" currentStep={0} />);
    expect(screen.getByText(/Welcome to Fluenta/)).toBeInTheDocument();
  });

  it('should progress through steps correctly', () => {
    // Test step progression
  });

  it('should handle assessment completion', () => {
    // Test assessment flow
  });
});
```

### Integration Tests

```typescript
// src/app/api/onboarding/__tests__/assessment.test.ts
import { GET, POST } from "../assessment/route";

describe("/api/onboarding/assessment", () => {
  it("should generate assessment questions", async () => {
    // Test question generation
  });

  it("should process assessment results correctly", async () => {
    // Test result processing
  });
});
```

### E2E Tests

```typescript
// cypress/e2e/onboarding.cy.ts
describe("Onboarding Flow", () => {
  it("should complete full onboarding process", () => {
    cy.visit("/onboarding");
    cy.get('[data-cy="welcome-next"]').click();
    // ... test complete flow
  });

  it("should trigger tours on first module visit", () => {
    cy.visit("/dashboard/reading");
    cy.get('[data-cy="tour-overlay"]').should("be.visible");
  });
});
```

## Integration Points

### 1. Authentication Flow

- Check onboarding status in middleware
- Redirect new users to onboarding
- Skip onboarding for existing users

### 2. Dashboard Integration

- Add tour attributes to existing components
- Integrate with gamification stats
- Enhance navigation with tour triggers

### 3. Module Integration

- Add first-visit detection to all modules
- Include tour attributes in key components
- Connect with existing progress tracking

### 4. Gamification Integration

- Award XP for onboarding completion
- Create onboarding-specific achievements
- Track onboarding metrics in user stats

### 5. Notification System

- Welcome notifications for new users
- Tour completion notifications
- Progress milestone alerts

## Performance Considerations

### 1. Lazy Loading

- Load tour components only when needed
- Lazy load assessment questions
- Progressive image loading for onboarding

### 2. Caching

- Cache assessment questions
- Store tour progress locally
- Optimize API calls with React Query

### 3. Bundle Size

- Split onboarding code into separate chunk
- Minimize tour overlay bundle
- Optimize assessment question storage

## Security Considerations

### 1. Data Protection

- Validate all onboarding inputs
- Sanitize user preferences
- Protect assessment answers

### 2. Rate Limiting

- Limit assessment attempts
- Prevent tour spam
- Throttle progress updates

### 3. Authorization

- Verify user permissions for all operations
- Protect sensitive onboarding data
- Validate tour completion claims

## Future Enhancements

### Phase 3 (Future)

- A/B testing for onboarding flows
- Advanced personalization algorithms
- Social onboarding features
- Video tutorials integration
- Voice-guided tours
- Mobile-specific optimizations

This implementation plan provides a comprehensive roadmap for implementing user onboarding while maintaining compatibility with the existing codebase and following established patterns and conventions.
