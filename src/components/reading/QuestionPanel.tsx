'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: Array<string | { id: string; text: string }>;
  correctAnswer: string;
  explanation: string;
}

interface QuestionPanelProps {
  questions: Question[];
  onAnswerSubmit: (
    correct: boolean,
    questionId: string,
    selectedAnswer: string
  ) => void;
  answeredCount?: number;
  previousAnswers?: Record<string, string>;
}

export function QuestionPanel({
  questions,
  onAnswerSubmit,
  answeredCount = 0,
  previousAnswers = {},
}: QuestionPanelProps) {
  const [lastActive, setLastActive] = useState<number>(Date.now());

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    return Math.min(answeredCount, questions.length - 1);
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>(false);
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    () => {
      const answered = new Set<number>();
      for (let i = 0; i < answeredCount; i++) {
        answered.add(i);
      }
      return answered;
    }
  );

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );

  const progress = useMemo(
    () => (answeredQuestions.size / questions.length) * 100,
    [answeredQuestions.size, questions.length]
  );

  const getOptionText = useCallback(
    (option: string | { id: string; text: string }): string => {
      if (typeof option === 'string') {
        return option;
      }
      return option.text || '';
    },
    []
  );

  const getOptionId = useCallback(
    (option: string | { id: string; text: string }, index: number): string => {
      if (typeof option === 'string') {
        return index.toString();
      }
      return option.id || index.toString();
    },
    []
  );

  const determineIfCorrect = useCallback(
    (
      selectedAnswer: string,
      correctAnswer: string,
      questionType: string,
      options?: Array<string | { id: string; text: string }>
    ): boolean => {
      if (questionType === 'multiple-choice' && options) {
        const selectedLetter =
          selectedAnswer.length === 1 && selectedAnswer.match(/[A-Da-d]/)
            ? selectedAnswer.toUpperCase()
            : '';

        const correctLetter =
          correctAnswer.length === 1 && correctAnswer.match(/[A-Da-d]/)
            ? correctAnswer.toUpperCase()
            : '';

        return !!(
          selectedLetter &&
          correctLetter &&
          selectedLetter === correctLetter
        );
      } else if (questionType === 'true-false') {
        const selectedIsTrueValue =
          selectedAnswer.toLowerCase() === 'true' ||
          selectedAnswer.toLowerCase() === 'a';
        const correctIsTrueValue =
          correctAnswer.toLowerCase() === 'true' ||
          correctAnswer.toLowerCase() === 'a';
        return selectedIsTrueValue === correctIsTrueValue;
      } else {
        return selectedAnswer.toLowerCase() === correctAnswer.toLowerCase();
      }
    },
    []
  );

  useEffect(() => {
    if (Object.keys(previousAnswers).length > 0) {
      const answeredIndices = new Set<number>();
      const answerMap: Record<number, string> = {};

      questions.forEach((question, index) => {
        if (previousAnswers[question.id]) {
          answeredIndices.add(index);
          answerMap[index] = previousAnswers[question.id];
        }
      });

      if (answeredIndices.size > 0) {
        setAnsweredQuestions(answeredIndices);
        setSavedAnswers(answerMap);

        if (!answeredQuestions.has(currentQuestionIndex)) {
          const firstAnsweredIndex = Math.min(...Array.from(answeredIndices));
          setCurrentQuestionIndex(firstAnsweredIndex);
        }
      }
    }
  }, [previousAnswers, questions]);

  useEffect(() => {
    if (answeredQuestions.has(currentQuestionIndex)) {
      const savedAnswer = savedAnswers[currentQuestionIndex];
      if (savedAnswer) {
        setSelectedAnswer(savedAnswer);

        const isCorrect = determineIfCorrect(
          savedAnswer,
          currentQuestion.correctAnswer,
          currentQuestion.type,
          currentQuestion.options
        );
        setAnswerIsCorrect(!!isCorrect);
        setShowFeedback(true);
      }
    } else {
      setSelectedAnswer('');
      setShowFeedback(false);
    }
  }, [
    currentQuestionIndex,
    answeredQuestions,
    savedAnswers,
    currentQuestion,
    determineIfCorrect,
  ]);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return;

    if (answeredQuestions.has(currentQuestionIndex)) {
      return;
    }

    const isCorrect = determineIfCorrect(
      selectedAnswer,
      currentQuestion.correctAnswer,
      currentQuestion.type,
      currentQuestion.options
    );

    setAnswerIsCorrect(isCorrect);
    onAnswerSubmit(isCorrect, currentQuestion.id, selectedAnswer);

    setSavedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedAnswer,
    }));

    setAnsweredQuestions(prev => {
      const newSet = new Set(prev);
      newSet.add(currentQuestionIndex);
      return newSet;
    });

    setShowFeedback(true);
  }, [
    selectedAnswer,
    currentQuestion,
    onAnswerSubmit,
    currentQuestionIndex,
    answeredQuestions,
    determineIfCorrect,
  ]);

  const handleNext = useCallback(() => {
    setSelectedAnswer('');
    setShowFeedback(false);

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
    }
  }, [questions.length, currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    setSelectedAnswer('');
    setShowFeedback(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleQuestionSelect = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestionIndex(index);

        // If selecting an already answered question, show the saved answer and feedback
        if (answeredQuestions.has(index)) {
          const savedAnswer = savedAnswers[index];
          if (savedAnswer) {
            setSelectedAnswer(savedAnswer);
            const isCorrect = determineIfCorrect(
              savedAnswer,
              questions[index].correctAnswer,
              questions[index].type,
              questions[index].options
            );
            setAnswerIsCorrect(!!isCorrect);
            setShowFeedback(true);
          }
        } else {
          // New question
          setSelectedAnswer('');
          setShowFeedback(false);
        }
      }
    },
    [questions, answeredQuestions, savedAnswers, determineIfCorrect]
  );

  const isCurrentQuestionAnswered = useMemo(
    () => answeredQuestions.has(currentQuestionIndex),
    [answeredQuestions, currentQuestionIndex]
  );

  const renderQuestionNavigator = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {questions.map((_, index) => (
          <Button
            key={index}
            variant={
              index === currentQuestionIndex
                ? 'default'
                : answeredQuestions.has(index)
                  ? 'outline'
                  : 'secondary'
            }
            size="sm"
            onClick={() => handleQuestionSelect(index)}
            className={`w-8 h-8 p-0 ${answeredQuestions.has(index) ? 'border-green-500' : ''}`}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Comprehension Questions</h2>
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {renderQuestionNavigator()}

      <div className="space-y-6">
        {isCurrentQuestionAnswered && !showFeedback && (
          <Alert className="bg-blue-100 mb-4">
            <AlertDescription>
              You&apos;ve already answered this question. Showing your previous
              answer and feedback.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-lg font-medium">{currentQuestion.question}</div>

        {currentQuestion.type === 'multiple-choice' && (
          <>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={value => {
                setSelectedAnswer(value);
              }}
              disabled={showFeedback || isCurrentQuestionAnswered}
            >
              {currentQuestion.options?.map((option, idx) => {
                const optionId =
                  typeof option === 'string'
                    ? String.fromCharCode(65 + idx)
                    : option.id;
                const optionText = getOptionText(option);

                return (
                  <div
                    key={`option-${idx}`}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={optionId} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="text-base">
                      {optionId}. {optionText}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </>
        )}

        {currentQuestion.type === 'true-false' && (
          <>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={value => {
                setSelectedAnswer(value);
              }}
              disabled={showFeedback || isCurrentQuestionAnswered}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A" id="true-option" />
                <Label htmlFor="true-option">A. True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="B" id="false-option" />
                <Label htmlFor="false-option">B. False</Label>
              </div>
            </RadioGroup>
          </>
        )}

        {currentQuestion.type === 'fill-blank' && (
          <Input
            value={selectedAnswer}
            onChange={e => setSelectedAnswer(e.target.value)}
            placeholder="Fill in the blank..."
            disabled={showFeedback || isCurrentQuestionAnswered}
          />
        )}

        {(showFeedback || isCurrentQuestionAnswered) && (
          <Alert variant={answerIsCorrect ? 'default' : 'destructive'}>
            <AlertDescription>
              {answerIsCorrect ? (
                'Correct! '
              ) : (
                <>
                  Incorrect.
                  {currentQuestion.type === 'multiple-choice' &&
                  currentQuestion.options ? (
                    <div className="mt-1">
                      <div className="font-normal">
                        You selected:{' '}
                        <span className="font-semibold">
                          {(() => {
                            const selectedOption = currentQuestion.options.find(
                              opt => {
                                const optId =
                                  typeof opt === 'string' ? opt : opt.id;
                                return (
                                  optId &&
                                  optId.toLowerCase() ===
                                    selectedAnswer.toLowerCase()
                                );
                              }
                            );

                            if (selectedOption) {
                              return typeof selectedOption === 'string'
                                ? selectedOption
                                : `${selectedOption.id}. ${selectedOption.text}`;
                            }

                            return selectedAnswer;
                          })()}
                        </span>
                      </div>

                      <div className="font-normal mt-1">
                        The correct answer is:{' '}
                        <span className="font-semibold">
                          {(() => {
                            let correctOption = currentQuestion.options.find(
                              opt => {
                                const optId =
                                  typeof opt === 'string' ? opt : opt.id;
                                return (
                                  optId &&
                                  optId.toLowerCase() ===
                                    currentQuestion.correctAnswer.toLowerCase()
                                );
                              }
                            );

                            if (
                              !correctOption &&
                              currentQuestion.correctAnswer.length === 1 &&
                              currentQuestion.correctAnswer.match(/[A-Da-d]/)
                            ) {
                              const index =
                                currentQuestion.correctAnswer
                                  .toUpperCase()
                                  .charCodeAt(0) - 65;
                              if (
                                index >= 0 &&
                                index < currentQuestion.options.length
                              ) {
                                correctOption = currentQuestion.options[index];
                              }
                            }

                            if (!correctOption) {
                              correctOption = currentQuestion.options.find(
                                opt => {
                                  const optText =
                                    getOptionText(opt).toLowerCase();
                                  return (
                                    optText ===
                                      currentQuestion.correctAnswer.toLowerCase() ||
                                    optText.includes(
                                      currentQuestion.correctAnswer.toLowerCase()
                                    ) ||
                                    currentQuestion.correctAnswer
                                      .toLowerCase()
                                      .includes(optText)
                                  );
                                }
                              );
                            }

                            if (correctOption) {
                              return typeof correctOption === 'string'
                                ? correctOption
                                : `${correctOption.id}. ${correctOption.text}`;
                            }

                            if (
                              currentQuestion.correctAnswer.length === 1 &&
                              currentQuestion.correctAnswer.match(/[A-Da-d]/)
                            ) {
                              const optionIndex =
                                currentQuestion.correctAnswer
                                  .toUpperCase()
                                  .charCodeAt(0) - 65;
                              if (
                                optionIndex >= 0 &&
                                optionIndex < currentQuestion.options.length
                              ) {
                                const option =
                                  currentQuestion.options[optionIndex];
                                return typeof option === 'string'
                                  ? option
                                  : `${option.id}. ${option.text}`;
                              }
                              return currentQuestion.correctAnswer.toUpperCase();
                            }

                            return currentQuestion.correctAnswer;
                          })()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="font-semibold">
                      The correct answer is: {currentQuestion.correctAnswer}
                    </span>
                  )}{' '}
                </>
              )}
              {currentQuestion.explanation && (
                <div className="mt-2">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <div className="space-x-2">
            {!showFeedback && (
              <Button onClick={handleSubmit} disabled={!selectedAnswer}>
                Submit
              </Button>
            )}
            {showFeedback && (
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
