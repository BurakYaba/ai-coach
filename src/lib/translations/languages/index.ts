import { LanguageTranslations } from "../types";
import { turkishTranslations } from "./turkish";
import { germanTranslations } from "./german";
import { spanishTranslations } from "./spanish";
import { frenchTranslations } from "./french";

export const allTranslations: LanguageTranslations = {
  turkish: turkishTranslations,
  german: germanTranslations,
  spanish: spanishTranslations,
  french: frenchTranslations,
};

export {
  turkishTranslations,
  germanTranslations,
  spanishTranslations,
  frenchTranslations,
};
