"use client";

import { Info } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { FreeConversation } from "@/components/speaking/FreeConversation";
import { TurnBasedConversation } from "@/components/speaking/TurnBasedConversation";
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

export default function SpeakingPage() {
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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Speaking Practice</h1>

      <Tabs defaultValue="free-conversation" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="free-conversation">Free Conversation</TabsTrigger>
          <TabsTrigger value="guided-practice">Guided Practice</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
        </TabsList>

        <TabsContent value="free-conversation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Free Conversation</CardTitle>
                  <CardDescription>
                    Practice your speaking skills in a free-flowing conversation
                    with Fluenta.
                  </CardDescription>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium mb-2">
                    Conversation Mode:
                  </span>
                  <div className="flex items-center">
                    <div className="bg-secondary rounded-md p-1 flex">
                      {isAdmin ? (
                        <>
                          <Button
                            variant={
                              conversationMode === "realtime"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="rounded-md"
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
                            className="rounded-md"
                            onClick={() => setConversationMode("turn-based")}
                            aria-label="Turn-based conversation mode"
                          >
                            Turn-based
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-md opacity-50 cursor-not-allowed"
                            disabled
                            aria-label="Realtime conversation mode coming soon"
                          >
                            Realtime
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="rounded-md"
                            onClick={() => setConversationMode("turn-based")}
                            aria-label="Turn-based conversation mode"
                          >
                            Turn-based
                          </Button>
                        </>
                      )}
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-1">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-80">
                          {isAdmin ? (
                            <>
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
                            </>
                          ) : (
                            <>
                              <p>
                                <strong>Realtime:</strong> Coming soon! Natural
                                back-and-forth conversation with OpenAI&apos;s
                                Realtime API.
                              </p>
                              <p className="mt-2">
                                <strong>Turn-based:</strong> Record your
                                response, then listen to the AI response.
                                Includes role-play options.
                              </p>
                            </>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
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
                Practice specific speaking scenarios with guided exercises.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pronunciation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pronunciation Practice</CardTitle>
              <CardDescription>
                Focus on improving your pronunciation with targeted exercises.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-muted-foreground mb-8">
        Practice your speaking skills in real time. Choose from guided speaking
        exercises, pronunciation practice, or free conversation with Fluenta.
      </p>
    </div>
  );
}
