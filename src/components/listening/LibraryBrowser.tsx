"use client";

import { format } from "date-fns";
import { PlayCircle, Clock, BookOpen, Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { formatDuration } from "@/lib/utils";

interface LibraryItem {
  _id: string;
  title: string;
  level: string;
  topic: string;
  contentType: string;
  duration: number;
  category?: string;
  tags?: string[];
  createdAt: string;
  content?: any;
  questions?: any[];
  vocabulary?: any[];
}

export function LibraryBrowser() {
  const router = useRouter();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  const [startingSession, setStartingSession] = useState<string | null>(null);

  const fetchLibraryItems = async () => {
    setLoading(true);
    try {
      let url = `/api/library?page=${currentPage}&limit=8`;

      if (levelFilter && levelFilter !== "all") {
        url += `&level=${encodeURIComponent(levelFilter)}`;
      }

      if (contentTypeFilter && contentTypeFilter !== "all") {
        url += `&contentType=${encodeURIComponent(contentTypeFilter)}`;
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch library items");
      }

      const data = await response.json();
      setItems(data.sessions);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error("Error fetching library items:", err);
      setError("Failed to load library items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryItems();
  }, [currentPage, levelFilter, contentTypeFilter, searchTerm]);

  const startSession = async (item: LibraryItem) => {
    setStartingSession(item._id);
    try {
      // First fetch the full library item details to get content, questions, and vocabulary
      const itemResponse = await fetch(`/api/library/${item._id}`);
      if (!itemResponse.ok) {
        throw new Error("Failed to fetch library item details");
      }
      const fullItem = await itemResponse.json();

      // Create a new session from the library item
      const response = await fetch("/api/listening/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: fullItem.title,
          level: fullItem.level,
          topic: fullItem.topic,
          content: fullItem.content,
          contentType: fullItem.contentType,
          duration: fullItem.duration,
          fromLibrary: true,
          libraryItemId: fullItem._id,
          questions: fullItem.questions || [],
          vocabulary: fullItem.vocabulary || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const sessionData = await response.json();

      // Redirect directly to the listening exercise
      router.push(`/dashboard/listening/${sessionData._id}`);

      // Prefetch the dashboard page for better navigation experience
      router.prefetch("/dashboard/listening?tab=inprogress");
    } catch (err) {
      console.error("Error starting session:", err);
      toast({
        title: "Error",
        description: "Failed to start the listening session",
        variant: "destructive",
      });
      setStartingSession(null);
    }
  };

  // Function to get background color based on level
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-green-100",
      A2: "bg-green-200",
      B1: "bg-blue-100",
      B2: "bg-blue-200",
      C1: "bg-purple-100",
      C2: "bg-purple-200",
    };
    return colors[level] || "bg-gray-100";
  };

  // Function to get card border and background color based on level
  const getLevelCardColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "border-green-300 bg-green-50",
      A2: "border-green-300 bg-green-50",
      B1: "border-blue-300 bg-blue-50",
      B2: "border-blue-300 bg-blue-50",
      C1: "border-purple-300 bg-purple-50",
      C2: "border-purple-300 bg-purple-50",
    };
    return colors[level] || "border-gray-300 bg-gray-50";
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4" data-tour="search-filters">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by title or topic..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={levelFilter}
            onValueChange={value => {
              setLevelFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[140px] bg-white">
              <SelectValue placeholder="All Levels" />
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

          <Select
            value={contentTypeFilter}
            onValueChange={value => {
              setContentTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[140px] bg-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dialogue">Dialogue</SelectItem>
              <SelectItem value="monologue">Monologue</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="news">News Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          data-tour="content-library"
        >
          {items.map((item, index) => (
            <Card
              key={item._id}
              className={`border-2 hover:shadow-lg transition-all duration-300 group ${getLevelCardColor(item.level)}`}
              data-tour={index === 0 ? "content-card" : undefined}
            >
              <CardHeader className="pb-3 p-3 sm:p-6 sm:pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {item.level}
                  </Badge>
                </div>
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
                  {item.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{item.topic}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span>{formatDuration(item.duration)}</span>
                  <span>•</span>
                  <span className="truncate">{item.contentType}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
                <div className="space-y-3">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 2).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => startSession(item)}
                    disabled={startingSession === item._id}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white group-hover:bg-blue-600 transition-colors text-sm sm:text-base py-2 sm:py-3"
                  >
                    {startingSession === item._id ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Session
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          className="mt-6"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
