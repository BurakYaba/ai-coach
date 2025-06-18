"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Clock,
  BookOpen,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useOnboardingTranslations } from "@/lib/onboarding-translations";

interface PreferencesStepProps {
  onNext: (data?: any) => void;
  onSkip?: () => void;
  onBack?: () => void;
  data?: any;
  language: "en" | "tr";
}

export default function PreferencesStep({
  onNext,
  onBack,
  language,
}: PreferencesStepProps) {
  const t = useOnboardingTranslations(language);

  const [preferences, setPreferences] = useState({
    learningGoals: [] as string[],
    timeAvailability: "",
    preferredDifficulty: "",
    focusAreas: [] as string[],
    learningStyle: "",
  });

  const learningGoals = t.preferences.goals.options.map(option => ({
    id: option.id,
    label: option.label,
    icon: getIconForGoal(option.id),
  }));

  const timeOptions = t.preferences.time.options;
  const difficultyOptions = t.preferences.difficulty.options;
  const focusAreas = t.preferences.focusAreas.options;
  const learningStyles = t.preferences.learningStyle.options;

  function getIconForGoal(goalId: string) {
    const iconMap: Record<string, JSX.Element> = {
      conversation: <Users className="h-5 w-5" />,
      business: <BookOpen className="h-5 w-5" />,
      academic: <Target className="h-5 w-5" />,
      travel: <Clock className="h-5 w-5" />,
      exam: <Target className="h-5 w-5" />,
      general: <BookOpen className="h-5 w-5" />,
    };
    return iconMap[goalId] || <BookOpen className="h-5 w-5" />;
  }

  const handleGoalToggle = (goalId: string) => {
    setPreferences(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goalId)
        ? prev.learningGoals.filter(id => id !== goalId)
        : [...prev.learningGoals, goalId],
    }));
  };

  const handleFocusAreaToggle = (areaId: string) => {
    setPreferences(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(id => id !== areaId)
        : [...prev.focusAreas, areaId],
    }));
  };

  const handleContinue = () => {
    onNext({
      learningPreferences: preferences,
    });
  };

  const isValid =
    preferences.learningGoals.length > 0 &&
    preferences.timeAvailability &&
    preferences.preferredDifficulty &&
    preferences.focusAreas.length > 0 &&
    preferences.learningStyle;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t.preferences.title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t.preferences.subtitle}
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Learning Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t.preferences.goals.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {learningGoals.map(goal => (
              <button
                key={goal.id}
                onClick={() => handleGoalToggle(goal.id)}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  preferences.learningGoals.includes(goal.id)
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div
                  className={`${preferences.learningGoals.includes(goal.id) ? "text-blue-600" : "text-gray-400"}`}
                >
                  {goal.icon}
                </div>
                <span className="font-medium">{goal.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Time Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t.preferences.time.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {timeOptions.map(option => (
              <button
                key={option.id}
                onClick={() =>
                  setPreferences(prev => ({
                    ...prev,
                    timeAvailability: option.id,
                  }))
                }
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  preferences.timeAvailability === option.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm opacity-75">{option.description}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t.preferences.difficulty.title}
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {difficultyOptions.map(option => (
              <button
                key={option.id}
                onClick={() =>
                  setPreferences(prev => ({
                    ...prev,
                    preferredDifficulty: option.id,
                  }))
                }
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  preferences.preferredDifficulty === option.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm opacity-75">{option.description}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t.preferences.focusAreas.title}
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {focusAreas.map(area => (
              <button
                key={area.id}
                onClick={() => handleFocusAreaToggle(area.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  preferences.focusAreas.includes(area.id)
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="font-medium">{area.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Learning Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t.preferences.learningStyle.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {learningStyles.map(style => (
              <button
                key={style.id}
                onClick={() =>
                  setPreferences(prev => ({ ...prev, learningStyle: style.id }))
                }
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  preferences.learningStyle === style.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="font-medium mb-1">{style.label}</div>
                <div className="text-sm opacity-75">{style.description}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-between mt-8"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.preferences.buttons.back}</span>
          </button>
        )}
        <div className="flex space-x-4 ml-auto">
          <button
            onClick={() => onNext()}
            className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t.preferences.buttons.skip}
          </button>
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span>{t.preferences.buttons.continue}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
