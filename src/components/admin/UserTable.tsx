"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
  User,
  UserCog,
  School,
  Trash,
  Plus,
  Eye,
  EyeOff,
  CalendarClock,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UserStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  lastActive: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin" | "school_admin";
  createdAt: string;
  subscription: {
    type: "free" | "monthly" | "annual";
    status: "active" | "expired" | "pending";
    startDate?: Date;
    endDate?: Date;
  };
  stats: UserStats;
}

// Add new interfaces for schools and branches
interface SchoolOption {
  _id: string;
  name: string;
  branches?: BranchOption[];
}

interface BranchOption {
  _id: string;
  name: string;
}

// Add form schema for new user
const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "school_admin", "admin"]),
  schoolId: z.string().optional(),
  branchId: z.string().optional(),
});

export function UserTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [syncingSubscriptions, setSyncingSubscriptions] = useState(false);

  // Initialize form
  const addUserForm = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const selectedRole = addUserForm.watch("role");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/users?page=${currentPage}&limit=10`;

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin" | "school_admin"
  ) => {
    setUpdatingRole(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user role");
      }

      // Update user in state
      setUsers(
        users.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}`,
      });
    } catch (err: any) {
      console.error("Error updating role:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdatingRole(false);
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeletingUser(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      // Remove user from state
      setUsers(users.filter(user => user._id !== selectedUser._id));

      toast({
        title: "User deleted",
        description: `${selectedUser.name} has been permanently deleted`,
      });
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeletingUser(false);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const openRoleDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getUserInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  const fetchSchools = async () => {
    if (schools.length > 0) return; // Only fetch once

    setLoadingSchools(true);
    try {
      const response = await fetch("/api/admin/schools?limit=100");
      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }

      const data = await response.json();
      setSchools(data.schools);
    } catch (err) {
      console.error("Error fetching schools:", err);
      toast({
        title: "Error",
        description: "Failed to load schools",
        variant: "destructive",
      });
    } finally {
      setLoadingSchools(false);
    }
  };

  const fetchBranches = async (schoolId: string) => {
    try {
      // Check if we already have branches for this school
      const schoolWithBranches = schools.find(
        s => s._id === schoolId && s.branches
      );
      if (schoolWithBranches) return;

      const response = await fetch(`/api/admin/branches?schoolId=${schoolId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();

      // Update schools state with branches
      setSchools(
        schools.map(school =>
          school._id === schoolId
            ? { ...school, branches: data.branches }
            : school
        )
      );
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  // Handle form submission to create a new user
  const handleAddUser = async (data: z.infer<typeof addUserSchema>) => {
    setAddingUser(true);
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.role === "school_admin" &&
          data.schoolId && {
            school: data.schoolId,
            branch: data.branchId,
          }),
      };

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      toast({
        title: "User created",
        description: `${data.name} has been created successfully`,
      });

      // Close dialog and reset form
      setIsAddUserDialogOpen(false);
      addUserForm.reset();

      // Refresh user list
      fetchUsers();
    } catch (err: any) {
      console.error("Error creating user:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setAddingUser(false);
    }
  };

  // Handle school selection to load branches
  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    addUserForm.setValue("schoolId", schoolId);
    addUserForm.setValue("branchId", undefined); // Reset branch selection

    // Fetch branches for the selected school
    fetchBranches(schoolId);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSyncSubscriptions = async () => {
    setSyncingSubscriptions(true);
    try {
      const response = await fetch("/api/admin/users/sync-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sync subscriptions");
      }

      const result = await response.json();

      toast({
        title: "Subscriptions synced",
        description: `Updated ${result.usersUpdated} expired subscriptions`,
      });

      // Refresh user list to show updated statuses
      fetchUsers();
    } catch (err: any) {
      console.error("Error syncing subscriptions:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to sync subscriptions",
        variant: "destructive",
      });
    } finally {
      setSyncingSubscriptions(false);
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by name or email..."
          className="max-w-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSyncSubscriptions}
            disabled={syncingSubscriptions}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${syncingSubscriptions ? "animate-spin" : ""}`}
            />
            {syncingSubscriptions ? "Syncing..." : "Sync Subscriptions"}
          </Button>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Subscription Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.image} />
                        <AvatarFallback>
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "default"
                          : user.role === "school_admin"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {user.role === "school_admin"
                        ? "school admin"
                        : user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {user.stats.lastActive
                      ? formatDistanceToNow(new Date(user.stats.lastActive), {
                          addSuffix: true,
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    {user.stats.completedSessions} / {user.stats.totalSessions}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.subscription.status === "active"
                          ? "default"
                          : user.subscription.status === "pending"
                            ? "outline"
                            : "destructive"
                      }
                      className="capitalize flex items-center gap-1"
                    >
                      {user.subscription.status === "active" ? (
                        <CalendarClock className="h-3 w-3" />
                      ) : user.subscription.status === "pending" ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {user.subscription.type} - {user.subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleDropdown(user._id)}
                      >
                        <span className="sr-only">Open menu</span>
                        <UserCog className="h-4 w-4" />
                      </Button>
                      {openDropdownId === user._id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                openRoleDialog(user);
                                setOpenDropdownId(null);
                              }}
                              role="menuitem"
                            >
                              Change Role
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => {
                                openDeleteDialog(user);
                                setOpenDropdownId(null);
                              }}
                              role="menuitem"
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
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

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <div>
                  Change role for user {selectedUser.name} ({selectedUser.email}
                  )
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedUser?.role === "user" ? "default" : "outline"}
                onClick={() =>
                  selectedUser && handleRoleChange(selectedUser._id, "user")
                }
                disabled={updatingRole || selectedUser?.role === "user"}
                className="flex-1"
              >
                <User className="h-4 w-4 mr-2" />
                User
              </Button>
              <Button
                variant={
                  selectedUser?.role === "school_admin" ? "default" : "outline"
                }
                onClick={() =>
                  selectedUser &&
                  handleRoleChange(selectedUser._id, "school_admin")
                }
                disabled={updatingRole || selectedUser?.role === "school_admin"}
                className="flex-1"
              >
                <School className="h-4 w-4 mr-2" />
                School Admin
              </Button>
              <Button
                variant={selectedUser?.role === "admin" ? "default" : "outline"}
                onClick={() =>
                  selectedUser && handleRoleChange(selectedUser._id, "admin")
                }
                disabled={updatingRole || selectedUser?.role === "admin"}
                className="flex-1"
              >
                <UserCog className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={updatingRole}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <div>
                  Are you sure you want to delete user{" "}
                  <span className="font-semibold">{selectedUser.name}</span> (
                  {selectedUser.email})?
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-destructive">
              This action cannot be undone. This will permanently delete the
              user account and all associated data.
            </p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deletingUser}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deletingUser}
            >
              {deletingUser ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and assign a role.
            </DialogDescription>
          </DialogHeader>

          <Form {...addUserForm}>
            <form
              onSubmit={addUserForm.handleSubmit(handleAddUser)}
              className="space-y-4"
            >
              <FormField
                control={addUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value);
                        if (value === "school_admin") {
                          fetchSchools();
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="school_admin">
                          School Admin
                        </SelectItem>
                        <SelectItem value="admin">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional fields for school admin */}
              {selectedRole === "school_admin" && (
                <>
                  <FormField
                    control={addUserForm.control}
                    name="schoolId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <Select
                          onValueChange={handleSchoolChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a school" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingSchools ? (
                              <SelectItem value="loading" disabled>
                                Loading schools...
                              </SelectItem>
                            ) : schools.length === 0 ? (
                              <SelectItem value="none" disabled>
                                No schools available
                              </SelectItem>
                            ) : (
                              schools.map(school => (
                                <SelectItem key={school._id} value={school._id}>
                                  {school.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedSchoolId && (
                    <FormField
                      control={addUserForm.control}
                      name="branchId"
                      render={({ field }) => {
                        const selectedSchool = schools.find(
                          school => school._id === selectedSchoolId
                        );
                        const branches = selectedSchool?.branches || [];

                        return (
                          <FormItem>
                            <FormLabel>Branch (Optional)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a branch (optional)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {branches.length === 0 ? (
                                  <SelectItem value="none" disabled>
                                    No branches available
                                  </SelectItem>
                                ) : (
                                  branches.map(branch => (
                                    <SelectItem
                                      key={branch._id}
                                      value={branch._id}
                                    >
                                      {branch.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Branch selection is optional for school admins
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}
                </>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddUserDialogOpen(false);
                    addUserForm.reset();
                  }}
                  disabled={addingUser}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addingUser}>
                  {addingUser ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
