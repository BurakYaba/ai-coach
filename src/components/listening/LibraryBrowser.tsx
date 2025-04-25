"use client";

import { format } from "date-fns";
import { PlayCircle, Clock, BookOpen, Bookmark, Search } from "lucide-react";
import Link from "next/link";
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
}

export function LibraryBrowser() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

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
      <div className="flex flex-wrap gap-4 justify-between">
        <Input
          placeholder="Search by title or topic..."
          className="max-w-sm"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when search changes
          }}
        />
        <div className="flex gap-2">
          <Select
            value={levelFilter}
            onValueChange={value => {
              setLevelFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="A1">A1 (Beginner)</SelectItem>
              <SelectItem value="A2">A2 (Elementary)</SelectItem>
              <SelectItem value="B1">B1 (Intermediate)</SelectItem>
              <SelectItem value="B2">B2 (Upper Int.)</SelectItem>
              <SelectItem value="C1">C1 (Advanced)</SelectItem>
              <SelectItem value="C2">C2 (Proficient)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={contentTypeFilter}
            onValueChange={value => {
              setContentTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <Card key={item._id} className="h-full flex flex-col">
              <div className={`h-1.5 ${getLevelColor(item.level)}`} />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base mb-1">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {formatDuration(item.duration)} • {item.contentType}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.topic}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild className="w-full text-xs" size="sm">
                  <Link href={`/dashboard/listening/library/${item._id}`}>
                    <PlayCircle className="mr-2 h-3.5 w-3.5" />
                    Start Session
                  </Link>
                </Button>
              </CardFooter>
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
