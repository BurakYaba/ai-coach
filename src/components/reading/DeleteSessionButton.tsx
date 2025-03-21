'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, memo } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteSessionButtonProps {
  sessionId: string;
}

// Use memo to prevent unnecessary re-renders
export const DeleteSessionButton = memo(function DeleteSessionButton({
  sessionId,
}: DeleteSessionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Use useCallback to memoize the handler
  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/reading/sessions/${sessionId}/delete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Use router.push instead of window.location for better performance
        router.push('/dashboard/reading?success=deleted');
      } else {
        router.push('/dashboard/reading?error=delete-failed');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      router.push('/dashboard/reading?error=delete-failed');
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  }, [sessionId, isDeleting, router]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Session
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            reading session and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
