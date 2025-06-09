"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FeedbackItem {
  _id: string;
  rating: number;
  category: string;
  subject: string;
  message: string;
  status: "new" | "in_review" | "resolved" | "dismissed";
  adminResponse?: string;
  adminNotes?: string;
  respondedBy?: {
    name: string;
    _id: string;
  };
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  pendingFeedback: number;
  reviewingFeedback: number;
  resolvedFeedback: number;
}

interface FeedbackResponse {
  feedback: FeedbackItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: FeedbackStats;
}

const categoryLabels = {
  general: "General",
  features: "Features",
  usability: "Usability",
  content: "Content",
  performance: "Performance",
  bug_report: "Bug Report",
};

const statusLabels = {
  new: "New",
  in_review: "In Review",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const statusIcons = {
  new: Clock,
  in_review: MessageSquare,
  resolved: CheckCircle,
  dismissed: XCircle,
};

const statusColors = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  in_review:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function FeedbackHistory() {
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchFeedback = async (page: number = 1, status: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (status) params.set("status", status);

      const response = await fetch(`/api/feedback/my-feedback?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await response.json();
      setFeedbackData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === statusFilter ? "" : status);
    setCurrentPage(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading feedback: {error}</p>
            <Button
              onClick={() => fetchFeedback(currentPage, statusFilter)}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feedbackData) return null;

  const { feedback, pagination, stats } = feedbackData;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Feedback
                </p>
                <p className="text-2xl font-bold">{stats.totalFeedback}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Progress
                </p>
                <p className="text-2xl font-bold">
                  {stats.pendingFeedback + stats.reviewingFeedback}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved
                </p>
                <p className="text-2xl font-bold">{stats.resolvedFeedback}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "" ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusFilter("")}
        >
          All
        </Button>
        {Object.entries(statusLabels).map(([status, label]) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilter(status)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No feedback found</p>
              <p className="text-muted-foreground">
                {statusFilter
                  ? "No feedback matches the selected filter."
                  : "You haven't submitted any feedback yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          feedback.map(item => {
            const StatusIcon = statusIcons[item.status];
            return (
              <Card key={item._id}>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={statusColors[item.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusLabels[item.status]}
                            </Badge>
                            <Badge variant="outline">
                              {
                                categoryLabels[
                                  item.category as keyof typeof categoryLabels
                                ]
                              }
                            </Badge>
                            <div className="flex items-center gap-1">
                              {renderStars(item.rating)}
                            </div>
                          </div>
                          <CardTitle className="text-lg">
                            {item.subject}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Submitted on{" "}
                            {format(
                              new Date(item.createdAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />

                      {/* Original Message */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Your Message</h4>
                          <p className="text-sm leading-relaxed bg-muted/50 rounded-lg p-3">
                            {item.message}
                          </p>
                        </div>

                        {/* Admin Response */}
                        {item.adminResponse && (
                          <div>
                            <h4 className="font-medium mb-2">Our Response</h4>
                            <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                              <p className="text-sm mb-2">
                                {item.adminResponse}
                              </p>
                              {item.respondedBy && item.respondedAt && (
                                <p className="text-xs text-muted-foreground">
                                  — {item.respondedBy.name} on{" "}
                                  {format(
                                    new Date(item.respondedAt),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Status without response */}
                        {!item.adminResponse && item.status !== "new" && (
                          <div className="text-sm text-muted-foreground">
                            {item.status === "in_review" &&
                              "Your feedback is being reviewed by our team."}
                            {item.status === "dismissed" &&
                              "This feedback has been reviewed and closed."}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
