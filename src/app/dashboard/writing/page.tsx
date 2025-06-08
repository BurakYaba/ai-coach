"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WritingProgress } from "@/components/writing/WritingProgress";
import { WritingPromptList } from "@/components/writing/WritingPromptList";
import { WritingSessionList } from "@/components/writing/WritingSessionList";
import ModuleTour from "@/components/tours/ModuleTour";
import { TakeTourButton } from "@/components/tours/TakeTourButton";
import { useTour } from "@/hooks/useTour";
import { tourSteps } from "@/data/tourSteps";

export default function WritingDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, markFirstVisit, completeTour, closeTour, manualStart } =
    useTour("writing");

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

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Writing Practice
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Improve your writing skills with AI-powered feedback and analysis
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
          <TakeTourButton
            onStartTour={manualStart}
            className="text-xs sm:text-sm order-2 sm:order-1"
          />
          <Link href="/dashboard/writing/new" className="order-1 sm:order-2">
            <Button
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
              data-tour="start-new-session"
            >
              <span className="hidden sm:inline">New Writing Session</span>
              <span className="sm:hidden">New Session</span>
            </Button>
          </Link>
        </div>
      </div>

      <Tabs
        defaultValue="sessions"
        className="space-y-4"
        data-tour="writing-tabs"
      >
        <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
          <TabsTrigger
            value="sessions"
            data-tour="sessions-tab"
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">My Sessions</span>
            <span className="sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger
            value="prompts"
            data-tour="prompts-tab"
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Writing Prompts</span>
            <span className="sm:hidden">Prompts</span>
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            data-tour="progress-tab"
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">My Progress</span>
            <span className="sm:hidden">Progress</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div data-tour="writing-sessions">
            <WritingSessionList />
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <div data-tour="writing-prompts">
            <WritingPromptList />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div data-tour="writing-progress">
            <WritingProgress />
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Tour */}
      <ModuleTour
        module="writing"
        steps={tourSteps.writing}
        isOpen={isOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
    </div>
  );
}
