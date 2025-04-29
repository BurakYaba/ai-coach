"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Book,
  Calendar,
  Clock,
  Star,
  Trophy,
  Headphones,
  Mic,
  PenTool,
  Brain,
  Gamepad2,
  TrendingUp,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";

interface ModuleProgressProps {
  module:
    | "reading"
    | "writing"
    | "listening"
    | "speaking"
    | "vocabulary"
    | "grammar"
    | "games";
}

interface ActivityItem {
  id: string;
  date: string;
  xp: number;
  description: string;
  activityType: string;
}

interface ModuleStats {
  totalSessions: number;
  totalTimeSpent: number; // in minutes
  completedItems: number; // depends on module (e.g., passages, exercises, etc.)
  averageScore: number; // percentage
  totalXP: number;
  recentActivity: ActivityItem[];
  streak?: {
    current: number;
    best: number;
  };
  level: {
    value: number;
    progress: number;
  };
  achievements?: {
    total: number;
    unlocked: number;
  };
}

export function ModuleProgress({ module }: ModuleProgressProps) {
  const { toast } = useToast();
  const [stats, setStats] = useState<ModuleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleStats = async () => {
      setLoading(true);
      try {
        // Fetch real data from the API
        const response = await axios.get(
          `/api/gamification/modules/${module}/stats`
        );

        if (response.data.stats) {
          setStats(response.data.stats);
        } else {
          // Handle empty response
          setStats(null);
          toast({
            title: "No data available",
            description: `No ${module} activity data available yet.`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error(`Error fetching ${module} stats:`, error);
        toast({
          title: "Error",
          description: `Failed to load ${module} statistics`,
          variant: "destructive",
        });
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleStats();
  }, [module, toast]);

  // Get module icon
  const getModuleIcon = () => {
    switch (module) {
      case "reading":
        return <Book className="h-5 w-5" />;
      case "writing":
        return <PenTool className="h-5 w-5" />;
      case "listening":
        return <Headphones className="h-5 w-5" />;
      case "speaking":
        return <Mic className="h-5 w-5" />;
      case "vocabulary":
        return <Brain className="h-5 w-5" />;
      case "grammar":
        return <PenTool className="h-5 w-5" />;
      case "games":
        return <Gamepad2 className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  // Get module display name with first letter capitalized
  const getModuleDisplayName = () => {
    return module.charAt(0).toUpperCase() + module.slice(1);
  };

  // Get color class for module
  const getModuleColor = () => {
    switch (module) {
      case "reading":
        return "text-blue-500";
      case "writing":
        return "text-indigo-500";
      case "listening":
        return "text-green-500";
      case "speaking":
        return "text-orange-500";
      case "vocabulary":
        return "text-purple-500";
      case "grammar":
        return "text-pink-500";
      case "games":
        return "text-yellow-500";
      default:
        return "text-primary";
    }
  };

  // Get color class for module background
  const getModuleBgColor = () => {
    switch (module) {
      case "reading":
        return "bg-blue-500/10";
      case "writing":
        return "bg-indigo-500/10";
      case "listening":
        return "bg-green-500/10";
      case "speaking":
        return "bg-orange-500/10";
      case "vocabulary":
        return "bg-purple-500/10";
      case "grammar":
        return "bg-pink-500/10";
      case "games":
        return "bg-yellow-500/10";
      default:
        return "bg-primary/10";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className={cn(
              "text-lg font-semibold flex items-center gap-2",
              getModuleColor()
            )}
          >
            {getModuleIcon()}
            {getModuleDisplayName()} Progress
          </h3>
        </div>

        <Card className="bg-muted/5">
          <CardContent className="py-8 text-center">
            <div
              className={cn(
                "mx-auto mb-4 p-3 rounded-full",
                getModuleBgColor()
              )}
            >
              {getModuleIcon()}
            </div>
            <h4 className="text-lg font-medium mb-2">No Activity Yet</h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You haven't completed any {module} activities yet. Start
              practicing to see your progress stats here!
            </p>
            <div className="mt-6">
              <Button
                className={cn(
                  getModuleBgColor(),
                  "text-white hover:bg-opacity-90"
                )}
                asChild
              >
                <Link href={`/dashboard/${module}`}>
                  Start {getModuleDisplayName()} Activity
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2
          className={cn(
            "text-2xl font-bold flex items-center gap-2",
            getModuleColor()
          )}
        >
          {getModuleIcon()}
          {getModuleDisplayName()} Progress
        </h2>
        <Button variant="outline">Start New Session</Button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Level & XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Star className={cn("h-5 w-5 mr-2", getModuleColor())} />
                <span className="text-2xl font-bold">
                  Level {stats.level.value}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.totalXP} Total XP
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress to Level {stats.level.value + 1}</span>
                <span>{stats.level.progress}%</span>
              </div>
              <Progress value={stats.level.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Sessions</span>
                <span className="text-2xl font-bold">
                  {stats.totalSessions}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Time Spent
                </span>
                <span className="text-2xl font-bold">
                  {Math.floor(stats.totalTimeSpent / 60)}h{" "}
                  {stats.totalTimeSpent % 60}m
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Items Completed
                </span>
                <span className="text-2xl font-bold">
                  {stats.completedItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Avg. Score
                </span>
                <span className="text-2xl font-bold">
                  {stats.averageScore || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Trophy className={cn("h-5 w-5 mr-2", getModuleColor())} />
                <span className="text-2xl font-bold">
                  {stats.achievements?.unlocked || 0}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                of {stats.achievements?.total || 0} unlocked
              </span>
            </div>
            <div className="space-y-1">
              <Progress
                value={
                  stats.achievements
                    ? (stats.achievements.unlocked /
                        (stats.achievements.total || 1)) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>
            <div className="mt-2 text-center">
              <Button variant="link" className="text-xs p-0">
                View All Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your {module} learning activity in the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg border border-muted/20 hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        getModuleBgColor(),
                        getModuleColor()
                      )}
                    >
                      {getModuleIcon()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {activity.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()} -{" "}
                        {new Date(activity.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-sm">{activity.xp} XP</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity to display
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full">
            View Full History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
