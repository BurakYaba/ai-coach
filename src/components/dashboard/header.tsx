"use client";

import { useState } from "react";
import { Menu, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { DashboardNav } from "./nav";
import { UserNav } from "./user-nav";
import { XpProgress } from "./xp-progress";
import { SubscriptionBadge } from "./subscription-badge";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  subscription?: {
    type: "free" | "monthly" | "annual";
    status: "active" | "expired" | "pending";
    startDate?: string;
    endDate?: string;
  };
  isIndividualUser?: boolean;
}

export default function DashboardHeader({
  user,
  subscription,
  isIndividualUser,
}: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Fluenta</span>
          </div>
          <div className="hidden md:flex">
            <DashboardNav />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {subscription && (
            <SubscriptionBadge
              subscription={subscription}
              isIndividualUser={isIndividualUser}
            />
          )}
          <XpProgress />

          {/* Only show UserNav on medium screens and above */}
          <div className="hidden md:block">
            <UserNav user={user} />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Fluenta
                    </span>
                  </div>

                  {/* User profile in mobile menu */}
                  <div className="mb-6 pb-6 border-b border-muted/20">
                    <div className="flex items-center gap-4">
                      <UserNav user={user} />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <DashboardNavMobile onItemClick={() => setIsOpen(false)} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile navigation component with vertical layout
function DashboardNavMobile({ onItemClick }: { onItemClick: () => void }) {
  const navItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Listening", href: "/dashboard/listening" },
    { title: "Reading", href: "/dashboard/reading" },
    { title: "Vocabulary", href: "/dashboard/vocabulary" },
    { title: "Writing", href: "/dashboard/writing" },
    { title: "Speaking", href: "/dashboard/speaking" },
    { title: "Grammar", href: "/dashboard/grammar" },
    { title: "Games", href: "/games" },
  ];

  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map(item => (
        <a
          key={item.href}
          href={item.href}
          className="px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted/50 hover:text-primary"
          onClick={onItemClick}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
