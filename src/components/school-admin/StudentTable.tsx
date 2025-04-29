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

interface User {
  _id: string;
  name: string;
  email: string;
  learningPreferences?: {
    topics: string[];
  };
  languageLevel?: string;
  createdAt: string;
  subscription?: {
    type: "none" | "monthly" | "annual";
    startDate?: string;
    endDate?: string;
    status: "active" | "expired" | "pending";
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
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<
    "monthly" | "annual"
  >("monthly");
  const [subscriptionMonths, setSubscriptionMonths] = useState<number>(1);
  const [updatingSubscription, setUpdatingSubscription] = useState(false);
  const [isBranchAdmin, setIsBranchAdmin] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<BranchInfo | null>(null);

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
          setSelectedBranch(userData.user.branch);
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

  // Add a new useEffect to fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      if (!school?._id) return;

      try {
        const response = await fetch(`/api/schools/${school._id}/branches`);
        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }

        const data = await response.json();
        setBranches(data.branches);

        // If the user is a branch admin, find their branch info
        if (isBranchAdmin && selectedBranch) {
          const userBranch = data.branches.find(
            (branch: BranchInfo) => branch._id === selectedBranch
          );
          if (userBranch) {
            setCurrentBranch(userBranch);
          }
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };

    if (school) {
      fetchBranches();
    }
  }, [school, isBranchAdmin, selectedBranch]);

  const fetchStudents = async (
    schoolId: string,
    page: number,
    search: string = searchTerm,
    branchId: string = selectedBranch
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

      // We don't need to explicitly pass branchId for branch admins
      // as the API will automatically filter by their branch
      if (!isBranchAdmin && branchId && branchId !== "all") {
        searchParams.append("branchId", branchId);
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
      fetchStudents(school._id, 1, searchTerm, selectedBranch);
    }
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    if (school) {
      fetchStudents(school._id, 1, searchTerm, value);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (school && newPage > 0 && newPage <= totalPages) {
      fetchStudents(school._id, newPage, searchTerm, selectedBranch);
    }
  };

  const handleViewStudent = (studentId: string) => {
    router.push(`/school-admin/students/${studentId}`);
  };

  const handleEditStudent = (studentId: string) => {
    router.push(`/school-admin/students/${studentId}/edit`);
  };

  const handleManageSubscription = (student: User) => {
    setSelectedStudent(student);
    setSubscriptionType(
      student.subscription?.type === "annual" ? "annual" : "monthly"
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
        endDate = addMonths(startDate, 12);
      } else {
        endDate = addMonths(startDate, subscriptionMonths);
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
      fetchStudents(school._id, currentPage, searchTerm, selectedBranch);
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
        "Are you sure you want to remove this student from your school?"
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
        throw new Error("Failed to remove student");
      }

      toast.success("Student removed successfully");

      // Refresh the student list
      fetchStudents(school._id, currentPage, searchTerm, selectedBranch);
    } catch (err) {
      toast.error("Failed to remove student");
      console.error(err);
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
            ? isBranchAdmin && currentBranch
              ? `Manage students for ${currentBranch.name} Branch (Code: ${currentBranch.registrationCode})`
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

          {/* Only show branch filter for school-wide admins, not for branch admins */}
          {!isBranchAdmin && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="branch-select">Filter by Branch</Label>
              <Select value={selectedBranch} onValueChange={handleBranchChange}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}{" "}
                      {branch.registrationCode &&
                        `(Code: ${branch.registrationCode})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Students register using branch codes. Each branch has a unique
                6-digit code.
              </p>
            </div>
          )}
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
            <RadioGroup
              defaultValue={subscriptionType}
              value={subscriptionType}
              onValueChange={value =>
                setSubscriptionType(value as "monthly" | "annual")
              }
              className="grid grid-cols-2 gap-4"
            >
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
                </Label>
              </div>
            </RadioGroup>

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
    </Card>
  );
}
