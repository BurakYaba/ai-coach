"use client";

import { format } from "date-fns";
import { Medal } from "lucide-react";

import { Badge as UIBadge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Badge } from "@/hooks/use-gamification";

interface BadgeCardProps {
  badge: Badge;
  unlocked?: boolean;
}

export function BadgeCard({ badge, unlocked = false }: BadgeCardProps) {
  // Simplified - using the same Medal icon for all badges
  const IconComponent = Medal;

  const tierColors = {
    bronze: "bg-amber-700/20 text-amber-700 ring-amber-700/20",
    silver: "bg-slate-400/20 text-slate-400 ring-slate-400/20",
    gold: "bg-yellow-500/20 text-yellow-500 ring-yellow-500/20",
    platinum: "bg-cyan-400/20 text-cyan-400 ring-cyan-400/20",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden backdrop-blur-sm transition-all duration-300",
        unlocked
          ? "bg-gradient-to-br from-background to-background/80 border-muted/20 hover:border-primary/30"
          : "bg-gradient-to-br from-muted/10 to-muted/5 border-muted/10 opacity-70"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-center">
          <div
            className={cn(
              "p-4 rounded-full ring-2 ring-offset-2 ring-offset-background",
              tierColors[badge.tier] ||
                "bg-primary/10 text-primary ring-primary/10"
            )}
          >
            <IconComponent className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-base mt-3 text-center">
          {badge.name}
        </CardTitle>
        <CardDescription className="text-center">
          {badge.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between">
          <UIBadge
            variant="outline"
            className={cn(
              "text-xs capitalize px-2 py-0.5",
              unlocked ? "opacity-100" : "opacity-70"
            )}
          >
            {badge.category}
          </UIBadge>

          <UIBadge
            className={cn(
              "text-xs capitalize px-2 py-0.5",
              tierColors[badge.tier] || "bg-primary/10 text-primary",
              unlocked ? "opacity-100" : "opacity-70"
            )}
          >
            {badge.tier}
          </UIBadge>
        </div>
        {unlocked && badge.unlockedAt && (
          <div className="text-xs text-center text-muted-foreground mt-3">
            Earned on {format(new Date(badge.unlockedAt), "MMMM d, yyyy")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
