"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addMonths } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Pencil, Trash2, Eye, CalendarClock } from "lucide-react";
import { toast } from "sonner";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface User {
  _id: string;
  name: string;
  email: string;
  learningPreferences?: {
    topics: string[];
    dailyGoal?: number;
    preferredLearningTime?: string[];
  };
  languageLevel?: string;
  createdAt: string;
  subscription?: {
    type: "free" | "monthly" | "annual";
    startDate?: string;
    endDate?: string;
    status: "active" | "expired" | "pending";
  };
  progress?: {
    readingLevel?: number;
    writingLevel?: number;
    speakingLevel?: number;
    totalPoints?: number;
    streak?: number;
  };
}

interface SchoolInfo {
  _id: string;
  name: string;
}

interface BranchInfo {
  _id: string;
  name: string;
  registrationCode?: string;
}

interface StudentTableProps {
  userId: string;
}

export function StudentTable({ userId }: StudentTableProps) {
  const router = useRouter();
  const [students, setStudents] = useState<User[]>([]);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<
    "monthly" | "annual" | "free"
  >("monthly");
  const [subscriptionMonths, setSubscriptionMonths] = useState<number>(1);
  const [updatingSubscription, setUpdatingSubscription] = useState(false);
  const [isBranchAdmin, setIsBranchAdmin] = useState(false);
  const [branchInfo, setBranchInfo] = useState<BranchInfo | null>(null);
  const [isViewStudentDialogOpen, setIsViewStudentDialogOpen] = useState(false);
  const [viewStudentDetails, setViewStudentDetails] = useState<User | null>(
    null
  );
  const [isLoadingStudentDetails, setIsLoadingStudentDetails] = useState(false);
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [isUpdatingStudent, setIsUpdatingStudent] = useState(false);

  // Load user's school and then load its students
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Find the user's school
        const userResponse = await fetch("/api/user/profile");
        const userData = await userResponse.json();

        if (!userData.user?.school) {
          setError("No school associated with your account");
          setIsLoading(false);
          return;
        }

        // Check if the user is a branch admin
        if (userData.user?.branch) {
          setIsBranchAdmin(true);

          // If user is a branch admin, get branch details
          try {
            const branchResponse = await fetch(`/api/user/branch`);
            if (branchResponse.ok) {
              const branchData = await branchResponse.json();
              setBranchInfo(branchData.branch);
            }
          } catch (branchErr) {
            console.error("Error fetching branch details:", branchErr);
          }
        }

        // Get school details
        const schoolId = userData.user.school;
        const schoolResponse = await fetch(`/api/schools/${schoolId}`);

        if (!schoolResponse.ok) {
          throw new Error("Failed to fetch school information");
        }

        const schoolData = await schoolResponse.json();
        setSchool(schoolData);

        // Now fetch students
        fetchStudents(schoolId, 1);
      } catch (err) {
        setError("Failed to load school information");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchSchool();
  }, [userId]);

  const fetchStudents = async (
    schoolId: string,
    page: number,
    search: string = searchTerm
  ) => {
    try {
      setIsLoading(true);

      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) {
        searchParams.append("search", search);
      }

      const response = await fetch(
        `/api/schools/${schoolId}/students?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data.students);
      setTotalPages(data.pagination.pages);
      setCurrentPage(page);
      setIsLoading(false);

      // Update the isBranchAdmin state based on server response
      if (data.isBranchAdmin !== undefined) {
        setIsBranchAdmin(data.isBranchAdmin);
      }
    } catch (err) {
      setError("Failed to load students");
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (school) {
      fetchStudents(school._id, 1, searchTerm);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (school && newPage > 0 && newPage <= totalPages) {
      fetchStudents(school._id, newPage, searchTerm);
    }
  };

  const handleViewStudent = async (studentId: string) => {
    if (!school) return;

    setIsLoadingStudentDetails(true);
    setIsViewStudentDialogOpen(true);

    try {
      const response = await fetch(
        `/api/schools/${school._id}/students/${studentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }

      const studentData = await response.json();
      setViewStudentDetails(studentData);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load student details");
    } finally {
      setIsLoadingStudentDetails(false);
    }
  };

  const handleEditStudent = async (studentId: string) => {
    if (!school) return;

    setIsUpdatingStudent(true);

    try {
      const response = await fetch(
        `/api/schools/${school._id}/students/${studentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }

      const studentData = await response.json();
      setEditingStudent(studentData);

      // Reset form with student data
      editForm.reset({
        name: studentData.name,
        languageLevel: studentData.languageLevel || "beginner",
        topics: studentData.learningPreferences?.topics || [],
        dailyGoal: studentData.learningPreferences?.dailyGoal || 30,
      });

      setIsEditStudentDialogOpen(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load student details");
    } finally {
      setIsUpdatingStudent(false);
    }
  };

  const handleManageSubscription = (student: User) => {
    setSelectedStudent(student);
    setSubscriptionType(
      student.subscription?.type === "annual"
        ? "annual"
        : student.subscription?.type === "monthly"
          ? "monthly"
          : "free"
    );
    setSubscriptionMonths(1);
    setIsSubscriptionDialogOpen(true);
  };

  const handleUpdateSubscription = async () => {
    if (!selectedStudent || !school) return;

    setUpdatingSubscription(true);

    try {
      const startDate = new Date();
      let endDate;

      if (subscriptionType === "annual") {
        // Annual subscription - 1 year
        endDate = addMonths(startDate, 12);
      } else if (subscriptionType === "monthly") {
        // Monthly subscription - X months based on selection
        endDate = addMonths(startDate, subscriptionMonths);
      } else {
        // Free subscription - 1 week
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
      }

      const response = await fetch(
        `/api/schools/${school._id}/students/${selectedStudent._id}/subscription`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: subscriptionType,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status: "active",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subscription");
      }

      toast.success(`Subscription updated for ${selectedStudent.name}`);
      setIsSubscriptionDialogOpen(false);

      // Refresh the student list
      fetchStudents(school._id, currentPage, searchTerm);
    } catch (error) {
      toast.error("Failed to update subscription");
      console.error(error);
    } finally {
      setUpdatingSubscription(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!school) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/schools/${school._id}/students/${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      toast.success("Student deleted successfully");

      // Refresh the student list
      fetchStudents(school._id, currentPage, searchTerm);
    } catch (err) {
      toast.error("Failed to delete student");
      console.error(err);
    }
  };

  // Define the form schema for editing students
  const editStudentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    languageLevel: z.enum(["beginner", "intermediate", "advanced"]),
    topics: z.array(z.string()).optional(),
    dailyGoal: z.coerce.number().min(5).max(120).optional(),
  });

  // Create the form
  const editForm = useForm<z.infer<typeof editStudentSchema>>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      name: "",
      languageLevel: "beginner",
      topics: [],
      dailyGoal: 30,
    },
  });

  // Function to handle the student update submission
  const handleEditStudentSubmit = async (
    data: z.infer<typeof editStudentSchema>
  ) => {
    if (!school || !editingStudent) return;

    setIsUpdatingStudent(true);

    try {
      const response = await fetch(
        `/api/schools/${school._id}/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            languageLevel: data.languageLevel,
            learningPreferences: {
              topics: data.topics,
              dailyGoal: data.dailyGoal,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      // Update was successful
      toast.success(`${data.name}'s information has been updated`);
      setIsEditStudentDialogOpen(false);

      // Refresh the student list
      fetchStudents(school._id, currentPage, searchTerm);
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student information");
    } finally {
      setIsUpdatingStudent(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>
          {school
            ? isBranchAdmin && branchInfo
              ? `Manage students for ${branchInfo.name} Branch (Code: ${branchInfo.registrationCode || "N/A"})`
              : `Manage students for ${school.name}`
            : "Loading..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No students found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="capitalize">
                      {student.languageLevel || "beginner"}
                    </TableCell>
                    <TableCell>
                      {student.subscription?.status === "active" ? (
                        <Badge variant="default">
                          {student.subscription.type === "annual"
                            ? "Annual"
                            : student.subscription.type === "free"
                              ? "Free"
                              : "Monthly"}
                        </Badge>
                      ) : (
                        <Badge variant="outline">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewStudent(student._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditStudent(student._id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleManageSubscription(student)}
                      >
                        <CalendarClock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStudent(student._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </CardFooter>
      )}

      {/* Subscription Dialog */}
      <Dialog
        open={isSubscriptionDialogOpen}
        onOpenChange={setIsSubscriptionDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              {selectedStudent &&
                `Update subscription for ${selectedStudent.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">
                Select Subscription Type
              </h3>
              <RadioGroup
                defaultValue={subscriptionType}
                value={subscriptionType}
                onValueChange={value =>
                  setSubscriptionType(value as "monthly" | "annual" | "free")
                }
                className="grid grid-cols-3 gap-2"
              >
                <div>
                  <RadioGroupItem
                    value="free"
                    id="free"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="free"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-medium">Free</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      1 week access
                    </span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="monthly"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-medium">Monthly</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Custom duration
                    </span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="annual"
                    id="annual"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="annual"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-medium">Annual</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      1 year access
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {subscriptionType === "monthly" && (
              <div className="grid gap-2">
                <Label htmlFor="months">Duration (months)</Label>
                <Select
                  value={subscriptionMonths.toString()}
                  onValueChange={value =>
                    setSubscriptionMonths(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => (
                      <SelectItem key={month} value={month.toString()}>
                        {month} {month === 1 ? "month" : "months"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="mt-2 text-sm bg-muted/30 p-3 rounded-md">
              {subscriptionType === "free" && (
                <p>Free subscription provides 7 days of access.</p>
              )}
              {subscriptionType === "monthly" && (
                <p>
                  Monthly subscription provides {subscriptionMonths}{" "}
                  {subscriptionMonths === 1 ? "month" : "months"} of access from
                  today.
                </p>
              )}
              {subscriptionType === "annual" && (
                <p>
                  Annual subscription provides 12 months of access from today.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubscriptionDialogOpen(false)}
              disabled={updatingSubscription}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubscription}
              disabled={updatingSubscription}
            >
              {updatingSubscription ? "Updating..." : "Update Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog
        open={isViewStudentDialogOpen}
        onOpenChange={setIsViewStudentDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Detailed information about the student
            </DialogDescription>
          </DialogHeader>

          {isLoadingStudentDetails ? (
            <div className="py-8 text-center">
              <p>Loading student details...</p>
            </div>
          ) : viewStudentDetails ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <p>{viewStudentDetails.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p>{viewStudentDetails.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Language Level</h3>
                  <p className="capitalize">
                    {viewStudentDetails.languageLevel || "beginner"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Joined</h3>
                  <p>
                    {new Date(
                      viewStudentDetails.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="subscription">
                  <AccordionTrigger>Subscription Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <h3 className="text-sm font-medium">Status</h3>
                          <p
                            className={
                              viewStudentDetails.subscription?.status ===
                              "active"
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {viewStudentDetails.subscription?.status || "None"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Type</h3>
                          <p className="capitalize">
                            {viewStudentDetails.subscription?.type || "Free"}
                          </p>
                        </div>
                        {viewStudentDetails.subscription?.startDate && (
                          <div>
                            <h3 className="text-sm font-medium">Start Date</h3>
                            <p>
                              {new Date(
                                viewStudentDetails.subscription.startDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {viewStudentDetails.subscription?.endDate && (
                          <div>
                            <h3 className="text-sm font-medium">End Date</h3>
                            <p>
                              {new Date(
                                viewStudentDetails.subscription.endDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="preferences">
                  <AccordionTrigger>Learning Preferences</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-sm font-medium">Topics</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewStudentDetails.learningPreferences?.topics
                            ?.length ? (
                            viewStudentDetails.learningPreferences.topics.map(
                              topic => (
                                <Badge
                                  key={topic}
                                  variant="outline"
                                  className="capitalize"
                                >
                                  {topic}
                                </Badge>
                              )
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No topics selected
                            </p>
                          )}
                        </div>
                      </div>

                      {viewStudentDetails.learningPreferences?.dailyGoal && (
                        <div>
                          <h3 className="text-sm font-medium">Daily Goal</h3>
                          <p>
                            {viewStudentDetails.learningPreferences.dailyGoal}{" "}
                            minutes
                          </p>
                        </div>
                      )}

                      {viewStudentDetails.learningPreferences
                        ?.preferredLearningTime?.length && (
                        <div>
                          <h3 className="text-sm font-medium">
                            Preferred Learning Time
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {viewStudentDetails.learningPreferences.preferredLearningTime.map(
                              time => (
                                <Badge
                                  key={time}
                                  variant="outline"
                                  className="capitalize"
                                >
                                  {time}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="progress">
                  <AccordionTrigger>Learning Progress</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {viewStudentDetails.progress ? (
                        <div className="grid grid-cols-2 gap-2">
                          {viewStudentDetails.progress.readingLevel !==
                            undefined && (
                            <div>
                              <h3 className="text-sm font-medium">
                                Reading Level
                              </h3>
                              <p>
                                {viewStudentDetails.progress.readingLevel}/10
                              </p>
                            </div>
                          )}
                          {viewStudentDetails.progress.writingLevel !==
                            undefined && (
                            <div>
                              <h3 className="text-sm font-medium">
                                Writing Level
                              </h3>
                              <p>
                                {viewStudentDetails.progress.writingLevel}/10
                              </p>
                            </div>
                          )}
                          {viewStudentDetails.progress.speakingLevel !==
                            undefined && (
                            <div>
                              <h3 className="text-sm font-medium">
                                Speaking Level
                              </h3>
                              <p>
                                {viewStudentDetails.progress.speakingLevel}/10
                              </p>
                            </div>
                          )}
                          {viewStudentDetails.progress.totalPoints !==
                            undefined && (
                            <div>
                              <h3 className="text-sm font-medium">
                                Total Points
                              </h3>
                              <p>{viewStudentDetails.progress.totalPoints}</p>
                            </div>
                          )}
                          {viewStudentDetails.progress.streak !== undefined && (
                            <div>
                              <h3 className="text-sm font-medium">
                                Current Streak
                              </h3>
                              <p>{viewStudentDetails.progress.streak} days</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No progress data available
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Failed to load student details
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewStudentDialogOpen(false)}
            >
              Close
            </Button>
            {viewStudentDetails && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewStudentDialogOpen(false);
                    handleEditStudent(viewStudentDetails._id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewStudentDialogOpen(false);
                    handleManageSubscription(viewStudentDetails);
                  }}
                >
                  Manage Subscription
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog
        open={isEditStudentDialogOpen}
        onOpenChange={open => {
          setIsEditStudentDialogOpen(open);
          if (!open) {
            setEditingStudent(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              {editingStudent
                ? `Update ${editingStudent.name}'s information`
                : "Loading..."}
            </DialogDescription>
          </DialogHeader>

          {editingStudent ? (
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleEditStudentSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Student name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="languageLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language Level</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Topics</FormLabel>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {[
                            "general",
                            "business",
                            "academic",
                            "travel",
                            "culture",
                            "technology",
                          ].map(topic => (
                            <Badge
                              key={topic}
                              variant={
                                field.value?.includes(topic)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer capitalize"
                              onClick={() => {
                                const currentTopics = field.value || [];
                                if (currentTopics.includes(topic)) {
                                  field.onChange(
                                    currentTopics.filter(t => t !== topic)
                                  );
                                } else {
                                  field.onChange([...currentTopics, topic]);
                                }
                              }}
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <FormDescription>
                          Click to select the topics the student is interested
                          in
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="dailyGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Goal (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={5} max={120} {...field} />
                      </FormControl>
                      <FormDescription>
                        Recommended daily learning time in minutes (5-120)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditStudentDialogOpen(false)}
                    disabled={isUpdatingStudent}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdatingStudent}>
                    {isUpdatingStudent ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Loading student information...
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
