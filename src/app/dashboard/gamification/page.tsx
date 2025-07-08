import { Suspense } from "react";
import { CircleUser, Flame, Users, Target, LayoutGrid } from "lucide-react";

import { GamificationProfileStats } from "@/components/gamification/profile-stats";
import { LeaderboardComponent } from "@/components/gamification/leaderboard";
import { ChallengesComponent } from "@/components/gamification/challenges";
import { LearningGroupsComponent } from "@/components/gamification/learning-groups";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { ModuleProgress } from "@/components/gamification/module-progress";
import { ModuleAchievements } from "@/components/gamification/module-achievements";

export default function GamificationPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Gamification Dashboard
        </h1>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <CircleUser className="h-4 w-4" />
            <span className="hidden sm:inline">My Profile</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboards" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboards</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Learning Groups</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Module Stats</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            My Learning Profile
          </h2>
          <Suspense fallback={<div>Loading profile...</div>}>
            <GamificationProfileStats />
          </Suspense>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboards" className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Leaderboards
          </h2>
          <Suspense fallback={<div>Loading leaderboard...</div>}>
            <LeaderboardComponent />
          </Suspense>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Daily & Weekly Challenges
          </h2>
          <Suspense fallback={<div>Loading challenges...</div>}>
            <ChallengesComponent />
          </Suspense>
        </TabsContent>

        {/* Learning Groups Tab */}
        <TabsContent value="groups" className="space-y-8">
          <Suspense fallback={<div>Loading learning groups...</div>}>
            <LearningGroupsComponent />
          </Suspense>
        </TabsContent>

        {/* Module Stats Tab */}
        <TabsContent value="modules" className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Module-Specific Progress
          </h2>

          <Tabs defaultValue="reading">
            <TabsList className="mb-6">
              <TabsTrigger value="reading">Reading</TabsTrigger>
              <TabsTrigger value="writing">Writing</TabsTrigger>
              <TabsTrigger value="listening">Listening</TabsTrigger>
              <TabsTrigger value="speaking">Speaking</TabsTrigger>
              <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            </TabsList>

            <TabsContent value="reading" className="mt-0">
              <div className="grid grid-cols-1 gap-8">
                <ModuleProgress module="reading" />
                <Separator />
                <ModuleAchievements module="reading" />
              </div>
            </TabsContent>

            <TabsContent value="writing" className="mt-0">
              <div className="grid grid-cols-1 gap-8">
                <ModuleProgress module="writing" />
                <Separator />
                <ModuleAchievements module="writing" />
              </div>
            </TabsContent>

            <TabsContent value="listening" className="mt-0">
              <div className="grid grid-cols-1 gap-8">
                <ModuleProgress module="listening" />
                <Separator />
                <ModuleAchievements module="listening" />
              </div>
            </TabsContent>

            <TabsContent value="speaking" className="mt-0">
              <div className="grid grid-cols-1 gap-8">
                <ModuleProgress module="speaking" />
                <Separator />
                <ModuleAchievements module="speaking" />
              </div>
            </TabsContent>

            <TabsContent value="vocabulary" className="mt-0">
              <div className="grid grid-cols-1 gap-8">
                <ModuleProgress module="vocabulary" />
                <Separator />
                <ModuleAchievements module="vocabulary" />
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
