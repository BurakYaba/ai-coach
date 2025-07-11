"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";

interface WritingPrompt {
  _id: string;
  type: "essay" | "letter" | "story" | "argument";
  level: string;
  topic: string;
  text: string;
  requirements: string[];
  suggestedLength: {
    min: number;
    max: number;
  };
  timeLimit?: number;
  createdAt: string;
}

export function WritingPromptList() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 8; // 2 rows x 4 columns
  const [showAllResults, setShowAllResults] = useState(false);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const response = await fetch("/api/writing/prompts?limit=50");
        if (!response.ok) {
          throw new Error("Failed to fetch prompts");
        }
        const data = await response.json();
        setPrompts(data.prompts);
      } catch (error) {
        console.error("Error fetching writing prompts:", error);
        toast({
          title: "Error",
          description: "Failed to load writing prompts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPrompts();
  }, []);

  const startSession = async (promptId: string) => {
    try {
      // Find the prompt
      const prompt = prompts.find(p => p._id === promptId);
      if (!prompt) {
        throw new Error("Prompt not found");
      }

      // Create a new writing session
      const response = await fetch("/api/writing/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: prompt.text,
            type: prompt.type,
            topic: prompt.topic,
            targetLength: Math.floor(
              (prompt.suggestedLength.min + prompt.suggestedLength.max) / 2
            ),
            requirements: prompt.requirements,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const data = await response.json();

      // Navigate to the new session
      router.push(`/dashboard/writing/${data.session._id}`);

      toast({
        title: "Success",
        description: "Writing session created successfully",
      });
    } catch (error) {
      console.error("Error creating writing session:", error);
      toast({
        title: "Error",
        description: "Failed to create writing session",
        variant: "destructive",
      });
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    if (typeFilter !== "all" && prompt.type !== typeFilter) {
      return false;
    }
    if (levelFilter !== "all" && prompt.level !== levelFilter) {
      return false;
    }
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;

  // Show all prompts if showAllResults is true, otherwise use pagination
  const currentPrompts = showAllResults
    ? filteredPrompts
    : filteredPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, levelFilter]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Card key={i} className="h-full flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentPrompts.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Prompts Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            No writing prompts match your current filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setTypeFilter("all");
              setLevelFilter("all");
            }}
            className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="essay">Essay</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="report">Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllResults(!showAllResults)}
          >
            {showAllResults ? "Show Paged Results" : "Show All Results"}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          Showing {currentPrompts.length} of {filteredPrompts.length} prompts
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPrompts.map(prompt => (
              <Card
                key={prompt._id}
                className="border-2 bg-blue-50 border-blue-300 hover:shadow-lg transition-all duration-300 group h-full flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="capitalize text-lg font-semibold text-gray-800 leading-tight">
                        {prompt.type}: {prompt.topic}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 mt-1">
                        {prompt.level.charAt(0).toUpperCase() +
                          prompt.level.slice(1)}{" "}
                        Level
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                    >
                      {prompt.suggestedLength.min}-{prompt.suggestedLength.max}{" "}
                      words
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {prompt.text}
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800">
                      Requirements:
                    </h4>
                    <ul className="text-sm list-disc pl-4 space-y-1 line-clamp-2 text-gray-600">
                      {prompt.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      {prompt.timeLimit && (
                        <span className="text-xs text-gray-500">
                          {prompt.timeLimit} min
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => startSession(prompt._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Start Writing
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {!showAllResults && totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {pageNumbers.map(number => (
                  <PaginationItem key={number}>
                    <PaginationLink
                      onClick={() => setCurrentPage(number)}
                      isActive={currentPage === number}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    );
  }
}
