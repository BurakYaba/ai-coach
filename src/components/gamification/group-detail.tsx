"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Crown,
  Shield,
  Settings,
  Flame,
  LogOut,
  UserPlus,
} from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface GroupDetailsProps {
  groupId: string;
}

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

interface GroupAchievement {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  icon: string;
}

interface GroupChallenge {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  expiresAt: string;
}

export function GroupDetailComponent({ groupId }: GroupDetailsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<LearningGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  // Fetch group data
  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        // Fetch group details
        const groupResponse = await axios.get(
          `/api/gamification/groups/${groupId}`
        );
        setGroup(groupResponse.data.group);

        // Fetch group members
        const membersResponse = await axios.get(
          `/api/gamification/groups/${groupId}?action=members`
        );
        setMembers(membersResponse.data.members);

        // Check if current user is admin or member
        const currentUserId = groupResponse.data.currentUserId;
        const memberData = membersResponse.data.members.find(
          (m: GroupMember) => m.userId === currentUserId
        );

        if (memberData) {
          setIsMember(true);
          setIsAdmin(memberData.role === "admin");
        }

        // Generate invite link
        setInviteLink(`${window.location.origin}/invite/group/${groupId}`);
      } catch (error) {
        console.error("Error fetching group data:", error);
        toast({
          title: "Error",
          description: "Failed to load group data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, toast]);

  // Leave group
  const handleLeaveGroup = async () => {
    try {
      await axios.post(`/api/gamification/groups/${groupId}/leave`);
      toast({
        title: "Success",
        description: "You have left the group",
      });
      // Redirect to groups page
      window.location.href = "/dashboard/groups";
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        title: "Error",
        description: "Failed to leave the group",
        variant: "destructive",
      });
    }
  };

  // Copy invite link
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invite link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-8 w-36 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
        <p className="text-muted-foreground">
          The learning group you're looking for does not exist or you don't have
          permission to view it.
        </p>
        <Button
          className="mt-6"
          onClick={() => (window.location.href = "/dashboard/groups")}
        >
          Back to Groups
        </Button>
      </div>
    );
  }

  // Sort members with admins first, then by XP
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return (b.stats?.xp || 0) - (a.stats?.xp || 0);
  });

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            {group.stats.activeMembers} members
            {group.settings.isPrivate && (
              <Badge variant="outline" className="ml-2">
                <Shield className="h-3.5 w-3.5 mr-1" />
                Private Group
              </Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          )}
          {isMember && (
            <Button variant="destructive" onClick={handleLeaveGroup}>
              <LogOut className="h-4 w-4 mr-2" />
              Leave Group
            </Button>
          )}
        </div>
      </div>

      {/* Group Description */}
      <Card>
        <CardContent className="pt-6">
          <p>{group.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {/* Tabs for Members, Achievements, and Challenges */}
      <Tabs defaultValue="members">
        <TabsList className="mb-6">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="achievements">Group Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Group Challenges</TabsTrigger>
          {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-0">
          <h3 className="text-lg font-semibold mb-4">Group Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMembers.map(member => (
              <Card
                key={member.userId}
                className="bg-gradient-to-br from-background to-background/90"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-muted">
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10">
                        {member.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.username}</span>
                        {member.role === "admin" && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      {member.stats && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Flame className="h-3.5 w-3.5 text-orange-500 mr-1" />
                              {member.stats.streak} day streak
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Group Achievements Tab */}
        <TabsContent value="achievements" className="mt-0">
          <h3 className="text-lg font-semibold mb-4">Group Achievements</h3>
          <div className="text-center py-8">
            {/* Removed Award icon */}
            <h3 className="text-xl font-medium mb-1">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Group achievements will track collective progress and milestones
              reached by all members working together.
            </p>
          </div>
        </TabsContent>

        {/* Group Challenges Tab */}
        <TabsContent value="challenges" className="mt-0">
          <h3 className="text-lg font-semibold mb-4">Group Challenges</h3>
          <div className="text-center py-8">
            {/* Removed Award icon */}
            <h3 className="text-xl font-medium mb-1">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Group challenges will allow members to work together on
              collaborative goals and earn rewards as a team.
            </p>
          </div>
        </TabsContent>

        {/* Settings Tab (Admin Only) */}
        {isAdmin && (
          <TabsContent value="settings" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Group Settings</h3>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-medium">Group Privacy</h4>
                  <p className="text-sm text-muted-foreground">
                    Private groups are only visible to members
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span>Private Group</span>
                    <Badge
                      variant={group.settings.isPrivate ? "default" : "outline"}
                    >
                      {group.settings.isPrivate ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <h4 className="font-medium">Membership Approval</h4>
                  <p className="text-sm text-muted-foreground">
                    Require admin approval for new members
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span>Require Approval</span>
                    <Badge
                      variant={
                        group.settings.joinRequireApproval
                          ? "default"
                          : "outline"
                      }
                    >
                      {group.settings.joinRequireApproval ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Group Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>
              Share this link to invite others to join your learning group.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="bg-muted p-2 rounded-md text-sm flex-1 truncate">
              {inviteLink}
            </div>
            <Button size="sm" onClick={handleCopyInviteLink}>
              Copy
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setInviteDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
