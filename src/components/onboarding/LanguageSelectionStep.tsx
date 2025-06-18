"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Check, ChevronRight } from "lucide-react";
import { useOnboardingTranslations } from "@/lib/onboarding-translations";

interface LanguageSelectionStepProps {
  onNext: (data: { language: "en" | "tr" }) => void;
}

export default function LanguageSelectionStep({
  onNext,
}: LanguageSelectionStepProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "tr">("en");

  // Use English for the language selection step initially
  const t = useOnboardingTranslations("en");

  const handleLanguageSelect = (language: "en" | "tr") => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    onNext({ language: selectedLanguage });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Globe className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t.languageSelection.title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
          {t.languageSelection.subtitle}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t.languageSelection.description}
        </p>
      </motion.div>

      {/* Language Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4 mb-8"
      >
        {Object.entries(t.languageSelection.languages).map(
          ([langCode, langData]) => (
            <motion.div
              key={langCode}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedLanguage === langCode
                  ? "transform scale-105"
                  : "hover:transform hover:scale-102"
              }`}
              onClick={() => handleLanguageSelect(langCode as "en" | "tr")}
            >
              <div
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedLanguage === langCode
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                {selectedLanguage === langCode && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-xl font-semibold ${
                        selectedLanguage === langCode
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {langData.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        selectedLanguage === langCode
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {langData.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`h-6 w-6 ${
                      selectedLanguage === langCode
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )
        )}
      </motion.div>

      {/* Important Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8"
      >
        <div className="flex items-start space-x-3">
          <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
            ⚠️
          </div>
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Important Note:</p>
            <p>{t.languageSelection.note}</p>
          </div>
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <button
          onClick={handleContinue}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>Continue</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
}
