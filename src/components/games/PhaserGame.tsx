'use client';

import { useEffect, useRef, useState } from 'react';

// Define a custom event type for game completion
interface GameCompleteEvent extends CustomEvent {
  detail: {
    score: number;
  };
}

// TypeScript type definition without direct import
interface PhaserGameProps {
  gameConfig: any; // Using any instead of Phaser.Types.Core.GameConfig
  onGameComplete?: (score: number) => void;
}

/**
 * A reusable Phaser game component that can be used to embed any Phaser game
 * into the application.
 */
export default function PhaserGame({
  gameConfig,
  onGameComplete,
}: PhaserGameProps) {
  const gameRef = useRef<any | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Phaser game when on client side
  useEffect(() => {
    if (!isClient) return; // Don't run on server
    if (!parentRef.current) return; // Don't run if parent ref isn't available

    let gameInstance: any = null;
    let gameEventHandler: ((event: Event) => void) | null = null;

    // Dynamic import of Phaser
    const initGame = async () => {
      try {
        // Import Phaser
        const Phaser = await import('phaser');

        // Clear the container first
        const parentElement = parentRef.current;
        if (!parentElement) return;

        parentElement.innerHTML = '';

        // Create game container
        const gameContainer = document.createElement('div');
        gameContainer.style.width = '100%';
        gameContainer.style.height = '100%';
        parentElement.appendChild(gameContainer);

        // Configure game with container
        const config = {
          ...gameConfig,
          parent: gameContainer,
        };

        // Register game completion event handler
        if (onGameComplete) {
          gameEventHandler = (e: Event) => {
            const customEvent = e as GameCompleteEvent;
            onGameComplete(customEvent.detail.score);
          };

          window.addEventListener('game-complete', gameEventHandler);
        }

        // Create new game instance
        gameInstance = new Phaser.default.Game(config);
        gameRef.current = gameInstance;
      } catch (error) {
        console.error('Error initializing Phaser game:', error);
      }
    };

    // Initialize with a slight delay
    const timer = setTimeout(() => {
      initGame();
    }, 200);

    // Cleanup function
    return () => {
      clearTimeout(timer);

      // Remove event listener
      if (gameEventHandler) {
        window.removeEventListener('game-complete', gameEventHandler);
      }

      // Destroy game instance
      if (gameInstance) {
        try {
          gameInstance.destroy(true);
        } catch (e) {
          console.error('Error destroying Phaser game:', e);
        }
      }
    };
  }, [isClient, gameConfig, onGameComplete]);

  // If not on client, render placeholder
  if (!isClient) {
    return (
      <div
        ref={parentRef}
        className="phaser-game-container w-full h-full rounded-md overflow-hidden flex items-center justify-center bg-slate-100"
      >
        <div className="text-gray-500">Loading game...</div>
      </div>
    );
  }

  // On client, render the actual game container
  return (
    <div
      ref={parentRef}
      className="phaser-game-container w-full h-full rounded-md overflow-hidden"
      data-testid="phaser-game-container"
    />
  );
}
