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
        <Button variant="outline" size="sm" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1000px] !w-[1000px] max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {user.name}'s Learning Analytics
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList className="w-full grid grid-cols-4 gap-4 mb-6">
            <TabsTrigger value="overview" className="text-base">
              Overview
            </TabsTrigger>
            <TabsTrigger value="modules" className="text-base">
              Module Details
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-base">
              Progress
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-base">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user.email}</span>
                    <span className="text-muted-foreground">Last Active:</span>
                    <span className="font-medium">
                      {new Date(user.lastActive).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      Total Sessions:
                    </span>
                    <span className="font-medium">{user.totalSessions}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Gamification Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">
                      {user.gamification.level}
                    </span>
                    <span className="text-muted-foreground">Total XP:</span>
                    <span className="font-medium">
                      {user.gamification.stats.totalXP}
                    </span>
                    <span className="text-muted-foreground">
                      Current Streak:
                    </span>
                    <span className="font-medium">
                      {user.gamification.streak.current} days
                    </span>
                    <span className="text-muted-foreground">
                      Longest Streak:
                    </span>
                    <span className="font-medium">
                      {user.gamification.streak.longest} days
                    </span>
                    <span className="text-muted-foreground">Achievements:</span>
                    <span className="font-medium">
                      {user.gamification.achievements}
                    </span>
                    <span className="text-muted-foreground">Badges:</span>
                    <span className="font-medium">
                      {user.gamification.badges}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-base font-medium">Level Progress</div>
                    <Progress
                      value={(user.gamification.experience / 100) * 100}
                      className="h-3"
                    />
                    <div className="text-sm text-muted-foreground text-right">
                      {user.gamification.experience}/100 XP
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(user.detailedMetrics).map(
                ([moduleName, metrics]) => (
                  <Card key={moduleName} className="p-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl capitalize">
                        {moduleName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-base">
                        <span className="text-muted-foreground">
                          Average Score:
                        </span>
                        <span className="font-medium">
                          {metrics.averageScore}%
                        </span>
                        <span className="text-muted-foreground">Sessions:</span>
                        <span className="font-medium">
                          {metrics.completedSessions}/{metrics.totalSessions}
                        </span>
                        <span className="text-muted-foreground">
                          Time Spent:
                        </span>
                        <span className="font-medium">
                          {Math.floor(metrics.timeSpent / 60)}h{" "}
                          {metrics.timeSpent % 60}m
                        </span>
                        <span className="text-muted-foreground">
                          Items Completed:
                        </span>
                        <span className="font-medium">
                          {metrics.itemsCompleted}
                        </span>
                        {metrics.accuracy !== undefined && (
                          <>
                            <span className="text-muted-foreground">
                              Accuracy:
                            </span>
                            <span className="font-medium">
                              {metrics.accuracy}%
                            </span>
                          </>
                        )}
                        {metrics.wordCount !== undefined && (
                          <>
                            <span className="text-muted-foreground">
                              Words:
                            </span>
                            <span className="font-medium">
                              {metrics.wordCount}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="text-base font-medium">
                          Completion Rate
                        </div>
                        <Progress
                          value={user.completionRates[moduleName]}
                          className="h-3"
                        />
                        <div className="text-sm text-muted-foreground text-right">
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
            <Card className="p-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="text-lg font-medium">Current Level</div>
                    <div className="text-4xl font-bold">
                      {user.progress.level}
                    </div>
                    <div className="text-base text-muted-foreground">
                      {user.gamification.experience}/100 XP to next level
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-lg font-medium">Total Experience</div>
                    <div className="text-4xl font-bold">{user.progress.xp}</div>
                    <div className="text-base text-muted-foreground">
                      Lifetime XP earned
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(user.activityTrends).map(
                    ([moduleName, trend]) => (
                      <div key={moduleName} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium capitalize">
                            {moduleName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Last 7 days
                          </span>
                        </div>
                        <div className="h-32 flex items-end gap-2">
                          {trend.slice(-7).map(day => (
                            <div
                              key={day.date}
                              className="flex-1 bg-primary/20 rounded-t hover:bg-primary/30 transition-colors relative group"
                              style={{
                                height: `${(day.sessions / 10) * 100}%`,
                                minHeight: day.sessions ? "4px" : "0",
                              }}
                            >
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover text-popover-foreground text-sm rounded px-3 py-1.5 whitespace-nowrap shadow-md">
                                {new Date(day.date).toLocaleDateString()}
                                <br />
                                Sessions: {day.sessions}
                                <br />
                                XP: {day.xp}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: pagination.perPage.toString(),
          search: searchTerm,
        });

        const response = await fetch(
          `/api/admin/analytics/users?${searchParams.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user analytics");
        }
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Error fetching user analytics:", err);
        setError("Failed to load user analytics");
        toast({
          title: "Error",
          description: "Failed to load user analytics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [pagination.perPage, searchTerm]
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      fetchUserAnalytics(1);
    }, 300),
    [fetchUserAnalytics]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    fetchUserAnalytics(pagination.currentPage);
  }, [pagination.currentPage, fetchUserAnalytics]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics export will begin shortly",
    });
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
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
                <>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    key={page}
                    variant={
                      pagination.currentPage === page ? "default" : "outline"
                    }
                    size="icon"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                </>
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
