import * as React from 'react';

import { cn } from '@/lib/utils';

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'secondary';
  noPadding?: boolean;
  borderOpacity?: 'low' | 'medium' | 'high';
}

export function GradientCard({
  className,
  children,
  variant = 'default',
  noPadding = false,
  borderOpacity = 'medium',
  ...props
}: GradientCardProps) {
  const gradientVariants = {
    default: 'from-primary via-accent to-secondary',
    accent: 'from-accent via-secondary to-primary',
    secondary: 'from-secondary via-primary to-accent',
  };

  const borderOpacityClasses = {
    low: 'bg-opacity-30',
    medium: 'bg-opacity-50',
    high: 'bg-opacity-80',
  };

  return (
    <div className="relative z-1" {...props}>
      <div
        className={cn(
          'p-0.5 rounded-2xl bg-gradient-to-r',
          gradientVariants[variant],
          borderOpacityClasses[borderOpacity]
        )}
      >
        <div
          className={cn(
            'relative bg-background rounded-[1rem]',
            !noPadding && 'p-6 md:p-8',
            className
          )}
        >
          {/* If we want a small header bar like in Brainwave */}
          <div className="h-[1.4rem] bg-foreground bg-opacity-5 rounded-t-[0.9rem] -mt-6 -mx-6 md:-mx-8 mb-6" />
          {children}
        </div>
      </div>
    </div>
  );
}

export function GradientCardSimple({
  className,
  children,
  variant = 'default',
  noPadding = false,
  borderOpacity = 'medium',
  ...props
}: GradientCardProps) {
  const gradientVariants = {
    default: 'from-primary via-accent to-secondary',
    accent: 'from-accent via-secondary to-primary',
    secondary: 'from-secondary via-primary to-accent',
  };

  const borderOpacityClasses = {
    low: 'bg-opacity-30',
    medium: 'bg-opacity-50',
    high: 'bg-opacity-80',
  };

  return (
    <div className="relative z-1" {...props}>
      <div
        className={cn(
          'p-0.5 rounded-2xl bg-gradient-to-r',
          gradientVariants[variant],
          borderOpacityClasses[borderOpacity]
        )}
      >
        <div
          className={cn(
            'relative bg-background rounded-[1rem]',
            !noPadding && 'p-6 md:p-8',
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
