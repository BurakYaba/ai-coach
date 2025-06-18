"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle,
  Trophy,
  BookOpen,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboardingTranslations } from "@/lib/onboarding-translations";

interface CompletionStepProps {
  onNext: (data?: any) => void;
  onSkip?: () => void;
  onBack?: () => void;
  data?: any;
  language: "en" | "tr";
}

export default function CompletionStep({
  onNext,
  data,
  language,
}: CompletionStepProps) {
  const t = useOnboardingTranslations(language);
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleStartLearning = async () => {
    setIsCompleting(true);

    try {
      // Let the onboarding flow handle the completion and redirect
      onNext({
        onboardingCompleted: true,
        finalStep: true,
        redirectToDashboard: true,
      });
    } catch (error) {
      console.error("Error in handleStartLearning:", error);
      setIsCompleting(false);
    }
  };

  // Helper function to capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get the skill assessment data - could be from different sources
  const getSkillAssessment = () => {
    // Try to get from direct skill assessment data (from step 2)
    if (data?.skillAssessment) {
      const assessment = data.skillAssessment;

      // Get overall score from various sources
      let score = assessment.overallScore || assessment.score || 0;

      // If no overall score, calculate from individual scores
      if (!score && assessment.scores) {
        const scores = assessment.scores;
        const validScores = [
          scores.reading,
          scores.grammar,
          scores.vocabulary,
        ].filter(s => typeof s === "number" && s >= 0);
        if (validScores.length > 0) {
          score = Math.round(
            validScores.reduce((sum, s) => sum + s, 0) / validScores.length
          );
        }
      }

      return {
        level:
          assessment.recommendedLevel ||
          assessment.overallLevel ||
          assessment.ceferLevel ||
          "B1",
        score,
        weakAreas: assessment.weakAreas || [],
        strengths: assessment.strengths || [],
      };
    }

    // Try to get from nested onboarding data structure
    if (data?.onboarding?.skillAssessment) {
      const assessment = data.onboarding.skillAssessment;

      // Calculate overall score if not directly available
      let overallScore = assessment.overallScore || 0;
      if (
        !overallScore &&
        assessment.scores &&
        typeof assessment.scores === "object"
      ) {
        const scores = assessment.scores;
        const validScores = [
          scores.reading,
          scores.grammar,
          scores.vocabulary,
        ].filter(s => typeof s === "number" && s >= 0);
        if (validScores.length > 0) {
          overallScore = Math.round(
            validScores.reduce((sum, score) => sum + score, 0) /
              validScores.length
          );
        }
      }

      return {
        level: assessment.ceferLevel || assessment.recommendedLevel || "B1",
        score: overallScore,
        weakAreas: assessment.weakAreas || [],
        strengths: assessment.strengths || [],
      };
    }

    // Try to get from root level onboarding structure (API response format)
    if (data?.ceferLevel || data?.recommendedLevel) {
      let score = data.overallScore || 0;

      // Calculate from scores if available
      if (!score && data.scores) {
        const validScores = [
          data.scores.reading,
          data.scores.grammar,
          data.scores.vocabulary,
        ].filter(s => typeof s === "number" && s >= 0);
        if (validScores.length > 0) {
          score = Math.round(
            validScores.reduce((sum, s) => sum + s, 0) / validScores.length
          );
        }
      }

      return {
        level: data.ceferLevel || data.recommendedLevel || "B1",
        score,
        weakAreas: data.weakAreas || [],
        strengths: data.strengths || [],
      };
    }

    // Default fallback
    return {
      level: "B1",
      score: 0,
      weakAreas: ["reading"],
      strengths: [],
    };
  };

  const skillAssessment = getSkillAssessment();

  const achievements = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: t.completion.achievements.assessment,
      description: `${language === "tr" ? "İngilizce seviyeniz" : "Your English level"}: ${skillAssessment.level}`,
    },
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: t.completion.achievements.goals,
      description: data?.learningPreferences?.learningGoals?.length
        ? `${data.learningPreferences.learningGoals.length} ${language === "tr" ? "öğrenme hedefi tanımlandı" : "learning goals defined"}`
        : language === "tr"
          ? "Öğrenme tercihleri yapılandırıldı"
          : "Learning preferences configured",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: t.completion.achievements.path,
      description: data?.selectedLearningPath?.selectedModules?.length
        ? `${data.selectedLearningPath.selectedModules.length} ${language === "tr" ? "modül seçildi" : "modules selected"}`
        : language === "tr"
          ? "Kişiselleştirilmiş öğrenme yolu hazır"
          : "Personalized learning path ready",
    },
  ];

  const nextSteps = [
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: t.completion.nextSteps.items[0].title,
      description: t.completion.nextSteps.items[0].description,
    },
    {
      icon: <Target className="h-6 w-6 text-green-600" />,
      title: t.completion.nextSteps.items[1].title,
      description: t.completion.nextSteps.items[1].description,
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-600" />,
      title: t.completion.nextSteps.items[2].title,
      description: t.completion.nextSteps.items[2].description,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full mb-6"
        >
          <Trophy className="h-12 w-12" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t.completion.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t.completion.subtitle}
        </p>
      </motion.div>

      {/* Achievements Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {language === "tr" ? "Başardıklarınız" : "What You've Accomplished"}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {achievement.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Your Learning Profile
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Level</h3>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">
                {skillAssessment.level}
              </div>
              <div className="text-sm opacity-90">
                Score: {skillAssessment.score}%
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Focus Areas</h3>
            <div className="space-y-2">
              {skillAssessment.weakAreas
                ?.slice(0, 3)
                .map((area: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-lg p-2 text-sm"
                  >
                    {capitalize(area)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {t.completion.nextSteps.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex justify-center mb-3">{step.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold mb-4">💡 Quick Tips for Success</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <span>Practice a little every day for better retention</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <span>Don't be afraid to make mistakes - they help you learn</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <span>Use the speaking practice feature regularly</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <span>Track your progress to stay motivated</span>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="text-center"
      >
        <button
          onClick={handleStartLearning}
          disabled={isCompleting}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isCompleting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>
                {language === "tr" ? "Tamamlanıyor..." : "Completing..."}
              </span>
            </>
          ) : (
            <>
              <span>{t.completion.buttons.dashboard}</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {language === "tr"
            ? "İngilizce öğrenme maceranıza başlamaya hazır mısınız?"
            : "Ready to begin your English learning adventure?"}
        </p>
      </motion.div>
    </div>
  );
}
