/**
 * Spaced Repetition System (SRS) utilities
 * Based on the SuperMemo SM-2 algorithm
 */

// Performance ratings for the SM-2 algorithm
export enum PerformanceRating {
  FORGOT = 0, // Complete blackout, wrong response
  DIFFICULT = 1, // Correct response but with serious difficulty
  HESITANT = 2, // Correct response after hesitation
  EASY = 3, // Correct response with little difficulty
  PERFECT = 4, // Perfect response
}

interface SpacedRepetitionItem {
  mastery: number;
  easinessFactor?: number;
  repetitions?: number;
  interval?: number;
}

/**
 * Calculate the next review date using the SM-2 algorithm
 * @param performance - The performance rating (0-4)
 * @param item - The item being reviewed
 * @returns The next review date
 */
export function calculateNextReview(
  performance: PerformanceRating,
  item: SpacedRepetitionItem
): Date {
  // Initialize values if they don't exist
  const easinessFactor = item.easinessFactor || 2.5;
  const repetitions = item.repetitions || 0;
  const interval = item.interval || 0;

  // Calculate the new easiness factor (EF)
  // EF' = EF + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02))
  const newEF = Math.max(
    1.3,
    easinessFactor +
      (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02))
  );

  // Calculate the new interval
  let newInterval: number;
  let newRepetitions: number;

  if (performance < PerformanceRating.HESITANT) {
    // If the performance is poor, reset the interval and repetitions
    newInterval = 1;
    newRepetitions = 0;
  } else {
    // Increment repetitions
    newRepetitions = repetitions + 1;

    // Calculate interval based on repetitions
    if (newRepetitions === 1) {
      newInterval = 1; // 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6; // 6 days
    } else {
      // For subsequent repetitions, multiply the previous interval by the easiness factor
      newInterval = Math.round(interval * newEF);
    }

    // Adjust interval based on mastery level
    if (item.mastery < 30) {
      newInterval = Math.min(newInterval, 2); // Max 2 days for low mastery
    } else if (item.mastery < 50) {
      newInterval = Math.min(newInterval, 5); // Max 5 days for medium-low mastery
    } else if (item.mastery < 70) {
      newInterval = Math.min(newInterval, 10); // Max 10 days for medium mastery
    } else if (item.mastery < 90) {
      newInterval = Math.min(newInterval, 20); // Max 20 days for medium-high mastery
    }

    // Adjust interval based on performance
    if (performance === PerformanceRating.PERFECT) {
      newInterval = Math.round(newInterval * 1.3); // Increase interval for perfect recall
    } else if (performance === PerformanceRating.HESITANT) {
      newInterval = Math.max(1, Math.round(newInterval * 0.8)); // Decrease interval for hesitation
    }
  }

  // Calculate the next review date
  const now = new Date();
  const nextReview = new Date(
    now.getTime() + newInterval * 24 * 60 * 60 * 1000
  );

  return nextReview;
}

/**
 * Calculate the new mastery level based on performance
 * @param performance - The performance rating (0-4)
 * @param currentMastery - The current mastery level (0-100)
 * @returns The new mastery level (0-100)
 */
export function calculateNewMastery(
  performance: PerformanceRating,
  currentMastery: number
): number {
  // Adjust mastery based on performance
  let masteryChange = 0;

  switch (performance) {
    case PerformanceRating.FORGOT:
      masteryChange = -15; // Significant decrease for forgotten words
      break;
    case PerformanceRating.DIFFICULT:
      masteryChange = -5; // Small decrease for difficult recall
      break;
    case PerformanceRating.HESITANT:
      masteryChange = 5; // Small increase for hesitant recall
      break;
    case PerformanceRating.EASY:
      masteryChange = 10; // Moderate increase for easy recall
      break;
    case PerformanceRating.PERFECT:
      masteryChange = 15; // Significant increase for perfect recall
      break;
  }

  // Calculate new mastery level, ensuring it stays within 0-100 range
  return Math.min(100, Math.max(0, currentMastery + masteryChange));
}

/**
 * Update an item with new spaced repetition values
 * @param item - The item being reviewed
 * @param performance - The performance rating (0-4)
 * @returns The updated item with new spaced repetition values
 */
export function updateItemWithSpacedRepetition(
  item: SpacedRepetitionItem,
  performance: PerformanceRating
): SpacedRepetitionItem & { nextReview: Date } {
  // Initialize values if they don't exist
  const easinessFactor = item.easinessFactor || 2.5;
  const repetitions = item.repetitions || 0;
  const interval = item.interval || 0;

  // Calculate the new easiness factor (EF)
  const newEF = Math.max(
    1.3,
    easinessFactor +
      (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02))
  );

  // Calculate the new interval and repetitions
  let newInterval: number;
  let newRepetitions: number;

  if (performance < PerformanceRating.HESITANT) {
    // If the performance is poor, reset the interval and repetitions
    newInterval = 1;
    newRepetitions = 0;
  } else {
    // Increment repetitions
    newRepetitions = repetitions + 1;

    // Calculate interval based on repetitions
    if (newRepetitions === 1) {
      newInterval = 1; // 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6; // 6 days
    } else {
      // For subsequent repetitions, multiply the previous interval by the easiness factor
      newInterval = Math.round(interval * newEF);
    }
  }

  // Calculate the new mastery level
  const newMastery = calculateNewMastery(performance, item.mastery);

  // Calculate the next review date
  const now = new Date();
  const nextReview = new Date(
    now.getTime() + newInterval * 24 * 60 * 60 * 1000
  );

  return {
    ...item,
    mastery: newMastery,
    easinessFactor: newEF,
    repetitions: newRepetitions,
    interval: newInterval,
    nextReview,
  };
}
