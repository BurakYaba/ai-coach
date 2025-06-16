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
  TrendingUp,
  AlertCircle,
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
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
          <p className="text-gray-600">Loading your feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 bg-white shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Feedback
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => fetchFeedback(currentPage, statusFilter)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
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
        <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Feedback
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalFeedback}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Average Rating
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.pendingFeedback + stats.reviewingFeedback}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Resolved
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.resolvedFeedback}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card className="border-2 bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={statusFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("")}
              className={
                statusFilter === ""
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "border-2 border-gray-300 hover:border-blue-300"
              }
            >
              All Feedback
            </Button>
            {Object.entries(statusLabels).map(([status, label]) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter(status)}
                className={
                  statusFilter === status
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "border-2 border-gray-300 hover:border-blue-300"
                }
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <Card className="border-2 bg-white shadow-lg">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No feedback found
              </h3>
              <p className="text-gray-600">
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
              <Card
                key={item._id}
                className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge
                              className={`${statusColors[item.status]} px-3 py-1 font-medium`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusLabels[item.status]}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-2 border-gray-300 px-3 py-1"
                            >
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
                          <CardTitle className="text-xl text-gray-800 mb-2">
                            {item.subject}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Submitted on{" "}
                            {format(
                              new Date(item.createdAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-6 pb-6">
                      <Separator className="mb-6" />

                      {/* Original Message */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Your Message
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm leading-relaxed text-gray-700">
                              {item.message}
                            </p>
                          </div>
                        </div>

                        {/* Admin Response */}
                        {item.adminResponse && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Our Response
                            </h4>
                            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                              <p className="text-sm mb-3 text-gray-700">
                                {item.adminResponse}
                              </p>
                              {item.respondedBy && item.respondedAt && (
                                <p className="text-xs text-gray-600">
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
                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                              {item.status === "in_review" &&
                                "Your feedback is being reviewed by our team. We'll get back to you soon!"}
                              {item.status === "dismissed" &&
                                "This feedback has been reviewed and closed."}
                            </p>
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
        <Card className="border-2 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-2 border-gray-300 hover:border-blue-300"
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600 font-medium">
                Page {pagination.page} of {pagination.pages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="border-2 border-gray-300 hover:border-blue-300"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
