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
import { toast } from "@/components/ui/use-toast";

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

export function DashboardStats() {
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* User Statistics */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-800 text-lg font-semibold">
            User Statistics
          </CardTitle>
          <CardDescription className="text-blue-600">
            Platform user activity and growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">
                {stats.users.total}
              </p>
            </div>
            <div className="bg-white/40 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700">
                New Users (Today)
              </p>
              <p className="text-xl font-semibold text-blue-800">
                {stats.users.newToday}
              </p>
            </div>
            <div className="bg-white/40 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700">
                Active Users (This Week)
              </p>
              <p className="text-xl font-semibold text-blue-800">
                {stats.users.activeThisWeek}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Statistics */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-purple-800 text-lg font-semibold">
            School Statistics
          </CardTitle>
          <CardDescription className="text-purple-600">
            School and branch overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-sm font-medium text-purple-700">
                Total Schools
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {stats.schools.total}
              </p>
            </div>
            <div className="bg-white/40 rounded-lg p-3">
              <p className="text-sm font-medium text-purple-700">
                Active Schools
              </p>
              <p className="text-xl font-semibold text-purple-800">
                {stats.schools.active}
              </p>
            </div>
            <div className="bg-white/40 rounded-lg p-3">
              <p className="text-sm font-medium text-purple-700">
                Total Branches
              </p>
              <p className="text-xl font-semibold text-purple-800">
                {stats.schools.branches}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Overview */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 text-lg font-semibold">
            Feedback Overview
          </CardTitle>
          <CardDescription className="text-green-600">
            User feedback and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-sm font-medium text-green-700">
                Total Feedback
              </p>
              <p className="text-3xl font-bold text-green-900">
                {stats.feedback.total}
              </p>
            </div>
            <div className="bg-white/40 rounded-lg p-3">
              <p className="text-sm font-medium text-green-700">
                Unresolved Feedback
              </p>
              <p className="text-xl font-semibold text-green-800">
                {stats.feedback.unresolved}
              </p>
            </div>
            <div className="bg-white/40 rounded-lg p-3">
              <p className="text-sm font-medium text-green-700">
                Average Rating
              </p>
              <p className="text-xl font-semibold text-green-800">
                {stats.feedback.averageRating.toFixed(1)} / 5.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
