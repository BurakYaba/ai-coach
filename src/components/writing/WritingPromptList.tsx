'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface WritingPrompt {
  _id: string;
  type: 'essay' | 'letter' | 'story' | 'argument';
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
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 8; // 2 rows x 4 columns

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const response = await fetch('/api/writing/prompts');
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        const data = await response.json();
        setPrompts(data.prompts);
      } catch (error) {
        console.error('Error fetching writing prompts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load writing prompts',
          variant: 'destructive',
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
        throw new Error('Prompt not found');
      }

      // Create a new writing session
      const response = await fetch('/api/writing/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        throw new Error('Failed to create session');
      }

      const data = await response.json();

      // Navigate to the new session
      router.push(`/dashboard/writing/${data.session._id}`);

      toast({
        title: 'Success',
        description: 'Writing session created successfully',
      });
    } catch (error) {
      console.error('Error creating writing session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create writing session',
        variant: 'destructive',
      });
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    if (typeFilter !== 'all' && prompt.type !== typeFilter) {
      return false;
    }
    if (levelFilter !== 'all' && prompt.level !== levelFilter) {
      return false;
    }
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = filteredPrompts.slice(
    indexOfFirstPrompt,
    indexOfLastPrompt
  );

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="essay">Essay</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="argument">Argument</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPrompts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Prompts Found</CardTitle>
            <CardDescription>
              No writing prompts match your current filters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Try changing your filter settings or check back later for new
              prompts.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTypeFilter('all');
                setLevelFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentPrompts.map(prompt => (
              <Card key={prompt._id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="capitalize text-base">
                        {prompt.type}: {prompt.topic}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {prompt.level.charAt(0).toUpperCase() +
                          prompt.level.slice(1)}{' '}
                        Level
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {prompt.suggestedLength.min}-{prompt.suggestedLength.max}{' '}
                      words
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                    {prompt.text}
                  </p>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium">Requirements:</h4>
                    <ul className="text-xs list-disc pl-4 space-y-0.5 line-clamp-2">
                      {prompt.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    {prompt.timeLimit && (
                      <span className="text-xs text-muted-foreground">
                        {prompt.timeLimit} min
                      </span>
                    )}
                  </div>
                  <Button size="sm" onClick={() => startSession(prompt._id)}>
                    Start Writing
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
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
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
