# AI Coach Gamification Implementation Plan

## Overview

This document outlines the gamification strategy for the AI Coach language learning platform. The plan has been designed to integrate with the existing application structure and leverage the current implementation of reading, writing, listening, speaking, vocabulary, grammar, and game modules.

## Current State Analysis

### Existing Progress Tracking

- **Reading Module**: Tracks completed sessions, comprehension scores, words read, vocabulary reviewed
- **Writing Module**: Tracks completed sessions, word count, skills progress (grammar, vocabulary, coherence, style)
- **Listening Module**: Tracks completed sessions, listening time, content types, strong/weak topics
- **Speaking Module**: Tracks conversation sessions, evaluations, and pronunciation feedback
- **Vocabulary Module**: Implements spaced repetition, tracks mastery level of words
- **Games Module**: Currently has Word Scramble game with basic scoring

### Current Limitations

- Streak tracking is mentioned in models but not fully implemented
- No unified XP/leveling system
- Limited achievement recognition
- No cross-module gamification elements
- No social/competitive features

## Gamification Implementation Strategy

We'll implement gamification in phases, with each phase focusing on specific features while ensuring backward compatibility with existing modules.

## Phase 1: Core Gamification Framework (1-2 weeks)

### 1. Data Models

```typescript
// User Gamification Profile Extension
interface IGamificationProfile extends Document {
  userId: mongoose.Types.ObjectId;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
  achievements: Array<{
    id: string;
    unlockedAt: Date;
  }>;
  badges: Array<{
    id: string;
    unlockedAt: Date;
  }>;
  stats: {
    totalXP: number;
    activeDays: number;
    moduleActivity: {
      reading: number;
      writing: number;
      listening: number;
      speaking: number;
      vocabulary: number;
      grammar: number;
      games: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Achievement Definition (static data)
interface IAchievement {
  id: string;
  name: string;
  description: string;
  category: "progress" | "milestone" | "activity" | "skill" | "special";
  icon: string;
  xpReward: number;
  requirement: {
    type: string;
    value: number;
    module?: string;
  };
}

// Badge Definition (static data)
interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  category: string;
}

// User Activity for XP tracking
interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: string;
  module: string;
  xpEarned: number;
  metadata: Record<string, any>;
  createdAt: Date;
}
```

### 2. Experience Points (XP) System

#### XP Rewards by Activity:

- **Reading**:
  - Complete a reading session: 20 XP
  - Answer comprehension questions correctly: 5 XP per correct answer
  - Review vocabulary words: 2 XP per word
- **Writing**:
  - Complete a writing session: 30 XP
  - Submit a writing piece over 200 words: +10 XP
  - Submit a writing piece over 500 words: +20 XP
- **Listening**:
  - Complete a listening session: 20 XP
  - Answer comprehension questions correctly: 5 XP per correct answer
- **Speaking**:
  - Complete a speaking session: 30 XP
  - Complete a conversation session: 40 XP
- **Vocabulary**:
  - Review a word with spaced repetition: 2 XP
  - Master a word (reach 100% mastery): 5 XP
- **Grammar**:
  - Complete a grammar lesson: 15 XP
  - Complete a grammar exercise: 10 XP
- **Games**:
  - Complete a word scramble game: 15 XP
  - Bonus XP based on score: up to 25 XP

#### Leveling Formula:

```javascript
// XP needed for each level (increases with level)
const xpForLevel = level => 100 * Math.pow(level, 1.5);
```

### 3. Streak System

- Track daily activity across all modules
- Reward consecutive days of activity
- Implement streak protection mechanism
- Provide streak recovery opportunity

### 4. XP and Streak UI Components

- XP progress bar in global header
- Streak indicator with current streak count
- Level display with progress to next level
- XP gain notifications

## Phase 2: Achievements and Badges (1-2 weeks)

### 1. Achievement System

#### Achievement Categories:

- **Progress Achievements**: Based on completing a certain number of activities
- **Milestone Achievements**: Based on reaching specific milestones (levels, streaks, etc.)
- **Activity Achievements**: Based on specific actions in the app
- **Skill Achievements**: Based on demonstrating proficiency in specific skills
- **Special Achievements**: Unique achievements for special events or circumstances

#### Example Achievements:

```javascript
const achievements = [
  // Progress Achievements
  {
    id: "reading_enthusiast_1",
    name: "Reading Enthusiast I",
    description: "Complete 5 reading sessions",
    category: "progress",
    icon: "book",
    xpReward: 50,
    requirement: {
      type: "completion_count",
      value: 5,
      module: "reading",
    },
  },

  // Milestone Achievements
  {
    id: "vocabulary_master_1",
    name: "Vocabulary Master I",
    description: "Master 50 vocabulary words",
    category: "milestone",
    icon: "book-open",
    xpReward: 100,
    requirement: {
      type: "mastered_words",
      value: 50,
    },
  },

  // Activity Achievements
  {
    id: "consistent_learner_1",
    name: "Consistent Learner I",
    description: "Achieve a 7-day learning streak",
    category: "activity",
    icon: "calendar",
    xpReward: 75,
    requirement: {
      type: "streak",
      value: 7,
    },
  },
  // Many more...
];
```

### 2. Badge System

#### Badge Categories:

- **Module-specific**: For excellence in specific modules
- **Cross-module**: For general app usage and achievements
- **Special**: For exceptional accomplishments

#### Badge Tiers:

- Bronze → Silver → Gold → Platinum

#### Example Badges:

```javascript
const badges = [
  {
    id: "speaking_bronze",
    name: "Speaking Enthusiast",
    description: "Demonstrated dedication to speaking practice",
    icon: "microphone",
    tier: "bronze",
    category: "speaking",
  },
  {
    id: "all_rounder_silver",
    name: "All-Rounder",
    description: "Balanced practice across all learning modules",
    icon: "star",
    tier: "silver",
    category: "cross-module",
  },
  // Many more...
];
```

### 3. Achievement and Badge UI

- Achievement showcase page
- Achievement notification system
- Badge display on user profile
- "Recently unlocked" section on dashboard

## Phase 3: Challenges and Rewards (1-2 weeks)

### 1. Daily/Weekly Challenges

```typescript
interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  challengeType: "daily" | "weekly";
  challenges: Array<{
    id: string;
    description: string;
    module: string;
    target: number;
    progress: number;
    completed: boolean;
    xpReward: number;
  }>;
  refreshedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Example Challenge Types:

- Complete X reading sessions
- Master X vocabulary words
- Maintain a conversation for X minutes
- Achieve X% comprehension score in listening
- Write X words across writing sessions

### 2. Challenge Generation System

- Generates personalized challenges based on user activity
- Refreshes daily/weekly
- Ensures variety and balance across modules
- Adapts difficulty based on user level

### 3. Rewards System

- XP rewards for completing challenges
- Streak protection rewards
- Special profile customizations
- "Bonus XP" periods

### 4. Challenge UI

- Challenge dashboard
- Progress indicators
- Completion animations
- Reward collection UI

## Phase 4: Social and Competitive Features (2-3 weeks)

### 1. Leaderboards

```typescript
interface ILeaderboard extends Document {
  type: "weekly" | "monthly" | "all-time";
  category: "xp" | "streak" | "module-specific";
  entries: Array<{
    userId: mongoose.Types.ObjectId;
    username: string;
    avatarUrl?: string;
    value: number;
    rank: number;
  }>;
  refreshedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Leaderboard Categories:

- Weekly/Monthly XP gained
- Current streak
- Module-specific achievements

### 2. Learning Groups

```typescript
interface ILearningGroup extends Document {
  name: string;
  description: string;
  members: Array<{
    userId: mongoose.Types.ObjectId;
    role: "admin" | "member";
    joinedAt: Date;
  }>;
  settings: {
    isPrivate: boolean;
    joinRequireApproval: boolean;
  };
  stats: {
    totalXP: number;
    activeMembers: number;
    averageStreak: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Group Features:

- Group challenges
- Group leaderboards
- Group achievements
- Activity feed

### 3. Social UI

- Profile customization
- Activity sharing
- Group management interface
- Leaderboard visualization

## Phase 5: Integration and Polish (1-2 weeks)

### 1. Dashboard Integration

- Gamification hub in main dashboard
- Activity and achievement summary
- Next-level progress
- Recommended activities based on XP optimization

### 2. Module-Specific Gamification Elements

- Add gamification elements to each module's UI
- Module-specific challenge indicators
- XP gain indicators during activities
- Achievement progress during activities

### 3. Notification System

- Achievement unlocked notifications
- Level-up celebrations
- Streak alerts and reminders
- Challenge completion notifications

### 4. Analytics and Adjustments

- Track engagement metrics
- Adjust XP rewards based on usage patterns
- Balance challenge difficulty
- Regular new content for achievements and badges

## API Routes Implementation

### Core Gamification Routes

- `GET /api/gamification/profile` - Get user's gamification profile
- `POST /api/gamification/activity` - Record activity and award XP
- `GET /api/gamification/achievements` - Get user's achievements
- `GET /api/gamification/badges` - Get user's badges
- `GET /api/gamification/challenges` - Get user's current challenges
- `POST /api/gamification/challenges/:id/complete` - Mark challenge as complete
- `GET /api/gamification/leaderboard/:type` - Get leaderboard data

### Integration Routes

- `POST /api/reading/sessions/:id/complete` - Add XP awards and achievement checks
- `POST /api/writing/sessions/:id/complete` - Add XP awards and achievement checks
- `POST /api/listening/sessions/:id/complete` - Add XP awards and achievement checks
- `POST /api/speaking/sessions/:id/complete` - Add XP awards and achievement checks
- `POST /api/vocabulary/words/:id/review` - Add XP awards and achievement checks

## UI Component Implementation

### Global Components

- **XPIndicator**: Shows current XP and progress to next level
- **StreakCounter**: Shows current streak with visual indicator
- **AchievementToast**: Notification for unlocked achievements
- **LevelUpModal**: Celebration when reaching a new level

### Dashboard Components

- **GamificationSummary**: Overview of XP, level, streak, and recent achievements
- **ChallengeBoard**: Shows current daily and weekly challenges
- **AchievementShowcase**: Highlights recent or impressive achievements
- **NextGoals**: Suggests activities to unlock new achievements

### Profile Components

- **BadgeCollection**: Visual display of earned badges
- **AchievementList**: Comprehensive list of unlocked achievements
- **StatisticsDashboard**: Visualization of activity across modules
- **StreakCalendar**: Calendar showing activity history

## Implementation Timeline

### Week 1-2: Core Framework

- Implement data models
- Create XP system
- Implement streak tracking
- Develop basic UI components

### Week 3-4: Achievements and Badges

- Implement achievement system
- Create badge system
- Design and implement UI elements
- Integrate with existing modules

### Week 5-6: Challenges and Rewards

- Build challenge generation system
- Implement reward mechanisms
- Create challenge UI
- Integrate with dashboard

### Week 7-9: Social Features

- Implement leaderboards
- Create learning groups functionality
- Build social interaction UI
- Develop sharing mechanisms

### Week 10: Polish and Optimization

- Refine UI/UX
- Optimize performance
- Conduct user testing
- Make final adjustments

## Prioritized Feature Implementation

### Must-Have (Phase 1)

1. XP system and level progression
2. Streak tracking
3. Basic achievements for module completion
4. Core UI components for XP display

### Should-Have (Phase 2)

1. Comprehensive achievement system
2. Badge collection
3. Daily challenges
4. Achievement notifications

### Nice-to-Have (Phase 3+)

1. Leaderboards
2. Learning groups
3. Social sharing
4. Advanced challenge types

## Integration with Current App Structure

### Database Integration

- Extend existing user model with gamification profile
- Keep separate collections for achievements, activities, etc.
- Use efficient indexing for performance

### Front-End Integration

- Add gamification components to existing layouts
- Ensure consistent design language
- Use shared components for common elements

### API Integration

- Extend existing API routes with gamification logic
- Implement middleware for XP awards
- Ensure backward compatibility

## Conclusion

This implementation plan provides a structured approach to adding gamification features to the AI Coach platform. By phasing the implementation, we can deliver value incrementally while ensuring integration with existing modules and maintaining application performance and stability.

The plan focuses on enhancing user engagement through intrinsic (mastery, autonomy, purpose) and extrinsic (rewards, recognition, competition) motivations, with careful attention to balancing these elements to promote sustained learning behaviors.
