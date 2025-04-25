"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Book,
  Headphones,
  Mic,
  PenTool,
  Brain,
  Gamepad2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface ModuleAchievementsProps {
  module:
    | "reading"
    | "writing"
    | "listening"
    | "speaking"
    | "vocabulary"
    | "grammar"
    | "games";
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  progress?: number;
  target?: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export function ModuleAchievements({ module }: ModuleAchievementsProps) {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleAchievements = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/gamification/achievements?module=${module}`
        );
        setAchievements(response.data.achievements);
      } catch (error) {
        console.error(`Error fetching ${module} achievements:`, error);
        toast({
          title: "Error",
          description: `Failed to load ${module} achievements`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModuleAchievements();
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
        return <Award className="h-5 w-5" />;
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const progressPercentage =
    achievements.length > 0
      ? (unlockedAchievements.length / achievements.length) * 100
      : 0;

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
          {getModuleDisplayName()} Achievements
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {unlockedAchievements.length} / {achievements.length} unlocked
          </span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-8">
          <Award className="h-16 w-16 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">No Achievements Yet</h3>
          <p className="text-sm text-muted-foreground">
            Keep practicing {module} to earn achievements!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unlocked achievements first */}
          {unlockedAchievements.map(achievement => (
            <Card
              key={achievement.id}
              className="overflow-hidden backdrop-blur-sm transition-all duration-300 bg-gradient-to-br from-background/80 to-background/60 border-muted/30 hover:border-primary/30"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-primary/10",
                      getModuleColor()
                    )}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="outline" className="text-xs">
                      {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">
                  {achievement.name}
                </CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-xs capitalize px-2 py-0.5"
                  >
                    {achievement.category}
                  </Badge>
                  <div className="flex items-center">
                    <Award className="w-3.5 h-3.5 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium">
                      {achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Locked achievements */}
          {lockedAchievements.map(achievement => (
            <Card
              key={achievement.id}
              className="overflow-hidden backdrop-blur-sm transition-all duration-300 bg-gradient-to-br from-muted/10 to-muted/5 border-muted/10 opacity-70"
            >
              <CardHeader className="pb-2">
                <div
                  className={cn(
                    "p-2 rounded-lg w-fit bg-muted/30",
                    "text-muted-foreground"
                  )}
                >
                  <Award className="h-5 w-5" />
                </div>
                <CardTitle className="text-base mt-3">
                  {achievement.name}
                </CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                {achievement.progress !== undefined &&
                  achievement.target !== undefined && (
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <Progress
                        value={
                          (achievement.progress / achievement.target) * 100
                        }
                        className="h-1"
                      />
                    </div>
                  )}
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-xs capitalize px-2 py-0.5 opacity-50"
                  >
                    {achievement.category}
                  </Badge>
                  <div className="flex items-center text-muted-foreground">
                    <Award className="w-3.5 h-3.5 mr-1" />
                    <span className="text-xs font-medium">
                      {achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
