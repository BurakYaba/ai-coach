"use client";

import { useEffect, Suspense } from "react";
import { AlertCircle, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { ReadingProgressPage } from "@/components/reading/ReadingProgressPage";
import { ReadingSessionList } from "@/components/reading/ReadingSessionList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleTour from "@/components/tours/ModuleTour";
import { TakeTourButton } from "@/components/tours/TakeTourButton";
import { useTour } from "@/hooks/useTour";
import { tourSteps } from "@/data/tourSteps";

// Add dynamic = 'force-dynamic' to ensure page is not statically cached
export const dynamic = "force-dynamic";

export default function ReadingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tour functionality
  const { isOpen, closeTour, completeTour } = useTour("reading");

  // Handle manual tour start
  const manualStart = () => {
    // Tour logic handled by useTour hook
  };

  // Handle success and error messages from URL parameters
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  // Set error message based on URL parameter
  if (searchParams?.get("error")) {
    switch (searchParams.get("error")) {
      case "invalid-id":
        errorMessage = "Invalid session ID. Please try again.";
        break;
      case "not-found":
        errorMessage = "Reading session not found.";
        break;
      case "delete-failed":
        errorMessage = "Failed to delete reading session. Please try again.";
        break;
      default:
        errorMessage = "An error occurred. Please try again.";
    }
  }

  // Set success message based on URL parameter
  if (searchParams?.get("success") === "deleted") {
    successMessage = "Reading session deleted successfully.";
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Determine default tab (can be controlled via URL parameter)
  const defaultTab = searchParams?.get("tab") || "sessions";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div
          className="flex justify-between items-start mb-8"
          data-tour="reading-header"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Reading Practice
            </h1>
            <p className="text-gray-600">
              Improve your reading comprehension with AI-generated content
              tailored to your level
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TakeTourButton onStartTour={manualStart} className="text-sm" />
            <Link href="/dashboard/reading/new">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                data-tour="start-new-session"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Start New Session</span>
                <span className="sm:hidden">Start Practice</span>
              </Button>
            </Link>
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

        {/* Navigation Tabs */}
        <Tabs defaultValue={defaultTab} className="mb-6">
          <TabsList
            data-tour="reading-tabs"
            className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-white shadow-sm"
          >
            <TabsTrigger
              value="sessions"
              data-tour="sessions-tab"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Sessions</span>
              <span className="sm:hidden">Sessions</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              data-tour="progress-tab"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Clock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">My Progress</span>
              <span className="sm:hidden">Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="sessions" className="mt-6">
            <div
              className="bg-white rounded-2xl p-6 shadow-lg"
              data-tour="reading-sessions"
            >
              <Suspense fallback={<ReadingSessionsSkeleton />}>
                <ReadingSessionList />
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div
              className="bg-white rounded-2xl p-8 shadow-lg"
              data-tour="reading-progress"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Your Progress Overview
              </h3>
              <Suspense
                fallback={
                  <div className="h-[200px]">
                    <div className="h-full w-full bg-muted/10 animate-pulse rounded-lg"></div>
                  </div>
                }
              >
                <ReadingProgressPage />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>

        {/* Module Tour */}
        <ModuleTour
          module="reading"
          steps={tourSteps.reading}
          isOpen={isOpen}
          onClose={closeTour}
          onComplete={completeTour}
        />
      </div>
    </div>
  );
}

// Skeleton loader for reading sessions
function ReadingSessionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-48 bg-gray-100 animate-pulse rounded-xl"
        ></div>
      ))}
    </div>
  );
}
