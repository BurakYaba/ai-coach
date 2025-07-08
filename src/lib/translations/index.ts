import { TourStep, SupportedLanguage } from "./types";
import { allTranslations } from "./languages";

// Translation function using the static mapping
async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  try {
    // Check if the target language is supported
    if (targetLanguage in allTranslations) {
      const languageTranslations =
        allTranslations[targetLanguage as SupportedLanguage];
      return languageTranslations[text] || text;
    }

    // Return original text if language not supported or translation not found
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

// Function to translate tour steps based on user's native language
export async function translateTourSteps(
  steps: TourStep[],
  nativeLanguage: string
): Promise<TourStep[]> {
  // Don't translate if native language is English
  if (nativeLanguage === "english" || nativeLanguage === "en") {
    return steps;
  }

  const translatedSteps = await Promise.all(
    steps.map(async step => {
      const translatedTitle = await translateText(step.title, nativeLanguage);
      const translatedContent = await translateText(
        step.content,
        nativeLanguage
      );
      const translatedTips = await Promise.all(
        (step.tips || []).map(tip => translateText(tip, nativeLanguage))
      );

      return {
        ...step,
        title: translatedTitle,
        content: translatedContent,
        tips: translatedTips,
      };
    })
  );

  return translatedSteps;
}

// Re-export utils
export { getUserNativeLanguage, saveUserNativeLanguage } from "./utils";
