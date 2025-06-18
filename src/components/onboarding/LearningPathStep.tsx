"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PenTool,
  Headphones,
  Mic,
  Brain,
  FileText,
  Gamepad2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import {
  useOnboardingTranslations,
  learningPathTranslations,
} from "@/lib/onboarding-translations";

interface LearningPathStepProps {
  onNext: (data?: any) => void;
  onSkip?: () => void;
  onBack?: () => void;
  data?: any;
  language: "en" | "tr";
}

interface LearningPath {
  modules: Array<{
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    priority: "high" | "medium" | "low";
    estimatedTime: string;
    difficulty: string;
  }>;
  weeklyPlan: Array<{
    day: string;
    activities: Array<{
      module: string;
      activity: string;
      duration: string;
    }>;
  }>;
  goals: Array<{
    title: string;
    description: string;
    timeframe: string;
  }>;
}

export default function LearningPathStep({
  onNext,
  onBack,
  data,
  language,
}: LearningPathStepProps) {
  const t = useOnboardingTranslations(language);
  const pathT = learningPathTranslations[language];
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    generateLearningPath();
  }, []);

  const generateLearningPath = async () => {
    try {
      // Extract and map the data correctly for the API
      let skillAssessment = data?.skillAssessment;
      const learningPreferences = data?.learningPreferences;

      // Get the recommended level - try different sources but prioritize fresh data
      let recommendedLevel = "B1"; // Default fallback

      // Try to get skill assessment from different data structures - prioritize the most recent
      if (!skillAssessment && data?.onboarding?.skillAssessment) {
        skillAssessment = {
          recommendedLevel: data.onboarding.skillAssessment.ceferLevel,
          ceferLevel: data.onboarding.skillAssessment.ceferLevel,
          overallScore: data.onboarding.skillAssessment.overallScore,
          skillScores: data.onboarding.skillAssessment.scores,
          strengths: data.onboarding.skillAssessment.strengths,
          weakAreas: data.onboarding.skillAssessment.weakAreas,
        };
      }

      // Extract the correct level from the assessment data
      recommendedLevel =
        skillAssessment?.recommendedLevel ||
        skillAssessment?.ceferLevel ||
        data?.onboarding?.skillAssessment?.ceferLevel ||
        "B1";

      console.log("LearningPathStep - Using skill assessment data:", {
        skillAssessment,
        recommendedLevel,
        rawData: data,
      });

      // Map the preferences to match API expectations
      const mappedPreferences = {
        learningGoals: learningPreferences?.learningGoals || [],
        timeAvailable: learningPreferences?.timeAvailability || "flexible",
        difficultyPreference:
          learningPreferences?.preferredDifficulty || "moderate",
        focusAreas: learningPreferences?.focusAreas || [],
        learningStyle: learningPreferences?.learningStyle || "mixed",
        strengths: skillAssessment?.strengths || [],
        weaknesses: skillAssessment?.weakAreas || [],
      };

      const response = await fetch("/api/onboarding/learning-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPreferences),
      });

      if (response.ok) {
        const pathData = await response.json();

        // Transform the API response to match our component's expected format
        const transformedPath: LearningPath = {
          modules: [
            {
              id: "reading",
              name: pathT.modules.reading,
              description:
                language === "tr"
                  ? "Okuma anlama becerilerinizi geliştirin"
                  : "Improve your reading comprehension skills",
              icon: moduleIcons["reading"],
              priority: pathData.learningPath.primaryFocus.includes("reading")
                ? ("high" as const)
                : ("medium" as const),
              estimatedTime: "20-30 min",
              difficulty: recommendedLevel,
            },
            {
              id: "writing",
              name: pathT.modules.writing,
              description:
                language === "tr"
                  ? "Yazma becerilerinizi geliştirin"
                  : "Enhance your writing abilities",
              icon: moduleIcons["writing"],
              priority: pathData.learningPath.primaryFocus.includes("writing")
                ? ("high" as const)
                : ("medium" as const),
              estimatedTime: "25-35 min",
              difficulty: recommendedLevel,
            },
            {
              id: "speaking",
              name: pathT.modules.speaking,
              description:
                language === "tr"
                  ? "Konuşma ve telaffuz becerilerinizi geliştirin"
                  : "Develop your speaking and pronunciation",
              icon: moduleIcons["speaking"],
              priority: pathData.learningPath.primaryFocus.includes("speaking")
                ? ("high" as const)
                : ("medium" as const),
              estimatedTime: "15-25 min",
              difficulty: recommendedLevel,
            },
            {
              id: "listening",
              name: pathT.modules.listening,
              description:
                language === "tr"
                  ? "Dinleme anlama becerilerinizi geliştirin"
                  : "Improve your listening comprehension",
              icon: moduleIcons["listening"],
              priority: pathData.learningPath.primaryFocus.includes("listening")
                ? ("high" as const)
                : ("medium" as const),
              estimatedTime: "20-30 min",
              difficulty: recommendedLevel,
            },
            {
              id: "vocabulary",
              name: pathT.modules.vocabulary,
              description:
                language === "tr"
                  ? "Kelime dağarcığınızı genişletin"
                  : "Expand your vocabulary",
              icon: moduleIcons["vocabulary"],
              priority: pathData.learningPath.primaryFocus.includes(
                "vocabulary"
              )
                ? ("high" as const)
                : ("medium" as const),
              estimatedTime: "10-15 min",
              difficulty: recommendedLevel,
            },
            {
              id: "grammar",
              name: pathT.modules.grammar,
              description:
                language === "tr"
                  ? "Gramer kurallarında ustalaşın"
                  : "Master grammar rules",
              icon: moduleIcons["grammar"],
              priority: pathData.learningPath.primaryFocus.includes("grammar")
                ? ("high" as const)
                : ("medium" as const),
              estimatedTime: "15-20 min",
              difficulty: recommendedLevel,
            },
            {
              id: "games",
              name: pathT.modules.games,
              description:
                language === "tr"
                  ? "Eğlenceli oyunlarla öğrenin"
                  : "Learn through fun games",
              icon: moduleIcons["games"],
              priority: "low" as const,
              estimatedTime: "10-15 min",
              difficulty: recommendedLevel,
            },
          ],
          weeklyPlan: [
            {
              day: "Monday",
              activities: [
                {
                  module: "Reading",
                  activity: "Article comprehension",
                  duration: "20 min",
                },
                {
                  module: "Vocabulary",
                  activity: "New words practice",
                  duration: "10 min",
                },
              ],
            },
            {
              day: "Tuesday",
              activities: [
                {
                  module: "Grammar",
                  activity: "Rule practice",
                  duration: "15 min",
                },
                {
                  module: "Writing",
                  activity: "Paragraph writing",
                  duration: "25 min",
                },
              ],
            },
            {
              day: "Wednesday",
              activities: [
                {
                  module: "Listening",
                  activity: "Audio comprehension",
                  duration: "20 min",
                },
                {
                  module: "Speaking",
                  activity: "Conversation practice",
                  duration: "20 min",
                },
              ],
            },
            {
              day: "Thursday",
              activities: [
                {
                  module: "Reading",
                  activity: "Speed reading",
                  duration: "20 min",
                },
                {
                  module: "Vocabulary",
                  activity: "Review session",
                  duration: "10 min",
                },
              ],
            },
            {
              day: "Friday",
              activities: [
                {
                  module: "Writing",
                  activity: "Essay practice",
                  duration: "30 min",
                },
                {
                  module: "Games",
                  activity: "Language games",
                  duration: "15 min",
                },
              ],
            },
            {
              day: "Saturday",
              activities: [
                {
                  module: "Speaking",
                  activity: "Free conversation",
                  duration: "25 min",
                },
                {
                  module: "Listening",
                  activity: "Podcast listening",
                  duration: "20 min",
                },
              ],
            },
          ],
          goals: [
            {
              title: `Advance from ${recommendedLevel} Level`,
              description: `Build upon your current ${recommendedLevel} skills and advance to the next level`,
              timeframe: `${pathData.learningPath.estimatedWeeks} weeks`,
            },
            {
              title: "Build Core Skills",
              description: `Focus on ${pathData.learningPath.primaryFocus.join(", ")}`,
              timeframe: "4-6 weeks",
            },
            {
              title: "Daily Practice Habit",
              description: `Consistent ${mappedPreferences.timeAvailable} daily practice`,
              timeframe: "2 weeks",
            },
          ],
        };

        setLearningPath(transformedPath);
        // Pre-select high priority modules
        setSelectedModules(
          transformedPath.modules
            .filter((m: any) => m.priority === "high")
            .map((m: any) => m.id)
        );
      } else {
        console.error(
          "Failed to generate learning path:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error generating learning path:", error);
    } finally {
      setLoading(false);
    }
  };

  const moduleIcons: Record<string, React.ReactNode> = {
    reading: <BookOpen className="h-6 w-6" />,
    writing: <PenTool className="h-6 w-6" />,
    listening: <Headphones className="h-6 w-6" />,
    speaking: <Mic className="h-6 w-6" />,
    vocabulary: <Brain className="h-6 w-6" />,
    grammar: <FileText className="h-6 w-6" />,
    games: <Gamepad2 className="h-6 w-6" />,
  };

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleContinue = () => {
    // Create a clean data object without circular references
    const cleanData = {
      selectedLearningPath: {
        modules:
          learningPath?.modules?.map(module => ({
            id: module.id,
            name: module.name,
            description: module.description,
            priority: module.priority,
            estimatedTime: module.estimatedTime,
            difficulty: module.difficulty,
          })) || [],
        weeklyPlan: learningPath?.weeklyPlan || [],
        goals: learningPath?.goals || [],
        selectedModules,
      },
    };
    onNext(cleanData);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Creating your personalized learning path...
        </p>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-red-600 dark:text-red-400">
          Unable to generate learning path. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t.learningPath.title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t.learningPath.subtitle}
        </p>
      </motion.div>

      {/* Learning Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold mb-4">{t.learningPath.goals.title}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {learningPath.goals.map((goal, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{goal.title}</h4>
              <p className="text-sm opacity-90 mb-2">{goal.description}</p>
              <div className="flex items-center space-x-1 text-xs">
                <Clock className="h-3 w-3" />
                <span>{goal.timeframe}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t.learningPath.modules.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t.learningPath.modules.subtitle}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningPath.modules.map(module => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedModules.includes(module.id)
                  ? "transform scale-105"
                  : "hover:transform hover:scale-102"
              }`}
              onClick={() => handleModuleToggle(module.id)}
            >
              <div
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedModules.includes(module.id)
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                {selectedModules.includes(module.id) && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={`${selectedModules.includes(module.id) ? "text-blue-600" : "text-gray-400"}`}
                  >
                    {module.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {module.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          module.priority === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : module.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        }`}
                      >
                        {module.priority === "high"
                          ? language === "tr"
                            ? "Yüksek"
                            : "High"
                          : module.priority === "medium"
                            ? language === "tr"
                              ? "Orta"
                              : "Medium"
                            : language === "tr"
                              ? "Düşük"
                              : "Low"}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {module.description}
                </p>

                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{module.estimatedTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Plan Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t.learningPath.schedule.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {language === "tr"
            ? "Seçtiğiniz modüllerle haftanızın nasıl görünebileceğinin bir örneği:"
            : "Here's a sample of how your week might look with your selected modules:"}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningPath.weeklyPlan.slice(0, 6).map((day, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {day.day}
              </h4>
              <div className="space-y-2">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="text-sm">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {activity.activity}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {activity.module} • {activity.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row sm:justify-between gap-4"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.learningPath.buttons.back}</span>
          </button>
        )}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:ml-auto">
          <button
            onClick={() => onNext()}
            className="px-4 sm:px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-center"
          >
            {t.learningPath.buttons.skip}
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedModules.length === 0}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span>{t.learningPath.buttons.continue}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
