# Language Learning Platform XP System Documentation

## Overview

The gamification XP (Experience Points) system is designed to reward users for their learning activities and progress. XP contributes to user levels, which unlock achievements and badges, enhancing user engagement and motivation.

## XP Calculation

### Base XP Values

Different activities award different amounts of XP:

```javascript
const XP_CONFIG = {
  reading: {
    complete_session: 5,
    correct_answer: 5,
    review_word: 2,
  },
  writing: {
    complete_session: 30,
    words_200_plus: 10,
    words_500_plus: 20,
  },
  listening: {
    complete_session: 5,
    correct_answer: 2, // Recently updated from 5 to 2
    review_word: 2,
  },
  speaking: {
    complete_session: 30,
    conversation_session: 40,
  },
  vocabulary: {
    review_word: 2,
    master_word: 5,
  },
  grammar: {
    complete_lesson: 15,
    complete_exercise: 10,
  },
  games: {
    complete_game: 15,
    // Bonus XP is dynamic based on score
  },
};
```

### XP Multipliers

Some activities have count-based multipliers:

1. **Vocabulary Reviews**: 2 XP × number of words reviewed
2. **Correct Answers**: 2 XP × number of correct answers
3. **Writing Bonuses**: Additional XP for longer submissions (200+ words = +10 XP, 500+ words = +20 XP)
4. **Game Score Bonuses**: Up to +25 XP based on score percentage

## Leveling System

### XP Thresholds

The XP required for each level follows this formula:

- Level 1: 0-99 XP
- Level 2: 100-149 XP
- Level 3: 150-199 XP
- Level 4: 200-249 XP
- And so on (adds 50 XP per level)

Programmatically:

```javascript
function xpForLevel(level) {
  if (level <= 0) return 0;
  if (level === 1) return 100;
  return 100 + (level - 1) * 50;
}
```

### Level Calculation

The user's current level is determined by comparing their total XP to the level thresholds:

```javascript
// Find the current level based on XP
let level = 1;
while (xpForLevel(level) <= xp) {
  level++;
}
// Adjust back to the correct level
level--;
```

This ensures that as soon as a user reaches 100 XP, they are properly recognized as Level 2, and when they reach 150 XP, they advance to Level 3, and so on.

## Progress Tracking

### Current Level Progress

For a user with a given amount of XP:

1. **Current Level XP**: Total XP required to reach the current level
2. **Next Level XP**: Total XP required to reach the next level
3. **XP Since Current Level**: XP earned since reaching the current level
4. **XP Needed For Next Level**: XP needed to advance to the next level
5. **Progress Percentage**: Visual representation of progress toward the next level

### Special Cases

- **New Users (0 XP)**:

  - Level: 1
  - Progress: 0/100 (0%)

- **Level 1 Users (1-99 XP)**:
  - Current Level XP: 0
  - Next Level XP: 100
  - XP Since Current Level: User's current XP
  - Progress: [current XP]/100
- **Level 2 Users (100-149 XP)**:
  - Current Level XP: 100
  - Next Level XP: 150
  - XP Since Current Level: [current XP] - 100
  - Progress: [XP Since Current Level]/50

## XP Award Process

### When XP is Awarded

XP is awarded at several points in the user journey:

1. **Session Completion**: When a user completes a learning session
2. **Correct Answers**: For each correct answer in quizzes
3. **Vocabulary Review**: For each vocabulary word reviewed
4. **Achievement Unlocks**: Bonus XP for unlocking achievements

### How XP is Tracked and Awarded

The primary logic for awarding XP is in the `GamificationService.awardXP` method:

1. **Activity Recording**:

   - Activities are logged in the database
   - Multiple XP awards within the same session are flagged with `isPartOfCompletedSession: true`
   - This prevents double-counting activities

2. **Award Bundling**:

   - For listening sessions, we award:
     - 5 XP for session completion
     - 2 XP per correct answer
     - 2 XP per vocabulary word reviewed

3. **Stat Updates**:
   - Updates user's total experience
   - Recalculates level based on new total
   - Updates activity counts
   - Checks for achievements/badges unlocked

## Recent Fixes and Improvements

### Fixed Issues

1. **Level 1 User Display**: Fixed negative XP display for new users by special-casing level 1 calculations

   - Now shows "0/100 XP" instead of "-100/0 XP"
   - Progress bar displays correctly (0-100%)

2. **Answer Tracking**:

   - Fixed answer count to properly increment for each correct answer
   - Tracks changes from correct to incorrect answers
   - Tracks changes from incorrect to correct answers
   - Preserves total correct answers across submissions

3. **XP Award Logic**:

   - Changed XP per correct answer from 5 to 2
   - Now properly awards XP for all correct answers, not just the last one
   - Fixed vocabulary review XP to properly count all words

4. **Database Updates**:

   - Fixed issues with Mongoose Map objects
   - Properly converts between JavaScript objects and MongoDB Map types
   - Uses field-specific updates instead of replacing entire objects

5. **Level Progression Fix**:
   - Fixed an issue where users with 100+ XP were still being shown as Level 1
   - Removed special case logic that was causing incorrect level calculations at threshold boundaries
   - Now users properly advance to Level 2 when reaching 100 XP
   - Progress display now correctly shows "1/50 XP" for Level 2 users with 101 XP

## Technical Implementation

### Key Files

- `src/lib/gamification/gamification-service.ts`: Core XP calculation and award logic
- `src/components/dashboard/xp-progress.tsx`: Client-side display of XP progress
- `src/components/gamification/profile-stats.tsx`: Detailed profile and stats display
- `src/app/api/listening/[id]/feedback/route.ts`: XP awards for listening sessions

### Database Schema

The XP data is stored in the GamificationProfile collection:

```javascript
{
  userId: ObjectId,
  level: Number,
  experience: Number,
  experienceToNextLevel: Number,
  achievements: [{ id: String, unlockedAt: Date }],
  badges: [{ id: String, unlockedAt: Date }],
  stats: {
    totalXP: Number,
    activeDays: Number,
    moduleActivity: {
      reading: Number,
      writing: Number,
      listening: Number,
      speaking: Number,
      vocabulary: Number,
      grammar: Number,
      games: Number
    }
  },
  streak: {
    current: Number,
    longest: Number,
    lastActivity: Date
  }
}
```

Activities are recorded in the UserActivity collection:

```javascript
{
  userId: ObjectId,
  activityType: String,
  module: String,
  xpEarned: Number,
  metadata: Object,
  createdAt: Date
}
```

## Testing and Debugging

For debugging XP calculations, look for these log patterns:

```
XP Award - Profile After Calculation: {
  userId: '...',
  activity: 'listening/correct_answer',
  xpAwarded: 10,
  newTotalXP: 25,
  newLevel: 1,
  levelUp: false,
  experienceToNextLevel: 100,
  fullCalculation: {
    level: 1,
    experienceToNextLevel: 100,
    currentLevelXP: 0,
    nextLevelXP: 100,
    xpSinceCurrentLevel: 25,
    xpNeededForNextLevel: 100,
    progressPercentage: 25
  },
  isPartOfCompletedSession: true
}
```

For tracking correct answer counts:

```
Correct answers calculation: {
  existingCorrectAnswers: 3,
  newCorrectAnswersCount: 1,
  newIncorrectAnswersReplacingCorrect: 0,
  totalCorrectAnswers: 4
}
```
