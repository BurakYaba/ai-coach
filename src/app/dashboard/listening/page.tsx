import { AlertCircle, Volume2 } from "lucide-react";
import { Metadata } from "next";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-[250px]" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 w-full sm:w-[140px]" />
          <Skeleton className="h-10 w-full sm:w-[140px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8"
          data-tour="listening-header"
        >
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Listening Practice
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Improve your listening skills with curated and personalized audio
              content
            </p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto">
            <ListeningTourTrigger />
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 sm:mb-6 bg-green-50 text-green-800 border border-green-200">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs */}
        <Tabs defaultValue={defaultTab} className="mb-4 sm:mb-6">
          <TabsList
            data-tour="listening-tabs"
            className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white shadow-sm h-auto p-1"
          >
            <TabsTrigger
              value="library"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden xs:inline sm:hidden lg:inline">
                Listening Library
              </span>
              <span className="xs:hidden sm:inline lg:hidden">Library</span>
              <span className="xs:inline sm:hidden lg:hidden">Lib</span>
            </TabsTrigger>
            <TabsTrigger
              value="inprogress"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <span className="hidden xs:inline sm:hidden lg:inline">
                In Progress
              </span>
              <span className="xs:hidden sm:inline lg:hidden">Progress</span>
              <span className="xs:inline sm:hidden lg:hidden">Prog</span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <span className="hidden xs:inline">Completed</span>
              <span className="xs:inline sm:hidden">Done</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              data-tour="progress-tab"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <span className="hidden xs:inline sm:hidden lg:inline">
                My Progress
              </span>
              <span className="xs:hidden sm:inline lg:hidden">Stats</span>
              <span className="xs:inline sm:hidden lg:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="library" className="mt-4 sm:mt-6">
            <Suspense fallback={<LibraryBrowserSkeleton />}>
              <LibraryBrowser />
            </Suspense>
          </TabsContent>

          <TabsContent value="inprogress" className="mt-4 sm:mt-6">
            <Suspense fallback={<SessionSkeleton count={6} />}>
              <SessionList filter="inprogress" />
            </Suspense>
          </TabsContent>

          <TabsContent value="completed" className="mt-4 sm:mt-6">
            <Suspense fallback={<SessionSkeleton count={6} />}>
              <SessionList filter="completed" />
            </Suspense>
          </TabsContent>

          <TabsContent value="progress" className="mt-4 sm:mt-6">
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Your Progress Overview
              </h3>
              <Suspense
                fallback={
                  <div className="h-[200px]">
                    <div className="h-full w-full bg-muted/10 animate-pulse rounded-lg"></div>
                  </div>
                }
              >
                <ListeningStats />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>

        {/* Listening Tour */}
        <ListeningTourManager />
      </div>
    </div>
  );
}
