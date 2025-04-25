"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback, memo } from "react";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DeleteSpeakingSessionButtonProps {
  sessionId: string;
  variant?: "button" | "icon";
}

// Use memo to prevent unnecessary re-renders
export const DeleteSpeakingSessionButton = memo(
  function DeleteSpeakingSessionButton({
    sessionId,
    variant = "button",
  }: DeleteSpeakingSessionButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Use useCallback to memoize the handler
    const handleDelete = useCallback(async () => {
      if (isDeleting) return;

      try {
        setIsDeleting(true);
        const response = await fetch(`/api/speaking/sessions/${sessionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Show success toast
          toast({
            title: "Success",
            description: "Speaking session deleted successfully.",
            variant: "default",
          });

          // Navigate to the speaking dashboard
          router.push("/dashboard/speaking", { scroll: true });
        } else {
          const errorData = await response.json();
          toast({
            title: "Error",
            description:
              errorData.error || "Failed to delete speaking session.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting speaking session:", error);
        toast({
          title: "Error",
          description: "Failed to delete speaking session. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setIsOpen(false);
      }
    }, [sessionId, isDeleting, router]);

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          {variant === "button" ? (
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={e => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Session
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={e => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Session</span>
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              speaking session and all associated data, including transcripts,
              recordings, and analysis results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);
