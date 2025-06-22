"use client";

import React, { useState } from "react";
import { AvatarViewer } from "./AvatarViewer";
import { AvatarSelector } from "./AvatarSelector";
import { AVATAR_CHARACTERS, detectEmotionFromText } from "./constants";
import { FacialAnimationData } from "./types";

// Demo component to showcase enhanced lip sync features
export function EnhancedAvatarDemo() {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_CHARACTERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechText, setSpeechText] = useState(
    "Hello! How are you doing today?"
  );

  // Mock viseme data for demo
  const mockVisemeData: FacialAnimationData = {
    visemes: [
      { visemeId: 0, offset: 0, duration: 100 }, // silence
      { visemeId: 1, offset: 100, duration: 150 }, // H
      { visemeId: 11, offset: 250, duration: 200 }, // E
      { visemeId: 8, offset: 450, duration: 100 }, // L
      { visemeId: 8, offset: 550, duration: 100 }, // L
      { visemeId: 13, offset: 650, duration: 200 }, // O
      { visemeId: 0, offset: 850, duration: 100 }, // silence
    ],
    eyeMovements: [],
    eyebrowExpressions: [],
    headGestures: [],
    blinkPatterns: [],
  };

  const testSentences = [
    "Hello! How are you doing today?",
    "I'm so excited to help you learn!",
    "Are you ready for the next lesson?",
    "That's fantastic progress!",
    "I'm sorry, but that's not quite right.",
    "Wow! That's absolutely incredible!",
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    // Auto-stop after 3 seconds for demo
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const detectedEmotion = detectEmotionFromText(speechText);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Enhanced Avatar Lip Sync Demo
        </h2>
        <p className="text-gray-600 mb-4">
          This demo showcases the enhanced lip sync system with co-articulation,
          emotion detection, head motion, and natural variation.
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Avatar</h3>
        <AvatarSelector
          characters={AVATAR_CHARACTERS}
          selectedCharacter={selectedAvatar}
          onCharacterChange={setSelectedAvatar}
        />
      </div>

      {/* Speech Text Input */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Speech Text</h3>
        <div className="space-y-3">
          <textarea
            value={speechText}
            onChange={e => setSpeechText(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
            placeholder="Enter text to analyze emotion and generate speech..."
          />
          <div className="flex flex-wrap gap-2">
            {testSentences.map((sentence, index) => (
              <button
                key={index}
                onClick={() => setSpeechText(sentence)}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
              >
                {sentence.split(" ").slice(0, 3).join(" ")}...
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Detected Emotion:</strong> {detectedEmotion}
          </div>
        </div>
      </div>

      {/* Avatar Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Avatar Display</h3>
        <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center">
          <AvatarViewer
            character={selectedAvatar}
            state={isPlaying ? "speaking" : "idle"}
            facialAnimationData={mockVisemeData}
            speechText={speechText}
            onLoaded={() => {}}
            onError={error => console.error("Avatar error:", error)}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Controls</h3>
        <div className="flex gap-3">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isPlaying
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isPlaying ? "Playing..." : "Play Animation"}
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            disabled={!isPlaying}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !isPlaying
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Stop
          </button>
        </div>
      </div>

      {/* Enhancement Features */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Enhanced Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              ✅ Co-Articulation
            </h4>
            <p className="text-sm text-green-700">
              Smooth blending between visemes using 3-phoneme sliding window
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              😊 Emotion Detection
            </h4>
            <p className="text-sm text-blue-700">
              Automatic facial expressions based on speech content
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              🎯 Viseme Prioritization
            </h4>
            <p className="text-sm text-purple-700">
              Emphasizes visually important phonemes like /F/, /O/, /U/
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">🎭 Head Motion</h4>
            <p className="text-sm text-orange-700">
              Subtle breathing, blinking, and micro-movements
            </p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="text-sm text-gray-600">
        <h3 className="text-lg font-semibold mb-3">Technical Implementation</h3>
        <ul className="space-y-1">
          <li>• Co-articulation with 50% blend strength</li>
          <li>• Minimum viseme duration: 120ms</li>
          <li>• Natural variation: ±2% morph influence</li>
          <li>• Blinking frequency: 0.2 Hz during speech</li>
          <li>• Emotion overlay with 70% base intensity</li>
          <li>• Micro-expressions: 10% chance per frame</li>
        </ul>
      </div>
    </div>
  );
}
