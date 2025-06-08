"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideIcon,
  Users,
  School,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface SidebarItemProps {
  icon: LucideIcon;
  title: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  title,
  href,
  isActive,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  );
};

export function SchoolAdminSidebar() {
  const pathnameValue = usePathname();
  const pathname = pathnameValue !== null ? pathnameValue : "";

  return (
    <div className="pb-12 w-64 border-r bg-card">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            School Admin
          </h2>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarItem
              icon={School}
              title="School Overview"
              href="/school-admin"
              isActive={pathname === "/school-admin"}
            />
            <SidebarItem
              icon={Users}
              title="Students"
              href="/school-admin/students"
              isActive={pathname.startsWith("/school-admin/students")}
            />
            <SidebarItem
              icon={BarChart}
              title="Analytics"
              href="/school-admin/analytics"
              isActive={pathname.startsWith("/school-admin/analytics")}
            />
            <SidebarItem
              icon={Settings}
              title="Settings"
              href="/school-admin/settings"
              isActive={pathname.startsWith("/school-admin/settings")}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 px-3 w-64">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
