"use client";

import { useEffect, Suspense } from "react";
import { AlertCircle } from "lucide-react";
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
  const { isOpen, markFirstVisit, completeTour, closeTour, manualStart } =
    useTour("reading");

  // Handle authentication
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Mark first visit when component mounts
    markFirstVisit();
  }, [session, status, markFirstVisit]);

  if (status === "loading") {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Handle success and error messages from URL parameters
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  // Set error message based on URL parameter
  const error = searchParams?.get("error");
  if (error) {
    switch (error) {
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

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Reading Practice
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Improve your reading comprehension with AI-generated content
            tailored to your level.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
          <TakeTourButton
            onStartTour={manualStart}
            className="text-xs sm:text-sm order-2 sm:order-1"
          />
          <Link href="/dashboard/reading/new" className="order-1 sm:order-2">
            <Button
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
              data-tour="start-new-session"
            >
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

      <Tabs
        defaultValue="sessions"
        className="space-y-4"
        data-tour="reading-tabs"
      >
        <TabsList>
          <TabsTrigger value="sessions" data-tour="sessions-tab">
            My Sessions
          </TabsTrigger>
          <TabsTrigger value="progress" data-tour="progress-tab">
            My Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div data-tour="reading-sessions">
            <ReadingSessionList />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div data-tour="reading-progress">
            <ReadingProgressPage />
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
  );
}
