"use client";

import { useState } from "react";
import { Trophy, Users, Flame, Award, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeaderboard } from "@/hooks/use-gamification";

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  value: number;
  rank: number;
}

export function LeaderboardComponent() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "all-time">(
    "weekly"
  );
  const [category, setCategory] = useState<"xp" | "streak" | "module-specific">(
    "xp"
  );
  const [module, setModule] = useState<string | undefined>(undefined);

  const {
    data: leaderboard,
    isLoading,
    error,
  } = useLeaderboard(timeframe, category, module);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as "weekly" | "monthly" | "all-time");
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as "xp" | "streak" | "module-specific");

    // Reset module selection if we're not on module-specific
    if (value !== "module-specific") {
      setModule(undefined);
    } else {
      // Default to reading module
      setModule("reading");
    }
  };

  const handleModuleChange = (value: string) => {
    setModule(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            Sorry, we couldn't load the leaderboard data. Please try again
            later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Default empty array if no data yet
  const entries = leaderboard?.entries || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              See how you rank against other learners
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2">
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xp">XP Gained</SelectItem>
                <SelectItem value="streak">Streak Days</SelectItem>
                <SelectItem value="module-specific">By Module</SelectItem>
              </SelectContent>
            </Select>

            {category === "module-specific" && (
              <Select value={module} onValueChange={handleModuleChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry: LeaderboardEntry, index: number) => {
              const getRankStyle = (rank: number) => {
                switch (rank) {
                  case 1:
                    return "bg-yellow-500/10 text-yellow-500";
                  case 2:
                    return "bg-slate-400/10 text-slate-400";
                  case 3:
                    return "bg-amber-700/10 text-amber-700";
                  default:
                    return "bg-muted/10 text-muted-foreground";
                }
              };

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-muted/20 hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${getRankStyle(
                        entry.rank
                      )}`}
                    >
                      {entry.rank}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-sm">
                        {entry.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                      {entry.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {category === "xp" && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                    {category === "streak" && (
                      <Flame className="h-4 w-4 text-orange-500" />
                    )}
                    {category === "module-specific" && (
                      <Award className="h-4 w-4 text-purple-500" />
                    )}
                    <span className="font-bold text-sm">{entry.value}</span>
                    <span className="text-xs text-muted-foreground">
                      {category === "xp" && "XP"}
                      {category === "streak" && "days"}
                      {category === "module-specific" && "activities"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No Data Yet</h3>
            <p className="text-sm text-muted-foreground">
              {category === "xp" && "Be the first to top the XP leaderboard!"}
              {category === "streak" &&
                "Start a streak to appear on the leaderboard!"}
              {category === "module-specific" &&
                `Complete ${module} activities to rank!`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
