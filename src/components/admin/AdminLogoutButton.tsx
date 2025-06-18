"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const { data: session } = useSession();

  // Proper logout function that cleans up database sessions
  const handleLogout = async () => {
    try {
      // First, call our custom logout API to terminate the database session
      if (session?.user?.sessionToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
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

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
