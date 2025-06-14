"use client";

import {
  Award,
  Zap,
  BookOpen,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { DailyGrammarChallenge } from "@/components/grammar/DailyGrammarChallenge";
import { GrammarFlashcards } from "@/components/grammar/GrammarFlashcards";
import GrammarIssuesList from "@/components/grammar/GrammarIssuesList";
import GrammarLessonsList from "@/components/grammar/GrammarLessonsList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import GrammarTourManager from "@/components/tours/GrammarTourManager";
import GrammarTourTrigger from "@/components/tours/GrammarTourTrigger";

interface GrammarBadge {
  name: string;
  category: string;
  level: string;
  earnedAt: Date;
}

export default function GrammarPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [badges, setBadges] = useState<GrammarBadge[]>([]);
  const [userStats, setUserStats] = useState({
    issuesResolved: 0,
    lessonsCompleted: 0,
    challengeStreak: 0,
  });

  // Fetch user's grammar progress on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProgress();
    }
  }, [session?.user?.id]);

  const fetchUserProgress = async () => {
    try {
      const response = await fetch("/api/user/grammar-progress");
      if (!response.ok) {
        throw new Error("Failed to fetch user grammar progress");
      }
      const data = await response.json();

      setBadges(data.badges || []);
      setUserStats({
        issuesResolved: data.issuesResolved || 0,
        lessonsCompleted: data.lessonsCompleted || 0,
        challengeStreak: data.challengeStreak || 0,
      });
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  // Generate a grammar lesson based on user's frequent error types
  const generateLesson = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate grammar lessons",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch the most common error category for this user
      const issuesResponse = await fetch("/api/grammar/issues?limit=50");

      if (!issuesResponse.ok) {
        throw new Error("Failed to fetch grammar issues");
      }

      const issuesData = await issuesResponse.json();
      const issues = issuesData.issues || [];

      if (issues.length === 0) {
        toast({
          title: "No grammar issues found",
          description:
            "Complete some writing or speaking exercises first to collect grammar issues",
          variant: "default",
        });
        return;
      }

      // Count issues by category
      const categoryCounts: Record<string, { count: number; level: string }> =
        {};
      issues.forEach((issue: any) => {
        if (!categoryCounts[issue.category]) {
          categoryCounts[issue.category] = {
            count: 0,
            level: issue.ceferLevel,
          };
        }
        categoryCounts[issue.category].count += 1;
      });

      // Find the most common category
      let topCategory = "";
      let topCount = 0;
      let level = "B1"; // Default level if none found

      Object.entries(categoryCounts).forEach(([category, data]) => {
        if (data.count > topCount) {
          topCategory = category;
          topCount = data.count;
          level = data.level;
        }
      });

      // Generate a lesson for the most common category
      const generateResponse = await fetch("/api/grammar/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: topCategory,
          ceferLevel: level,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate grammar lesson");
      }

      const generateData = await generateResponse.json();

      toast({
        title: "Grammar lesson created",
        description: `New lesson created: ${generateData.lesson.title}`,
      });

      // Navigate directly to the new lesson
      router.push(`/dashboard/grammar/lessons/${generateData.lesson._id}`);
    } catch (error: any) {
      console.error("Error generating lesson:", error);
      toast({
        title: "Error generating lesson",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "silver":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "gold":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <GrammarTourManager />

        {/* Header */}
        <div
          className="flex justify-between items-start mb-8"
          data-tour="grammar-header"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Grammar Practice
            </h1>
            <p className="text-gray-600">
              Track your grammar issues and learn from personalized lessons
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GrammarTourTrigger />
            <Button
              onClick={generateLesson}
              disabled={isGenerating}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              data-tour="generate-lesson-btn"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                {isGenerating ? "Generating..." : "Generate Lesson"}
              </span>
              <span className="sm:hidden">
                {isGenerating ? "Generating..." : "Generate"}
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
          data-tour="grammar-tabs"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white shadow-sm">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              data-tour="grammar-issues-tab"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Issues</span>
              <span className="sm:hidden">Issues</span>
            </TabsTrigger>
            <TabsTrigger
              value="lessons"
              data-tour="grammar-lessons-tab"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Lessons</span>
              <span className="sm:hidden">Lessons</span>
            </TabsTrigger>
            <TabsTrigger
              value="practice"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
              <span className="sm:hidden">Practice</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Issues Resolved Card */}
              <Card
                className="border-2 bg-green-50 border-green-300 shadow-lg hover:shadow-xl transition-all duration-300"
                data-tour="grammar-achievements"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">
                        Issues Resolved
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Grammar errors fixed
                      </CardDescription>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">
                    {userStats.issuesResolved}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Keep practicing to improve!
                  </p>
                </CardContent>
              </Card>

              {/* Lessons Completed Card */}
              <Card className="border-2 bg-blue-50 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">
                        Lessons Completed
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Grammar lessons finished
                      </CardDescription>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">
                    {userStats.lessonsCompleted}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Great progress!</p>
                </CardContent>
              </Card>

              {/* Challenge Streak Card */}
              <Card className="border-2 bg-purple-50 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">
                        Challenge Streak
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Daily challenges completed
                      </CardDescription>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">
                    {userStats.challengeStreak}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {userStats.challengeStreak > 0
                      ? "Keep it up!"
                      : "Start your streak today!"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Section */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                      <Award className="h-6 w-6 text-yellow-600" />
                      Grammar Achievements
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your grammar learning milestones
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {badges.length > 0 ? (
                    badges.slice(0, 6).map((badge, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`flex items-center gap-1 ${getBadgeColor(badge.level)}`}
                      >
                        <Award className="h-3 w-3" />
                        {badge.name}
                      </Badge>
                    ))
                  ) : (
                    <div className="flex h-[80px] flex-col items-center justify-center w-full">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <Award className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          No badges yet
                        </p>
                        <p className="text-xs text-gray-500">
                          Complete challenges to earn badges!
                        </p>
                      </div>
                    </div>
                  )}
                  {badges.length > 6 && (
                    <Badge variant="outline" className="border-gray-300">
                      +{badges.length - 6} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Your Grammar Issues
                </h3>
                <p className="text-gray-600">
                  Grammar errors identified from your writing and speaking
                  sessions
                </p>
              </div>
              <GrammarIssuesList />
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Your Grammar Lessons
                </h3>
                <p className="text-gray-600">
                  Personalized lessons based on your common grammar mistakes
                </p>
              </div>
              <GrammarLessonsList />
            </div>
          </TabsContent>

          <TabsContent value="practice" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                data-tour="daily-challenge"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-800">
                        Daily Grammar Challenge
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Test your grammar knowledge with a daily challenge
                      </CardDescription>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                      <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DailyGrammarChallenge />
                </CardContent>
              </Card>

              <Card
                className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                data-tour="grammar-flashcards"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-800">
                        Grammar Flashcards
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Review grammar rules with spaced repetition
                      </CardDescription>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <GrammarFlashcards />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
