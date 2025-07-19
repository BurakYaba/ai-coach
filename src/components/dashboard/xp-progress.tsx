"use client";

import { Star, Trophy, TrendingUp } from "lucide-react";

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

interface XpProgressProps {
  showLabel?: boolean;
}

export function XpProgress({ showLabel = false }: XpProgressProps) {
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
        {showLabel ? (
          <div className="flex items-center justify-between cursor-pointer w-full">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Level & XP
              </span>
            </div>
            <span className="font-bold text-gray-800">{displayLevel}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800">{displayLevel}</span>
          </div>
        )}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 border-0 shadow-xl"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Level {displayLevel}
              </h3>
              <p className="text-sm text-gray-600">
                {xpSinceCurrentLevel} XP / {xpNeededForNextLevel} XP
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">
                  Progress to Level {displayLevel + 1}
                </span>
                <span className="font-medium text-gray-800">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-gray-600 mr-1" />
                  <span className="text-xs text-gray-600">Total XP</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {profile.stats.totalXP}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <div className="flex items-center justify-center mb-1">
                  <span className="text-xs text-gray-600">Streak</span>
                  <span className="ml-1 text-orange-500">🔥</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {profile.streak.current}
                </div>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
