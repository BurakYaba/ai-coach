"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Listening",
    href: "/dashboard/listening",
  },
  {
    title: "Reading",
    href: "/dashboard/reading",
  },
  {
    title: "Vocabulary",
    href: "/dashboard/vocabulary",
  },
  {
    title: "Writing",
    href: "/dashboard/writing",
  },
  {
    title: "Speaking",
    href: "/dashboard/speaking",
  },
  {
    title: "Grammar",
    href: "/dashboard/grammar",
  },
  {
    title: "Games",
    href: "/games",
  },
  {
    title: "Billing",
    href: "/dashboard/subscription",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center space-x-1 lg:space-x-2"
      data-tour="dashboard-nav"
    >
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted/50 hover:text-primary",
            pathname === item.href ||
              (item.href === "/games" && pathname?.startsWith("/games")) ||
              (item.href === "/dashboard/grammar" &&
                pathname?.startsWith("/dashboard/grammar"))
              ? "text-primary bg-primary/5 shadow-sm"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
