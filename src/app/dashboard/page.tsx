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
    <div className="space-y-8">
      {/* Show message for school users redirected from pricing */}
      {showSchoolUserMessage && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>School User Notice</AlertTitle>
          <AlertDescription>
            As a school user, your subscription is managed by your school
            administrator. Individual pricing plans are not available for school
            accounts.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl backdrop-blur-sm border border-muted/10">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="text-gradient">{userName}</span>!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your language learning progress
        </p>
      </div>

      {/* GamificationProfileStats replaces UserStats */}
      <GamificationProfileStats />
    </div>
  );
}
