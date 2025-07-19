"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { BookOpen, Target, FileText } from "lucide-react";

interface ReadingStats {
  totalSessions: number;
  completedSessions: number;
  sessionsLastWeek: number;
  averageComprehension: number;
  comprehensionChange: number;
  totalWords: number;
  wordsLastMonth: number;
  topicsRead: {
    name: string;
    count: number;
  }[];
  streak: number;
  hasData: boolean;
}

export function ReadingProgressPage() {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/reading/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch reading statistics");
        }

        const data = await response.json();
        setStats(data.stats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reading statistics:", error);
        toast({
          title: "Error",
          description: "Failed to load your reading progress data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <ReadingProgressSkeleton />;
  }

  if (!stats || !stats.hasData) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Reading Data Available
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            Complete some reading sessions to see your progress and statistics
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-1">
            {stats.totalSessions}
          </div>
          <div className="text-sm text-blue-700 font-medium">
            Total Sessions
          </div>
          <div className="text-xs text-blue-600 mt-2">
            {stats.completedSessions} completed
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900 mb-1">
            {stats.averageComprehension}%
          </div>
          <div className="text-sm text-green-700 font-medium">
            Comprehension Score
          </div>
          <div className="text-xs text-green-600 mt-2">
            {stats.comprehensionChange > 0 ? "+" : ""}
            {stats.comprehensionChange}% from last month
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-900 mb-1">
            {stats.totalWords.toLocaleString()}
          </div>
          <div className="text-sm text-purple-700 font-medium">Words Read</div>
          <div className="text-xs text-purple-600 mt-2">
            {stats.wordsLastMonth.toLocaleString()} in the last month
          </div>
        </div>
      </div>

      {/* Topics Read */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Topics Read
          </h3>
          <p className="text-sm text-gray-600">
            Distribution of reading topics
          </p>
        </div>
        <div className="space-y-4">
          {stats.topicsRead.map((topic, index) => (
            <div key={topic.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{topic.name}</span>
                <span className="text-gray-600">{topic.count} sessions</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index % 4 === 0
                      ? "bg-blue-500"
                      : index % 4 === 1
                        ? "bg-green-500"
                        : index % 4 === 2
                          ? "bg-purple-500"
                          : "bg-orange-500"
                  }`}
                  style={{
                    width: `${(topic.count / stats.totalSessions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Tips */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Reading Tips
          </h3>
          <p className="text-sm text-gray-600">
            Personalized suggestions to improve your reading skills
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <p className="text-sm text-gray-700">
              Try reading texts from more diverse topics to expand your
              vocabulary.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <p className="text-sm text-gray-700">
              Consistency is key - aim for at least one reading session per day.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <p className="text-sm text-gray-700">
              Review vocabulary from your completed sessions to reinforce
              learning.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">4</span>
            </div>
            <p className="text-sm text-gray-700">
              Challenge yourself with slightly more difficult texts to improve
              comprehension.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingProgressSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-4 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
