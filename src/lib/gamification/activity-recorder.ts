import { GamificationService } from "./gamification-service";

/**
 * Records a user activity for gamification purposes
 * @param userId - The ID of the user
 * @param module - The module where the activity occurred (reading, writing, etc.)
 * @param activityType - The type of activity (e.g., complete_session, review_word)
 * @param metadata - Additional data about the activity
 * @returns Promise with the result of recording the activity
 */
export async function recordActivity(
  userId: string,
  module: string,
  activityType: string,
  metadata: Record<string, any> = {}
) {
  try {
    // Ensure metadata has required fields based on activity type
    if (activityType === "complete_session" && !metadata.sessionId) {
      // Generate a sessionId if one doesn't exist
      metadata.sessionId = `${module}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    }

    // Ensure score is present for activities that should have it
    if (
      ["complete_session", "complete_lesson", "complete_exercise"].includes(
        activityType
      ) &&
      !Object.prototype.hasOwnProperty.call(metadata, "score")
    ) {
      metadata.score = 0;
    }

    // Track items completed if not explicitly set
    if (!Object.prototype.hasOwnProperty.call(metadata, "itemsCompleted")) {
      if (
        activityType === "complete_session" ||
        activityType === "complete_lesson" ||
        activityType === "complete_exercise"
      ) {
        metadata.itemsCompleted = 1;
      } else if (
        activityType === "review_word" ||
        activityType === "master_word"
      ) {
        metadata.itemsCompleted = 1;
      }
    }

    // Duration tracking
    if (
      !Object.prototype.hasOwnProperty.call(metadata, "duration") &&
      ["complete_session", "complete_lesson", "conversation_session"].includes(
        activityType
      )
    ) {
      // Set a default duration if none provided (5 minutes in seconds)
      metadata.duration = 300;
    }

    const result = await GamificationService.awardXP(
      userId,
      module,
      activityType,
      metadata
    );

    return result;
  } catch (error) {
    console.error("Error recording activity:", error);
    throw error;
  }
}

/**
 * Records completion of a reading session
 * @param userId - The ID of the user
 * @param sessionId - The ID of the completed session
 * @param score - The comprehension score (0-100)
 * @param wordCount - Number of words in the reading
 * @param timeSpent - Time spent in seconds
 */
export async function recordReadingCompletion(
  userId: string,
  sessionId: string,
  score: number = 0,
  wordCount: number = 0,
  timeSpent: number = 300
) {
  return recordActivity(userId, "reading", "complete_session", {
    sessionId,
    score,
    wordCount,
    duration: timeSpent,
    itemsCompleted: 1,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Records completion of a writing session
 * @param userId - The ID of the user
 * @param sessionId - The ID of the completed session
 * @param wordCount - Number of words written
 * @param timeSpent - Time spent in seconds
 */
export async function recordWritingCompletion(
  userId: string,
  sessionId: string,
  wordCount: number = 0,
  timeSpent: number = 300
) {
  return recordActivity(userId, "writing", "complete_session", {
    sessionId,
    wordCount,
    duration: timeSpent,
    itemsCompleted: 1,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Records completion of a listening session
 * @param userId - The ID of the user
 * @param sessionId - The ID of the completed session
 * @param score - The comprehension score (0-100)
 * @param timeSpent - Time spent in seconds
 */
export async function recordListeningCompletion(
  userId: string,
  sessionId: string,
  score: number = 0,
  timeSpent: number = 300
) {
  return recordActivity(userId, "listening", "complete_session", {
    sessionId,
    score,
    duration: timeSpent,
    itemsCompleted: 1,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Records completion of a speaking session
 * @param userId - The ID of the user
 * @param sessionId - The ID of the completed session
 * @param duration - Duration of the session in seconds
 */
export async function recordSpeakingCompletion(
  userId: string,
  sessionId: string,
  duration: number = 300
) {
  return recordActivity(userId, "speaking", "complete_session", {
    sessionId,
    duration,
    itemsCompleted: 1,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Records a vocabulary word review
 * @param userId - The ID of the user
 * @param wordId - The ID of the word
 * @param mastered - Whether the word was mastered
 */
export async function recordVocabularyReview(
  userId: string,
  wordId: string,
  mastered: boolean = false
) {
  const activityType = mastered ? "master_word" : "review_word";
  return recordActivity(userId, "vocabulary", activityType, {
    wordId,
    mastered,
    itemsCompleted: 1,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Records completion of a grammar lesson
 * @param userId - The ID of the user
 * @param lessonId - The ID of the lesson
 * @param score - The score achieved (0-100)
 */
export async function recordGrammarLessonCompletion(
  userId: string,
  lessonId: string,
  score: number = 0
) {
  return recordActivity(userId, "grammar", "complete_lesson", {
    lessonId,
    score,
    itemsCompleted: 1,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Records completion of a game
 * @param userId - The ID of the user
 * @param gameType - The type of game
 * @param score - The score achieved
 */
export async function recordGameCompletion(
  userId: string,
  gameType: string,
  score: number = 0
) {
  return recordActivity(userId, "games", "complete_game", {
    gameType,
    score,
    itemsCompleted: 1,
    timestamp: new Date().toISOString(),
  });
}
