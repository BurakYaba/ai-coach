"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  Target,
  Award,
} from "lucide-react";

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
  const lessonId = params?.id as string;

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
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
              <Card key={i} className="border-2 bg-gray-50 shadow-lg">
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Lesson Not Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                The lesson you are looking for might have been removed or
                doesn't exist.
              </p>
              <Button
                onClick={() => router.push("/dashboard/grammar")}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Grammar Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with title and level */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => router.push("/dashboard/grammar")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                {lesson.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                CEFR {lesson.ceferLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Explanation section */}
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">
                  Explanation
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none text-gray-700">
                {lesson.content.explanation
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p key={i} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Examples section */}
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">
                  Examples
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lesson.content.examples.map((example, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="mb-3">
                      <p className="text-gray-600 mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="line-through">
                          {example.incorrect}
                        </span>
                      </p>
                      <p className="text-blue-700 font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {example.correct}
                      </p>
                    </div>
                    <p className="text-sm border-l-4 border-blue-300 pl-3 mt-3 text-gray-700 bg-blue-50 py-2 rounded-r">
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercises section */}
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">
                  Exercises
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {lesson.content.exercises.length > 0 ? (
                <div className="space-y-6">
                  {lesson.content.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <p className="font-medium mb-4 text-gray-800">
                        {exercise.question}
                      </p>

                      {exercise.options ? (
                        <RadioGroup
                          value={answers[index]}
                          onValueChange={value =>
                            handleAnswerChange(index, value)
                          }
                          disabled={showResults}
                        >
                          <div className="space-y-3">
                            {exercise.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center space-x-3"
                              >
                                <RadioGroupItem
                                  value={option}
                                  id={`option-${index}-${optionIndex}`}
                                  className="border-gray-400"
                                />
                                <label
                                  htmlFor={`option-${index}-${optionIndex}`}
                                  className={`cursor-pointer ${
                                    showResults &&
                                    option === exercise.correctAnswer
                                      ? "text-green-600 font-medium"
                                      : showResults &&
                                          answers[index] === option &&
                                          option !== exercise.correctAnswer
                                        ? "text-red-500 line-through"
                                        : "text-gray-700"
                                  }`}
                                >
                                  {option}
                                </label>
                                {showResults &&
                                  option === exercise.correctAnswer && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                {showResults &&
                                  answers[index] === option &&
                                  option !== exercise.correctAnswer && (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      ) : (
                        <div className="mb-4">
                          <input
                            type="text"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
                          <AccordionItem
                            value="explanation"
                            className="border-gray-300"
                          >
                            <AccordionTrigger
                              className={`hover:no-underline ${
                                answers[index] === exercise.correctAnswer
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {answers[index] === exercise.correctAnswer ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                {answers[index] === exercise.correctAnswer
                                  ? "Correct!"
                                  : "Incorrect"}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-300">
                                <p className="mb-2 text-gray-800">
                                  <span className="font-medium">
                                    Correct answer:
                                  </span>{" "}
                                  <span className="text-blue-700 font-medium">
                                    {exercise.correctAnswer}
                                  </span>
                                </p>
                                <p className="text-gray-700">
                                  {exercise.explanation}
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  ))}

                  {showResults && (
                    <div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
                      <h3 className="text-xl font-medium mb-4 text-gray-800 flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-600" />
                        Your Results
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <Progress value={score} className="h-3 flex-1" />
                        <span className="font-bold text-lg text-gray-800">
                          {score}%
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">
                        You answered{" "}
                        <span className="font-medium text-green-700">
                          {
                            lesson.content.exercises.filter(
                              (_, index) =>
                                answers[index] ===
                                lesson.content.exercises[index].correctAnswer
                            ).length
                          }
                        </span>{" "}
                        out of{" "}
                        <span className="font-medium">
                          {lesson.content.exercises.length}
                        </span>{" "}
                        questions correctly.
                      </p>
                      <Button
                        onClick={resetExercises}
                        className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {!showResults && (
                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={submitExercises}
                        disabled={
                          isSubmitting ||
                          Object.values(answers).some(answer => !answer) ||
                          Object.keys(answers).length !==
                            lesson.content.exercises.length
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      >
                        {isSubmitting ? "Checking..." : "Check Answers"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Award className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600">
                      No exercises available for this lesson.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
