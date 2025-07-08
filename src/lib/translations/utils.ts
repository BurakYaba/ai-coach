// Function to get user's native language from session or profile
export function getUserNativeLanguage(): string {
  if (typeof window === "undefined") return "english";

  // Try to get from localStorage first (for immediate access)
  const savedNativeLanguage = localStorage.getItem("fluenta-native-language");
  if (savedNativeLanguage) {
    return savedNativeLanguage;
  }

  // Fallback to English
  return "english";
}

// Function to save user's native language
export function saveUserNativeLanguage(language: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("fluenta-native-language", language);
  }
}
