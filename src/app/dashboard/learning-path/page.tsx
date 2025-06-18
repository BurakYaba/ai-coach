"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Brain,
  Clock,
  Target,
  Trophy,
  Zap,
  ArrowRight,
  User,
  Calendar,
  TrendingUp,
  CheckCircle,
  Star,
  MapPin,
  Loader2,
} from "lucide-react";

import { learningPathTranslations } from "@/lib/onboarding-translations";

interface LearningPathData {
  primaryFocus: string[];
  suggestedOrder: string[];
  estimatedWeeks: number;
  timeRecommendations: {
    dailyMinutes: number;
    weeklyMinutes: number;
    sessionsPerWeek: string;
    recommendedBreakdown: {
      mainSkill: number;
      vocabulary: number;
      review: number;
    };
  };
  studyPlan: {
    phase1: {
      title: string;
      duration: string;
      focus: string[];
      activities: string[];
    };
    phase2: {
      title: string;
      duration: string;
      focus: string[];
      activities: string[];
    };
    phase3: {
      title: string;
      duration: string;
      focus: string[];
      activities: string[];
    };
  };
  recommendations: {
    title: string;
    description: string;
    tips: string[];
  }[];
}

interface UserOnboarding {
  skillAssessment: {
    ceferLevel: string;
    overallScore: number;
    scores: {
      reading: number;
      grammar: number;
      vocabulary: number;
    };
    weakAreas: string[];
    strengths: string[];
  };
  preferences: {
    learningGoals: string[];
    timeAvailable: string;
    learningStyle: string;
    focusAreas: string[];
  };
  recommendedPath: LearningPathData;
}

const moduleIcons = {
  reading: BookOpen,
  writing: Target,
  speaking: Zap,
  listening: Brain,
  vocabulary: Star,
  grammar: CheckCircle,
  games: Trophy,
};

const moduleColors = {
  reading: "bg-blue-500",
  writing: "bg-green-500",
  speaking: "bg-orange-500",
  listening: "bg-purple-500",
  vocabulary: "bg-yellow-500",
  grammar: "bg-red-500",
  games: "bg-indigo-500",
};

export default function LearningPathPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [onboardingData, setOnboardingData] = useState<UserOnboarding | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Detect language from pathname
  const language: "en" | "tr" = pathname?.startsWith("/tr") ? "tr" : "en";
  const t = learningPathTranslations[language];

  // Function to get translated module name
  const getModuleName = (moduleId: string) => {
    return t.modules[moduleId as keyof typeof t.modules] || moduleId;
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchLearningPath();
  }, [session, status]);

  const fetchLearningPath = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        if (data.onboarding?.completed && data.onboarding?.recommendedPath) {
          // Validate that we have the required data structure
          const path = data.onboarding.recommendedPath;

          // Ensure timeRecommendations exists with defaults
          if (!path.timeRecommendations) {
            path.timeRecommendations = {
              dailyMinutes: 30,
              weeklyMinutes: 210,
              sessionsPerWeek: "7",
              recommendedBreakdown: {
                mainSkill: 20,
                vocabulary: 5,
                review: 5,
              },
            };
          }

          // Ensure studyPlan exists with defaults
          if (!path.studyPlan) {
            path.studyPlan = {
              phase1: {
                title: "Foundation Building",
                duration: "4 weeks",
                focus: ["vocabulary", "grammar"],
                activities: [
                  "Daily vocabulary practice",
                  "Basic grammar exercises",
                ],
              },
              phase2: {
                title: "Skill Development",
                duration: "4 weeks",
                focus: ["reading", "writing"],
                activities: ["Reading comprehension", "Writing practice"],
              },
              phase3: {
                title: "Advanced Practice",
                duration: "4 weeks",
                focus: ["speaking", "listening"],
                activities: ["Conversation practice", "Listening exercises"],
              },
            };
          }

          // Ensure recommendations exists with defaults
          if (!path.recommendations) {
            path.recommendations = [
              {
                title: "Getting Started",
                description:
                  "Begin your learning journey with these foundational tips.",
                tips: [
                  "Set aside consistent study time each day",
                  "Focus on gradual improvement over perfection",
                  "Practice regularly to build confidence",
                ],
              },
            ];
          }

          // Ensure other required fields exist
          if (!path.primaryFocus) path.primaryFocus = [];
          if (!path.suggestedOrder)
            path.suggestedOrder = [
              "vocabulary",
              "grammar",
              "reading",
              "writing",
              "listening",
              "speaking",
              "games",
            ];
          if (!path.estimatedWeeks) path.estimatedWeeks = 12;

          setOnboardingData(data.onboarding);
        } else if (data.onboarding?.completed) {
          setError(
            "Learning path is incomplete. Please regenerate your learning path."
          );
        } else {
          setError(
            "Learning path not found. Please complete onboarding first."
          );
        }
      } else {
        setError("Failed to load learning path.");
      }
    } catch (error) {
      console.error("Error fetching learning path:", error);
      setError("Failed to load learning path.");
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">{t.error}</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push("/onboarding")}>
            {t.completeOnboarding}
          </Button>
        </div>
      </div>
    );
  }

  if (!onboardingData) {
    return null;
  }

  const { skillAssessment, preferences, recommendedPath } = onboardingData;

  // Additional safety checks for rendering
  const safeTimeRecs = recommendedPath.timeRecommendations || {
    dailyMinutes: 30,
    weeklyMinutes: 210,
    sessionsPerWeek: "7",
    recommendedBreakdown: { mainSkill: 20, vocabulary: 5, review: 5 },
  };

  const safeStudyPlan = recommendedPath.studyPlan || {};
  const safeRecommendations = recommendedPath.recommendations || [];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.cards.currentLevel}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skillAssessment?.ceferLevel || "B1"}
            </div>
            <p className="text-xs text-muted-foreground">
              Score: {skillAssessment?.overallScore || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.cards.dailyTime}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeTimeRecs.dailyMinutes}min
            </div>
            <p className="text-xs text-muted-foreground">
              {safeTimeRecs.sessionsPerWeek} sessions/week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.cards.estimatedDuration}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendedPath.estimatedWeeks || 12}
            </div>
            <p className="text-xs text-muted-foreground">weeks to next level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.cards.focusAreas}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(recommendedPath.primaryFocus || []).length}
            </div>
            <p className="text-xs text-muted-foreground">priority modules</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Roadmap */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Your Learning Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(recommendedPath.suggestedOrder || []).map((module, index) => {
              const IconComponent =
                moduleIcons[module as keyof typeof moduleIcons] || BookOpen;
              const isPrimary = (recommendedPath.primaryFocus || []).includes(
                module
              );
              const isWeakArea = (skillAssessment?.weakAreas || []).includes(
                module
              );

              return (
                <Card
                  key={module}
                  className={`relative transition-all hover:shadow-md ${
                    isPrimary ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${moduleColors[module as keyof typeof moduleColors]}/20`}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${moduleColors[module as keyof typeof moduleColors].replace("bg-", "text-")}`}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-sm">
                            {getModuleName(module)}
                          </CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Step #{index + 1}
                            </span>
                            {isPrimary && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1"
                              >
                                Priority
                              </Badge>
                            )}
                            {isWeakArea && (
                              <Badge variant="outline" className="text-xs px-1">
                                Focus Area
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {isWeakArea && (
                        <p className="text-xs text-muted-foreground">
                          Recommended based on your assessment results
                        </p>
                      )}
                      {isPrimary && !isWeakArea && (
                        <p className="text-xs text-muted-foreground">
                          High priority for your learning goals
                        </p>
                      )}
                      {!isPrimary && !isWeakArea && (
                        <p className="text-xs text-muted-foreground">
                          Build comprehensive skills
                        </p>
                      )}
                      <Button
                        size="sm"
                        variant={isPrimary ? "default" : "outline"}
                        className="w-full"
                        onClick={() => router.push(`/dashboard/${module}`)}
                      >
                        {index === 0 ? "Start Here" : "Begin Practice"}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              3-Phase Study Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(safeStudyPlan).map(([phase, data]) => (
              <div key={phase} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{data.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {data.duration}
                </p>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Focus: </span>
                    <span className="text-sm">{data.focus.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Activities:</span>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {data.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Time Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {safeTimeRecs.recommendedBreakdown.mainSkill}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Main Skill
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {safeTimeRecs.recommendedBreakdown.vocabulary}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Vocabulary
                  </div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {safeTimeRecs.recommendedBreakdown.review}
                  </div>
                  <div className="text-xs text-muted-foreground">Review</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Your Preferences</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Learning Style:</span>
                    <span className="font-medium">
                      {capitalize(preferences?.learningStyle || "mixed")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Available:</span>
                    <span className="font-medium">
                      {preferences?.timeAvailable || "flexible"}
                    </span>
                  </div>
                  <div>
                    <span>Goals:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(preferences?.learningGoals || []).map((goal, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                      {(!preferences?.learningGoals ||
                        preferences.learningGoals.length === 0) && (
                        <Badge variant="outline" className="text-xs">
                          General English
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeRecommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{rec.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {rec.description}
                </p>
                <ul className="space-y-1">
                  {rec.tips.map((tip, tipIndex) => (
                    <li
                      key={tipIndex}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Star className="h-3 w-3 mt-0.5 text-yellow-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
