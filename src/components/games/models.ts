/**
 * Common types and interfaces for the games module
 */

export interface GameResult {
  userId: string;
  gameId: string;
  score: number;
  timeSpent: number; // in seconds
  correctAnswers: number;
  totalQuestions: number;
  completedAt: Date;
  level: string;
  metadata?: Record<string, any>;
}

export interface GameWord {
  id: string;
  word: string;
  definition?: string;
  partOfSpeech?: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'; // CEFR level
}

export interface GameSession {
  id: string;
  gameId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  completed: boolean;
  level: string;
}
