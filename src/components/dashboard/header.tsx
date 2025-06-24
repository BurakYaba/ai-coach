"use client";

import { useState } from "react";
import { Menu, Star, Calendar, CreditCard, CalendarClock } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { DashboardNav } from "./nav";
import { UserNav } from "./user-nav";
import { XpProgress } from "./xp-progress";
import { SubscriptionBadge } from "./subscription-badge";
import DashboardTourTrigger from "../tours/DashboardTourTrigger";

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
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
        {/* Full width layout with three sections */}
        <div className="flex items-center justify-between w-full">
          {/* Left side - Logo only */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 flex items-center justify-center">
              <Image
                src="/favicon.svg"
                alt="Fluenta"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6"
              />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-2xl font-bold">
              Fluenta
            </h1>
          </div>

          {/* Center - Navigation (hidden on mobile and small tablets) */}
          <div className="hidden lg:flex flex-1 justify-center">
            <DashboardNav />
          </div>

          {/* Right side - User info and controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 flex-shrink-0">
            {/* Subscription Badge */}
            {subscription && (
              <div className="hidden sm:block">
                <SubscriptionBadge
                  subscription={subscription}
                  isIndividualUser={isIndividualUser}
                />
              </div>
            )}

            {/* XP Progress */}
            <div className="hidden xs:block">
              <XpProgress />
            </div>

            {/* Tour button - visible on all devices */}
            <DashboardTourTrigger />

            {/* User Navigation - hidden on mobile */}
            <div className="hidden lg:block">
              <UserNav user={user} />
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 sm:p-2 focus:outline-none">
                    <Menu className="h-7 w-7 sm:h-8 sm:w-8" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[250px] sm:w-[350px] p-0"
                >
                  <div className="flex flex-col h-full bg-white">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Image
                            src="/favicon.svg"
                            alt="Fluenta"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        </div>
                        <span className="font-bold text-lg text-white">
                          Fluenta
                        </span>
                      </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="p-4 border-b border-gray-100">
                      <UserNav user={user}>
                        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors w-full">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
                            {user.name
                              ? user.name
                                  .split(" ")
                                  .map(n => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 text-base truncate">
                              {user.name}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </UserNav>
                    </div>

                    {/* XP Progress Section - Clickable for mobile */}
                    <div className="p-4 border-b border-gray-100">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Level & XP
                            </span>
                          </div>
                          <XpProgress />
                        </div>
                      </Link>
                    </div>

                    {/* Subscription Section - Clickable for mobile */}
                    {subscription && (
                      <div className="p-4 border-b border-gray-100">
                        <Link
                          href="/dashboard/subscription"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Calendar className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                Subscription
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-800 capitalize">
                                {subscription.type}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  subscription.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : subscription.status === "expired"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {subscription.status}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Navigation
                      </h5>
                      <DashboardNavMobile
                        onItemClick={() => setIsOpen(false)}
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile navigation component with vertical layout
function DashboardNavMobile({ onItemClick }: { onItemClick: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "🏠" },
    { title: "Listening", href: "/dashboard/listening", icon: "🎧" },
    { title: "Reading", href: "/dashboard/reading", icon: "📖" },
    { title: "Vocabulary", href: "/dashboard/vocabulary", icon: "📝" },
    { title: "Writing", href: "/dashboard/writing", icon: "✍️" },
    { title: "Speaking", href: "/dashboard/speaking", icon: "🗣️" },
    { title: "Grammar", href: "/dashboard/grammar", icon: "📚" },
    { title: "Games", href: "/dashboard/games", icon: "🎮" },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map(item => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={onItemClick}
          >
            <span className="text-base">{item.icon}</span>
            <span className="font-medium text-sm">{item.title}</span>
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
