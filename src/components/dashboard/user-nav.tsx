"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  MessageSquare,
  History,
  User,
  CreditCard,
  Settings,
  Star,
  LogOut,
} from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
// Simple translations for user navigation
const userNavTranslations = {
  en: {
    profile: "Profile",
    billing: "Subscription",
    settings: "Settings",
    feedback: "Send Feedback",
    feedbackHistory: "My Feedback",
    logout: "Log Out",
  },
  tr: {
    profile: "Profil",
    billing: "Abonelik",
    settings: "Ayarlar",
    feedback: "Geri Bildirim Gönder",
    feedbackHistory: "Geri Bildirimlerim",
    logout: "Çıkış Yap",
  },
};

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  children?: React.ReactNode;
}

export function UserNav({ user, children }: UserNavProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Detect language from pathname
  const language: "en" | "tr" = pathname?.startsWith("/tr") ? "tr" : "en";
  const t = userNavTranslations[language];

  const userRole = session?.user?.role || "student";

  const initials = user.name
    ? user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
    : "?";

  // Proper logout function that cleans up database sessions
  const handleLogout = async () => {
    try {
      // First, call our custom logout API to terminate the database session
      if (session?.user?.sessionToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "logout",
          }),
        });
      }
    } catch (error) {
      console.error("Error calling logout API:", error);
      // Continue with logout even if session cleanup fails
    }

    // Then sign out with NextAuth
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

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
            <span className="text-gray-700">{t.profile}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/subscription">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">{t.billing}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/settings">
            <Settings className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">{t.settings}</span>
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
              <span className="text-gray-700">{t.feedback}</span>
            </DropdownMenuItem>
          }
        />

        {/* My Feedback History */}
        <DropdownMenuItem
          asChild
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Link href="/dashboard/feedback">
            <History className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">{t.feedbackHistory}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
