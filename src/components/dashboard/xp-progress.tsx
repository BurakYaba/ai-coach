"use client";

import { ChevronsUp, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamificationProfile } from "@/hooks/use-gamification";

export function XpProgress() {
  const { data: profile, isLoading, error } = useGamificationProfile();

  // Calculate progress percentage for current level
  const progressPercentage = profile
    ? (profile.experience /
        (profile.experience + profile.experienceToNextLevel)) *
      100
    : 0;

  if (isLoading) {
    return <Skeleton className="h-4 w-20" />;
  }

  if (error || !profile) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1 cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-medium">{profile.level}</span>
          </span>
          <Progress value={progressPercentage} className="h-1.5 w-12" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4 border border-muted/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Level {profile.level}</h4>
              <p className="text-xs text-muted-foreground">
                {profile.experience} XP /{" "}
                {profile.experience + profile.experienceToNextLevel} XP
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress to Level {profile.level + 1}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex flex-col items-center justify-center rounded-lg border border-muted/20 p-2 bg-background">
              <span className="text-xs text-muted-foreground">Total XP</span>
              <span className="text-lg font-semibold">
                {profile.stats.totalXP}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-muted/20 p-2 bg-background">
              <span className="text-xs text-muted-foreground">Streak</span>
              <div className="flex items-center gap-1">
                <ChevronsUp className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-semibold">
                  {profile.streak.current}
                </span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
