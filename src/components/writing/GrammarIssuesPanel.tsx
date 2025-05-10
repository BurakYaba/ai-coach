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
  type: string;
  context: string;
  suggestion: string;
  explanation: string;
  message?: string;
  original?: string;
}

interface GrammarIssuesPanelProps {
  issues: GrammarIssue[];
  sessionId: string;
  sourceModule: "writing" | "speaking";
  ceferLevel?: string;
}

export function GrammarIssuesPanel({
  issues,
  sessionId,
  sourceModule,
  ceferLevel = "B1",
}: GrammarIssuesPanelProps) {
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
            No grammar issues found in this session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Great job! Your writing doesn't have any significant grammar errors.
          </p>
        </CardContent>
      </Card>
    );
  }

  const addToGrammarModule = async (issue: GrammarIssue) => {
    const issueKey = `${issue.type}-${issue.context}`;

    try {
      setIsAddingGrammarIssue(prev => ({ ...prev, [issueKey]: true }));

      const response = await fetch("/api/grammar/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceModule,
          sourceSessionId: sessionId,
          issue: {
            type: issue.type,
            text: issue.context,
            correction: issue.suggestion,
            explanation: issue.explanation,
          },
          ceferLevel,
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
          Identified grammar errors in your {sourceModule}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, index) => {
            const issueKey = `${issue.type}-${issue.context}`;
            const isAdded = addedGrammarIssues[issueKey];
            const isAdding = isAddingGrammarIssue[issueKey];

            return (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{issue.type}</h4>
                    <p className="text-sm text-muted-foreground line-through">
                      {issue.context}
                    </p>
                    <p className="text-sm">{issue.suggestion}</p>
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
