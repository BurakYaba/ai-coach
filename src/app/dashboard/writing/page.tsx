"use client";

import { useEffect } from "react";
import { BookOpen, PenTool } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div
          className="flex justify-between items-start mb-8"
          data-tour="writing-header"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Writing Practice
            </h1>
            <p className="text-gray-600">
              Improve your writing skills with AI-powered feedback and analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TakeTourButton onStartTour={manualStart} className="text-sm" />
            <Link href="/dashboard/writing/new">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                data-tour="start-new-session"
              >
                <PenTool className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Writing Session</span>
                <span className="sm:hidden">New Session</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="sessions" className="mb-6" data-tour="writing-tabs">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white shadow-sm">
            <TabsTrigger
              value="sessions"
              data-tour="sessions-tab"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">My Sessions</span>
              <span className="sm:hidden">Sessions</span>
            </TabsTrigger>
            <TabsTrigger
              value="prompts"
              data-tour="prompts-tab"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Writing Prompts</span>
              <span className="sm:hidden">Prompts</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              data-tour="progress-tab"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Progress</span>
              <span className="sm:hidden">Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="sessions" className="mt-6">
            <div
              className="bg-white rounded-2xl p-6 shadow-lg"
              data-tour="writing-sessions"
            >
              <WritingSessionList />
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="mt-6">
            <div
              className="bg-white rounded-2xl p-6 shadow-lg"
              data-tour="writing-prompts"
            >
              <WritingPromptList />
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div
              className="bg-white rounded-2xl p-8 shadow-lg"
              data-tour="writing-progress"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Your Progress Overview
              </h3>
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
    </div>
  );
}
