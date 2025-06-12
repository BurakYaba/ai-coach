"use client";

import { Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { FreeConversation } from "@/components/speaking/FreeConversation";
import { TurnBasedConversation } from "@/components/speaking/TurnBasedConversation";
import { GuidedPractice } from "@/components/speaking/GuidedPractice";
import { PronunciationPractice } from "@/components/speaking/PronunciationPractice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SpeakingPracticePage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // For non-admin users, default to turn-based mode
  const [conversationMode, setConversationMode] = useState<
    "realtime" | "turn-based"
  >(isAdmin ? "realtime" : "turn-based");

  // If user is not admin and tries to set realtime mode, switch back to turn-based
  useEffect(() => {
    if (!isAdmin && conversationMode === "realtime") {
      setConversationMode("turn-based");
    }
  }, [isAdmin, conversationMode]);

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Title and Back Button in same row */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Speaking Practice
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Practice your speaking skills in real time. Choose from guided
              speaking exercises, pronunciation practice, or free conversation
              with Fluenta.
            </p>
          </div>

          <Link href="/dashboard/speaking">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Speaking Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="free-conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10 mb-6 sm:mb-8">
            <TabsTrigger
              value="free-conversation"
              className="text-sm py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Free Conversation
            </TabsTrigger>
            <TabsTrigger
              value="guided-practice"
              className="text-sm py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Guided Practice
            </TabsTrigger>
            <TabsTrigger
              value="pronunciation"
              className="text-sm py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Pronunciation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free-conversation" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0 gap-4">
                  <div>
                    <CardTitle>Free Conversation</CardTitle>
                    <CardDescription>
                      Practice your speaking skills in a free-flowing
                      conversation with Fluenta.
                    </CardDescription>
                  </div>

                  {/* Only show conversation mode selector for admin users */}
                  {isAdmin && (
                    <div className="flex flex-col items-start lg:items-end">
                      <span className="text-sm font-medium mb-2">
                        Conversation Mode:
                      </span>
                      <div className="flex items-center w-full lg:w-auto">
                        <div className="bg-secondary rounded-md p-1 flex flex-1 lg:flex-none">
                          <Button
                            variant={
                              conversationMode === "realtime"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="rounded-md flex-1 lg:flex-none"
                            onClick={() => setConversationMode("realtime")}
                            aria-label="Realtime conversation mode"
                          >
                            Realtime
                          </Button>
                          <Button
                            variant={
                              conversationMode === "turn-based"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="rounded-md flex-1 lg:flex-none"
                            onClick={() => setConversationMode("turn-based")}
                            aria-label="Turn-based conversation mode"
                          >
                            Turn-based
                          </Button>
                        </div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-1 flex-shrink-0"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-80">
                              <p>
                                <strong>Realtime:</strong> Natural
                                back-and-forth conversation with OpenAI&apos;s
                                Realtime API.
                              </p>
                              <p className="mt-2">
                                <strong>Turn-based:</strong> Record your
                                response, then listen to the AI response.
                                Includes role-play options.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {conversationMode === "realtime" ? (
                  <FreeConversation />
                ) : (
                  <TurnBasedConversation />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guided-practice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guided Practice</CardTitle>
                <CardDescription>
                  Practice specific speaking scenarios with guided exercises and
                  step-by-step instruction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GuidedPractice />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pronunciation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pronunciation Practice</CardTitle>
                <CardDescription>
                  Focus on improving your pronunciation with targeted exercises
                  for specific sounds and phonemes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PronunciationPractice />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
