"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

interface StatsProps {
  variant?: "default" | "overview";
}

interface AdminStats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    activeToday: number;
    activeThisWeek: number;
    activeThisMonth: number;
    growth: Array<{
      _id: { year: number; month: number };
      count: number;
    }>;
  };
  schools: {
    total: number;
    active: number;
    branches: number;
    studentsTotal: number;
  };
  feedback: {
    total: number;
    unresolved: number;
    averageRating: number;
  };
}

export function DashboardStats({ variant = "default" }: StatsProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Failed to load admin statistics");
        toast({
          title: "Error",
          description: "Failed to load admin statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center p-4 text-red-500">
        {error || "Failed to load statistics"}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* User Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Platform user activity and growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold">{stats.users.total}</p>
            </div>
            <div>
              <p className="text-sm font-medium">New Users (Today)</p>
              <p className="text-xl">{stats.users.newToday}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Active Users (This Week)</p>
              <p className="text-xl">{stats.users.activeThisWeek}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>School Statistics</CardTitle>
          <CardDescription>School and branch overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Total Schools</p>
              <p className="text-2xl font-bold">{stats.schools.total}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Active Schools</p>
              <p className="text-xl">{stats.schools.active}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Branches</p>
              <p className="text-xl">{stats.schools.branches}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Overview</CardTitle>
          <CardDescription>User feedback and ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Total Feedback</p>
              <p className="text-2xl font-bold">{stats.feedback.total}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Unresolved Feedback</p>
              <p className="text-xl">{stats.feedback.unresolved}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Average Rating</p>
              <p className="text-xl">
                {stats.feedback.averageRating.toFixed(1)} / 5.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
