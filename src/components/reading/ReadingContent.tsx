'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VocabularyWord {
  word: string;
  definition: string;
  context: string;
  examples: string[];
  difficulty: number;
}

interface ReadingContentProps {
  content: string;
  vocabulary: VocabularyWord[];
  onWordClick: (word: string) => void;
}

export function ReadingContent({
  content,
  vocabulary,
  onWordClick,
}: ReadingContentProps) {
  const [fontSize, setFontSize] = useState(16);
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text-to-speech functionality
  const speak = useCallback(() => {
    if (!isTextToSpeechEnabled) return;

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.9; // Slightly slower than normal
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [content, isTextToSpeechEnabled]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle font size changes
  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => Math.max(12, prev - 2));
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => Math.min(24, prev + 2));
  }, []);

  // Toggle text-to-speech
  const toggleTextToSpeech = useCallback(() => {
    setIsTextToSpeechEnabled(prev => !prev);
  }, []);

  // Toggle play/stop
  const toggleSpeaking = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak();
    }
  }, [isSpeaking, speak, stopSpeaking]);

  // Add a button to mark all vocabulary as reviewed
  const markAllAsReviewed = useCallback(() => {
    vocabulary.forEach(word => {
      onWordClick(word.word);
    });
  }, [vocabulary, onWordClick]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={decreaseFontSize}>
            A-
          </Button>
          <Button variant="outline" size="sm" onClick={increaseFontSize}>
            A+
          </Button>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={toggleTextToSpeech}>
            {isTextToSpeechEnabled ? 'Disable' : 'Enable'} Text-to-Speech
          </Button>
          {isTextToSpeechEnabled && (
            <Button variant="outline" size="sm" onClick={toggleSpeaking}>
              {isSpeaking ? 'Stop' : 'Play'}
            </Button>
          )}
        </div>
      </div>

      <div
        className="prose max-w-none"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: '1.8',
        }}
      >
        {content}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="sm" onClick={markAllAsReviewed}>
          Mark All Vocabulary as Reviewed
        </Button>
      </div>
    </Card>
  );
}
