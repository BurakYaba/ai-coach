"use client";

// Remove the HeroIcons import
// import {
//   XCircleIcon,
//   LightBulbIcon,
//   CheckCircleIcon,
//   ArrowTrendingUpIcon,
// } from '@heroicons/react/24/outline';
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface WritingSession {
  _id: string;
  prompt: {
    text: string;
    type: string;
    topic: string;
    targetLength: number;
  };
  submission: {
    content: string;
    finalVersion: {
      submittedAt: string;
      wordCount: number;
    };
  };
  analysis: {
    overallScore: number;
    summaryFeedback: string;
    lengthAssessment: {
      assessment: string;
      feedback: string;
    };
    strengths: string[];
    improvements: string[];
    details: {
      grammar: {
        score: number;
        errorList: {
          type: string;
          context: string;
          suggestion: string;
          explanation: string;
          message?: string;
          original?: string;
        }[];
        suggestions: string[];
        strengths: string[];
        improvements: string[];
      };
      vocabulary: {
        score: number;
        level: string;
        strengths: string[];
        improvements: string[];
        wordFrequency: {
          word: string;
          count: number;
          category: string;
        }[];
      };
      structure: {
        score: number;
        strengths: string[];
        improvements: string[];
      };
      content: {
        score: number;
        relevance: number;
        depth: number;
        strengths: string[];
        improvements: string[];
      };
    };
    grammarIssues?: GrammarIssue[];
    vocabularyAnalysis?: VocabularyAnalysis;
    feedback?: EnhancedFeedback;
    grammarScore?: number;
    vocabularyScore?: number;
    coherenceScore?: number;
    styleScore?: number;
    timestamp: Date;
    analyzedAt: string;
  };
  status: "draft" | "submitted" | "analyzed" | "completed";
}

// Add the interface definitions for the OpenAI analyzer types
interface GrammarIssue {
  type: string;
  context: string;
  suggestion: string;
  explanation: string;
  message?: string;
  original?: string;
}

interface VocabularySuggestion {
  original: string;
  alternatives: string[];
  context?: string;
}

interface VocabularyAnalysis {
  uniqueWords: number;
  wordFrequency: { word: string; count: number; category: string }[];
  suggestions: VocabularySuggestion[];
  level: string;
  strengths: string[];
  improvements: string[];
}

interface EnhancedFeedback {
  overallAssessment: string;
  assessment?: string;
  scoreBreakdown: {
    grammar: string;
    vocabulary: string;
    coherence: string;
    style: string;
    overall: string;
  };
  strengths: string[];
  areasForImprovement: string[];
  suggestionsForImprovement: string[];
  suggestions?: string[];
  improvements: string[];
  detailedAnalysis?: string;
  nextSteps?: string;
}

interface ScoreCardProps {
  score: number;
  title: string;
  description: string;
}

// Add ScoreCard component
const ScoreCard: React.FC<ScoreCardProps> = ({ score, title, description }) => {
  // Calculate color based on score
  let color = "bg-gray-100";
  let textColor = "text-gray-700";

  if (score >= 90) {
    color = "bg-green-100";
    textColor = "text-green-700";
  } else if (score >= 75) {
    color = "bg-blue-100";
    textColor = "text-blue-700";
  } else if (score >= 60) {
    color = "bg-yellow-100";
    textColor = "text-yellow-700";
  } else if (score > 0) {
    color = "bg-red-100";
    textColor = "text-red-700";
  }

  return (
    <div className={`p-4 rounded-lg ${color}`}>
      <h3 className={`font-semibold text-lg ${textColor}`}>{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
      <div className="mt-3 flex items-center">
        <div className="font-bold text-3xl mr-2">{score}</div>
        <div className="text-gray-500 text-sm">/100</div>
      </div>
    </div>
  );
};

// Define HeroIcons components with proper types
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const XCircleIcon: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LightBulbIcon: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
    />
  </svg>
);

const CheckCircleIcon: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ArrowTrendingUpIcon: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
    />
  </svg>
);

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<WritingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentVocabCardIndex, setCurrentVocabCardIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const vocabSliderRef = useRef<HTMLDivElement>(null);

  // Fetch session data
  useEffect(() => {
    async function fetchSession() {
      try {
        console.log("Fetching session data for:", sessionId);
        const response = await fetch(`/api/writing/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        console.log("Session data received:", data.session);
        console.log("Analysis data:", data.session.analysis);
        setSession(data.session);

        // If session is not analyzed, redirect to analyze page
        if (
          data.session.status !== "analyzed" &&
          data.session.status !== "completed"
        ) {
          toast({
            title: "Not Analyzed",
            description: "This writing session has not been analyzed yet.",
          });
          router.push(`/dashboard/writing/${sessionId}/analyze`);
        }
      } catch (error) {
        console.error("Error fetching writing session:", error);
        setError("Failed to load writing session");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId, router]);

  // Function to handle grammar slider navigation
  const handlePrevCard = () => {
    if (!session?.analysis?.grammarIssues?.length) return;

    setCurrentCardIndex(prev => {
      if (prev === 0) {
        return Math.max(0, session.analysis.grammarIssues!.length - 3);
      }
      return Math.max(0, prev - 1);
    });
  };

  const handleNextCard = () => {
    if (!session?.analysis?.grammarIssues?.length) return;

    setCurrentCardIndex(prev => {
      if (prev >= session.analysis.grammarIssues!.length - 3) {
        return 0;
      }
      return prev + 1;
    });
  };

  // Function to handle vocabulary slider navigation
  const handlePrevVocabCard = () => {
    if (!session?.analysis?.vocabularyAnalysis?.suggestions?.length) return;

    setCurrentVocabCardIndex(prev => {
      if (prev === 0) {
        return Math.max(
          0,
          session.analysis.vocabularyAnalysis!.suggestions.length - 3
        );
      }
      return Math.max(0, prev - 1);
    });
  };

  const handleNextVocabCard = () => {
    if (!session?.analysis?.vocabularyAnalysis?.suggestions?.length) return;

    setCurrentVocabCardIndex(prev => {
      if (prev >= session.analysis.vocabularyAnalysis!.suggestions.length - 3) {
        return 0;
      }
      return prev + 1;
    });
  };

  // Calculate total number of individual cards
  const totalCards = session?.analysis?.grammarIssues?.length || 0;
  const totalVocabCards =
    session?.analysis?.vocabularyAnalysis?.suggestions?.length || 0;

  // Check if we have more cards to show
  const hasMoreCards = totalCards > 3;
  const hasMoreVocabCards = totalVocabCards > 3;

  // Mark session as completed
  const handleComplete = async () => {
    try {
      const response = await fetch(
        `/api/writing/sessions/${sessionId}/complete`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete session");
      }

      toast({
        title: "Session Completed",
        description: "Your writing session has been marked as completed.",
      });

      // Refresh session data
      const updatedResponse = await fetch(`/api/writing/sessions/${sessionId}`);
      const data = await updatedResponse.json();
      setSession(data.session);
    } catch (error) {
      console.error("Error completing session:", error);
      toast({
        title: "Error",
        description: "Failed to complete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              There was an error loading your feedback. Please try again or go
              back to your writing dashboard.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/writing")}
            >
              Back to Dashboard
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Not Found</CardTitle>
            <CardDescription>
              The writing session you&apos;re looking for doesn&apos;t exist or
              you don&apos;t have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please check the URL or go back to your writing dashboard.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/writing")}>
              Back to Writing Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { analysis } = session;

  // Check if analysis data is available
  if (!analysis) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Not Available</CardTitle>
            <CardDescription>
              The analysis for this writing session is not available yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try analyzing this session again.</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                router.push(`/dashboard/writing/${sessionId}/analyze`)
              }
            >
              Analyze Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/writing")}
            >
              Back to Writing Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Extract analysis from the session
  const analysisData = analysis?.details || {};

  // Check if enhanced analysis from OpenAI is available
  const hasEnhancedAnalysis = Boolean(
    analysis &&
      (typeof analysis.grammarIssues !== "undefined" ||
        typeof analysis.vocabularyAnalysis !== "undefined") &&
      Array.isArray(analysis.grammarIssues || [])
  );

  // Check if there is enhanced feedback available
  const hasEnhancedFeedback = Boolean(
    analysis && analysis.feedback && typeof analysis.feedback === "object"
  );

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Writing Feedback
          </h1>
          <p className="text-muted-foreground mb-6">
            Review your feedback and improve your writing skills
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/writing/${sessionId}`}>
              View Submission
            </Link>
          </Button>

          {session.status !== "completed" && (
            <Button onClick={handleComplete}>Mark as Completed</Button>
          )}
        </div>
      </div>

      {/* Header Card with Title and Score */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-2">
              <CardTitle className="capitalize">
                {session.prompt.type}: {session.prompt.topic}
              </CardTitle>
              <CardDescription>
                {new Date(analysis.timestamp).toLocaleDateString()} •{" "}
                {session.submission.finalVersion.wordCount} words
              </CardDescription>
            </div>

            <div className="col-span-8">
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="text-sm italic text-foreground leading-relaxed">
                  {analysis.summaryFeedback || "No summary feedback available."}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex justify-end items-center gap-2">
              <Badge
                variant={session.status === "completed" ? "default" : "outline"}
              >
                {session.status === "completed" ? "Completed" : "Analyzed"}
              </Badge>
              <div className="flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-1 rounded-md">
                <span className="text-sm">Score:</span>
                <span className="text-lg font-bold">
                  {analysis.overallScore}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Analysis Tabs - Full width */}
      <div className="mt-6">
        <Tabs defaultValue="grammar" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="grammar" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Grammar & Spelling</CardTitle>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-1 rounded-md">
                    <span className="text-sm">Score:</span>
                    <span className="text-lg font-bold">
                      {hasEnhancedAnalysis &&
                      typeof analysis.grammarScore !== "undefined"
                        ? analysis.grammarScore
                        : analysisData.grammar?.score || "N/A"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display OpenAI grammar issues in slider if available */}
                {hasEnhancedAnalysis &&
                analysis.grammarIssues &&
                analysis.grammarIssues.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Errors Found</h3>
                      {hasMoreCards && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Showing {currentCardIndex + 1}-
                            {Math.min(currentCardIndex + 3, totalCards)} of{" "}
                            {totalCards}
                          </span>
                        </div>
                      )}
                    </div>

                    <div ref={sliderRef} className="overflow-hidden relative">
                      <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                          transform: `translateX(-${currentCardIndex * (100 / 3)}%)`,
                          width: "100%",
                        }}
                      >
                        {analysis.grammarIssues.map(
                          (issue: GrammarIssue, index: number) => (
                            <div
                              key={index}
                              className="w-1/3 px-2 flex-shrink-0 box-border"
                              style={{ maxWidth: "calc(100% / 3)" }}
                            >
                              <Card className="h-full">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base capitalize truncate">
                                    {issue.type || "Unknown"} Error
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div>
                                    <p className="text-sm font-medium">
                                      Context:
                                    </p>
                                    <div className="p-2 bg-muted rounded-md">
                                      <p className="text-sm break-words line-clamp-3">
                                        {issue.context ||
                                          "No context available"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Suggestion:
                                    </p>
                                    <div className="p-2 bg-primary/5 text-primary rounded-md">
                                      <p className="text-sm break-words line-clamp-2">
                                        {issue.suggestion ||
                                          "No suggestion available"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Explanation:
                                    </p>
                                    <p className="text-sm text-muted-foreground break-words line-clamp-3">
                                      {issue.explanation ||
                                        "No explanation available"}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {hasMoreCards && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevCard}
                          disabled={currentCardIndex === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextCard}
                          disabled={currentCardIndex >= totalCards - 3}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Fallback to original grammar errors
                  <>
                    {analysisData.grammar?.errorList &&
                    analysisData.grammar.errorList.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Errors Found</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {analysisData.grammar.errorList.map(
                            (error, index) => (
                              <Card key={index} className="h-full">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base capitalize">
                                    {error.type || "Unknown"} Error
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div>
                                    <p className="text-sm font-medium">
                                      Context:
                                    </p>
                                    <p className="p-2 bg-muted rounded-md">
                                      {error.context || "No context available"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Suggestion:
                                    </p>
                                    <p className="p-2 bg-primary/5 text-primary rounded-md">
                                      {error.suggestion ||
                                        "No suggestion available"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Explanation:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {error.explanation ||
                                        "No explanation available"}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p>No grammar errors found.</p>
                      </div>
                    )}
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Strengths</h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback && analysis.feedback?.strengths ? (
                        analysis.feedback.strengths
                          .filter(
                            s =>
                              s.toLowerCase().includes("grammar") ||
                              s.toLowerCase().includes("spelling")
                          )
                          .map((strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^grammar strength:\s*/i, "")
                              .replace(/^grammar:\s*/i, "")
                              .replace(/^spelling strength:\s*/i, "")
                              .replace(/^spelling:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          })
                      ) : analysisData.grammar?.strengths &&
                        analysisData.grammar.strengths.length > 0 ? (
                        analysisData.grammar.strengths.map(
                          (strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^grammar strength:\s*/i, "")
                              .replace(/^grammar:\s*/i, "")
                              .replace(/^spelling strength:\s*/i, "")
                              .replace(/^spelling:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <li>No grammar strengths identified.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback &&
                      analysis.feedback?.improvements ? (
                        analysis.feedback.improvements
                          .filter(
                            imp =>
                              imp.toLowerCase().includes("grammar") ||
                              imp.toLowerCase().includes("spelling")
                          )
                          .map((improvement: string, index: number) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^grammar improvement:\s*/i, "")
                              .replace(/^grammar:\s*/i, "")
                              .replace(/^spelling improvement:\s*/i, "")
                              .replace(/^spelling:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          })
                      ) : analysisData.grammar?.improvements &&
                        analysisData.grammar.improvements.length > 0 ? (
                        analysisData.grammar.improvements.map(
                          (improvement, index) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^grammar improvement:\s*/i, "")
                              .replace(/^grammar:\s*/i, "")
                              .replace(/^spelling improvement:\s*/i, "")
                              .replace(/^spelling:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-500">!</span>
                            <span>
                              Review your sentence structures for clarity and
                              variety.
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-500">!</span>
                            <span>
                              Check for consistent verb tense usage throughout
                              your writing.
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-500">!</span>
                            <span>
                              Pay attention to punctuation, particularly with
                              commas and periods.
                            </span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vocabulary" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Vocabulary Usage</CardTitle>
                    <CardDescription>
                      Estimated level:{" "}
                      <Badge variant="outline">
                        {hasEnhancedAnalysis && analysis.vocabularyScore
                          ? analysis.vocabularyScore > 85
                            ? "Advanced"
                            : analysis.vocabularyScore > 70
                              ? "Intermediate"
                              : "Basic"
                          : analysisData.vocabulary?.level || "Not assessed"}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-1 rounded-md">
                    <span className="text-sm">Score:</span>
                    <span className="text-lg font-bold">
                      {hasEnhancedAnalysis &&
                      typeof analysis.vocabularyScore !== "undefined"
                        ? analysis.vocabularyScore
                        : analysisData.vocabulary?.score || "N/A"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display OpenAI vocabulary suggestions in slider if available */}
                {hasEnhancedAnalysis &&
                  analysis.vocabularyAnalysis &&
                  analysis.vocabularyAnalysis.suggestions &&
                  analysis.vocabularyAnalysis.suggestions.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Word Suggestions
                        </h3>
                        {hasMoreVocabCards && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Showing {currentVocabCardIndex + 1}-
                              {Math.min(
                                currentVocabCardIndex + 3,
                                totalVocabCards
                              )}{" "}
                              of {totalVocabCards}
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        ref={vocabSliderRef}
                        className="overflow-hidden relative"
                      >
                        <div
                          className="flex transition-transform duration-300 ease-in-out"
                          style={{
                            transform: `translateX(-${currentVocabCardIndex * (100 / 3)}%)`,
                            width: "100%",
                          }}
                        >
                          {analysis.vocabularyAnalysis.suggestions.map(
                            (suggestion: VocabularySuggestion, index) => (
                              <div
                                key={index}
                                className="w-1/3 px-2 flex-shrink-0 box-border"
                                style={{ maxWidth: "calc(100% / 3)" }}
                              >
                                <Card className="h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                      <span className="font-mono">
                                        {suggestion.original}
                                      </span>{" "}
                                      → Alternative options
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {suggestion.alternatives.map((alt, i) => (
                                        <span
                                          key={i}
                                          className="inline-block bg-primary/5 px-2 py-1 rounded-full text-sm border border-primary/20"
                                        >
                                          {alt}
                                        </span>
                                      ))}
                                    </div>
                                    {suggestion.context && (
                                      <p className="text-sm text-muted-foreground">
                                        Context:{" "}
                                        <span className="italic">
                                          {suggestion.context}
                                        </span>
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {hasMoreVocabCards && (
                        <div className="flex justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevVocabCard}
                            disabled={currentVocabCardIndex === 0}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextVocabCard}
                            disabled={
                              currentVocabCardIndex >= totalVocabCards - 3
                            }
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Strengths</h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback && analysis.feedback?.strengths ? (
                        analysis.feedback.strengths
                          .filter(
                            s =>
                              s.toLowerCase().includes("vocabulary") ||
                              s.toLowerCase().includes("word")
                          )
                          .map((strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^vocabulary strength:\s*/i, "")
                              .replace(/^vocabulary:\s*/i, "")
                              .replace(/^word choice:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          })
                      ) : analysisData.vocabulary?.strengths &&
                        analysisData.vocabulary.strengths.length > 0 ? (
                        analysisData.vocabulary.strengths.map(
                          (strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^vocabulary strength:\s*/i, "")
                              .replace(/^vocabulary:\s*/i, "")
                              .replace(/^word choice:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <li>No vocabulary strengths identified.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback &&
                      analysis.feedback?.improvements ? (
                        analysis.feedback.improvements
                          .filter(
                            imp =>
                              imp.toLowerCase().includes("vocabulary") ||
                              imp.toLowerCase().includes("word")
                          )
                          .map((improvement, index) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^vocabulary improvement:\s*/i, "")
                              .replace(/^vocabulary:\s*/i, "")
                              .replace(/^word choice:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          })
                      ) : analysisData.vocabulary?.improvements &&
                        analysisData.vocabulary.improvements.length > 0 ? (
                        analysisData.vocabulary.improvements.map(
                          (improvement, index) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^vocabulary improvement:\s*/i, "")
                              .replace(/^vocabulary:\s*/i, "")
                              .replace(/^word choice:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <li>No vocabulary improvements suggested.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Show word frequency table only if no enhanced analysis */}
                {!hasEnhancedAnalysis &&
                  analysisData.vocabulary?.wordFrequency &&
                  analysisData.vocabulary.wordFrequency.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Word Frequency
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="p-2 border">Word</th>
                              <th className="p-2 border">Count</th>
                              <th className="p-2 border">Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysisData.vocabulary.wordFrequency.map(
                              (item, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0
                                      ? "bg-background"
                                      : "bg-muted/50"
                                  }
                                >
                                  <td className="p-2 border">
                                    {item.word || "N/A"}
                                  </td>
                                  <td className="p-2 border">
                                    {item.count || 0}
                                  </td>
                                  <td className="p-2 border capitalize">
                                    {item.category || "Unknown"}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Structure & Organization</CardTitle>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-1 rounded-md">
                    <span className="text-sm">Score:</span>
                    <span className="text-lg font-bold">
                      {hasEnhancedAnalysis &&
                      typeof analysis.coherenceScore !== "undefined"
                        ? analysis.coherenceScore
                        : analysisData.structure?.score || "N/A"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Strengths</h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback && analysis.feedback?.strengths ? (
                        analysis.feedback.strengths
                          .filter(
                            s =>
                              s.toLowerCase().includes("structure") ||
                              s.toLowerCase().includes("organization") ||
                              s.toLowerCase().includes("coherence") ||
                              s.toLowerCase().includes("flow") ||
                              s.toLowerCase().includes("paragraph")
                          )
                          .map((strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^structure strength:\s*/i, "")
                              .replace(/^structure:\s*/i, "")
                              .replace(/^organization:\s*/i, "")
                              .replace(/^coherence:\s*/i, "")
                              .replace(/^paragraph:\s*/i, "")
                              .replace(/^grammar strength:\s*/i, "")
                              .replace(/^grammar:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          })
                      ) : analysisData.structure?.strengths &&
                        analysisData.structure.strengths.length > 0 ? (
                        analysisData.structure.strengths.map(
                          (strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^structure strength:\s*/i, "")
                              .replace(/^structure:\s*/i, "")
                              .replace(/^organization:\s*/i, "")
                              .replace(/^coherence:\s*/i, "")
                              .replace(/^paragraph:\s*/i, "")
                              .replace(/^grammar strength:\s*/i, "")
                              .replace(/^grammar:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <li>No structure strengths identified.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback &&
                      analysis.feedback?.improvements ? (
                        analysis.feedback.improvements
                          .filter(
                            imp =>
                              imp.toLowerCase().includes("structure") ||
                              imp.toLowerCase().includes("organization") ||
                              imp.toLowerCase().includes("coherence") ||
                              imp.toLowerCase().includes("flow") ||
                              imp.toLowerCase().includes("paragraph")
                          )
                          .map((improvement, index) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^structure improvement:\s*/i, "")
                              .replace(/^structure:\s*/i, "")
                              .replace(/^organization:\s*/i, "")
                              .replace(/^coherence:\s*/i, "")
                              .replace(/^paragraph:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          })
                      ) : analysisData.structure?.improvements &&
                        analysisData.structure.improvements.length > 0 ? (
                        analysisData.structure.improvements.map(
                          (improvement, index) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^structure improvement:\s*/i, "")
                              .replace(/^structure:\s*/i, "")
                              .replace(/^organization:\s*/i, "")
                              .replace(/^coherence:\s*/i, "")
                              .replace(/^paragraph:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <li>No structure improvements suggested.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Structure Tips</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">•</span>
                      <span>
                        Make sure each paragraph focuses on a single main idea.
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">•</span>
                      <span>
                        Use transition words to connect ideas between
                        paragraphs.
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">•</span>
                      <span>
                        Ensure your introduction clearly presents your main
                        topic or thesis.
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">•</span>
                      <span>
                        Your conclusion should summarize key points and provide
                        closure.
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Content & Ideas</CardTitle>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-1 rounded-md">
                    <span className="text-sm">Score:</span>
                    <span className="text-lg font-bold">
                      {hasEnhancedAnalysis &&
                      typeof analysis.styleScore !== "undefined"
                        ? analysis.styleScore
                        : analysisData.content?.score || "N/A"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasEnhancedAnalysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Relevance</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Topic Relevance:</span>
                          <span className="font-medium">
                            {analysisData.content?.relevance || "N/A"}/100
                          </span>
                        </div>
                        <Progress
                          value={analysisData.content?.relevance || 0}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Depth</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Analysis Depth:</span>
                          <span className="font-medium">
                            {analysisData.content?.depth || "N/A"}/100
                          </span>
                        </div>
                        <Progress
                          value={analysisData.content?.depth || 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {hasEnhancedFeedback && analysis.feedback?.assessment && (
                  <div className="p-4 bg-primary/5 rounded-lg mb-4">
                    <h3 className="text-lg font-medium mb-2">
                      Overall Assessment
                    </h3>
                    <p className="text-muted-foreground">
                      {analysis.feedback.assessment}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Strengths</h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback && analysis.feedback?.strengths ? (
                        analysis.feedback.strengths
                          .filter(
                            s =>
                              s.toLowerCase().includes("content") ||
                              s.toLowerCase().includes("idea") ||
                              s.toLowerCase().includes("argument") ||
                              s.toLowerCase().includes("point") ||
                              s.toLowerCase().includes("topic")
                          )
                          .map((strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^content strength:\s*/i, "")
                              .replace(/^content:\s*/i, "")
                              .replace(/^idea:\s*/i, "")
                              .replace(/^argument:\s*/i, "")
                              .replace(/^topic:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          })
                      ) : analysisData.content?.strengths &&
                        analysisData.content.strengths.length > 0 ? (
                        analysisData.content.strengths.map(
                          (strength, index) => {
                            // Clean the strength text from prefixes
                            const cleanStrength = strength
                              .replace(/^content strength:\s*/i, "")
                              .replace(/^content:\s*/i, "")
                              .replace(/^idea:\s*/i, "")
                              .replace(/^argument:\s*/i, "")
                              .replace(/^topic:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-500">✓</span>
                                <span>{cleanStrength}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <li>No content strengths identified.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {hasEnhancedFeedback &&
                      analysis.feedback?.improvements ? (
                        analysis.feedback.improvements
                          .filter(
                            imp =>
                              imp.toLowerCase().includes("content") ||
                              imp.toLowerCase().includes("idea") ||
                              imp.toLowerCase().includes("argument") ||
                              imp.toLowerCase().includes("point") ||
                              imp.toLowerCase().includes("topic")
                          )
                          .map((improvement, index) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^content improvement:\s*/i, "")
                              .replace(/^content:\s*/i, "")
                              .replace(/^idea:\s*/i, "")
                              .replace(/^argument:\s*/i, "")
                              .replace(/^topic:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          })
                      ) : analysisData.content?.improvements &&
                        analysisData.content.improvements.length > 0 ? (
                        analysisData.content.improvements.map(
                          (improvement, index) => {
                            // Clean the improvement text from prefixes
                            const cleanImprovement = improvement
                              .replace(/^content improvement:\s*/i, "")
                              .replace(/^content:\s*/i, "")
                              .replace(/^idea:\s*/i, "")
                              .replace(/^argument:\s*/i, "")
                              .replace(/^topic:\s*/i, "");

                            return (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-amber-500">!</span>
                                <span>{cleanImprovement}</span>
                              </li>
                            );
                          }
                        )
                      ) : (
                        <li>No content improvements suggested.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {hasEnhancedFeedback &&
                  analysis.feedback?.suggestions &&
                  analysis.feedback.suggestions.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-2 text-blue-700">
                        Next Steps
                      </h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {analysis.feedback.suggestions.map(
                          (suggestion: string, index: number) => {
                            // Clean suggestion prefixes
                            const cleanSuggestion = suggestion
                              .replace(/^to improve grammar:\s*/i, "")
                              .replace(/^to enhance vocabulary:\s*/i, "")
                              .replace(/^to strengthen structure:\s*/i, "")
                              .replace(/^to develop content:\s*/i, "")
                              .replace(/^to improve grammar,\s*/i, "")
                              .replace(/^to enhance vocabulary,\s*/i, "")
                              .replace(/^to strengthen structure,\s*/i, "")
                              .replace(/^to develop content,\s*/i, "");

                            return (
                              <li key={index} className="text-gray-700">
                                {cleanSuggestion}
                              </li>
                            );
                          }
                        )}
                      </ol>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI-powered analysis section */}
      {hasEnhancedFeedback && analysis.feedback && (
        <div className="mt-6 space-y-6">{/* AI analysis components */}</div>
      )}

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/writing">Back to Dashboard</Link>
        </Button>

        {session.status !== "completed" && (
          <Button onClick={handleComplete}>Mark as Completed</Button>
        )}
      </div>
    </div>
  );
}
