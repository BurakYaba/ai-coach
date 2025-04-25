import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export interface IGamificationProfile {
  userId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
  achievements: Array<{
    id: string;
    unlockedAt: Date;
  }>;
  badges: Array<{
    id: string;
    unlockedAt: Date;
  }>;
  stats: {
    totalXP: number;
    activeDays: number;
    moduleActivity: {
      reading: number;
      writing: number;
      listening: number;
      speaking: number;
      vocabulary: number;
      grammar: number;
      games: number;
    };
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "progress" | "milestone" | "activity" | "skill" | "special";
  icon: string;
  xpReward: number;
  unlockedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  category: string;
  unlockedAt?: Date;
}

// Fetch the user's gamification profile
export function useGamificationProfile() {
  return useQuery({
    queryKey: ["gamification", "profile"],
    queryFn: async () => {
      const response = await axios.get("/api/gamification/profile");
      return response.data.profile as IGamificationProfile;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch user achievements with details
export function useUserAchievements() {
  return useQuery({
    queryKey: ["gamification", "achievements"],
    queryFn: async () => {
      const response = await axios.get("/api/gamification/achievements");
      return response.data.achievements as Achievement[];
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch user badges with details
export function useUserBadges() {
  return useQuery({
    queryKey: ["gamification", "badges"],
    queryFn: async () => {
      const response = await axios.get("/api/gamification/badges");
      return response.data.badges as Badge[];
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Record an activity (awards XP)
export function useRecordActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      module,
      activityType,
      metadata,
    }: {
      module: string;
      activityType: string;
      metadata?: Record<string, any>;
    }) => {
      const response = await axios.post("/api/gamification/activity", {
        module,
        activityType,
        metadata,
      });
      return response.data;
    },
    onSuccess: data => {
      // If user leveled up, show a toast
      if (data.leveledUp) {
        toast({
          title: "🎉 Level Up!",
          description: `Congratulations! You've reached level ${data.newLevel}`,
          variant: "default",
        });
      }

      // If user earned achievements, show a toast
      if (data.newAchievements?.length > 0) {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `You've earned: ${data.newAchievements[0].name}`,
          variant: "default",
        });
      }

      // If user earned badges, show a toast
      if (data.newBadges?.length > 0) {
        toast({
          title: "🥇 Badge Earned!",
          description: `You've earned: ${data.newBadges[0].name}`,
          variant: "default",
        });
      }

      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record activity",
        variant: "destructive",
      });
    },
  });
}

// Fetch leaderboard data
export function useLeaderboard(
  type: "weekly" | "monthly" | "all-time" = "weekly",
  category: "xp" | "streak" | "module-specific" = "xp",
  module?: string
) {
  return useQuery({
    queryKey: ["gamification", "leaderboard", type, category, module],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("type", type);
      params.append("category", category);
      if (module) params.append("module", module);

      const response = await axios.get(
        `/api/gamification/leaderboard?${params.toString()}`
      );
      return response.data.leaderboard;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
