"use client";

import { DashboardNav } from "./nav";
import { UserNav } from "./user-nav";
import { XpProgress } from "./xp-progress";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <span className="font-bold text-lg mr-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Coach
          </span>
          <div className="hidden md:flex">
            <DashboardNav />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <XpProgress />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
