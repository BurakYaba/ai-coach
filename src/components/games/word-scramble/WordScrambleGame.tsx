"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
// Dynamic import for Phaser

import { PlayButton } from "@/components/ui/play-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

import { GameWord } from "../models";

import { vocabularyLists } from "./vocabulary";

// Dynamically import only PhaserGame component
const PhaserGame = dynamic(() => import("../PhaserGame"), { ssr: false });

interface WordScrambleGameProps {
  onComplete?: (
    score: number,
    correctAnswers: number,
    totalQuestions: number
  ) => void;
}

export default function WordScrambleGame({
  onComplete,
}: WordScrambleGameProps) {
  const { data: session } = useSession();
  const [difficulty, setDifficulty] = useState<
    "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  >("A1");
  const [timeLimit, setTimeLimit] = useState(60); // seconds
  const [wordCount, setWordCount] = useState(5); // Default to 5 words
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] =
    useState<Phaser.Types.Core.GameConfig | null>(null);
  const [gameResult, setGameResult] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("start");

  // Function to select random words from vocabulary lists based on difficulty and word count
  const getRandomWords = (
    difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
    count: number
  ): GameWord[] => {
    // Get the list of words for the selected difficulty
    const wordList = vocabularyLists[difficulty];

    // If wordCount is greater than available words, return all words
    if (count >= wordList.length) {
      return [...wordList];
    }

    // Shuffle the array and take the first 'count' elements
    return [...wordList].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  // Handle game completion
  const handleGameComplete = (score: number) => {
    // Extract additional info from the score
    const correctAnswers = Math.floor(score / 10); // Assuming 10 points per correct answer
    const totalQuestions = wordCount;

    setGameResult({ score, correctAnswers, totalQuestions });
    setGameStarted(false);
    setActiveTab("start");

    if (onComplete) {
      onComplete(score, correctAnswers, totalQuestions);
    }

    // Save result to the server if user is logged in
    if (session?.user?.id) {
      saveGameResult(score, correctAnswers, totalQuestions);
    }
  };

  // Save game result to the server
  const saveGameResult = async (
    score: number,
    correctAnswers: number,
    totalQuestions: number
  ) => {
    try {
      const response = await fetch("/api/games/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: "word-scramble",
          score,
          correctAnswers,
          totalQuestions,
          timeSpent: timeLimit,
          level: difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save game result");
      }

      toast({
        title: "Progress saved!",
        description: "Your game result has been saved.",
      });
    } catch (error) {
      console.error("Error saving game result:", error);
      toast({
        title: "Failed to save progress",
        description: "There was an error saving your game result.",
        variant: "destructive",
      });
    }
  };

  // Start a new game
  const startGame = () => {
    // Get random words based on difficulty and word count
    const words = getRandomWords(difficulty, wordCount);

    // If no words available, display an error
    if (words.length === 0) {
      toast({
        title: "No words available",
        description: "No words found for the selected difficulty level.",
        variant: "destructive",
      });
      return;
    }

    // Perform dynamic imports for game creation
    Promise.all([import("phaser"), import("./WordScrambleScene")])
      .then(([Phaser, SceneModule]) => {
        // Get references to the imported modules
        const PhaserInstance = Phaser.default;
        const WordScrambleScene = SceneModule.default;

        // Create Phaser game configuration
        const config = {
          type: PhaserInstance.AUTO,
          width: 800,
          height: 600,
          backgroundColor: "#f7f9fc",
          scale: {
            mode: PhaserInstance.Scale.FIT,
            autoCenter: PhaserInstance.Scale.CENTER_BOTH,
          },
          scene: [
            new WordScrambleScene({
              words,
              timeLimit,
              onComplete: handleGameComplete,
            }),
          ],
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0, x: 0 },
              debug: false,
            },
          },
        };

        setGameConfig(config);
        setGameStarted(true);
        setGameResult(null);
        setActiveTab("game");
      })
      .catch(error => {
        console.error("Error loading game components:", error);
        toast({
          title: "Game Error",
          description: "Failed to start the game. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Render result card
  const renderResultCard = () => {
    if (!gameResult) return null;

    const { score, correctAnswers, totalQuestions } = gameResult;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Game Results</CardTitle>
          <CardDescription>
            Here&apos;s how you did in Word Scramble
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Score:</span>
              <span className="text-xl font-bold">{score} points</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Words Completed:</span>
              <span>
                {correctAnswers} out of {totalQuestions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Success Rate:</span>
              <span
                className={
                  percentage >= 80
                    ? "text-green-600"
                    : percentage >= 50
                      ? "text-amber-600"
                      : "text-red-600"
                }
              >
                {percentage}%
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <PlayButton onClick={startGame}>PLAY AGAIN</PlayButton>
        </CardFooter>
      </Card>
    );
  };

  // Render game settings form
  const renderGameSettings = () => {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Game Settings</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="difficulty-select"
                className="text-sm font-medium"
              >
                Difficulty Level
              </label>
              <Select
                value={difficulty}
                onValueChange={(
                  value: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
                ) => setDifficulty(value)}
              >
                <SelectTrigger id="difficulty-select">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 (Beginner)</SelectItem>
                  <SelectItem value="A2">A2 (Elementary)</SelectItem>
                  <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                  <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                  <SelectItem value="C1">C1 (Advanced)</SelectItem>
                  <SelectItem value="C2">C2 (Proficiency)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="word-count-select"
                className="text-sm font-medium"
              >
                Number of Words
              </label>
              <Select
                value={wordCount.toString()}
                onValueChange={value => setWordCount(parseInt(value))}
              >
                <SelectTrigger id="word-count-select">
                  <SelectValue placeholder="Select word count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 words</SelectItem>
                  <SelectItem value="10">10 words</SelectItem>
                  <SelectItem value="15">15 words</SelectItem>
                  <SelectItem value="20">20 words</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="time-limit-select"
                className="text-sm font-medium"
              >
                Time Limit
              </label>
              <Select
                value={timeLimit.toString()}
                onValueChange={value => setTimeLimit(parseInt(value))}
              >
                <SelectTrigger id="time-limit-select">
                  <SelectValue placeholder="Select time limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds (Quick)</SelectItem>
                  <SelectItem value="60">60 seconds (Normal)</SelectItem>
                  <SelectItem value="120">120 seconds (Relaxed)</SelectItem>
                  <SelectItem value="180">180 seconds (Extended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <PlayButton onClick={startGame}>START GAME</PlayButton>
        </div>
      </div>
    );
  };

  return (
    <div className="word-scramble-game">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Word Scramble</h1>
        <p className="text-muted-foreground">
          Unscramble the jumbled words to improve your vocabulary and spelling
          skills.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="start">Setup</TabsTrigger>
          <TabsTrigger value="game" disabled={!gameStarted}>
            Game
          </TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="start" className="space-y-4">
          {gameResult && renderResultCard()}
          {renderGameSettings()}
        </TabsContent>

        <TabsContent value="game">
          {gameStarted && gameConfig && (
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="h-[600px] rounded-md overflow-hidden">
                <PhaserGame
                  gameConfig={gameConfig}
                  onGameComplete={handleGameComplete}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="instructions">
          <Card>
            <CardHeader>
              <CardTitle>How to Play Word Scramble</CardTitle>
              <CardDescription>Instructions for the game</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Objective</h3>
                <p>
                  Unscramble as many words as you can within the time limit to
                  earn points.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Gameplay</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    A scrambled word will appear on the screen along with its
                    definition.
                  </li>
                  <li>
                    Click on the letter tiles to place them in the answer area.
                  </li>
                  <li>Click on a letter in the answer area to remove it.</li>
                  <li>Click "Submit" when you think your answer is correct.</li>
                  <li>
                    If correct, you&apos;ll earn 10 points and move to the next
                    word.
                  </li>
                  <li>If incorrect, try again!</li>
                  <li>
                    You can click "Skip" to move to the next word without
                    scoring.
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Use the definition as a hint for the word.</li>
                  <li>Look for common prefixes and suffixes.</li>
                  <li>Try different combinations if you&apos;re stuck.</li>
                  <li>Don&apos;t spend too much time on any single word.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Vocabulary Levels</h3>
                <p>Words are categorized according to the CEFR levels:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>A1 (Beginner)</strong>: Simple, common words.
                  </li>
                  <li>
                    <strong>A2 (Elementary)</strong>: Basic, everyday
                    vocabulary.
                  </li>
                  <li>
                    <strong>B1 (Intermediate)</strong>: Everyday vocabulary with
                    some complexity.
                  </li>
                  <li>
                    <strong>B2 (Upper Intermediate)</strong>: More abstract
                    terms and formal vocabulary.
                  </li>
                  <li>
                    <strong>C1 (Advanced)</strong>: Sophisticated vocabulary for
                    complex topics.
                  </li>
                  <li>
                    <strong>C2 (Proficiency)</strong>: Specialized, nuanced
                    vocabulary for academic or professional use.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
