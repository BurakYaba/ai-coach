"use client";

import { useEffect, useState } from "react";
import { PenTool, TrendingUp, FileText, BarChart3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface WritingStats {
  totalSessions: number;
  completedSessions: number;
  sessionsLastWeek: number;
  averageScore: number;
  scoreChange: number;
  totalWords: number;
  wordsLastMonth: number;
  skillProgress: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    style: number;
  };
  hasData: boolean;
}

export function WritingProgress() {
  const [stats, setStats] = useState<WritingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/writing/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch writing statistics");
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching writing statistics:", error);
        toast({
          title: "Error",
          description: "Failed to load your writing progress data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <WritingProgressSkeleton />;
  }

  if (!stats || !stats.hasData) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Writing Data Available
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            Complete some writing sessions to see your progress. Your writing
            statistics will appear here once you have completed sessions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="border-2 bg-blue-50 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">
              Total Sessions
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <PenTool className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {stats.totalSessions}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {stats.sessionsLastWeek > 0
                ? `+${stats.sessionsLastWeek} from last week`
                : "No new sessions this week"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-green-50 border-green-300 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">
              Average Score
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {stats.averageScore}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {stats.scoreChange > 0
                ? `+${stats.scoreChange}% from last month`
                : stats.scoreChange < 0
                  ? `${stats.scoreChange}% from last month`
                  : "No change from last month"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-purple-50 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">
              Words Written
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {stats.totalWords.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {stats.wordsLastMonth > 0
                ? `+${stats.wordsLastMonth.toLocaleString()} from last month`
                : "No new words this month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Writing Skills Progress
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your progress across different writing skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">Grammar</div>
                <div className="text-sm font-semibold text-gray-700">
                  {stats.skillProgress.grammar}%
                </div>
              </div>
              <Progress
                value={stats.skillProgress.grammar}
                className="h-3"
                style={{
                  background: "#e5e7eb",
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">
                  Vocabulary
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {stats.skillProgress.vocabulary}%
                </div>
              </div>
              <Progress
                value={stats.skillProgress.vocabulary}
                className="h-3"
                style={{
                  background: "#e5e7eb",
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">
                  Coherence
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {stats.skillProgress.coherence}%
                </div>
              </div>
              <Progress
                value={stats.skillProgress.coherence}
                className="h-3"
                style={{
                  background: "#e5e7eb",
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">Style</div>
                <div className="text-sm font-semibold text-gray-700">
                  {stats.skillProgress.style}%
                </div>
              </div>
              <Progress
                value={stats.skillProgress.style}
                className="h-3"
                style={{
                  background: "#e5e7eb",
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Based on your last 5 writing sessions
          </p>
        </CardFooter>
      </Card>
    </>
  );
}

function WritingProgressSkeleton() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-2 bg-gray-50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-4 w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 bg-white shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-[180px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[40px]" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-[220px]" />
        </CardFooter>
      </Card>
    </>
  );
}
