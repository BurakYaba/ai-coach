/**
 * Format preferred practice time for display
 * Converts "early_morning" to "Early Morning", etc.
 */
export function formatPracticeTime(timeValue: string): string {
  if (!timeValue) return "Not specified";

  const timeMap: { [key: string]: string } = {
    early_morning: "Early Morning",
    mid_morning: "Mid Morning",
    afternoon: "Afternoon",
    early_evening: "Early Evening",
    late_evening: "Late Evening",
  };

  return (
    timeMap[timeValue] ||
    timeValue.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  );
}

/**
 * Format reminder timing for display
 * Converts "30_min" to "30 minutes before", etc.
 */
export function formatReminderTiming(timingValue: string): string {
  if (!timingValue) return "Not specified";

  const timingMap: { [key: string]: string } = {
    "30_min": "30 minutes before",
    "1_hour": "1 hour before",
    "2_hours": "2 hours before",
    "15": "15 minutes before",
    "30": "30 minutes before",
    "60": "1 hour before",
    "120": "2 hours before",
  };

  return (
    timingMap[timingValue] ||
    timingValue.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  );
}

/**
 * Format learning days for display
 * Converts ["monday", "wednesday"] to "Monday, Wednesday"
 */
export function formatLearningDays(days: string[]): string {
  if (!days || days.length === 0) return "Not specified";

  return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ");
}

/**
 * Format any underscore-separated value for display
 * Generic function for converting snake_case to Title Case
 */
export function formatDisplayValue(value: string): string {
  if (!value) return "Not specified";

  return value.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get practice time with detailed description for emails
 */
export function formatPracticeTimeWithDetails(timeValue: string): string {
  if (!timeValue) return "your preferred study time";

  const timeWithDetails: { [key: string]: string } = {
    early_morning: "Early Morning (6-9 AM)",
    mid_morning: "Mid Morning (9 AM-12 PM)",
    afternoon: "Afternoon (12-5 PM)",
    early_evening: "Early Evening (5-8 PM)",
    late_evening: "Late Evening (8-10 PM)",
  };

  return timeWithDetails[timeValue] || formatPracticeTime(timeValue);
}
