"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Generate and play audio using OpenAI TTS
  const speak = useCallback(async () => {
    if (isLoadingAudio || isSpeaking) return;

    try {
      setIsLoadingAudio(true);
      console.log("Starting TTS generation...");

      // OpenAI TTS has a 4096 character limit, so we need to handle longer texts
      let textToSpeak = content;
      const maxLength = 4000; // Leave some buffer

      if (content.length > maxLength) {
        // Find a good breaking point (end of sentence or paragraph)
        const truncatePoint = content.lastIndexOf(".", maxLength);
        if (truncatePoint > maxLength * 0.7) {
          textToSpeak = content.substring(0, truncatePoint + 1);
        } else {
          textToSpeak = content.substring(0, maxLength) + "...";
        }

        toast({
          title: "Long Text",
          description: `Text is long, playing first ${Math.round((textToSpeak.length / content.length) * 100)}% of content.`,
        });
      }

      console.log("Sending TTS request with text length:", textToSpeak.length);

      // Use OpenAI TTS API to generate natural speech
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToSpeak,
          voice: "nova", // Using a clear, pleasant voice for reading
        }),
      });

      console.log("TTS response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("TTS API error:", errorData);
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const data = await response.json();
      console.log(
        "TTS response received, audio URL length:",
        data.audioUrl?.length
      );

      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio();

        // Set up event handlers for the audio element
        audioRef.current.onplay = () => {
          console.log("Audio started playing");
          setIsSpeaking(true);
          setIsLoadingAudio(false);
        };
        audioRef.current.onended = () => {
          console.log("Audio finished playing");
          setIsSpeaking(false);
        };
        audioRef.current.onpause = () => {
          console.log("Audio paused");
          setIsSpeaking(false);
        };
        audioRef.current.onerror = e => {
          console.error("Audio playback error:", e);
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          toast({
            title: "Error",
            description: "Could not play the audio",
            variant: "destructive",
          });
        };
      }

      // Set the audio source and play
      console.log("Setting audio source and attempting to play...");
      audioRef.current.src = data.audioUrl;

      try {
        await audioRef.current.play();
        console.log("Audio play() called successfully");
      } catch (playError) {
        console.error("Audio play failed:", playError);

        // Handle autoplay policy errors
        if (
          playError instanceof DOMException &&
          playError.name === "NotAllowedError"
        ) {
          toast({
            title: "Autoplay Blocked",
            description: "Please click the Listen button again to play audio.",
            variant: "destructive",
          });
        } else {
          throw playError; // Re-throw other errors
        }
        setIsLoadingAudio(false);
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Could not generate speech. Please try again.",
        variant: "destructive",
      });
      setIsLoadingAudio(false);
    }
  }, [content, isLoadingAudio, isSpeaking, toast]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setIsLoadingAudio(false);
  }, []);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
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

  // Toggle play/stop with single button
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
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSpeaking}
            disabled={isLoadingAudio}
            className="flex items-center gap-2"
          >
            {isLoadingAudio ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Listen
              </>
            )}
          </Button>
        </div>
      </div>

      <div
        className="prose max-w-none"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.8",
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
