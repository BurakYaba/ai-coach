"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface GrammarLesson {
  _id: string;
  title: string;
  category: string;
  ceferLevel: string;
  content: {
    explanation: string;
    examples: Array<{
      correct: string;
      incorrect: string;
      explanation: string;
    }>;
    exercises: Array<{
      question: string;
      options?: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  };
  relatedIssues: string[];
  completed: boolean;
  score?: number;
  createdAt: string;
}

export default function GrammarLessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<GrammarLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define fetchLesson with useCallback to avoid dependency issues
  const fetchLesson = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/grammar/lessons?lessonId=${lessonId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch grammar lesson");
      }

      const data = await response.json();
      if (data.lessons && data.lessons.length > 0) {
        setLesson(data.lessons[0]);

        // If the lesson has exercises, initialize the answers object
        if (data.lessons[0].content.exercises.length > 0) {
          const initialAnswers: Record<number, string> = {};
          data.lessons[0].content.exercises.forEach((_: any, index: number) => {
            initialAnswers[index] = "";
          });
          setAnswers(initialAnswers);
        }
      } else {
        throw new Error("Lesson not found");
      }
    } catch (error) {
      console.error("Error fetching grammar lesson:", error);
      toast({
        title: "Error",
        description: "Failed to load grammar lesson",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  // Fetch lesson data
  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const handleAnswerChange = (exerciseIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [exerciseIndex]: value,
    }));
  };

  const submitExercises = async () => {
    if (!lesson) return;

    setIsSubmitting(true);

    try {
      // Calculate score
      let correctAnswers = 0;

      lesson.content.exercises.forEach((exercise, index) => {
        if (answers[index] === exercise.correctAnswer) {
          correctAnswers++;
        }
      });

      const calculatedScore = Math.round(
        (correctAnswers / lesson.content.exercises.length) * 100
      );

      setScore(calculatedScore);
      setShowResults(true);

      // Mark lesson as completed and update score
      const response = await fetch(`/api/grammar/lessons/${lessonId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
          score: calculatedScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lesson progress");
      }

      toast({
        title: "Progress saved",
        description: `You scored ${calculatedScore}% on this lesson`,
      });
    } catch (error) {
      console.error("Error submitting exercises:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetExercises = () => {
    if (!lesson) return;

    // Reset answers
    const initialAnswers: Record<number, string> = {};
    lesson.content.exercises.forEach((_, index) => {
      initialAnswers[index] = "";
    });

    setAnswers(initialAnswers);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />

        <Skeleton className="h-6 w-1/4 mb-2 mt-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
        <p className="text-muted-foreground mb-6">
          The lesson you are looking for might have been removed or doesn't
          exist.
        </p>
        <Button onClick={() => router.push("/dashboard/grammar")}>
          Back to Grammar Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header with title and level */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {lesson.category}
            </span>
            <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
              {lesson.ceferLevel}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/grammar")}
        >
          Back to Grammar
        </Button>
      </div>

      {/* Main content */}
      <div className="space-y-8">
        {/* Explanation section */}
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none dark:prose-invert">
              {lesson.content.explanation.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Examples section */}
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {lesson.content.examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-2">
                    <p className="text-muted-foreground mb-1">
                      <span className="line-through">{example.incorrect}</span>
                    </p>
                    <p className="text-primary font-medium">
                      {example.correct}
                    </p>
                  </div>
                  <p className="text-sm border-l-2 border-primary/20 pl-3 mt-2">
                    {example.explanation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercises section */}
        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {lesson.content.exercises.length > 0 ? (
              <div className="space-y-8">
                {lesson.content.exercises.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium mb-4">{exercise.question}</p>

                    {exercise.options ? (
                      <RadioGroup
                        value={answers[index]}
                        onValueChange={value =>
                          handleAnswerChange(index, value)
                        }
                        disabled={showResults}
                      >
                        <div className="space-y-2">
                          {exercise.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option}
                                id={`option-${index}-${optionIndex}`}
                              />
                              <label
                                htmlFor={`option-${index}-${optionIndex}`}
                                className={`
                                  ${
                                    showResults &&
                                    option === exercise.correctAnswer
                                      ? "text-green-600 font-medium"
                                      : showResults &&
                                          answers[index] === option &&
                                          option !== exercise.correctAnswer
                                        ? "text-red-500 line-through"
                                        : ""
                                  }
                                `}
                              >
                                {option}
                              </label>
                              {showResults &&
                                option === exercise.correctAnswer && (
                                  <span className="text-green-600 ml-2">✓</span>
                                )}
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="mb-4">
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={answers[index] || ""}
                          onChange={e =>
                            handleAnswerChange(index, e.target.value)
                          }
                          disabled={showResults}
                          placeholder="Type your answer here..."
                        />
                      </div>
                    )}

                    {showResults && (
                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="explanation">
                          <AccordionTrigger
                            className={
                              answers[index] === exercise.correctAnswer
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {answers[index] === exercise.correctAnswer
                              ? "Correct!"
                              : "Incorrect"}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <p className="mb-2">
                                <span className="font-medium">
                                  Correct answer:
                                </span>{" "}
                                {exercise.correctAnswer}
                              </p>
                              <p>{exercise.explanation}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                ))}

                {showResults && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h3 className="text-xl font-medium mb-2">Your Results</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <Progress value={score} className="h-2 flex-1" />
                      <span className="font-medium">{score}%</span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      You answered{" "}
                      {
                        lesson.content.exercises.filter(
                          (_, index) =>
                            answers[index] ===
                            lesson.content.exercises[index].correctAnswer
                        ).length
                      }{" "}
                      out of {lesson.content.exercises.length} questions
                      correctly.
                    </p>
                    <Button onClick={resetExercises}>Try Again</Button>
                  </div>
                )}

                {!showResults && (
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={submitExercises}
                      disabled={
                        isSubmitting ||
                        Object.values(answers).some(answer => !answer) ||
                        Object.keys(answers).length !==
                          lesson.content.exercises.length
                      }
                    >
                      {isSubmitting ? "Checking..." : "Check Answers"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No exercises available for this lesson.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
