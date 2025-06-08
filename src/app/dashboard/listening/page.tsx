import { AlertCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { LibraryBrowser } from "@/components/listening/LibraryBrowser";
import { ListeningStats } from "@/components/listening/ListeningStats";
import {
  SessionList,
  SessionSkeleton,
} from "@/components/listening/SessionList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";
import ListeningTourManager from "@/components/tours/ListeningTourManager";
import ListeningTourTrigger from "@/components/tours/ListeningTourTrigger";

export const metadata: Metadata = {
  title: "Listening Practice | Language Coach",
  description: "Improve your listening skills with personalized audio content",
};

function LibraryBrowserSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 bg-muted" />
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <div className="mt-4 flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Skeleton className="h-8 w-[200px]" />
      </div>
    </div>
  );
}

export default async function ListeningDashboardPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    error?: string;
    success?: string;
    tab?: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Handle success and error messages from URL parameters
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  // Set error message based on URL parameter
  if (searchParams.error) {
    switch (searchParams.error) {
      case "invalid-id":
        errorMessage = "Invalid session ID. Please try again.";
        break;
      case "not-found":
        errorMessage = "Listening session not found.";
        break;
      case "delete-failed":
        errorMessage = "Failed to delete listening session. Please try again.";
        break;
      default:
        errorMessage = "An error occurred. Please try again.";
    }
  }

  // Set success message based on URL parameter
  if (searchParams.success === "deleted") {
    successMessage = "Listening session deleted successfully.";
  }

  // Determine default tab (can be controlled via URL parameter)
  const defaultTab = searchParams.tab || "library";

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6">
      <div className="mb-6" data-tour="listening-header">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Listening Practice
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Improve your listening skills with curated and personalized audio
              content
            </p>
          </div>
          <div className="flex-shrink-0">
            <ListeningTourTrigger />
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-6 bg-green-50 text-green-800 border border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList
          data-tour="listening-tabs"
          className="grid w-full grid-cols-4 text-xs sm:text-sm"
        >
          <TabsTrigger value="library" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Listening Library</span>
            <span className="sm:hidden">Library</span>
          </TabsTrigger>
          <TabsTrigger value="inprogress" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">In Progress</span>
            <span className="sm:hidden">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            data-tour="progress-tab"
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">My Progress</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <Suspense fallback={<LibraryBrowserSkeleton />}>
            <LibraryBrowser />
          </Suspense>
        </TabsContent>

        <TabsContent value="inprogress" className="space-y-4">
          <Suspense fallback={<SessionSkeleton count={6} />}>
            <SessionList filter="inprogress" />
          </Suspense>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Suspense fallback={<SessionSkeleton count={6} />}>
            <SessionList filter="completed" />
          </Suspense>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Listening Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="h-[200px]">
                    <div className="h-full w-full bg-muted/10 animate-pulse rounded-lg"></div>
                  </div>
                }
              >
                <ListeningStats />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Listening Tour */}
      <ListeningTourManager />
    </div>
  );
}
