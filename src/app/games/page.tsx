"use client";

import Image from "next/image";
import Link from "next/link";

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
  },
  {
    id: "fill-in-blanks",
    title: "Fill the Blanks",
    description: "Complete sentences by filling in the missing words",
    image: "/images/games/fill-blanks.png",
    level: "A2-C1",
    skillFocus: "Grammar, Vocabulary",
    available: false,
  },
];

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-primary/20 to-secondary/20 p-8 rounded-lg">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Enhance Your Learning Through Play
          </h2>
          <p className="text-lg mb-6">
            Our interactive language games make learning fun while reinforcing
            key concepts in vocabulary, grammar, and comprehension.
          </p>
          <p className="text-muted-foreground mb-6">
            Games adapt to your skill level and track your progress to help you
            improve consistently.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <Card
            key={game.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-muted">
              {game.available ? (
                <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                  <span>Game thumbnail placeholder</span>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                  <span>Coming Soon</span>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{game.title}</CardTitle>
                <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {game.level}
                </div>
              </div>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <strong>Skills:</strong> {game.skillFocus}
              </p>
            </CardContent>
            <CardFooter>
              {game.available ? (
                <Link
                  href={`/games/${game.id}`}
                  className="w-full flex justify-center"
                >
                  <PlayButton>PLAY NOW</PlayButton>
                </Link>
              ) : (
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
