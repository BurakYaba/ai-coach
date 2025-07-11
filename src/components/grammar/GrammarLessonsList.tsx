"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, GraduationCap, CheckCircle, Clock } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface GrammarLesson {
  _id: string;
  title: string;
  category: string;
  ceferLevel: string;
  content: {
    explanation: string;
    examples: Array<{
      correct: string;
      incorrect: string;
      explanation: string;
    }>;
    exercises: Array<{
      question: string;
      options?: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  };
  relatedIssues: string[];
  completed: boolean;
  score?: number;
  createdAt: string;
}

export default function GrammarLessonsList() {
  const router = useRouter();
  const [lessons, setLessons] = useState<GrammarLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [completedFilter, setCompletedFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 8; // Show 8 lessons per page to match the 4-column layout (2 rows)

  // Fetch lessons when component mounts or filters change
  useEffect(() => {
    fetchLessons();
  }, [categoryFilter, levelFilter, completedFilter]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      // Build query string based on filters
      let url = "/api/grammar/lessons?limit=50";

      if (categoryFilter !== "all") {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }

      if (levelFilter !== "all") {
        url += `&ceferLevel=${encodeURIComponent(levelFilter)}`;
      }

      if (completedFilter !== "all") {
        url += `&completed=${completedFilter === "completed"}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch grammar lessons");
      }

      const data = await response.json();
      setLessons(data.lessons || []);

      // Reset to first page when filters change
      setCurrentPage(1);

      // Extract unique categories and levels for filters
      const uniqueCategories = Array.from(
        new Set(data.lessons.map((lesson: GrammarLesson) => lesson.category))
      );
      setCategories(uniqueCategories as string[]);

      const uniqueLevels = Array.from(
        new Set(data.lessons.map((lesson: GrammarLesson) => lesson.ceferLevel))
      );
      setLevels(uniqueLevels as string[]);
    } catch (error) {
      console.error("Error fetching grammar lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load grammar lessons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/dashboard/grammar/lessons/${lessonId}`);
  };

  // Calculate pagination
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = lessons.slice(indexOfFirstLesson, indexOfLastLesson);
  const totalPages = Math.ceil(lessons.length / lessonsPerPage);

  const getCardStyle = (completed: boolean) => {
    if (completed) {
      return "border-2 border-green-300 bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300";
    } else {
      return "border-2 border-blue-300 bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300";
    }
  };

  const getStatusBadge = (completed: boolean) => {
    if (completed) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Card key={i} className="border-2 bg-gray-50 shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
                <Skeleton className="h-4 w-full mt-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-2 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Grammar Lessons Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            Generate lessons from your grammar issues to start learning
            personalized content.
          </p>
          <Button
            onClick={() => router.push("/dashboard/grammar")}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Back to Grammar Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 justify-end">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px] bg-white border-gray-300">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[150px] bg-white border-gray-300">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
          </SelectContent>
        </Select>

        <Select value={completedFilter} onValueChange={setCompletedFilter}>
          <SelectTrigger className="w-[150px] bg-white border-gray-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <SelectItem value="all">All Lessons</SelectItem>
            <SelectItem value="incomplete">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lessons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentLessons.map(lesson => (
          <Card
            key={lesson._id}
            className={`h-full flex flex-col cursor-pointer ${getCardStyle(lesson.completed)}`}
            onClick={() => navigateToLesson(lesson._id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base mb-1 text-gray-800">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600">
                    {lesson.content.explanation.length} characters •{" "}
                    {lesson.content.exercises.length} exercises
                  </CardDescription>
                </div>
                {getStatusBadge(lesson.completed)}
              </div>
            </CardHeader>

            <CardContent className="flex-grow space-y-3 py-2">
              <p className="text-gray-600 text-sm line-clamp-2">
                {lesson.content.explanation.substring(0, 120)}...
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <div className="w-full">
                <Progress
                  value={
                    lesson.completed
                      ? 100
                      : lesson.score !== undefined
                        ? lesson.score
                        : 0
                  }
                  className="h-2"
                />
              </div>

              <div className="w-full flex justify-between items-center">
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs border-gray-300">
                    {lesson.ceferLevel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs capitalize border-gray-300"
                  >
                    {lesson.category}
                  </Badge>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs h-7 hover:bg-gray-200 transition-colors"
                >
                  {lesson.completed ? "Review Lesson" : "Continue Reading"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
