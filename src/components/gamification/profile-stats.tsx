"use client";

import { useState } from "react";
import { Calendar, Target, Award, Star, BarChart3 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useGamificationProfile,
  useUserAchievements,
  useUserBadges,
} from "@/hooks/use-gamification";

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

export function GamificationProfileStats() {
  const { data: profile, isLoading: profileLoading } = useGamificationProfile();
  const { data: achievements, isLoading: achievementsLoading } =
    useUserAchievements();
  const { data: badges, isLoading: badgesLoading } = useUserBadges();
  const [activeTab, setActiveTab] = useState<"achievements" | "badges">(
    "achievements"
  );

  // Calculate the XP thresholds and current progress using the new function
  const calculatedData = profile
    ? calculateLevelAndProgress(profile.experience)
    : null;

  // Use calculated data or fallbacks
  const displayLevel = calculatedData?.level || 1;
  const xpSinceCurrentLevel = calculatedData?.xpSinceCurrentLevel || 0;
  const xpNeededForNextLevel = calculatedData?.xpNeededForNextLevel || 100;
  const progressPercentage = calculatedData?.progressPercentage || 0;

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
        </div>
        <Skeleton className="h-8 w-1/4 mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="p-4 border border-red-200 bg-red-50 rounded-md">
        <p className="text-red-700">
          Profile data could not be loaded. Please try again later.
        </p>
      </div>
    );
  }

  // Calculate activity data
  const activities = [
    {
      name: "Reading",
      count: profile.stats.moduleActivity.reading,
      color: "bg-blue-500",
    },
    {
      name: "Writing",
      count: profile.stats.moduleActivity.writing,
      color: "bg-green-500",
    },
    {
      name: "Listening",
      count: profile.stats.moduleActivity.listening,
      color: "bg-yellow-500",
    },
    {
      name: "Speaking",
      count: profile.stats.moduleActivity.speaking,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Your Learning Journey
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Level & XP Card */}
        <div
          className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          data-tour="level-xp-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Level & XP</h3>
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex items-end space-x-3 mb-3">
            <span className="text-3xl font-bold text-gray-800">
              Level {displayLevel}
            </span>
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-1">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Progress to Level {displayLevel + 1}
              </span>
              <span className="font-medium text-gray-800">
                {xpSinceCurrentLevel} / {xpNeededForNextLevel} XP
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="text-right text-sm text-gray-500">
              {profile.stats.totalXP} Total XP
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div
          className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          data-tour="streak-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Learning Streak
            </h3>
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex items-end space-x-2 mb-3">
            <span className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
              {profile.streak.current} days
            </span>
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mb-1">
              <span className="text-white text-xs">🔥</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                📅 Longest: {profile.streak.longest} days
              </span>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-2 rounded-lg border border-red-100">
              <p className="text-sm text-red-700 font-medium">
                Keep learning daily to maintain your streak!
              </p>
            </div>

            <div className="text-sm text-gray-500">
              {profile.stats.activeDays} active days total
            </div>
          </div>
        </div>

        {/* Activity Breakdown Card */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Activity Breakdown
            </h3>
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activities.map(activity => (
              <div key={activity.name} className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  {activity.count}
                </div>
                <div className="text-sm text-gray-600">{activity.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements and Badges */}
      <div className="space-y-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 rounded-full font-medium shadow-lg transition-all duration-200 ${
              activeTab === "achievements"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Achievements ({achievements?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === "badges"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Badges ({badges?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div data-tour="achievements-section">
          {activeTab === "achievements" ? (
            achievementsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
              </div>
            ) : achievements && achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {achievement.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {achievement.unlockedAt
                              ? new Date(
                                  achievement.unlockedAt
                                ).toLocaleDateString()
                              : "Not unlocked"}
                          </span>
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Milestone
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">
                  No Achievements Yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete learning activities to earn achievements
                </p>
              </div>
            )
          ) : badgesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
            </div>
          ) : badges && badges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {badge.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {badge.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {badge.unlockedAt
                            ? new Date(badge.unlockedAt).toLocaleDateString()
                            : "Not unlocked"}
                        </span>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            badge.tier === "gold"
                              ? "bg-yellow-100 text-yellow-700"
                              : badge.tier === "silver"
                                ? "bg-gray-100 text-gray-700"
                                : badge.tier === "bronze"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {badge.tier?.charAt(0).toUpperCase() +
                            badge.tier?.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  );
}
