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
    href: "/dashboard/games",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex space-x-3 lg:space-x-4 xl:space-x-6 2xl:space-x-8"
      data-tour="dashboard-nav"
    >
      {navItems.map((item, index) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "pb-2 px-1 text-xs lg:text-sm xl:text-sm font-medium transition-all duration-200 whitespace-nowrap",
              isActive
                ? "border-b-2 border-white text-white"
                : "text-white/70 hover:text-white hover:border-b-2 hover:border-white/50"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
