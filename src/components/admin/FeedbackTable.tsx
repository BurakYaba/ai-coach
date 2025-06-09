"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Star,
  Eye,
  Filter,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Loader2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Feedback {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  rating: number;
  category: string;
  subject: string;
  message: string;
  status: "new" | "in_review" | "resolved" | "dismissed";
  adminResponse?: string;
  adminNotes?: string;
  respondedAt?: string;
  respondedBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  metadata?: {
    userAgent?: string;
    currentPage?: string;
    deviceInfo?: string;
  };
}

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  newFeedback: number;
  resolvedFeedback: number;
}

export function FeedbackTable() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [notesText, setNotesText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(ratingFilter !== "all" && { rating: ratingFilter }),
      });

      const response = await fetch(`/api/feedback?${params}`);
      if (!response.ok) throw new Error("Failed to fetch feedback");

      const data = await response.json();
      setFeedback(data.feedback);
      setStats(data.stats);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, statusFilter, categoryFilter, ratingFilter]);

  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast({
        title: "Status Updated",
        description: "Feedback status has been updated successfully.",
      });

      fetchFeedback();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResponseSubmit = async () => {
    if (!selectedFeedback || (!responseText.trim() && !notesText.trim()))
      return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/feedback/${selectedFeedback._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminResponse: responseText.trim() || undefined,
          adminNotes: notesText.trim() || undefined,
          status: responseText.trim() ? "resolved" : selectedFeedback.status,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit response");

      toast({
        title: "Response Submitted",
        description: "Your response has been saved successfully.",
      });

      setDetailsOpen(false);
      setResponseText("");
      setNotesText("");
      fetchFeedback();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openDetails = (feedbackItem: Feedback) => {
    setSelectedFeedback(feedbackItem);
    setResponseText(feedbackItem.adminResponse || "");
    setNotesText(feedbackItem.adminNotes || "");
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-500",
      in_review: "bg-yellow-500",
      resolved: "bg-green-500",
      dismissed: "bg-gray-500",
    };

    return (
      <Badge
        className={`${variants[status as keyof typeof variants]} text-white`}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: "General",
      features: "Features",
      usability: "Usability",
      content: "Content",
      performance: "Performance",
      bug_report: "Bug Report",
    };
    return labels[category as keyof typeof labels] || category;
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Feedback</CardDescription>
              <CardTitle className="text-2xl">{stats.totalFeedback}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Rating</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {stats.averageRating.toFixed(1)}
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New Feedback</CardDescription>
              <CardTitle className="text-2xl">{stats.newFeedback}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Resolved</CardDescription>
              <CardTitle className="text-2xl">
                {stats.resolvedFeedback}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card style={{ overflow: "visible" }}>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>Manage and respond to user feedback</CardDescription>
        </CardHeader>
        <CardContent style={{ overflow: "visible" }}>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="features">Features</SelectItem>
                <SelectItem value="usability">Usability</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="bug_report">Bug Report</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feedback Table */}
          <div className="rounded-md border" style={{ overflow: "visible" }}>
            <div style={{ overflow: "visible", position: "relative" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquare className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No feedback found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or check back later for
                            new feedback.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedback.map(item => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StarRating rating={item.rating} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryLabel(item.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px] truncate">
                            {item.subject}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          {format(new Date(item.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {/* View Details Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openDetails(item)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* Mark In Review Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleStatusUpdate(item._id, "in_review")
                              }
                              title="Mark In Review"
                              disabled={item.status === "in_review"}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>

                            {/* Mark Resolved Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleStatusUpdate(item._id, "resolved")
                              }
                              title="Mark Resolved"
                              disabled={item.status === "resolved"}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>

                            {/* Dismiss Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleStatusUpdate(item._id, "dismissed")
                              }
                              title="Dismiss"
                              disabled={item.status === "dismissed"}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              View and respond to user feedback
            </DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">User</span>
                  <div className="text-sm">
                    <div>{selectedFeedback.user.name}</div>
                    <div className="text-muted-foreground">
                      {selectedFeedback.user.email}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Rating</span>
                  <div className="text-sm">
                    <StarRating rating={selectedFeedback.rating} />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Category</span>
                  <div className="text-sm">
                    {getCategoryLabel(selectedFeedback.category)}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Status</span>
                  <div className="text-sm">
                    {getStatusBadge(selectedFeedback.status)}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium">Subject</span>
                <div className="text-sm mt-1">{selectedFeedback.subject}</div>
              </div>

              <div>
                <span className="text-sm font-medium">Message</span>
                <div className="text-sm mt-1 p-3 bg-muted rounded-md">
                  {selectedFeedback.message}
                </div>
              </div>

              {selectedFeedback.metadata?.currentPage && (
                <div>
                  <span className="text-sm font-medium">Context</span>
                  <div className="text-sm mt-1 text-muted-foreground">
                    Page: {selectedFeedback.metadata.currentPage}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="admin-notes" className="text-sm font-medium">
                  Admin Notes
                </label>
                <Textarea
                  id="admin-notes"
                  placeholder="Internal notes about this feedback..."
                  value={notesText}
                  onChange={e => setNotesText(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="admin-response" className="text-sm font-medium">
                  Response to User
                </label>
                <Textarea
                  id="admin-response"
                  placeholder="Response that will be visible to the user..."
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDetailsOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResponseSubmit}
                  disabled={
                    isUpdating || (!responseText.trim() && !notesText.trim())
                  }
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Response"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
