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

export function GamificationProfileStats() {
  const { data: profile, isLoading: profileLoading } = useGamificationProfile();
  const { data: achievements, isLoading: achievementsLoading } =
    useUserAchievements();
  const { data: badges, isLoading: badgesLoading } = useUserBadges();

  // Calculate progress percentage for current level
  const progressPercentage = profile
    ? (profile.experience /
        (profile.experience + profile.experienceToNextLevel)) *
      100
    : 0;

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
                  Level {profile.level}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {profile.stats.totalXP} Total XP
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress to Level {profile.level + 1}</span>
                <span>
                  {profile.experience} /{" "}
                  {profile.experience + profile.experienceToNextLevel} XP
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
    </div>
  );
}
