'use client';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [completedFilter, setCompletedFilter] = useState<string>('all');
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
      let url = '/api/grammar/lessons?limit=50';

      if (categoryFilter !== 'all') {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }

      if (levelFilter !== 'all') {
        url += `&ceferLevel=${encodeURIComponent(levelFilter)}`;
      }

      if (completedFilter !== 'all') {
        url += `&completed=${completedFilter === 'completed'}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch grammar lessons');
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
      console.error('Error fetching grammar lessons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load grammar lessons',
        variant: 'destructive',
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-10 w-40" />
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
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No grammar lessons found. Generate lessons from your grammar issues.
        </p>
        <Button onClick={() => router.push('/dashboard/grammar')}>
          Back to Grammar Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 justify-end">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={completedFilter} onValueChange={setCompletedFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lessons</SelectItem>
            <SelectItem value="incomplete">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lessons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentLessons.map(lesson => (
          <Card
            key={lesson._id}
            className={`h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer ${
              lesson.completed ? 'border-green-200' : ''
            }`}
            onClick={() => navigateToLesson(lesson._id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base mb-1">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {format(new Date(lesson.createdAt), 'PPP')}
                  </CardDescription>
                </div>
                {lesson.completed ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Completed
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    In Progress
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-grow space-y-3 pt-0">
              <p className="text-muted-foreground text-sm line-clamp-2">
                {lesson.content.explanation.substring(0, 120)}...
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {lesson.category}
                </Badge>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                  {lesson.ceferLevel}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                <div>
                  <span className="font-medium">Examples: </span>
                  {lesson.content.examples.length}
                </div>
                <div>
                  <span className="font-medium">Exercises: </span>
                  {lesson.content.exercises.length}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{lesson.completed ? 'Completed' : 'Progress'}</span>
                  {lesson.score !== undefined && (
                    <span className="font-medium">{lesson.score}%</span>
                  )}
                </div>
                <Progress
                  value={
                    lesson.completed
                      ? 100
                      : lesson.score !== undefined
                        ? lesson.score
                        : 0
                  }
                  className="h-1.5"
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
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
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
