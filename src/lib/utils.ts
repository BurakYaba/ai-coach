import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a time in seconds to a readable format (MM:SS or H:MM:SS)
 * @param seconds Time in seconds
 * @returns Formatted time string in digital clock format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = Math.floor(seconds % 60);

  // For audio player display (MM:SS format)
  if (hours === 0) {
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // For longer content (H:MM:SS format)
  const formattedHours = String(hours);
  const formattedMinutes = String(remainingMinutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Format a time in seconds to a human-readable format
 * @param seconds Time in seconds
 * @returns Formatted time string in user-friendly format (e.g., "5 min" or "1 hr 15 min")
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '0 min';
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // For short content under a minute, still show "1 min" instead of "0 min"
  if (minutes === 0) {
    return '1 min';
  }

  // For durations under 60 minutes, show "X min"
  if (hours === 0) {
    return `${minutes} min`;
  }

  // For durations over 60 minutes, show "X hr Y min"
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
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
