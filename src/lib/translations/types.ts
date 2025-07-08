export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "hover" | "focus" | "none";
  optional?: boolean;
  tips?: string[];
}

export type SupportedLanguage = "turkish" | "german" | "spanish" | "french";

export type TranslationDictionary = Record<string, string>;

export type LanguageTranslations = Record<
  SupportedLanguage,
  TranslationDictionary
>;
