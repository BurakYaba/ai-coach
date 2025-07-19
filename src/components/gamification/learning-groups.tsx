"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Shield, Users } from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface LearningGroup {
  _id: string;
  name: string;
  description: string;
  members: Array<{
    userId: string;
    role: "admin" | "member";
    joinedAt: string;
  }>;
  settings: {
    isPrivate: boolean;
    joinRequireApproval: boolean;
  };
  stats: {
    totalXP: number;
    activeMembers: number;
    averageStreak: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface GroupMember {
  userId: string;
  username: string;
  avatarUrl?: string;
  role: "admin" | "member";
  joinedAt: string;
  stats?: {
    level: number;
    xp: number;
    streak: number;
  };
}

// Create group form schema
const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Group name must be at most 50 characters"),
  description: z
    .string()
    .max(300, "Description must be at most 300 characters")
    .optional(),
  isPrivate: z.boolean().default(false),
  joinRequireApproval: z.boolean().default(true),
});

export function LearningGroupsComponent() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [myGroups, setMyGroups] = useState<LearningGroup[]>([]);
  const [publicGroups, setPublicGroups] = useState<LearningGroup[]>([]);
  const [searchResults, setSearchResults] = useState<LearningGroup[]>([]);

  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      joinRequireApproval: true,
    },
  });

  // Load data when the component mounts
  useEffect(() => {
    loadGroups();
  }, []);

  // Load groups based on the active tab
  const loadGroups = async () => {
    setIsLoading(true);

    try {
      if (activeTab === "my-groups") {
        const response = await axios.get("/api/gamification/groups?mine=true");
        setMyGroups(response.data.groups);
      } else {
        const response = await axios.get("/api/gamification/groups");
        setPublicGroups(response.data.groups);
      }
    } catch (error) {
      console.error("Error loading groups:", error);
      toast({
        title: "Error",
        description: "Failed to load learning groups",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "my-groups" && myGroups.length === 0) {
      loadGroups();
    } else if (value === "discover" && publicGroups.length === 0) {
      loadGroups();
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const response = await axios.get(
        `/api/gamification/groups?search=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data.groups);
      setActiveTab("search-results");
    } catch (error) {
      console.error("Error searching groups:", error);
      toast({
        title: "Error",
        description: "Failed to search learning groups",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle group creation
  const onCreateGroup = async (values: z.infer<typeof createGroupSchema>) => {
    setIsCreating(true);

    try {
      const response = await axios.post("/api/gamification/groups", values);
      toast({
        title: "Success",
        description: "Learning group created successfully",
      });

      // Add the new group to my groups
      setMyGroups(prev => [response.data.group, ...prev]);

      // Switch to my groups tab
      setActiveTab("my-groups");

      // Close the dialog
      setCreateDialogOpen(false);

      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create learning group",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (groupId: string) => {
    setIsJoining(true);

    try {
      const response = await axios.post(
        `/api/gamification/groups/${groupId}/join`
      );

      if (response.data.pending) {
        toast({
          title: "Join Request Sent",
          description:
            "Your request to join the group has been sent to the admin",
        });
      } else {
        toast({
          title: "Success",
          description: "You have joined the group successfully",
        });

        // Refresh my groups
        const myGroupsResponse = await axios.get(
          "/api/gamification/groups?mine=true"
        );
        setMyGroups(myGroupsResponse.data.groups);

        // Switch to my groups tab
        setActiveTab("my-groups");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error",
        description: "Failed to join learning group",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Render group cards
  const renderGroupCards = (groups: LearningGroup[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="opacity-70">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-20" />
                </CardFooter>
              </Card>
            ))}
        </div>
      );
    }

    if (groups.length === 0) {
      return (
        <div className="text-center py-10">
          <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">No Groups Found</h3>
          <p className="text-sm text-muted-foreground">
            {activeTab === "my-groups"
              ? "You haven't joined any learning groups yet."
              : "No learning groups available. Be the first to create one!"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => (
          <Card key={group._id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {group.name}
                    {group.settings.isPrivate && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Users className="h-3.5 w-3.5" />
                    {group.stats.activeMembers} members
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {group.description || "No description provided."}
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="flex flex-col items-center p-2 rounded-md bg-muted/10">
                  <span className="text-xs text-muted-foreground">Members</span>
                  <span className="font-medium">
                    {group.stats.activeMembers}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-muted/10">
                  <span className="text-xs text-muted-foreground">
                    Total XP
                  </span>
                  <span className="font-medium">{group.stats.totalXP}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-muted/10">
                  <span className="text-xs text-muted-foreground">
                    Avg Streak
                  </span>
                  <span className="font-medium">
                    {group.stats.averageStreak}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/groups/${group._id}`)}
              >
                Details
              </Button>
              {activeTab !== "my-groups" && (
                <Button
                  size="sm"
                  onClick={() => handleJoinGroup(group._id)}
                  disabled={isJoining}
                >
                  Join Group
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Learning Groups</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Learning Group</DialogTitle>
              <DialogDescription>
                Create a group to learn together with friends and other language
                learners.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onCreateGroup)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter group name" />
                      </FormControl>
                      <FormDescription>
                        Choose a name that reflects your learning goals
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Describe your group's focus and goals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Private Group</FormLabel>
                          <FormDescription>
                            Only visible to members
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="joinRequireApproval"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require Approval</FormLabel>
                          <FormDescription>
                            Approve join requests
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Group"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Search for groups..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="discover" onValueChange={handleTabChange}>
        <TabsList className="mb-4 grid grid-cols-3 max-w-md">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger
            value="search-results"
            disabled={searchResults.length === 0}
          >
            Search Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-0">
          {renderGroupCards(publicGroups)}
        </TabsContent>

        <TabsContent value="my-groups" className="mt-0">
          {renderGroupCards(myGroups)}
        </TabsContent>

        <TabsContent value="search-results" className="mt-0">
          {renderGroupCards(searchResults)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
