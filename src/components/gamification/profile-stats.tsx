"use client";

import { ChevronsUp, Calendar, Book, Target, Award, Flame } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGamificationProfile,
  useUserAchievements,
  useUserBadges,
} from "@/hooks/use-gamification";
import { AchievementCard } from "./achievement-card";
import { BadgeCard } from "./badge-card";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

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

  // Debug log for edge cases
  if (xp >= 100 && xp < 110) {
    console.log("Edge case XP calculation:", {
      xp,
      level,
      currentLevelXP,
      nextLevelXP,
      xpSinceCurrentLevel,
      xpNeededForNextLevel,
    });
  }

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    xpSinceCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  };
}

export function GamificationProfileStats() {
  const { data: profile, isLoading: profileLoading } = useGamificationProfile();
  const { data: achievements, isLoading: achievementsLoading } =
    useUserAchievements();
  const { data: badges, isLoading: badgesLoading } = useUserBadges();
  const queryClient = useQueryClient();

  // Calculate the XP thresholds and current progress using the new function
  const calculatedData = profile
    ? calculateLevelAndProgress(profile.experience)
    : null;

  // Use calculated data or fallbacks
  const displayLevel = calculatedData?.level || 1;
  const xpSinceCurrentLevel = calculatedData?.xpSinceCurrentLevel || 0;
  const xpNeededForNextLevel = calculatedData?.xpNeededForNextLevel || 100;
  const progressPercentage = calculatedData?.progressPercentage || 0;

  // Debug logging
  if (profile && calculatedData) {
    console.log("Profile Stats Component - Data:", {
      totalXP: profile.experience,
      calculatedLevel: calculatedData.level,
      currentLevelThreshold: calculatedData.currentLevelXP,
      nextLevelThreshold: calculatedData.nextLevelXP,
      xpSinceCurrentLevel: calculatedData.xpSinceCurrentLevel,
      xpNeededForNextLevel: calculatedData.xpNeededForNextLevel,
      progressPercentage: calculatedData.progressPercentage,
      moduleCounts: profile.stats.moduleActivity,
    });
  }

  // Debug functions
  const recalculateLevel = () => {
    if (!profile) return;

    const manualCalculation = calculateLevelAndProgress(profile.experience);
    console.log("Manual Recalculation:", manualCalculation);

    alert(`
      Raw experience: ${profile.experience}
      Total XP: ${profile.stats.totalXP}
      DB Level: ${profile.level}
      Calculated Level: ${manualCalculation.level}
      
      Threshold Calculation:
      - Level 1: 0-99 XP
      - Level 2: 100-149 XP
      - Level 3: 150-199 XP
      
      XP For Level Results:
      - xpForLevel(0): ${xpForLevel(0)}
      - xpForLevel(1): ${xpForLevel(1)}
      - xpForLevel(2): ${xpForLevel(2)}
      - xpForLevel(3): ${xpForLevel(3)}
    `);
  };

  // Function to force update the level in the database
  const forceUpdateLevel = async () => {
    if (!profile) return;

    try {
      // Show a loading indicator or message
      toast({
        title: "Updating level...",
        description: "Please wait while we update your level",
      });

      const response = await fetch("/api/gamification/debug/update-level", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experience: profile.experience,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success notification
        toast({
          title: "Level Updated",
          description: `Your level has been updated from ${profile.level} to ${data.newLevel}`,
          variant: "default",
        });

        // Immediately invalidate the cached profile data to trigger a refetch
        await queryClient.invalidateQueries({
          queryKey: ["gamification", "profile"],
        });

        // Optionally, force an immediate refetch
        await queryClient.refetchQueries({
          queryKey: ["gamification", "profile"],
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to update level: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating level:", error);
      toast({
        title: "Error",
        description: "Failed to update level. Check console for details.",
        variant: "destructive",
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
        </div>
        <Skeleton className="h-8 w-1/4 mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Gamification profile not available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Your Learning Journey
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XP and Level Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Level & XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">
                  Level {displayLevel} ✓
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {profile.stats.totalXP} Total XP
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress to Level {displayLevel + 1}</span>
                <span>
                  {xpSinceCurrentLevel} / {xpNeededForNextLevel} XP
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Flame className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-2xl font-bold">
                  {profile.streak.current} days
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm text-muted-foreground">
                  Longest: {profile.streak.longest} days
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Keep learning daily to maintain your streak!
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Activity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Reading</span>
                  <span className="text-xs font-medium">
                    {profile.stats.moduleActivity.reading}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Writing</span>
                  <span className="text-xs font-medium">
                    {profile.stats.moduleActivity.writing}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Listening</span>
                  <span className="text-xs font-medium">
                    {profile.stats.moduleActivity.listening}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Speaking</span>
                  <span className="text-xs font-medium">
                    {profile.stats.moduleActivity.speaking}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {profile.stats.activeDays} active days total
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements and Badges */}
      <Tabs defaultValue="achievements" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="achievements">
            Achievements ({achievements?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="badges">
            Badges ({badges?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-0">
          {achievementsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
            </div>
          ) : achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No Achievements Yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete learning activities to earn achievements
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="badges" className="mt-0">
          {badgesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
            </div>
          ) : badges && badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} unlocked={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No Badges Yet</h3>
              <p className="text-sm text-muted-foreground">
                Earn badges by mastering specific skills and completing
                challenges
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Debug Information - REMOVE AFTER FIXING */}
      <div className="mt-6 p-4 border border-dashed border-red-300 rounded-md bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-md font-bold text-red-700 dark:text-red-400 mb-2">
          Debug Information
        </h3>
        <div className="text-sm text-red-600 dark:text-red-400 mb-4">
          <p>Raw DB values:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Experience: {profile?.experience}</li>
            <li>Total XP: {profile?.stats.totalXP}</li>
            <li>DB Level: {profile?.level}</li>
            <li>Experience to Next Level: {profile?.experienceToNextLevel}</li>
          </ul>
          <p className="mt-2">Calculated values:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Calculated Level: {calculatedData?.level}</li>
            <li>Current Level XP: {calculatedData?.currentLevelXP}</li>
            <li>Next Level XP: {calculatedData?.nextLevelXP}</li>
            <li>
              XP Since Current Level: {calculatedData?.xpSinceCurrentLevel}
            </li>
            <li>
              XP Needed For Next Level: {calculatedData?.xpNeededForNextLevel}
            </li>
            <li>
              Progress Percentage:{" "}
              {calculatedData?.progressPercentage?.toFixed(2)}%
            </li>
          </ul>
        </div>
        <div className="flex gap-3">
          <button
            onClick={recalculateLevel}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
          >
            Debug XP Calculation
          </button>
          <button
            onClick={forceUpdateLevel}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
          >
            Force Update Level
          </button>
          <button
            onClick={async () => {
              if (
                window.confirm(
                  "This will recalculate and sync levels for ALL users. Continue?"
                )
              ) {
                try {
                  toast({
                    title: "Syncing levels...",
                    description: "Please wait while we sync all user levels",
                  });

                  const response = await fetch(
                    "/api/gamification/debug/sync-levels",
                    {
                      method: "POST",
                    }
                  );

                  const data = await response.json();

                  if (response.ok) {
                    toast({
                      title: "Levels Synced",
                      description: data.message,
                      variant: "default",
                    });

                    // Refresh the data
                    queryClient.invalidateQueries({
                      queryKey: ["gamification", "profile"],
                    });
                  } else {
                    toast({
                      title: "Error",
                      description: data.error || "Failed to sync levels",
                      variant: "destructive",
                    });
                  }
                } catch (error) {
                  console.error("Error syncing levels:", error);
                  toast({
                    title: "Error",
                    description:
                      "Failed to sync levels. Check console for details.",
                    variant: "destructive",
                  });
                }
              }
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Sync All Levels
          </button>
        </div>
      </div>
    </div>
  );
}
