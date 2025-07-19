"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Clock, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Challenge {
  id: string;
  description: string;
  module: string;
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
}

interface ChallengeData {
  daily: Challenge[];
  weekly: Challenge[];
  refreshedAt: string;
  expiresAt: string;
}

// This would typically come from an API call
// For now, we'll use mock data
const mockChallengeData: ChallengeData = {
  daily: [
    {
      id: "daily-1",
      description: "Complete 2 reading sessions",
      module: "reading",
      target: 2,
      progress: 1,
      completed: false,
      xpReward: 50,
    },
    {
      id: "daily-2",
      description: "Review 10 vocabulary words",
      module: "vocabulary",
      target: 10,
      progress: 10,
      completed: true,
      xpReward: 25,
    },
    {
      id: "daily-3",
      description: "Complete 1 listening session",
      module: "listening",
      target: 1,
      progress: 0,
      completed: false,
      xpReward: 30,
    },
  ],
  weekly: [
    {
      id: "weekly-1",
      description: "Maintain a 5-day streak",
      module: "all",
      target: 5,
      progress: 3,
      completed: false,
      xpReward: 100,
    },
    {
      id: "weekly-2",
      description: "Complete 3 writing sessions",
      module: "writing",
      target: 3,
      progress: 2,
      completed: false,
      xpReward: 75,
    },
    {
      id: "weekly-3",
      description: "Master 20 vocabulary words",
      module: "vocabulary",
      target: 20,
      progress: 12,
      completed: false,
      xpReward: 90,
    },
    {
      id: "weekly-4",
      description: "Complete 5 grammar exercises",
      module: "grammar",
      target: 5,
      progress: 5,
      completed: true,
      xpReward: 80,
    },
  ],
  refreshedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
};

export function ChallengesComponent() {
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    mockChallengeData
  );
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, this would make an API call
  const refreshChallenges = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setChallengeData(mockChallengeData);
      setIsLoading(false);
    }, 1000);
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case "reading":
        return "text-blue-500 bg-blue-500/10";
      case "writing":
        return "text-indigo-500 bg-indigo-500/10";
      case "listening":
        return "text-green-500 bg-green-500/10";
      case "speaking":
        return "text-orange-500 bg-orange-500/10";
      case "vocabulary":
        return "text-purple-500 bg-purple-500/10";
      case "grammar":
        return "text-pink-500 bg-pink-500/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  if (!challengeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily & Weekly Challenges</CardTitle>
          <CardDescription>
            No challenge data available. Try refreshing.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={refreshChallenges}>Refresh Challenges</Button>
        </CardFooter>
      </Card>
    );
  }

  const totalDailyProgress = challengeData.daily.reduce((acc, challenge) => {
    return acc + (challenge.completed ? 1 : 0);
  }, 0);

  const totalWeeklyProgress = challengeData.weekly.reduce((acc, challenge) => {
    return acc + (challenge.completed ? 1 : 0);
  }, 0);

  const dailyProgressPercentage =
    (totalDailyProgress / challengeData.daily.length) * 100;
  const weeklyProgressPercentage =
    (totalWeeklyProgress / challengeData.weekly.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Challenges
            </CardTitle>
            <CardDescription>
              Complete challenges to earn XP and rewards
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshChallenges}>
            <Clock className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Daily Challenges
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {totalDailyProgress}/{challengeData.daily.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Weekly Challenges
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {totalWeeklyProgress}/{challengeData.weekly.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Daily Progress</span>
                <span>
                  {totalDailyProgress}/{challengeData.daily.length} completed
                </span>
              </div>
              <Progress value={dailyProgressPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              {challengeData.daily.map(challenge => (
                <div
                  key={challenge.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${getModuleColor(challenge.module)}`}
                      >
                        {challenge.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Target className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          {challenge.description}
                        </h4>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {challenge.module} module • {challenge.xpReward} XP
                          reward
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-xs font-medium ${challenge.completed ? "text-green-500" : "text-muted-foreground"}`}
                    >
                      {challenge.progress}/{challenge.target}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress
                      value={(challenge.progress / challenge.target) * 100}
                      className="h-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Weekly Progress</span>
                <span>
                  {totalWeeklyProgress}/{challengeData.weekly.length} completed
                </span>
              </div>
              <Progress value={weeklyProgressPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              {challengeData.weekly.map(challenge => (
                <div
                  key={challenge.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${getModuleColor(challenge.module)}`}
                      >
                        {challenge.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Target className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          {challenge.description}
                        </h4>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {challenge.module} module • {challenge.xpReward} XP
                          reward
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-xs font-medium ${challenge.completed ? "text-green-500" : "text-muted-foreground"}`}
                    >
                      {challenge.progress}/{challenge.target}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress
                      value={(challenge.progress / challenge.target) * 100}
                      className="h-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
