"use client";

import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { School, MapPin, MessageSquare, History } from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const initials = user.name
    ? user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none group transition-transform hover:scale-105"
        data-tour="user-nav"
      >
        <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20 transition-all">
          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border-muted/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-muted/20" />

        {/* Admin Dashboard Link for school_admin and admin roles */}
        {(userRole === "school_admin" || userRole === "admin") && (
          <DropdownMenuItem
            asChild
            className="py-2 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <a href="/school-admin" className="flex items-center">
              <School className="mr-2 h-4 w-4" />
              <span>School Admin</span>
            </a>
          </DropdownMenuItem>
        )}

        {/* System Admin Link for admin role */}
        {userRole === "admin" && (
          <DropdownMenuItem
            asChild
            className="py-2 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <a href="/admin" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Admin Dashboard</span>
            </a>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          asChild
          className="py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <a href="/dashboard/profile" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <a href="/dashboard/learning-path" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Learning Path</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <a href="/dashboard/subscription" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            <span>Billing & Subscription</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <a href="/dashboard/settings" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Settings</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-muted/20" />

        {/* Feedback Form */}
        <FeedbackForm
          trigger={
            <DropdownMenuItem
              className="py-2 cursor-pointer hover:bg-muted/50 transition-colors flex items-center"
              onSelect={e => e.preventDefault()}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Give Feedback</span>
            </DropdownMenuItem>
          }
        />

        {/* My Feedback History */}
        <DropdownMenuItem
          asChild
          className="py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <a href="/dashboard/feedback" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            <span>My Feedback</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-muted/20" />
        <DropdownMenuItem
          className="py-2 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors flex items-center"
          onSelect={() => signOut({ callbackUrl: "/login" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
