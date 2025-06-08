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

// Local implementation of xpForLevel to avoid database imports
function xpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 0; // Level 1 starts at 0 XP
  if (level === 2) return 100; // Level 2 starts at 100 XP

  // For Level 3 and above, use increasing XP requirements
  // Level 3: 250 XP (100 + 150)
  // Level 4: 450 XP (100 + 150 + 200)
  // Level 5: 700 XP (100 + 150 + 200 + 250)
  // And so on...

  let totalXP = 100; // Starting with requirement for Level 2
  let increment = 150; // Initial increment (for Level 3)

  for (let i = 3; i <= level; i++) {
    totalXP += increment;
    increment += 50; // Each level requires 50 more XP than the previous increment
  }

  return totalXP;
}

// Client-side implementation of level calculation from XP
function calculateLevelAndProgress(xp: number) {
  // Handle special case of 0 XP
  if (xp === 0) {
    return {
      level: 1,
      currentLevelXP: 0,
      nextLevelXP: 100,
      xpSinceCurrentLevel: 0,
      xpNeededForNextLevel: 100,
      progressPercentage: 0,
    };
  }

  // Find the level where user's XP puts them
  let level = 1;

  // Keep incrementing level as long as XP is >= the threshold for that level
  while (xp >= xpForLevel(level)) {
    level++;
  }

  // Adjust back since we went one level too far
  level--;

  // Add 1 to level to match user expectations (100 XP = Level 2, not Level 1)
  level += 1;

  // Ensure level is at least 1
  level = Math.max(level, 1);

  // Calculate XP thresholds based on the adjusted level
  const currentLevelXP = xpForLevel(level - 1); // XP threshold for current level
  const nextLevelXP = xpForLevel(level); // XP threshold for next level

  // Calculate XP progress within current level
  const xpSinceCurrentLevel = xp - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;

  // Calculate percentage progress to next level
  const progressPercentage = (xpSinceCurrentLevel / xpNeededForNextLevel) * 100;

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    xpSinceCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  };
}

export function XpProgress() {
  const { data: profile, isLoading, error } = useGamificationProfile();

  // Calculate the XP thresholds and current progress using the new function
  const calculatedData = profile
    ? calculateLevelAndProgress(profile.experience)
    : null;

  // Use calculated data or fallbacks
  const displayLevel = calculatedData?.level || 1;
  const xpSinceCurrentLevel = calculatedData?.xpSinceCurrentLevel || 0;
  const xpNeededForNextLevel = calculatedData?.xpNeededForNextLevel || 100;
  const progressPercentage = calculatedData?.progressPercentage || 0;

  if (isLoading) {
    return <Skeleton className="h-4 w-20" />;
  }

  if (error || !profile) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="flex items-center gap-2 rounded-lg px-2 py-1 cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors"
          data-tour="xp-progress"
        >
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-medium">{displayLevel}</span>
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
              <h4 className="text-sm font-semibold">Level {displayLevel}</h4>
              <p className="text-xs text-muted-foreground">
                {xpSinceCurrentLevel} XP / {xpNeededForNextLevel} XP
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress to Level {displayLevel + 1}</span>
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
