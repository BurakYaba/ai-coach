"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trophy,
  Medal,
  Activity,
  Clock,
  BookOpen,
  Target,
  Eye,
  CalendarDays,
} from "lucide-react";
import debounce from "lodash/debounce";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  formatPracticeTime,
  formatReminderTiming,
} from "@/lib/formatting/display-formatters";

interface ModuleActivity {
  reading: number;
  writing: number;
  speaking: number;
  grammar: number;
  vocabulary: number;
  games: number;
}

interface ModuleMetrics {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  timeSpent: number;
  itemsCompleted: number;
  wordCount?: number;
  uniqueWords?: number;
  accuracy?: number;
}

interface UserAnalyticsData {
  _id: string;
  name: string;
  email: string;
  totalSessions: number;
  lastActive: string;
  registeredAt: string;
  moduleActivity: ModuleActivity;
  completionRates: Record<string, number>;
  detailedMetrics: Record<string, ModuleMetrics>;
  activityTrends: Record<
    string,
    Array<{ date: string; sessions: number; xp: number }>
  >;
  gamification: {
    level: number;
    experience: number;
    streak: {
      current: number;
      longest: number;
    };
    achievements: number;
    badges: number;
    stats: {
      totalXP: number;
      activeDays: number;
      moduleActivity: ModuleActivity;
    };
  };
  progress: {
    level: string;
    xp: number;
    streak: number;
  };
  onboarding: {
    completed: boolean;
    currentStep: number;
    language: "en" | "tr";
    nativeLanguage: string;
    country: string;
    region: string;
    preferredPracticeTime: string;
    preferredLearningDays: string[];
    reminderTiming: string;
    reasonsForLearning: string[];
    howHeardAbout: string;
    dailyStudyTimeGoal: number;
    weeklyStudyTimeGoal: number;
    consentDataUsage: boolean;
    consentAnalytics: boolean;
    completedAt: string | null;
  };
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

interface UserDetailsModalProps {
  user: UserAnalyticsData;
}

function UserDetailsModal({ user }: UserDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1000px] !w-[1000px] max-h-[85vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-full">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
            <DialogTitle className="text-3xl font-bold">
              {user.name}'s Learning Analytics
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-5 gap-2 mb-6 bg-white/60 backdrop-blur-sm p-1 rounded-xl">
                <TabsTrigger
                  value="overview"
                  className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-all duration-300"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="modules"
                  className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-all duration-300"
                >
                  Module Details
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-all duration-300"
                >
                  Progress
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-all duration-300"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="onboarding"
                  className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-all duration-300"
                >
                  Onboarding
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        User Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            Email:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {user.email}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            Registered:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {new Date(user.registeredAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            Last Active:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {new Date(user.lastActive).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            Total Sessions:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {user.totalSessions}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Gamification Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-900">
                              {user.gamification.level}
                            </div>
                            <div className="text-sm text-purple-700">Level</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-900">
                              {user.gamification.stats.totalXP}
                            </div>
                            <div className="text-sm text-purple-700">
                              Total XP
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-900">
                              {user.gamification.streak.current}
                            </div>
                            <div className="text-sm text-purple-700">
                              Current Streak
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-900">
                              {user.gamification.streak.longest}
                            </div>
                            <div className="text-sm text-purple-700">
                              Longest Streak
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-purple-800">
                            Level Progress
                          </div>
                          <Progress
                            value={(user.gamification.experience / 100) * 100}
                            className="h-2"
                          />
                          <div className="text-xs text-purple-700 text-right">
                            {user.gamification.experience}/100 XP
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="modules">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(user.detailedMetrics).map(
                    ([moduleName, metrics]) => (
                      <Card
                        key={moduleName}
                        className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg capitalize text-green-800 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {moduleName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="bg-white/60 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-green-700 text-sm">
                                Score:
                              </span>
                              <span className="font-semibold text-green-900">
                                {metrics.averageScore}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700 text-sm">
                                Sessions:
                              </span>
                              <span className="font-semibold text-green-900">
                                {metrics.completedSessions}/
                                {metrics.totalSessions}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700 text-sm">
                                Time:
                              </span>
                              <span className="font-semibold text-green-900">
                                {Math.floor(metrics.timeSpent / 60)}h{" "}
                                {metrics.timeSpent % 60}m
                              </span>
                            </div>
                            {metrics.accuracy !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-green-700 text-sm">
                                  Accuracy:
                                </span>
                                <span className="font-semibold text-green-900">
                                  {metrics.accuracy}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-green-800">
                              Completion Rate
                            </div>
                            <Progress
                              value={user.completionRates[moduleName]}
                              className="h-2"
                            />
                            <div className="text-xs text-green-700 text-right">
                              {user.completionRates[moduleName]}%
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="progress">
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-yellow-800 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-white/60 rounded-lg p-6 text-center">
                        <div className="text-lg font-medium text-yellow-800 mb-2">
                          Current Level
                        </div>
                        <div className="text-4xl font-bold text-yellow-900 mb-2">
                          {user.gamification.level}
                        </div>
                        <div className="text-sm text-yellow-700">
                          {user.gamification.experience}/100 XP to next level
                        </div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-6 text-center">
                        <div className="text-lg font-medium text-yellow-800 mb-2">
                          Total Experience
                        </div>
                        <div className="text-4xl font-bold text-yellow-900 mb-2">
                          {user.gamification.stats.totalXP}
                        </div>
                        <div className="text-sm text-yellow-700">
                          Lifetime XP earned
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      {Object.entries(user.activityTrends).map(
                        ([moduleName, trend]) => {
                          // Calculate max sessions for proper scaling
                          const maxSessions = Math.max(
                            ...trend.slice(-7).map(day => day.sessions),
                            1
                          );

                          return (
                            <div
                              key={moduleName}
                              className="bg-white/60 rounded-lg p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium capitalize text-indigo-800">
                                  {moduleName}
                                </span>
                                <span className="text-sm text-indigo-600">
                                  Last 7 days
                                </span>
                              </div>
                              <div className="h-32 flex items-end gap-2">
                                {trend.slice(-7).map((day, index) => {
                                  const heightPercentage =
                                    maxSessions > 0
                                      ? (day.sessions / maxSessions) * 100
                                      : 0;

                                  return (
                                    <div
                                      key={`${day.date}-${index}`}
                                      className="flex-1 bg-indigo-400/60 rounded-t hover:bg-indigo-500/70 transition-colors relative group"
                                      style={{
                                        height: `${heightPercentage}%`,
                                        minHeight:
                                          day.sessions > 0 ? "4px" : "2px",
                                      }}
                                    >
                                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white text-slate-800 text-sm rounded px-3 py-1.5 whitespace-nowrap shadow-lg border z-10">
                                        {new Date(
                                          day.date
                                        ).toLocaleDateString()}
                                        <br />
                                        Sessions: {day.sessions}
                                        <br />
                                        XP: {day.xp}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="text-xs text-indigo-600 text-center">
                                Max: {maxSessions} sessions
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="onboarding">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-cyan-800 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Onboarding Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-white/60 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-cyan-700 text-sm">
                              Status:
                            </span>
                            <Badge
                              variant={
                                user.onboarding.completed
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.onboarding.completed
                                ? "Completed"
                                : "Incomplete"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-cyan-700 text-sm">
                              Current Step:
                            </span>
                            <span className="font-semibold text-cyan-900">
                              {user.onboarding.currentStep}/5
                            </span>
                          </div>
                          {user.onboarding.completedAt && (
                            <div className="flex justify-between items-center">
                              <span className="text-cyan-700 text-sm">
                                Completed:
                              </span>
                              <span className="font-semibold text-cyan-900">
                                {new Date(
                                  user.onboarding.completedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
                          <CalendarDays className="h-5 w-5" />
                          Language & Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-white/60 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-emerald-700 text-sm">
                              Native Language:
                            </span>
                            <span className="font-semibold text-emerald-900 capitalize">
                              {user.onboarding.nativeLanguage ||
                                "Not specified"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-emerald-700 text-sm">
                              App Language:
                            </span>
                            <span className="font-semibold text-emerald-900 uppercase">
                              {user.onboarding.language}
                            </span>
                          </div>
                          {user.onboarding.country && (
                            <div className="flex justify-between items-center">
                              <span className="text-emerald-700 text-sm">
                                Country:
                              </span>
                              <span className="font-semibold text-emerald-900">
                                {user.onboarding.country}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-violet-50 to-purple-100 border-violet-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-violet-800 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Study Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-violet-700 mb-1">
                              Preferred Practice Time
                            </div>
                            <div className="font-semibold text-violet-900">
                              {formatPracticeTime(
                                user.onboarding.preferredPracticeTime
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-violet-700 mb-1">
                              Reminder Timing
                            </div>
                            <div className="font-semibold text-violet-900">
                              {formatReminderTiming(
                                user.onboarding.reminderTiming
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-violet-700 mb-2">
                            Learning Days
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.onboarding.preferredLearningDays.length >
                            0 ? (
                              user.onboarding.preferredLearningDays.map(day => (
                                <Badge
                                  key={day}
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {day}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-violet-600 text-sm">
                                No days specified
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-violet-700 mb-1">
                              Daily Goal
                            </div>
                            <div className="font-semibold text-violet-900">
                              {user.onboarding.dailyStudyTimeGoal || 0} minutes
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-violet-700 mb-1">
                              Weekly Goal
                            </div>
                            <div className="font-semibold text-violet-900">
                              {user.onboarding.weeklyStudyTimeGoal || 0} minutes
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Learning Goals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-white/60 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2">
                            {user.onboarding.reasonsForLearning.length > 0 ? (
                              user.onboarding.reasonsForLearning.map(reason => (
                                <Badge
                                  key={reason}
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {reason.replace("_", " ")}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-orange-600 text-sm">
                                No goals specified
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-teal-800 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Discovery & Consent
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-white/60 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-teal-700 text-sm">
                              Heard About Us:
                            </span>
                            <span className="font-semibold text-teal-900 capitalize text-right max-w-[150px]">
                              {user.onboarding.howHeardAbout.replace(
                                "_",
                                " "
                              ) || "Not specified"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-teal-700 text-sm">
                              Data Usage:
                            </span>
                            <Badge
                              variant={
                                user.onboarding.consentDataUsage
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.onboarding.consentDataUsage
                                ? "Consented"
                                : "Not consented"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-teal-700 text-sm">
                              Analytics:
                            </span>
                            <Badge
                              variant={
                                user.onboarding.consentAnalytics
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.onboarding.consentAnalytics
                                ? "Consented"
                                : "Not consented"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UserAnalytics() {
  const [users, setUsers] = useState<UserAnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("lastActive");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 10,
  });

  const fetchUserAnalytics = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: pagination.perPage.toString(),
          search: searchTerm,
        });

        // Add module filter
        if (moduleFilter && moduleFilter !== "all") {
          searchParams.append("module", moduleFilter);
        }

        // Add date range filters
        if (dateFrom) {
          searchParams.append("dateFrom", dateFrom);
        }
        if (dateTo) {
          searchParams.append("dateTo", dateTo);
        }

        const response = await fetch(
          `/api/admin/analytics/users?${searchParams.toString()}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch user analytics");
        }

        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err: any) {
        console.error("Error fetching user analytics:", err);
        const errorMessage = err.message || "Failed to load user analytics";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [pagination.perPage, searchTerm, moduleFilter, dateFrom, dateTo]
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(() => {
      fetchUserAnalytics(1);
    }, 300),
    [fetchUserAnalytics]
  );

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    fetchUserAnalytics(pagination.currentPage);
  }, [pagination.currentPage, fetchUserAnalytics]);

  // Trigger search when filters change
  useEffect(() => {
    if (pagination.currentPage === 1) {
      fetchUserAnalytics(1);
    } else {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  }, [moduleFilter, dateFrom, dateTo, fetchUserAnalytics]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    try {
      // Create CSV content
      const csvHeaders = [
        "Name",
        "Email",
        "Level",
        "Total XP",
        "Current Streak",
        "Total Sessions",
        "Last Active",
        "Reading Sessions",
        "Writing Sessions",
        "Speaking Sessions",
        "Grammar Sessions",
        "Vocabulary Sessions",
        "Games Sessions",
      ];

      const csvData = users.map(user => [
        user.name,
        user.email,
        user.gamification.level,
        user.gamification.stats.totalXP,
        user.gamification.streak.current,
        user.totalSessions,
        new Date(user.lastActive).toLocaleString(),
        user.moduleActivity.reading,
        user.moduleActivity.writing,
        user.moduleActivity.speaking,
        user.moduleActivity.grammar,
        user.moduleActivity.vocabulary,
        user.moduleActivity.games,
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map((row: (string | number)[]) =>
          row
            .map((cell: string | number) =>
              typeof cell === "string" &&
              (cell.includes(",") || cell.includes('"') || cell.includes("\n"))
                ? `"${cell.replace(/"/g, '""')}"`
                : cell
            )
            .join(",")
        ),
      ].join("\n");

      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `user_analytics_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: "Analytics data has been exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  if (error) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={() => fetchUserAnalytics(pagination.currentPage)}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-64 pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[120px] justify-start"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {moduleFilter === "all"
                    ? "All Modules"
                    : moduleFilter.charAt(0).toUpperCase() +
                      moduleFilter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setModuleFilter("all")}>
                  All Modules
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("reading")}>
                  Reading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("writing")}>
                  Writing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("speaking")}>
                  Speaking
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("grammar")}>
                  Grammar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("vocabulary")}>
                  Vocabulary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("games")}>
                  Games
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg border">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Activity Date Range:</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dateFrom" className="text-sm">
              From:
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dateTo" className="text-sm">
              To:
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-40"
            />
          </div>
          {(dateFrom || dateTo) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear Dates
            </Button>
          )}
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {users.map(user => (
            <Card key={user._id} className="overflow-hidden">
              <CardHeader className="pb-2 space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {user.email}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    Level {user.gamification.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {user.gamification.stats.totalXP}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total XP
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {user.gamification.streak.current}
                    </div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {user.gamification.achievements}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Achievements
                    </div>
                  </div>
                </div>

                {/* Module Activity */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Module Activity</h4>
                  <div className="space-y-1.5">
                    {Object.entries(user.moduleActivity).map(
                      ([moduleName, count]) => (
                        <div key={moduleName} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="capitalize">{moduleName}</span>
                            <span>{count}</span>
                          </div>
                          <Progress
                            value={(count / user.totalSessions) * 100}
                            className="h-1"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Last Active */}
                <div className="text-xs text-muted-foreground">
                  Last active: {new Date(user.lastActive).toLocaleDateString()}
                </div>

                {/* View Details Button */}
                <UserDetailsModal user={user} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to{" "}
          {Math.min(
            pagination.currentPage * pagination.perPage,
            pagination.total
          )}{" "}
          of {pagination.total} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                page =>
                  page === 1 ||
                  page === pagination.pages ||
                  Math.abs(page - pagination.currentPage) <= 1
              )
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    variant={
                      pagination.currentPage === page ? "default" : "outline"
                    }
                    size="icon"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.pages)}
            disabled={pagination.currentPage === pagination.pages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
