"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { AvatarProps, VisemeData, FacialAnimationData } from "./types";
import {
  AZURE_TO_RPM_VISEMES,
  PERFORMANCE_SETTINGS,
  generateAvatarUrl,
  findBestVisemeName,
  findBestNeutralMouth,
} from "./constants";
import { LipSyncController } from "./LipSyncController";

interface AvatarViewerProps extends AvatarProps {
  facialAnimationData?: FacialAnimationData;
  speechText?: string;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

// Component to render the 3D avatar model
function AvatarModel({
  url,
  state,
  facialAnimationData,
  speechText,
  audioRef,
  onLoaded,
  onError,
}: {
  url: string;
  state: AvatarProps["state"];
  facialAnimationData?: FacialAnimationData;
  speechText?: string;
  audioRef?: React.RefObject<HTMLAudioElement>;
  onLoaded?: () => void;
  onError?: (error: Error) => void;
}) {
  // Load the avatar model with proper error handling
  const gltf = useGLTF(url);
  const scene = gltf.scene;
  const groupRef = useRef<THREE.Group>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize once when scene loads
  useEffect(() => {
    if (scene && !isInitialized && onLoaded) {
      setIsInitialized(true);
      onLoaded();
    }
  }, [scene, isInitialized, onLoaded]);

  // Enhanced facial animation system
  const isAnimating =
    state === "speaking" &&
    facialAnimationData &&
    facialAnimationData.visemes.length > 0;

  // PHASE 2: Enhanced animation frame with facial expressions
  useFrame(() => {
    if (!scene || !isInitialized || !groupRef.current) return;

    const currentTime = Date.now();

    // PHASE 2: Handle facial animation data
    if (isAnimating && facialAnimationData) {
      // Let LipSyncController handle all morph targets when animating
      // Don't interfere with the animation system
    } else {
      // Only reset morph targets in idle state when NOT animating
      if (state === "idle") {
        // Initialize morph target influences
        const morphTargetInfluences: { [key: string]: number } = {};

        // Idle state - ensure mouth is properly closed (neutral position)
        scene.traverse((child: any) => {
          if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
            const availableMorphTargets = Object.keys(
              child.morphTargetDictionary || {}
            );
            const neutralMouth = findBestNeutralMouth(availableMorphTargets);
            if (neutralMouth) {
              // Set to 0 to ensure mouth is closed in idle state
              morphTargetInfluences[neutralMouth] = 0;
            }

            // Reset all other mouth-related morph targets to 0
            Object.keys(AZURE_TO_RPM_VISEMES).forEach(visemeId => {
              const visemeName = AZURE_TO_RPM_VISEMES[parseInt(visemeId)];
              if (availableMorphTargets.includes(visemeName)) {
                morphTargetInfluences[visemeName] = 0;
              }
            });
          }
        });

        // Apply morph target influences to the mesh
        scene.traverse((child: any) => {
          if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
            Object.entries(morphTargetInfluences).forEach(([key, value]) => {
              const index = child.morphTargetDictionary?.[key];
              if (index !== undefined && child.morphTargetInfluences) {
                child.morphTargetInfluences[index] = value;
              }
            });
          }
        });
      }
    }

    // Subtle idle animation (only when truly idle)
    if (state === "idle" && !isAnimating && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(currentTime * 0.0005) * 0.05;
    }
  });

  if (!scene) {
    return null;
  }

  return (
    <>
      <group ref={groupRef}>
        <primitive
          object={scene}
          scale={[3.2, 3.2, 3.2]}
          position={[0, -1.9, 0]}
        />
      </group>

      {/* ENHANCED: Pass audioRef for real-time audio analysis */}
      <LipSyncController
        avatar={scene}
        facialAnimationData={facialAnimationData || { visemes: [] }}
        isPlaying={isAnimating || false}
        speechText={speechText}
        audioRef={audioRef}
        onAnimationComplete={() => {
          // Animation completed - no logging needed
        }}
      />
    </>
  );
}

// Loading fallback component - Using Three.js elements for Canvas compatibility
function AvatarLoading() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotate the loading indicator
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.05;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.3, 0.1, 8, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

// Error fallback component
function AvatarError({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="text-muted-foreground mb-2">Failed to load avatar</div>
      <div className="text-sm text-muted-foreground mb-4">{error.message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Main AvatarViewer component
export function AvatarViewer({
  character,
  state,
  facialAnimationData,
  speechText,
  audioRef,
  quality = "medium",
  onLoaded,
  onError,
}: AvatarViewerProps) {
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Detect if we're on mobile for performance optimization
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const settings = isMobile
    ? PERFORMANCE_SETTINGS.mobile
    : PERFORMANCE_SETTINGS.desktop;

  // Generate avatar URL with appropriate quality settings
  const avatarUrl = generateAvatarUrl(character, {
    quality,
    textureSize: settings.textureSize,
    meshLod: settings.meshLod,
    animationFPS: settings.animationFPS,
    enableLipSync: settings.enableLipSync,
    enableBlinking: settings.enableBlinking,
  });

  const handleError = (error: Error) => {
    setLoadError(error);
    onError?.(error);
  };

  const handleRetry = () => {
    setLoadError(null);
    setRetryCount(prev => prev + 1);
  };

  const handleLoaded = () => {
    setLoadError(null);
    onLoaded?.();
  };

  if (loadError) {
    return <AvatarError error={loadError} onRetry={handleRetry} />;
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.2, 2.0], fov: 32 }}
        style={{ background: "transparent" }}
        gl={{ antialias: !isMobile, alpha: true }}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Suspense fallback={<AvatarLoading />}>
          <AvatarModel
            key={`${character.id}-stable`}
            url={avatarUrl}
            state={state}
            facialAnimationData={facialAnimationData}
            speechText={speechText}
            audioRef={audioRef}
            onLoaded={handleLoaded}
            onError={handleError}
          />
        </Suspense>

        {/* Orbit controls completely removed for production use */}
      </Canvas>

      {/* Gradient mask to hide hands/lower body - fades to background color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 75%,
            rgba(248, 250, 252, 0.3) 85%,
            rgba(248, 250, 252, 1) 100%
          )`,
        }}
      />

      {/* State indicator */}
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <AvatarLoading />
        </div>
      )}
    </div>
  );
}
