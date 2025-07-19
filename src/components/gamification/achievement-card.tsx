"use client";

import { format } from "date-fns";
import { Award, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/hooks/use-gamification";

interface AchievementCardProps {
  achievement: Achievement;
  unlocked?: boolean;
}

export function AchievementCard({
  achievement,
  unlocked = false,
}: AchievementCardProps) {
  // Simplified icon approach - would need to add more icons as needed
  const getIconComponent = () => {
    switch (achievement.icon) {
      case "book":
        return <Award className="h-5 w-5" />;
      case "pen":
        return <Award className="h-5 w-5" />;
      case "headphones":
        return <Award className="h-5 w-5" />;
      case "mic":
        return <Award className="h-5 w-5" />;
      case "star":
        return <Star className="h-5 w-5" />;
      case "calendar":
        return <Award className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const categoryColors = {
    progress: "bg-blue-500/10 text-blue-500",
    milestone: "bg-purple-500/10 text-purple-500",
    activity: "bg-green-500/10 text-green-500",
    skill: "bg-orange-500/10 text-orange-500",
    special: "bg-yellow-500/10 text-yellow-500",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden backdrop-blur-sm transition-all duration-300",
        unlocked
          ? "bg-gradient-to-br from-background to-background/80 border-muted/20 hover:border-primary/30"
          : "bg-gradient-to-br from-muted/10 to-muted/5 border-muted/10 opacity-70"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div
            className={cn(
              "p-2 rounded-lg",
              categoryColors[achievement.category] ||
                "bg-primary/10 text-primary"
            )}
          >
            {getIconComponent()}
          </div>
          {unlocked && achievement.unlockedAt && (
            <Badge variant="outline" className="text-xs">
              {format(new Date(achievement.unlockedAt), "MMM d, yyyy")}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base mt-3">{achievement.name}</CardTitle>
        <CardDescription>{achievement.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn(
              "text-xs capitalize px-2 py-0.5",
              unlocked ? "opacity-100" : "opacity-70"
            )}
          >
            {achievement.category}
          </Badge>

          <div className="flex items-center">
            <Star className="w-3.5 h-3.5 text-yellow-500 mr-1" />
            <span className="text-xs font-medium">
              {achievement.xpReward} XP
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
