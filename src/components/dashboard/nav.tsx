'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Reading',
    href: '/dashboard/reading',
  },
  {
    title: 'Vocabulary',
    href: '/dashboard/vocabulary',
  },
  {
    title: 'Writing',
    href: '/dashboard/writing',
  },
  {
    title: 'Speaking',
    href: '/dashboard/speaking',
  },
  {
    title: 'Progress',
    href: '/dashboard/progress',
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
