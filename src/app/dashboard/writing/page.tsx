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
import WritingTour from "@/components/tours/WritingTour";
import { TakeTourButton } from "@/components/tours/TakeTourButton";
import { useTour } from "@/hooks/useTour";

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
        <div className="max-w-7xl mx-auto p-3 sm:p-6">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full sm:w-2/3 mb-4 sm:mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div
          className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:justify-between sm:items-start"
          data-tour="writing-header"
        >
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Writing Practice
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Improve your writing skills with AI-powered feedback and analysis
            </p>
          </div>
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3 flex-shrink-0">
            <TakeTourButton
              onStartTour={manualStart}
              className="text-sm order-2 xs:order-1"
            />
            <Link href="/dashboard/writing/new" className="order-1 xs:order-2">
              <Button
                className="w-full xs:w-auto bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                data-tour="start-new-session"
              >
                <PenTool className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">New Writing Session</span>
                <span className="xs:hidden">New Session</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          defaultValue="sessions"
          className="mb-4 sm:mb-6"
          data-tour="writing-tabs"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white shadow-sm h-auto p-1">
            <TabsTrigger
              value="sessions"
              data-tour="sessions-tab"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <PenTool className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden xs:inline">My Sessions</span>
              <span className="xs:hidden">Sessions</span>
            </TabsTrigger>
            <TabsTrigger
              value="prompts"
              data-tour="prompts-tab"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Writing Prompts</span>
              <span className="xs:hidden">Prompts</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              data-tour="progress-tab"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden xs:inline">My Progress</span>
              <span className="xs:hidden">Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="sessions" className="mt-4 sm:mt-6">
            <div
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
              data-tour="writing-history"
            >
              <WritingSessionList />
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="mt-4 sm:mt-6">
            <div
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
              data-tour="writing-prompts"
            >
              <WritingPromptList />
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-4 sm:mt-6">
            <div
              className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg"
              data-tour="writing-progress"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Your Progress Overview
              </h3>
              <WritingProgress />
            </div>
          </TabsContent>
        </Tabs>

        {/* Module Tour */}
        <WritingTour
          isOpen={isOpen}
          onClose={closeTour}
          onComplete={completeTour}
        />
      </div>
    </div>
  );
}
