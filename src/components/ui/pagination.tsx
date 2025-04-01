'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// The existing Pagination component
interface PaginationProps extends React.ComponentProps<'nav'> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  // Support both usage patterns - either with direct props or with children components
  if (currentPage && totalPages && onPageChange) {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Creates an array of page numbers to be displayed
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesShown = 5;
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesShown - 1);

      // Adjust startPage if endPage is at max total pages
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesShown + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };

    return (
      <nav
        className={cn('flex items-center justify-between px-2', className)}
        {...props}
      >
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            className="h-8 w-8"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="h-8 w-8"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {getPageNumbers().map(pageNum => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              onClick={() => onPageChange(pageNum)}
              className="h-8 w-8"
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="h-8 w-8"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            className="h-8 w-8"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn('flex items-center justify-center', className)}
      {...props}
    />
  );
}

// New pagination components that match the import expectations

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

export type PaginationLinkProps = {
  isActive?: boolean;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'a'> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({ className, isActive, children, ...props }, ref) => (
  <a
    ref={ref}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
      isActive
        ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
        : 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
      className
    )}
    {...props}
  >
    {children}
  </a>
));
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground',
      className
    )}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4 mr-1" />
    <span>Previous</span>
  </button>
));
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground',
      className
    )}
    {...props}
  >
    <span>Next</span>
    <ChevronRightIcon className="h-4 w-4 ml-1" />
  </button>
));
PaginationNext.displayName = 'PaginationNext';
