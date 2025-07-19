"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for the stats data
interface LevelProgress {
  level: string;
  completed: number;
  total: number;
  percentage: number;
}

interface CategoryCount {
  category: string;
  count: number;
}

interface ListeningStatsData {
  overview: {
    totalListeningTime: number;
    averageScore: number;
    completedSessions: number;
    totalSessions: number;
    currentStreak: number;
    librarySessionsTotal: number;
    librarySessionsCompleted: number;
  };
  progressByLevel: LevelProgress[];
  progressByContentType: {
    type: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
  commonTopics: {
    topic: string;
    count: number;
  }[];
  commonCategories: CategoryCount[];
}

async function fetchListeningStats(): Promise<ListeningStatsData> {
  const response = await fetch("/api/listening/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch listening stats");
  }
  return response.json();
}

export function ListeningStats() {
  const { data, isLoading, error } = useQuery<ListeningStatsData, Error>({
    queryKey: ["listeningStats"],
    queryFn: fetchListeningStats,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <StatsLoading />;
  }

  if (error) {
    return <StatsError />;
  }

  // No data yet
  if (!data || !data.overview) {
    return <EmptyStats />;
  }

  const {
    overview,
    progressByLevel,
    progressByContentType,
    commonTopics,
    commonCategories,
  } = data;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-blue-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-600">
            {overview.completedSessions}
          </div>
          <div className="text-sm text-gray-600">Exercises Completed</div>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <div className="text-3xl font-bold text-green-600">
            {overview.totalListeningTime}m
          </div>
          <div className="text-sm text-gray-600">Total Listening Time</div>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-xl">
          <div className="text-3xl font-bold text-purple-600">
            {overview.averageScore}%
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
      </div>

      {/* Library Sessions Section */}
      {overview.librarySessionsTotal > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-medium mb-3">
            Library Sessions Progress
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold">
                  {overview.librarySessionsCompleted}/
                  {overview.librarySessionsTotal} completed
                </p>
                <p className="text-xs text-gray-500">Library Sessions</p>
              </div>
            </div>
            <Progress
              value={
                (overview.librarySessionsCompleted /
                  Math.max(1, overview.librarySessionsTotal)) *
                100
              }
              className="h-2 w-24"
            />
          </div>
        </div>
      )}

      {/* Progress by Level */}
      {progressByLevel && progressByLevel.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-medium mb-3">Progress by Level</h3>
          <div className="space-y-3">
            {progressByLevel.map(level => (
              <div key={level.level} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Level {level.level}</span>
                  <span>
                    {level.completed}/{level.total} completed
                  </span>
                </div>
                <Progress value={level.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Type Stats */}
      {progressByContentType &&
        progressByContentType.some(item => item.total > 0) && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium mb-3">
              Progress by Content Type
            </h3>
            <div className="space-y-3">
              {progressByContentType
                .filter(item => item.total > 0)
                .map(item => (
                  <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{item.type}</span>
                      <span>
                        {item.completed}/{item.total} completed
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Common Categories and Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Categories */}
        {commonCategories && commonCategories.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium mb-3">Popular Categories</h3>
            <div className="flex flex-wrap gap-2">
              {commonCategories.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item.category} ({item.count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Common Topics */}
        {commonTopics && commonTopics.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium mb-3">Popular Topics</h3>
            <div className="flex flex-wrap gap-2">
              {commonTopics.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item.topic} ({item.count})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading state
function StatsLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-3">
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

// Error state
function StatsError() {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed p-4 text-center">
      <div>
        <p className="text-sm text-gray-500">Unable to load statistics</p>
        <button className="mt-2 text-sm text-primary hover:underline">
          Try again
        </button>
      </div>
    </div>
  );
}

// Empty state
function EmptyStats() {
  return (
    <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
      <div>
        <p className="font-medium">No listening data yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Complete your first listening session to see statistics
        </p>
      </div>
    </div>
  );
}
