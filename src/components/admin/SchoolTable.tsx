"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2, Building, Plus, School } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define interfaces
interface BranchData {
  _id: string;
  name: string;
  registrationCode: string;
  location?: {
    city?: string;
    country?: string;
  };
  contactInfo?: {
    name?: string;
    email?: string;
  };
  admins: any[];
  createdAt: string;
}

interface SchoolData {
  _id: string;
  name: string;
  location?: {
    city?: string;
    country?: string;
  };
  subscription: {
    type: string;
    status: string;
  };
  primaryContact: {
    name: string;
    email: string;
  };
  admins: any[];
  createdAt: string;
  branches?: BranchData[];
}

// Form schemas
const schoolFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "School name must be at least 2 characters" }),
  city: z.string().optional(),
  country: z.string().optional(),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
});

const branchFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters" }),
  schoolId: z.string().min(1, { message: "Please select a school" }),
  city: z.string().optional(),
  country: z.string().optional(),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
});

export function SchoolTable() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);

  // Dialog states
  const [isSchoolDialogOpen, setIsSchoolDialogOpen] = useState(false);
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [isDeleteSchoolDialogOpen, setIsDeleteSchoolDialogOpen] =
    useState(false);
  const [isDeleteBranchDialogOpen, setIsDeleteBranchDialogOpen] =
    useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [deletingSchool, setDeletingSchool] = useState(false);
  const [deletingBranch, setDeletingBranch] = useState(false);

  // Forms
  const schoolForm = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      city: "",
      country: "",
      contactName: "",
      contactEmail: "",
    },
  });

  const branchForm = useForm<z.infer<typeof branchFormSchema>>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: "",
      schoolId: "",
      city: "",
      country: "",
      contactName: "",
      contactEmail: "",
    },
  });

  const fetchSchools = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/schools?page=${currentPage}&limit=10`;

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }

      const data = await response.json();
      setSchools(data.schools);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError("Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async (schoolId: string) => {
    try {
      const response = await fetch(`/api/admin/branches?schoolId=${schoolId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();

      // Update the schools state with branches
      setSchools(
        schools.map(school => {
          if (school._id === schoolId) {
            return { ...school, branches: data.branches };
          }
          return school;
        })
      );
    } catch (err) {
      console.error("Error fetching branches:", err);
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSchools();
  };

  const toggleExpand = (schoolId: string) => {
    if (expandedSchoolId === schoolId) {
      setExpandedSchoolId(null);
    } else {
      setExpandedSchoolId(schoolId);
      fetchBranches(schoolId);
    }
  };

  const openSchoolDialog = (school?: SchoolData) => {
    if (school) {
      setSelectedSchool(school);
      schoolForm.reset({
        name: school.name,
        city: school.location?.city || "",
        country: school.location?.country || "",
        contactName: school.primaryContact.name,
        contactEmail: school.primaryContact.email,
      });
    } else {
      setSelectedSchool(null);
      schoolForm.reset();
    }
    setIsSchoolDialogOpen(true);
  };

  const openBranchDialog = (school?: SchoolData) => {
    if (school) {
      setSelectedSchool(school);
      branchForm.reset({
        name: "",
        schoolId: school._id,
        city: school.location?.city || "",
        country: school.location?.country || "",
        contactName: "",
        contactEmail: "",
      });
    } else {
      setSelectedSchool(null);
      branchForm.reset();
    }
    setIsBranchDialogOpen(true);
  };

  const onSchoolSubmit = async (data: z.infer<typeof schoolFormSchema>) => {
    try {
      const schoolData = {
        name: data.name,
        location: {
          city: data.city,
          country: data.country,
        },
        primaryContact: {
          name: data.contactName,
          email: data.contactEmail,
        },
      };

      let response;
      if (selectedSchool) {
        // Update existing school
        response = await fetch(`/api/schools/${selectedSchool._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schoolData),
        });
      } else {
        // Create new school
        response = await fetch("/api/admin/schools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schoolData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save school");
      }

      toast({
        title: selectedSchool ? "School Updated" : "School Created",
        description: `Successfully ${selectedSchool ? "updated" : "created"} the school.`,
      });

      setIsSchoolDialogOpen(false);
      fetchSchools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save school",
        variant: "destructive",
      });
    }
  };

  const onBranchSubmit = async (data: z.infer<typeof branchFormSchema>) => {
    try {
      const branchData = {
        name: data.name,
        schoolId: data.schoolId,
        location: {
          city: data.city,
          country: data.country,
        },
        contactInfo: {
          name: data.contactName,
          email: data.contactEmail,
        },
      };

      const response = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create branch");
      }

      toast({
        title: "Branch Created",
        description:
          "Successfully created the branch with a unique registration code.",
      });

      setIsBranchDialogOpen(false);
      if (expandedSchoolId === data.schoolId) {
        fetchBranches(data.schoolId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create branch",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;

    setDeletingSchool(true);
    try {
      const response = await fetch(`/api/schools/${selectedSchool._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete school");
      }

      toast({
        title: "School Deleted",
        description: `${selectedSchool.name} has been permanently deleted.`,
      });

      // Remove school from state
      setSchools(schools.filter(school => school._id !== selectedSchool._id));
      setIsDeleteSchoolDialogOpen(false);
      setSelectedSchool(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete school",
        variant: "destructive",
      });
    } finally {
      setDeletingSchool(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch || !expandedSchoolId) return;

    setDeletingBranch(true);
    try {
      const response = await fetch(
        `/api/admin/branches/${selectedBranch._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete branch");
      }

      toast({
        title: "Branch Deleted",
        description: `${selectedBranch.name} has been permanently deleted.`,
      });

      // Update the branches in the school
      setSchools(
        schools.map(school => {
          if (school._id === expandedSchoolId && school.branches) {
            return {
              ...school,
              branches: school.branches.filter(
                branch => branch._id !== selectedBranch._id
              ),
            };
          }
          return school;
        })
      );

      setIsDeleteBranchDialogOpen(false);
      setSelectedBranch(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete branch",
        variant: "destructive",
      });
    } finally {
      setDeletingBranch(false);
    }
  };

  const openDeleteSchoolDialog = (school: SchoolData) => {
    setSelectedSchool(school);
    setIsDeleteSchoolDialogOpen(true);
  };

  const openDeleteBranchDialog = (branch: BranchData) => {
    setSelectedBranch(branch);
    setIsDeleteBranchDialogOpen(true);
  };

  if (loading && schools.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm space-x-2"
        >
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
        <Button onClick={() => openSchoolDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add School
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No schools found
                </TableCell>
              </TableRow>
            ) : (
              schools.map(school => (
                <>
                  <TableRow key={school._id}>
                    <TableCell>
                      <div className="font-medium">{school.name}</div>
                    </TableCell>
                    <TableCell>
                      {school.location?.city && school.location?.country
                        ? `${school.location.city}, ${school.location.country}`
                        : school.location?.city ||
                          school.location?.country ||
                          "N/A"}
                    </TableCell>
                    <TableCell>
                      <div>{school.primaryContact.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {school.primaryContact.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          school.subscription.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {school.subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(school.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleExpand(school._id)}
                              >
                                <Building className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View branches</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openBranchDialog(school)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add branch</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openSchoolDialog(school)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit school</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteSchoolDialog(school)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete school</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Branches section - shown when expanded */}
                  {expandedSchoolId === school._id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Card className="bg-muted/50 mb-2">
                          <CardHeader className="py-2">
                            <CardTitle className="text-base">
                              Branches for {school.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {!school.branches ? (
                              <div className="text-center py-2">
                                Loading branches...
                              </div>
                            ) : school.branches.length === 0 ? (
                              <div className="text-center py-2">
                                No branches found
                              </div>
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Registration Code</TableHead>
                                    <TableHead>Admins</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {school.branches.map(branch => (
                                    <TableRow key={branch._id}>
                                      <TableCell>
                                        <div className="font-medium">
                                          {branch.name}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {branch.location?.city &&
                                        branch.location?.country
                                          ? `${branch.location.city}, ${branch.location.country}`
                                          : branch.location?.city ||
                                            branch.location?.country ||
                                            "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {branch.contactInfo?.name ? (
                                          <>
                                            <div>{branch.contactInfo.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                              {branch.contactInfo.email}
                                            </div>
                                          </>
                                        ) : (
                                          "N/A"
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="outline"
                                          className="font-mono"
                                        >
                                          {branch.registrationCode}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {branch.admins.length}
                                      </TableCell>
                                      <TableCell>
                                        {format(
                                          new Date(branch.createdAt),
                                          "MMM d, yyyy"
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            openDeleteBranchDialog(branch)
                                          }
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* School Dialog */}
      <Dialog open={isSchoolDialogOpen} onOpenChange={setIsSchoolDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSchool ? "Edit School" : "Add New School"}
            </DialogTitle>
            <DialogDescription>
              {selectedSchool
                ? "Update the school information below"
                : "Enter the details for the new school"}
            </DialogDescription>
          </DialogHeader>

          <Form {...schoolForm}>
            <form
              onSubmit={schoolForm.handleSubmit(onSchoolSubmit)}
              className="space-y-4"
            >
              <FormField
                control={schoolForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={schoolForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={schoolForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={schoolForm.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={schoolForm.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contact email address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {selectedSchool ? "Update School" : "Create School"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Branch Dialog */}
      <Dialog open={isBranchDialogOpen} onOpenChange={setIsBranchDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>
              Create a new branch with a unique registration code
            </DialogDescription>
          </DialogHeader>

          <Form {...branchForm}>
            <form
              onSubmit={branchForm.handleSubmit(onBranchSubmit)}
              className="space-y-4"
            >
              <FormField
                control={branchForm.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input
                        value={selectedSchool?.name || ""}
                        disabled={!!selectedSchool}
                      />
                    </FormControl>
                    <FormDescription>
                      {selectedSchool &&
                        "This branch will be created for the selected school"}
                    </FormDescription>
                    <FormMessage />
                    <input type="hidden" {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={branchForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter branch name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={branchForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={branchForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={branchForm.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={branchForm.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contact email address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormDescription>
                A unique 6-digit registration code will be automatically
                generated for this branch.
              </FormDescription>
              <DialogFooter>
                <Button type="submit">Create Branch</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete School Confirmation Dialog */}
      <Dialog
        open={isDeleteSchoolDialogOpen}
        onOpenChange={setIsDeleteSchoolDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete School</DialogTitle>
            <DialogDescription>
              {selectedSchool && (
                <div>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedSchool.name}</span>?
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-destructive">
              This action cannot be undone. This will permanently delete the
              school and all associated branches and data.
            </p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteSchoolDialogOpen(false)}
              disabled={deletingSchool}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSchool}
              disabled={deletingSchool}
            >
              {deletingSchool ? "Deleting..." : "Delete School"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Branch Confirmation Dialog */}
      <Dialog
        open={isDeleteBranchDialogOpen}
        onOpenChange={setIsDeleteBranchDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              {selectedBranch && (
                <div>
                  Are you sure you want to delete branch{" "}
                  <span className="font-semibold">{selectedBranch.name}</span>?
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-destructive">
              This action cannot be undone. This will permanently delete the
              branch and all associated data.
            </p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteBranchDialogOpen(false)}
              disabled={deletingBranch}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBranch}
              disabled={deletingBranch}
            >
              {deletingBranch ? "Deleting..." : "Delete Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
