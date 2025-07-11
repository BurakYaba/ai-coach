"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertCircle,
  Mail,
  Calendar,
  Clock,
  Users,
  Send,
  RefreshCw,
  TrendingUp,
  Bell,
  PlayCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface NotificationStats {
  total: number;
  sent: number;
  failed: number;
  byType: Record<string, number>;
  recent: Array<{
    userId: string;
    type: string;
    sentAt: string;
    status: string;
    reason?: string;
    provider?: string;
  }>;
}

interface UserStatus {
  studyReminder: {
    shouldSend: boolean;
    reason: string;
    scheduledTime?: string;
  };
  weeklyProgress: {
    shouldSend: boolean;
    reason: string;
  };
}

export default function NotificationAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [testUserId, setTestUserId] = useState("");
  const [lastResult, setLastResult] = useState<any>(null);

  // Handle authentication
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  // Load initial stats
  useEffect(() => {
    if (status === "authenticated") {
      loadStats();
    }
  }, [status]);

  const loadStats = async (userId?: string) => {
    try {
      const url = userId
        ? `/api/notifications/schedule?userId=${userId}`
        : "/api/notifications/schedule";

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setUserStatus(data.userStatus || null);
      } else {
        toast({
          title: "Error",
          description: "Failed to load notification stats",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
      toast({
        title: "Error",
        description: "Failed to load notification stats",
        variant: "destructive",
      });
    }
  };

  const runNotificationAction = async (
    action: string,
    userId?: string,
    type?: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          userId,
          type,
        }),
      });

      const data = await response.json();
      setLastResult(data);

      if (data.success) {
        toast({
          title: "Success",
          description: `Action "${action}" completed successfully`,
        });

        // Reload stats after successful action
        await loadStats(testUserId || undefined);
      } else {
        toast({
          title: "Error",
          description: data.error || "Action failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error running action:", error);
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserEligibility = async () => {
    if (!testUserId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive",
      });
      return;
    }

    await loadStats(testUserId);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-50"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Notification Management
            </h1>
            <p className="text-gray-600">
              Test and manage study reminders and weekly progress reports
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Notifications</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Successfully Sent</p>
                    <p className="text-2xl font-bold">{stats.sent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-red-100">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-2xl font-bold">{stats.failed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-100">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.total > 0
                        ? Math.round((stats.sent / stats.total) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="bulk" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Bulk Actions
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              User Testing
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Notification Logs
            </TabsTrigger>
          </TabsList>

          {/* Bulk Actions Tab */}
          <TabsContent value="bulk" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-100">
                      <Bell className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle>Study Reminders</CardTitle>
                      <CardDescription>
                        Process study reminders for all eligible users
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Sends study reminders to users based on their preferred
                    study time and reminder settings.
                  </p>
                  <Button
                    onClick={() =>
                      runNotificationAction("process_study_reminders")
                    }
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Process Study Reminders
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Weekly Progress Reports</CardTitle>
                      <CardDescription>
                        Send weekly progress reports to all eligible users
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Sends comprehensive weekly progress reports every Monday
                    morning.
                  </p>
                  <Button
                    onClick={() =>
                      runNotificationAction("process_weekly_reports")
                    }
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Process Weekly Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Process All Notifications
                </CardTitle>
                <CardDescription>
                  Run both study reminders and weekly progress reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runNotificationAction("process_all")}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4 mr-2" />
                  )}
                  Process All Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Testing Tab */}
          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test User Notifications</CardTitle>
                <CardDescription>
                  Test notification eligibility and sending for a specific user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="userId"
                      placeholder="Enter user ID"
                      value={testUserId}
                      onChange={e => setTestUserId(e.target.value)}
                    />
                    <Button
                      onClick={checkUserEligibility}
                      disabled={loading || !testUserId.trim()}
                    >
                      Check Status
                    </Button>
                  </div>
                </div>

                {userStatus && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium">User Notification Status</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Study Reminder</span>
                            <Badge
                              variant={
                                userStatus.studyReminder.shouldSend
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {userStatus.studyReminder.shouldSend
                                ? "Eligible"
                                : "Not Eligible"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {userStatus.studyReminder.reason}
                          </p>
                          {userStatus.studyReminder.scheduledTime && (
                            <p className="text-xs text-gray-500 mt-1">
                              Scheduled:{" "}
                              {new Date(
                                userStatus.studyReminder.scheduledTime
                              ).toLocaleTimeString()}
                            </p>
                          )}
                          <Button
                            onClick={() =>
                              runNotificationAction(
                                "test_user_reminder",
                                testUserId
                              )
                            }
                            disabled={loading}
                            size="sm"
                            className="mt-2 w-full"
                          >
                            Send Test Reminder
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Weekly Progress</span>
                            <Badge
                              variant={
                                userStatus.weeklyProgress.shouldSend
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {userStatus.weeklyProgress.shouldSend
                                ? "Eligible"
                                : "Not Eligible"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {userStatus.weeklyProgress.reason}
                          </p>
                          <Button
                            onClick={() =>
                              runNotificationAction(
                                "test_user_weekly",
                                testUserId
                              )
                            }
                            disabled={loading}
                            size="sm"
                            className="mt-2 w-full"
                          >
                            Send Test Report
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notification Logs</CardTitle>
                <CardDescription>
                  Recent notification attempts and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recent && stats.recent.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recent.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              log.status === "sent" ? "default" : "destructive"
                            }
                          >
                            {log.status}
                          </Badge>
                          <span className="font-medium">{log.type}</span>
                          <span className="text-sm text-gray-600">
                            User: {log.userId.slice(-8)}
                          </span>
                          {log.provider && (
                            <Badge variant="outline" className="text-xs">
                              {log.provider === "resend"
                                ? "📧 Resend"
                                : "📮 SMTP"}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(log.sentAt).toLocaleString()}
                          </p>
                          {log.reason && (
                            <p className="text-xs text-gray-500">
                              {log.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No notification logs available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Last Result Display */}
        {lastResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Last Action Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(lastResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => loadStats(testUserId || undefined)}
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Stats
          </Button>
        </div>
      </div>
    </div>
  );
}
