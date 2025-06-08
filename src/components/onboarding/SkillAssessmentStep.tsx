"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface SkillAssessmentStepProps {
  onNext: (data?: any) => void;
  onSkip?: () => void;
  onBack?: () => void;
  data?: any;
}

interface Question {
  id: string;
  type: "reading" | "grammar" | "vocabulary";
  difficulty: "A1" | "A2" | "B1" | "B2";
  question: string;
  options: string[];
}

interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  questions: Question[];
}

interface AssessmentResult {
  recommendedLevel: string;
  skillScores: {
    reading: number;
    grammar: number;
    vocabulary: number;
    listening: number;
  };
  strengths: string[];
  weakAreas: string[];
  overallScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

export default function SkillAssessmentStep({
  onNext,
  onBack,
}: SkillAssessmentStepProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [grammarVocabQuestions, setGrammarVocabQuestions] = useState<
    Question[]
  >([]);
  const [readingPassage, setReadingPassage] = useState<ReadingPassage | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"grammar-vocab" | "reading">(
    "grammar-vocab"
  );
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (assessmentStarted && !startTime) {
      setStartTime(new Date());
    }
  }, [assessmentStarted, startTime]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/onboarding/assessment");
      if (response.ok) {
        const data = await response.json();
        setGrammarVocabQuestions(data.questions);
        setReadingPassage(data.readingPassage);
      } else {
        console.error("Failed to fetch questions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setAssessmentStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestions = getCurrentQuestions();
    const currentQuestion = currentQuestions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const getCurrentQuestions = () => {
    if (currentPhase === "grammar-vocab") {
      return grammarVocabQuestions;
    } else {
      return readingPassage?.questions || [];
    }
  };

  const getTotalQuestions = () => {
    return (
      grammarVocabQuestions.length + (readingPassage?.questions.length || 0)
    );
  };

  const getOverallProgress = () => {
    if (currentPhase === "grammar-vocab") {
      return ((currentQuestionIndex + 1) / getTotalQuestions()) * 100;
    } else {
      const grammarVocabComplete = grammarVocabQuestions.length;
      const readingProgress = currentQuestionIndex + 1;
      return (
        ((grammarVocabComplete + readingProgress) / getTotalQuestions()) * 100
      );
    }
  };

  const getPhaseProgress = () => {
    const currentQuestions = getCurrentQuestions();
    return ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
  };

  const handleNextQuestion = () => {
    const currentQuestions = getCurrentQuestions();

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentPhase === "grammar-vocab") {
      // Move to reading phase
      setCurrentPhase("reading");
      setCurrentQuestionIndex(0);
    } else {
      // Submit assessment
      submitAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentPhase === "reading") {
      // Go back to grammar-vocab phase
      setCurrentPhase("grammar-vocab");
      setCurrentQuestionIndex(grammarVocabQuestions.length - 1);
    }
  };

  const submitAssessment = async () => {
    setSubmitting(true);

    // Calculate time spent
    const endTime = new Date();
    const timeSpentInSeconds = startTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

    try {
      const response = await fetch("/api/onboarding/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          timeSpent: timeSpentInSeconds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.results);
        setTimeSpent(timeSpentInSeconds);
      } else {
        console.error("Failed to submit assessment:", response.status);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    onNext({
      skillAssessment: result,
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Loading assessment...
        </p>
      </div>
    );
  }

  if (!assessmentStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Skill Assessment
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Let's evaluate your current English level to create the perfect
            learning path for you.
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            What to expect:
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                10-15 Minutes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Quick and efficient
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                20 Questions
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Grammar, Vocabulary & Reading
              </p>
            </div>
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Personalized Results
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tailored to your level
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Assessment Structure:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• First 15 questions: Grammar and Vocabulary</li>
              <li>• Reading passage with 5 comprehension questions</li>
              <li>• Immediate personalized results and recommendations</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}
          <div className="flex space-x-4 ml-auto">
            <button
              onClick={() => onNext()}
              className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip Assessment
            </button>
            <button
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Assessment Complete!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here are your personalized results
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-2xl font-bold mb-4">
              {result.recommendedLevel}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your English Level
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Score: {result.overallScore}% ({result.correctAnswers}/
              {result.totalQuestions} correct)
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Completed in {Math.floor(timeSpent / 60)}:
              {(timeSpent % 60).toString().padStart(2, "0")} minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Reading
              </h4>
              <div className="text-2xl font-bold text-blue-600">
                {result.skillScores.reading}%
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Grammar
              </h4>
              <div className="text-2xl font-bold text-green-600">
                {result.skillScores.grammar}%
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Vocabulary
              </h4>
              <div className="text-2xl font-bold text-purple-600">
                {result.skillScores.vocabulary}%
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Your Strengths
              </h4>
              {result.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="capitalize">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Continue practicing to identify your strengths!
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Areas to Improve
              </h4>
              {result.weakAreas.length > 0 ? (
                <ul className="space-y-2">
                  {result.weakAreas.map((area, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-orange-600"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="capitalize">{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Great job! No specific weak areas identified.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setResult(null)}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const currentQuestions = getCurrentQuestions();
  const currentQuestion = currentQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-red-600">
          Error loading questions. Please try again.
        </p>
      </div>
    );
  }

  const isLastQuestionInPhase =
    currentQuestionIndex === currentQuestions.length - 1;
  const isLastQuestionOverall =
    currentPhase === "reading" && isLastQuestionInPhase;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentPhase === "grammar-vocab"
              ? "Grammar & Vocabulary"
              : "Reading Comprehension"}
          </h2>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {currentQuestion.type} • {currentQuestion.difficulty}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Question{" "}
              {currentPhase === "grammar-vocab"
                ? currentQuestionIndex + 1
                : currentQuestionIndex + 1}{" "}
              of {currentQuestions.length}
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(getOverallProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Phase Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mb-1">
            <span>
              {currentPhase === "grammar-vocab"
                ? "Grammar & Vocabulary"
                : "Reading"}
            </span>
            <span>{Math.round(getPhaseProgress())}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1">
            <div
              className="bg-gray-400 dark:bg-gray-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${getPhaseProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Reading Passage (only show in reading phase) */}
      {currentPhase === "reading" && readingPassage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {readingPassage.title}
          </h3>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            {readingPassage.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Current Question */}
      <motion.div
        key={`${currentPhase}-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                answers[currentQuestion.id] === option
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion.id] === option
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {answers[currentQuestion.id] === option && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={
            currentPhase === "grammar-vocab" && currentQuestionIndex === 0
          }
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={answers[currentQuestion.id] === undefined || submitting}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>
                {isLastQuestionOverall
                  ? "Finish Assessment"
                  : isLastQuestionInPhase && currentPhase === "grammar-vocab"
                    ? "Continue to Reading"
                    : "Next"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
