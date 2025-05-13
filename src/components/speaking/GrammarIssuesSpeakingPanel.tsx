"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface GrammarIssue {
  text: string;
  issue: string;
  correction: string;
  explanation: string;
}

interface GrammarIssuesSpeakingPanelProps {
  issues: GrammarIssue[];
  sessionId: string;
  ceferLevel?: string;
}

export function GrammarIssuesSpeakingPanel({
  issues,
  sessionId,
  ceferLevel = "B1",
}: GrammarIssuesSpeakingPanelProps) {
  const [addedGrammarIssues, setAddedGrammarIssues] = useState<
    Record<string, boolean>
  >({});
  const [isAddingGrammarIssue, setIsAddingGrammarIssue] = useState<
    Record<string, boolean>
  >({});

  if (!issues || issues.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grammar Issues</CardTitle>
          <CardDescription>
            No grammar issues found in this speaking session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Great job! Your speaking doesn't have any significant grammar
            errors.
          </p>
        </CardContent>
      </Card>
    );
  }

  const addToGrammarModule = async (issue: GrammarIssue) => {
    const issueKey = `${issue.issue}-${issue.text}`;

    try {
      setIsAddingGrammarIssue(prev => ({ ...prev, [issueKey]: true }));

      // Ensure CEFR level is uppercase (e.g., convert "b1" to "B1")
      const normalizedCeferLevel = ceferLevel ? ceferLevel.toUpperCase() : "B1";

      const response = await fetch("/api/grammar/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceModule: "speaking",
          sourceSessionId: sessionId,
          issue: {
            type: issue.issue,
            text: issue.text,
            correction: issue.correction,
            explanation: issue.explanation,
          },
          ceferLevel: normalizedCeferLevel,
        }),
      });

      if (response.ok) {
        setAddedGrammarIssues(prev => ({ ...prev, [issueKey]: true }));
        toast({
          title: "Added to Grammar",
          description:
            "This grammar issue has been added to your Grammar module",
        });
      } else {
        throw new Error("Failed to add grammar issue");
      }
    } catch (error) {
      console.error("Error adding grammar issue:", error);
      toast({
        title: "Error",
        description: "Failed to add grammar issue",
        variant: "destructive",
      });
    } finally {
      setIsAddingGrammarIssue(prev => {
        const newState = { ...prev };
        delete newState[issueKey];
        return newState;
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Grammar Issues</CardTitle>
        <CardDescription>
          Identified grammar errors in your speaking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, index) => {
            const issueKey = `${issue.issue}-${issue.text}`;
            const isAdded = addedGrammarIssues[issueKey];
            const isAdding = isAddingGrammarIssue[issueKey];

            return (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{issue.issue}</h4>
                    <p className="text-sm text-muted-foreground line-through">
                      {issue.text}
                    </p>
                    <p className="text-sm">{issue.correction}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isAdded ? "outline" : "secondary"}
                    disabled={isAdded || isAdding}
                    onClick={() => addToGrammarModule(issue)}
                  >
                    {isAdding ? (
                      "Adding..."
                    ) : isAdded ? (
                      <>
                        <Check className="mr-1 h-4 w-4" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="mr-1 h-4 w-4" />
                        Add to Grammar
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm border-l-2 border-primary/20 pl-3">
                  {issue.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
