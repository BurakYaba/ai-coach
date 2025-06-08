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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Writing Practice
          </h1>
          <p className="text-muted-foreground">
            Improve your writing skills with AI-powered feedback and analysis
          </p>
        </div>
        <div className="flex gap-3">
          <TakeTourButton onStartTour={manualStart} />
          <Link href="/dashboard/writing/new">
            <Button size="lg" data-tour="start-new-session">
              New Writing Session
            </Button>
          </Link>
        </div>
      </div>

      <Tabs
        defaultValue="sessions"
        className="space-y-4"
        data-tour="writing-tabs"
      >
        <TabsList>
          <TabsTrigger value="sessions" data-tour="sessions-tab">
            My Sessions
          </TabsTrigger>
          <TabsTrigger value="prompts" data-tour="prompts-tab">
            Writing Prompts
          </TabsTrigger>
          <TabsTrigger value="progress" data-tour="progress-tab">
            My Progress
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
