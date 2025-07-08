"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Gamepad2, Target, Clock, Star, TrendingUp } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Add dynamic = 'force-dynamic' to ensure page is not statically cached
export const dynamic = "force-dynamic";

// Game catalog data
const games = [
  {
    id: "word-scramble",
    title: "Word Scramble",
    description:
      "Unscramble jumbled words to improve your vocabulary and spelling",
    image: "/images/games/word-scramble.png",
    level: "All Levels",
    skillFocus: "Vocabulary, Spelling",
    available: true,
    icon: "🔤",
    difficulty: "Easy",
    estimatedTime: "5-10 min",
  },
  {
    id: "sentence-builder",
    title: "Sentence Builder",
    description:
      "Arrange words in the correct order to form grammatically correct sentences",
    image: "/images/games/sentence-builder.png",
    level: "A1-C1",
    skillFocus: "Grammar, Sentence Structure",
    available: false,
    icon: "🔧",
    difficulty: "Medium",
    estimatedTime: "10-15 min",
  },
  {
    id: "vocabulary-match",
    title: "Vocabulary Match",
    description:
      "Match words with their definitions in a memory-style card game",
    image: "/images/games/vocabulary-match.png",
    level: "A1-C2",
    skillFocus: "Vocabulary, Comprehension",
    available: false,
    icon: "🎯",
    difficulty: "Easy",
    estimatedTime: "5-8 min",
  },
  {
    id: "fill-in-blanks",
    title: "Fill the Blanks",
    description: "Complete sentences by filling in the missing words",
    image: "/images/games/fill-blanks.png",
    level: "A2-C1",
    skillFocus: "Grammar, Vocabulary",
    available: false,
    icon: "📝",
    difficulty: "Hard",
    estimatedTime: "8-12 min",
  },
];

interface GameStats {
  totalGamesPlayed: number;
  averageScore: number;
  totalTimeSpent: number;
  favoriteGame: string;
  recentScores: number[];
  hasData: boolean;
}

export default function GamesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle authentication
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  // Fetch game statistics
  useEffect(() => {
    const fetchGameStats = async () => {
      if (!session?.user) return;

      setLoading(true);
      try {
        const response = await fetch("/api/games/stats");
        if (response.ok) {
          const data = await response.json();
          setGameStats(
            data.stats || {
              totalGamesPlayed: 0,
              averageScore: 0,
              totalTimeSpent: 0,
              favoriteGame: "None",
              recentScores: [],
              hasData: false,
            }
          );
        } else {
          // Set default empty stats
          setGameStats({
            totalGamesPlayed: 0,
            averageScore: 0,
            totalTimeSpent: 0,
            favoriteGame: "None",
            recentScores: [],
            hasData: false,
          });
        }
      } catch (error) {
        console.error("Error fetching game stats:", error);
        setGameStats({
          totalGamesPlayed: 0,
          averageScore: 0,
          totalTimeSpent: 0,
          favoriteGame: "None",
          recentScores: [],
          hasData: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGameStats();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Language Games
            </h1>
            <p className="text-gray-600">
              Enhance your learning through interactive games and challenges
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="games" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-white shadow-sm">
            <TabsTrigger
              value="games"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Available Games</span>
              <span className="sm:hidden">Games</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">My Progress</span>
              <span className="sm:hidden">Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="games" className="mt-6">
            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <Card
                  key={game.id}
                  className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    {game.available ? (
                      <div className="text-center">
                        <div className="text-6xl mb-2">{game.icon}</div>
                        <div className="text-sm text-gray-600 font-medium">
                          Ready to Play
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2 opacity-50">
                          {game.icon}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          Coming Soon
                        </div>
                      </div>
                    )}
                    {!game.available && (
                      <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                        <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-gray-800">
                        {game.title}
                      </CardTitle>
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                          {game.level}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Skills:</span>
                        <span className="font-medium text-gray-700">
                          {game.skillFocus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Difficulty:</span>
                        <span
                          className={`font-medium ${
                            game.difficulty === "Easy"
                              ? "text-green-600"
                              : game.difficulty === "Medium"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {game.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium text-gray-700 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {game.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    {game.available ? (
                      <Link
                        href={`/dashboard/games/${game.id}`}
                        className="w-full flex justify-center"
                      >
                        <PlayButton className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                          PLAY NOW
                        </PlayButton>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        className="w-full bg-gray-300 text-gray-500"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Your Gaming Progress
              </h3>

              {gameStats && gameStats.hasData ? (
                <div className="space-y-8">
                  {/* Overview Stats */}
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500 rounded-xl">
                          <Gamepad2 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-900 mb-1">
                        {gameStats.totalGamesPlayed}
                      </div>
                      <div className="text-sm text-blue-700 font-medium">
                        Games Played
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500 rounded-xl">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-900 mb-1">
                        {gameStats.averageScore}%
                      </div>
                      <div className="text-sm text-green-700 font-medium">
                        Average Score
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500 rounded-xl">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-purple-900 mb-1">
                        {Math.floor(gameStats.totalTimeSpent / 60)}h{" "}
                        {gameStats.totalTimeSpent % 60}m
                      </div>
                      <div className="text-sm text-purple-700 font-medium">
                        Time Played
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-500 rounded-xl">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-900 mb-1">
                        {gameStats.favoriteGame}
                      </div>
                      <div className="text-sm text-yellow-700 font-medium">
                        Favorite Game
                      </div>
                    </div>
                  </div>

                  {/* Recent Performance */}
                  {gameStats.recentScores.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Recent Performance
                      </h4>
                      <div className="space-y-3">
                        {gameStats.recentScores.map((score, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-600">
                              Game {gameStats.recentScores.length - index}
                            </span>
                            <div className="flex items-center gap-2">
                              <Progress value={score} className="h-2 w-24" />
                              <span className="text-sm font-medium text-gray-800">
                                {score}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Gamepad2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    No Gaming Activity Yet
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Start playing games to see your progress and statistics
                    here.
                  </p>
                  <Link href="#games">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Start Playing
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
