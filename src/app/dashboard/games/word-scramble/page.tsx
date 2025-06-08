import { Metadata } from "next";

import WordScrambleGame from "@/components/games/word-scramble/WordScrambleGame";

export const metadata: Metadata = {
  title: "Word Scramble Game - Fluenta",
  description: "Unscramble words to improve your vocabulary and spelling",
};

export default function WordScramblePage() {
  return <WordScrambleGame />;
}
