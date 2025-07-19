"use client";

import { Info, ArrowLeft, Mic, MessageSquare, Volume2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Speaking Practice
            </h1>
            <p className="text-gray-600">
              Practice your speaking skills in real time. Choose from guided
              speaking exercises, pronunciation practice, or free conversation
              with Fluenta.
            </p>
          </div>
          <Link href="/dashboard/speaking">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">
                Back to Speaking Dashboard
              </span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>

        {/* Practice Tabs */}
        <Tabs defaultValue="free-conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm mb-8">
            <TabsTrigger
              value="free-conversation"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Free Conversation</span>
              <span className="sm:hidden">Free</span>
            </TabsTrigger>
            <TabsTrigger
              value="guided-practice"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Guided Practice</span>
              <span className="sm:hidden">Guided</span>
            </TabsTrigger>
            <TabsTrigger
              value="pronunciation"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Pronunciation</span>
              <span className="sm:hidden">Pronunciation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free-conversation" className="space-y-4">
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0 gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      Free Conversation
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Practice your speaking skills in a free-flowing
                      conversation with Fluenta.
                    </CardDescription>
                  </div>

                  {/* Only show conversation mode selector for admin users */}
                  {isAdmin && (
                    <div className="flex flex-col items-start lg:items-end">
                      <span className="text-sm font-medium mb-2 text-gray-700">
                        Conversation Mode:
                      </span>
                      <div className="flex items-center w-full lg:w-auto">
                        <div className="bg-gray-100 rounded-md p-1 flex flex-1 lg:flex-none">
                          <Button
                            variant={
                              conversationMode === "realtime"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className={`rounded-md flex-1 lg:flex-none ${
                              conversationMode === "realtime"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                            }`}
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
                            className={`rounded-md flex-1 lg:flex-none ${
                              conversationMode === "turn-based"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                            }`}
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
                                className="ml-1 flex-shrink-0 hover:bg-gray-100"
                              >
                                <Info className="h-4 w-4 text-gray-500" />
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
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Mic className="h-4 w-4 text-green-600" />
                  </div>
                  Guided Practice
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
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
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <Volume2 className="h-4 w-4 text-purple-600" />
                  </div>
                  Pronunciation Practice
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
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
