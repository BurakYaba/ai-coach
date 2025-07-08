import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { GamificationProfileStats } from "@/components/gamification/profile-stats";
import DashboardTourManager from "@/components/tours/DashboardTourManager";

export const metadata: Metadata = {
  title: "Dashboard | Fluenta",
  description: "Track your language learning progress",
};

// Skeleton loader for the stats
function UserStatsSkeleton() {
  return <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />;
}

// User stats component to load asynchronously
async function UserStats({ userId }: { userId: string }) {
  await dbConnect();
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div className="hidden">
      {" "}
      {/* Hide this component as we're using GamificationProfileStats instead */}
      {/* This is kept as a placeholder since it's referenced elsewhere */}
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  await dbConnect();
  const user = await User.findById(session.user.id);
  const userName = session.user.name || "User";

  // Handle messages from URL parameters
  const showSchoolUserMessage = searchParams.message === "school-user";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Show message for school users redirected from pricing */}
        {showSchoolUserMessage && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>School User Notice</AlertTitle>
            <AlertDescription>
              As a school user, your subscription is managed by your school
              administrator. Individual pricing plans are not available for
              school accounts.
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div
          className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 rounded-2xl shadow-sm border border-indigo-100 mb-8"
          data-tour="dashboard-welcome"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {userName}
            </span>
            !
          </h2>
          <p className="text-gray-600 text-lg">
            Here's an overview of your language learning progress
          </p>
        </div>

        {/* GamificationProfileStats replaces UserStats */}
        <GamificationProfileStats />

        {/* Dashboard Tour */}
        <DashboardTourManager />
      </div>
    </div>
  );
}
