"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  School,
  MapPin,
  MessageSquare,
  History,
  User,
  CreditCard,
  Settings,
  Star,
  LogOut,
} from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  children?: React.ReactNode;
}

export function UserNav({ user, children }: UserNavProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const initials = user.name
    ? user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const defaultTrigger = (
    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white hover:shadow-lg transition-all duration-200">
      {initials}
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none group transition-transform hover:scale-105"
        data-tour="user-nav"
        asChild={!!children}
      >
        {children || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4 bg-white shadow-xl border border-gray-100 rounded-2xl">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Admin Dashboard Link for school_admin and admin roles */}
        {(userRole === "school_admin" || userRole === "admin") && (
          <DropdownMenuItem
            asChild
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <Link href="/school-admin">
              <School className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">School Admin</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* System Admin Link for admin role */}
        {userRole === "admin" && (
          <DropdownMenuItem
            asChild
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <Link href="/admin">
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/profile">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/learning-path">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Learning Path</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/subscription">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Billing & Subscription</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/settings">
            <Settings className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        {/* Feedback Form */}
        <FeedbackForm
          trigger={
            <DropdownMenuItem
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              onSelect={e => e.preventDefault()}
            >
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Give Feedback</span>
            </DropdownMenuItem>
          }
        />

        {/* My Feedback History */}
        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/feedback">
            <Star className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">My Feedback</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 cursor-pointer text-red-600"
          onSelect={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
