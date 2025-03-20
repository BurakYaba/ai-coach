'use client';

import { DashboardNav } from './nav';
import { UserNav } from './user-nav';

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <DashboardNav />
        </div>
        <div className="flex items-center space-x-4">
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
