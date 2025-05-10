"use client";

import { Award, Zap, BookOpen } from "lucide-react";
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
        return "";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Grammar Practice
          </h1>
          <p className="text-muted-foreground">
            Track your grammar issues and learn from personalized lessons
          </p>
        </div>
        <Button size="lg" onClick={generateLesson} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Lesson"}
        </Button>
      </div>

      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Grammar Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Issues Resolved:</span>
                  <span className="font-medium">
                    {userStats.issuesResolved}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Lessons Completed:</span>
                  <span className="font-medium">
                    {userStats.lessonsCompleted}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {badges.length > 0 ? (
                    badges.slice(0, 3).map((badge, index) => (
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
                    <p className="text-xs text-muted-foreground">
                      Complete challenges to earn badges!
                    </p>
                  )}
                  {badges.length > 3 && (
                    <Badge variant="outline">+{badges.length - 3} more</Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Grammar Issues</CardTitle>
              <CardDescription>
                Grammar errors identified from your writing and speaking
                sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GrammarIssuesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Grammar Lessons</CardTitle>
              <CardDescription>
                Personalized lessons based on your common grammar mistakes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GrammarLessonsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Grammar Challenge</CardTitle>
                <CardDescription>
                  Test your grammar knowledge with a daily challenge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DailyGrammarChallenge />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grammar Flashcards</CardTitle>
                <CardDescription>
                  Review grammar rules with spaced repetition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GrammarFlashcards />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
