import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a time in seconds to a readable format (MM:SS)
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Determine the standardized question type
 * @param type The question type from the API or data
 * @returns Normalized question type
 */
export function normalizeQuestionType(
  type: string
): 'multiple-choice' | 'true-false' | 'fill-blank' {
  const normalizedType = type.toLowerCase().trim();

  if (
    normalizedType === 'multiple-choice' ||
    normalizedType === 'multiple choice' ||
    normalizedType === 'multiplechoice'
  ) {
    return 'multiple-choice';
  }

  if (
    normalizedType === 'true-false' ||
    normalizedType === 'true/false' ||
    normalizedType === 'truefalse'
  ) {
    return 'true-false';
  }

  if (
    normalizedType === 'fill-blank' ||
    normalizedType === 'fill-in-the-blank' ||
    normalizedType === 'fillblank' ||
    normalizedType === 'fill in the blank' ||
    normalizedType === 'fillintheblanks'
  ) {
    return 'fill-blank';
  }

  // Default to multiple-choice if unrecognized
  return 'multiple-choice';
}
