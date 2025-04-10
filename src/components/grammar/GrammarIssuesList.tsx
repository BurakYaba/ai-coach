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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface GrammarIssue {
  _id: string;
  sourceModule: 'writing' | 'speaking';
  issue: {
    type: string;
    text: string;
    correction: string;
    explanation: string;
  };
  ceferLevel: string;
  category: string;
  resolved: boolean;
  createdAt: string;
}

export default function GrammarIssuesList() {
  const router = useRouter();
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [resolvedFilter, setResolvedFilter] = useState<string>('all');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [selectedExplanation, setSelectedExplanation] = useState<{
    title: string;
    explanation: string;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 8; // Show 8 issues per page to match the 4-column layout (2 rows)

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, [categoryFilter, levelFilter, resolvedFilter]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      // Build the query string based on filters
      let url = '/api/grammar/issues?limit=50';

      if (categoryFilter !== 'all') {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }

      if (levelFilter !== 'all') {
        url += `&ceferLevel=${encodeURIComponent(levelFilter)}`;
      }

      if (resolvedFilter !== 'all') {
        url += `&resolved=${resolvedFilter === 'resolved'}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch grammar issues');
      }

      const data = await response.json();
      setIssues(data.issues || []);

      // Reset to first page when filters change
      setCurrentPage(1);

      // Extract unique categories and levels for filters
      const uniqueCategories = Array.from(
        new Set(data.issues.map((issue: GrammarIssue) => issue.category))
      );
      setCategories(uniqueCategories as string[]);

      const uniqueLevels = Array.from(
        new Set(data.issues.map((issue: GrammarIssue) => issue.ceferLevel))
      );
      setLevels(uniqueLevels as string[]);
    } catch (error) {
      console.error('Error fetching grammar issues:', error);
      toast({
        title: 'Error',
        description: 'Failed to load grammar issues',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markIssuesResolved = async (resolved: boolean) => {
    if (selectedIssues.length === 0) {
      toast({
        title: 'No issues selected',
        description: 'Please select at least one issue to mark as resolved',
        variant: 'default',
      });
      return;
    }

    try {
      const response = await fetch('/api/grammar/issues', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueIds: selectedIssues,
          resolved,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update issues');
      }

      const data = await response.json();

      toast({
        title: 'Success',
        description: `${data.modifiedCount} issues updated`,
      });

      // Refresh issues
      fetchIssues();
      // Clear selection
      setSelectedIssues([]);
    } catch (error) {
      console.error('Error updating issues:', error);
      toast({
        title: 'Error',
        description: 'Failed to update issues',
        variant: 'destructive',
      });
    }
  };

  const generateLessonFromSelected = async () => {
    if (selectedIssues.length === 0) {
      toast({
        title: 'No issues selected',
        description: 'Please select at least one issue to generate a lesson',
        variant: 'default',
      });
      return;
    }

    try {
      // Determine the most common category and level from selected issues
      const selectedIssuesData = issues.filter(issue =>
        selectedIssues.includes(issue._id)
      );

      const categoryCounts: Record<string, number> = {};
      const levelCounts: Record<string, number> = {};

      selectedIssuesData.forEach(issue => {
        categoryCounts[issue.category] =
          (categoryCounts[issue.category] || 0) + 1;
        levelCounts[issue.ceferLevel] =
          (levelCounts[issue.ceferLevel] || 0) + 1;
      });

      // Find most common category and level
      const topCategory = Object.entries(categoryCounts).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

      const topLevel = Object.entries(levelCounts).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

      const response = await fetch('/api/grammar/lessons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueIds: selectedIssues,
          category: topCategory,
          ceferLevel: topLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson');
      }

      const data = await response.json();

      toast({
        title: 'Lesson created',
        description: `New lesson created: ${data.lesson.title}`,
      });

      // Navigate to the lesson
      router.push(`/dashboard/grammar/lessons/${data.lesson._id}`);
    } catch (error: any) {
      console.error('Error generating lesson:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate lesson',
        variant: 'destructive',
      });
    }
  };

  const toggleIssueSelection = (issueId: string) => {
    setSelectedIssues(prev =>
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const toggleAllIssues = () => {
    if (selectedIssues.length === issues.length) {
      setSelectedIssues([]);
    } else {
      setSelectedIssues(issues.map(issue => issue._id));
    }
  };

  // Calculate pagination
  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = issues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(issues.length / issuesPerPage);

  // Helper function to get status badge
  const getStatusBadge = (resolved: boolean) => {
    return resolved ? (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        Resolved
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-orange-50 text-orange-700 border-orange-200"
      >
        Unresolved
      </Badge>
    );
  };

  // Function to view full explanation
  const viewExplanation = (issue: GrammarIssue) => {
    setSelectedExplanation({
      title: `${issue.category}: ${issue.issue.type}`,
      explanation: issue.issue.explanation,
    });
  };

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

  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No grammar issues found. Complete some writing or speaking exercises
          to collect grammar issues.
        </p>
        <Button onClick={() => router.push('/dashboard/writing')}>
          Try Writing Practice
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={
              selectedIssues.length > 0 &&
              selectedIssues.length === issues.length
            }
            onClick={toggleAllIssues}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            {selectedIssues.length > 0
              ? `Selected ${selectedIssues.length} ${selectedIssues.length === 1 ? 'issue' : 'issues'}`
              : 'Select all'}
          </label>
        </div>

        {selectedIssues.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markIssuesResolved(true)}
            >
              Mark Resolved
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markIssuesResolved(false)}
            >
              Mark Unresolved
            </Button>
            <Button size="sm" onClick={generateLessonFromSelected}>
              Generate Lesson
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
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

          <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issues</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issues grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentIssues.map(issue => (
          <Card
            key={issue._id}
            className={`h-full flex flex-col ${
              selectedIssues.includes(issue._id) ? 'border-primary' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base mb-1 flex items-center gap-2">
                    <Checkbox
                      checked={selectedIssues.includes(issue._id)}
                      onClick={() => toggleIssueSelection(issue._id)}
                      className="mr-1"
                    />
                    <span className="capitalize">{issue.category}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {format(new Date(issue.createdAt), 'PPP')}
                  </CardDescription>
                </div>
                {getStatusBadge(issue.resolved)}
              </div>
            </CardHeader>

            <CardContent className="flex-grow space-y-3 pt-0">
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  <span className="line-through">{issue.issue.text}</span>
                </p>
                <p className="text-primary text-sm font-medium">
                  {issue.issue.correction}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="text-xs">
                  {issue.ceferLevel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {issue.sourceModule}
                </Badge>
                <div>
                  <span className="font-medium">Type: </span>
                  {issue.issue.type}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground w-full justify-start hover:bg-transparent hover:text-foreground p-0"
                onClick={() => viewExplanation(issue)}
              >
                View explanation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Explanation Dialog */}
      <Dialog
        open={!!selectedExplanation}
        onOpenChange={open => !open && setSelectedExplanation(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedExplanation?.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-2">
            {selectedExplanation?.explanation
              .split('\n')
              .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </DialogDescription>
        </DialogContent>
      </Dialog>

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
