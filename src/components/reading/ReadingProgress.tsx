'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ReadingProgressProps {
  progress: {
    timeSpent: number;
    questionsAnswered: number;
    correctAnswers: number;
    vocabularyReviewed: string[];
    comprehensionScore: number;
  };
  totalQuestions: number;
  totalVocabulary: number;
}

export function ReadingProgress({
  progress,
  totalQuestions,
  totalVocabulary,
}: ReadingProgressProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const vocabularyProgress = Math.round(
    (progress.vocabularyReviewed.length / totalVocabulary) * 100
  );
  const questionsProgress = Math.round(
    (progress.questionsAnswered / totalQuestions) * 100
  );

  return (
    <Card className="p-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Time Spent</h3>
          <p className="text-2xl font-bold">{formatTime(progress.timeSpent)}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Vocabulary Progress
          </h3>
          <div className="space-y-2">
            <Progress value={vocabularyProgress} className="h-2" />
            <p className="text-sm text-gray-600">
              {progress.vocabularyReviewed.length} of {totalVocabulary} words
              reviewed
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Comprehension Progress
          </h3>
          <div className="space-y-2">
            <Progress value={questionsProgress} className="h-2" />
            <p className="text-sm text-gray-600">
              {progress.questionsAnswered} of {totalQuestions} questions
              answered ({progress.comprehensionScore}% correct)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
