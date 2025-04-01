import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  href?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      children,
      href,
      variant = 'default',
      size = 'default',
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'relative inline-flex items-center justify-center transition-all duration-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none overflow-hidden',
      {
        'rounded-full': true,
        'h-10 px-6': size === 'default',
        'h-8 px-4 text-sm': size === 'sm',
        'h-12 px-8': size === 'lg',
        'bg-transparent': variant === 'ghost',
        'backdrop-blur-sm border border-foreground/10': variant === 'outline',
        'text-foreground-foreground': variant !== 'ghost',
      },
      className
    );

    const renderButton = () => (
      <button className={baseClasses} ref={ref} {...props}>
        {variant === 'default' && (
          <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-85 hover:opacity-100 transition-opacity" />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );

    const renderLink = () => (
      <Link href={href!} className={baseClasses}>
        {variant === 'default' && (
          <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-85 hover:opacity-100 transition-opacity" />
        )}
        <span className="relative z-10">{children}</span>
      </Link>
    );

    return href ? renderLink() : renderButton();
  }
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
