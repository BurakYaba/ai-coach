"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import {
  VisemeData,
  FacialAnimationData,
  EyeMovementData,
  EyebrowExpressionData,
  HeadGestureData,
  BlinkPatternData,
  LipSyncController as ILipSyncController,
} from "./types";
import {
  AZURE_TO_RPM_VISEMES,
  VISEME_TO_MORPH_MAPPING,
  findBestVisemeName,
  CO_ARTICULATION_SETTINGS,
  EMOTION_TO_MORPHS,
  VISEME_PRIORITY,
  getVisemePriority,
  HEAD_MOTION_SETTINGS,
  ENHANCED_ANIMATION_CURVES,
  NATURAL_VARIATION,
  applyNaturalVariation,
  detectEmotionFromText,
  blendVisemes,
} from "./constants";

interface FacialAnimationControllerProps {
  avatar: any; // Three.js Object3D
  facialAnimationData: FacialAnimationData;
  isPlaying: boolean;
  speechText?: string;
  onAnimationComplete?: () => void;
  audioRef?: React.RefObject<HTMLAudioElement>; // Keep for future use but simplify
}

// SIMPLIFIED: Basic animation state
interface AnimationState {
  isRunning: boolean;
  startTime: number;
  animationId: number | null;
  hasLoggedTargets: boolean;
  lastVisemeIndex: number;
  currentEmotion: keyof typeof EMOTION_TO_MORPHS;
  lastBlinkTime: number;
  animationState: "idle" | "playing" | "paused";
}

// SIMPLIFIED: Basic easing function
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// SMOOTH LIP SYNC: Enhanced morph target application with lerping
function applyMorphTargetInfluence(
  avatar: any,
  morphTargetNames: string[],
  targetInfluence: number,
  speed: number = 0.3
) {
  if (!avatar || !morphTargetNames.length) return;

  avatar.traverse((child: any) => {
    if (child.morphTargetInfluences && child.morphTargetDictionary) {
      morphTargetNames.forEach(morphTargetName => {
        const index = child.morphTargetDictionary[morphTargetName];
        if (index !== undefined) {
          const clampedTarget = Math.max(0, Math.min(1.0, targetInfluence));
          const currentValue = child.morphTargetInfluences[index] || 0;

          // SMOOTH LERP: Use THREE.js lerp for smooth transitions
          child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            currentValue,
            clampedTarget,
            speed
          );
        }
      });
    }
  });
}

// SMOOTH LIP SYNC: Gradual fade-out of all inactive visemes
function fadeOutInactiveVisemes(
  avatar: any,
  activeViseme: string | null,
  speed: number = 0.2
) {
  if (!avatar) return;

  Object.entries(VISEME_TO_MORPH_MAPPING).forEach(
    ([visemeName, morphTargetNames]) => {
      if (
        visemeName !== activeViseme &&
        morphTargetNames &&
        morphTargetNames.length > 0
      ) {
        // Gradually fade out inactive visemes
        applyMorphTargetInfluence(avatar, morphTargetNames, 0, speed);
      }
    }
  );

  // Also fade out jaw opening if not active
  if (
    activeViseme &&
    !["viseme_aa", "viseme_O", "viseme_U", "viseme_E", "viseme_I"].includes(
      activeViseme
    )
  ) {
    applyMorphTargetInfluence(avatar, ["jawOpen"], 0, speed);
  }
}

// SMOOTH LIP SYNC: Determine if viseme is a vowel for different animation speeds
function isVowelViseme(visemeName: string): boolean {
  const vowelVisemes = [
    "viseme_aa",
    "viseme_O",
    "viseme_U",
    "viseme_E",
    "viseme_I",
  ];
  return vowelVisemes.includes(visemeName);
}

// ENHANCED LIP SYNC: Determine consonant type for specific intensity boosts
function getConsonantType(
  visemeName: string
): "labial" | "dental" | "fricative" | "plosive" | "liquid" | "none" {
  const consonantTypes = {
    labial: ["viseme_PP", "viseme_FF"], // Lip-based sounds (P, B, M, F, V)
    dental: ["viseme_TH", "viseme_DD"], // Tongue-teeth sounds (TH, T, D, N, L)
    fricative: ["viseme_CH", "viseme_SS"], // Friction sounds (CH, SH, S, Z)
    plosive: ["viseme_kk"], // Explosive sounds (K, G)
    liquid: ["viseme_RR", "viseme_nn"], // Flowing sounds (R, N)
  };

  for (const [type, visemes] of Object.entries(consonantTypes)) {
    if (visemes.includes(visemeName)) {
      return type as "labial" | "dental" | "fricative" | "plosive" | "liquid";
    }
  }
  return "none";
}

// ENHANCED LIP SYNC: Get intensity multiplier based on viseme type
function getVisemeIntensityMultiplier(visemeName: string): number {
  const isVowel = isVowelViseme(visemeName);

  if (isVowel) {
    return 1.5; // INCREASED from 1.3 to 1.5 (50% boost for vowels)
  }

  const consonantType = getConsonantType(visemeName);

  switch (consonantType) {
    case "labial":
      return 1.6; // INCREASED from 1.4 to 1.6 (60% boost for lip-based consonants)
    case "fricative":
      return 1.4; // INCREASED from 1.25 to 1.4 (40% boost for fricatives)
    case "plosive":
      return 1.35; // INCREASED from 1.2 to 1.35 (35% boost for plosives)
    case "dental":
      return 1.3; // INCREASED from 1.15 to 1.3 (30% boost for dental sounds)
    case "liquid":
      return 1.25; // INCREASED from 1.1 to 1.25 (25% boost for liquids)
    default:
      return 1.0; // No boost for silence or unrecognized
  }
}

// SMOOTH LIP SYNC: Get appropriate lerp speed based on viseme type
function getLerpSpeed(visemeName: string, isActive: boolean): number {
  const isVowel = isVowelViseme(visemeName);

  if (isActive) {
    // Active viseme speeds - vowels slower for smoother movement
    return isVowel ? 0.15 : 0.25; // Reduced from original 0.2/0.4 for even smoother
  } else {
    // Fade-out speeds - vowels fade out slower too
    return isVowel ? 0.08 : 0.15; // Reduced from original 0.1/0.2 for smoother fade
  }
}

// SMOOTH LIP SYNC: Reset all viseme morph targets with optional immediate reset
function resetAllVisemeMorphTargets(avatar: any, immediate: boolean = false) {
  if (!avatar) return;

  if (immediate) {
    // IMMEDIATE RESET: Bypass lerping for instant reset (needed for replay)
    avatar.traverse((child: any) => {
      if (child.morphTargetInfluences && child.morphTargetDictionary) {
        // Reset all viseme morph targets immediately
        Object.values(VISEME_TO_MORPH_MAPPING).forEach(morphTargetNames => {
          if (morphTargetNames && morphTargetNames.length > 0) {
            morphTargetNames.forEach(morphTargetName => {
              const index = child.morphTargetDictionary[morphTargetName];
              if (index !== undefined) {
                child.morphTargetInfluences[index] = 0; // Immediate reset
              }
            });
          }
        });

        // Reset jaw opening immediately
        const jawIndex = child.morphTargetDictionary["jawOpen"];
        if (jawIndex !== undefined) {
          child.morphTargetInfluences[jawIndex] = 0; // Immediate reset
        }
      }
    });
  } else {
    // GRADUAL RESET: Use lerping for smooth transitions
    Object.values(VISEME_TO_MORPH_MAPPING).forEach(morphTargetNames => {
      if (morphTargetNames && morphTargetNames.length > 0) {
        applyMorphTargetInfluence(avatar, morphTargetNames, 0);
      }
    });

    // Reset jaw opening
    applyMorphTargetInfluence(avatar, ["jawOpen"], 0);
  }
}

// SIMPLIFIED: Get dynamic amplitude for more visible movement
function getAmplitudeAt(currentTime: number): number {
  // INCREASED AMPLITUDE: Even higher base for maximum visible mouth movement
  const primaryRhythm = Math.sin(currentTime * 0.001) * 0.15; // Slightly reduced variation for consistency
  const secondaryRhythm = Math.sin(currentTime * 0.004) * 0.08; // Slightly reduced variation
  const baseAmplitude = 0.95; // INCREASED from 0.85 to 0.95 for maximum visible movement

  const amplitude = baseAmplitude + primaryRhythm + secondaryRhythm;
  return Math.max(0.8, Math.min(1.0, amplitude)); // INCREASED minimum from 0.7 to 0.8
}

// SIMPLIFIED: Enhanced blinking
function applyEnhancedBlinking(
  avatar: any,
  elapsedTime: number,
  lastBlinkTime: number
): number {
  const blinkInterval = 3000 + Math.random() * 4000; // 3-7 seconds (slower)

  if (elapsedTime - lastBlinkTime > blinkInterval) {
    const blinkIntensity = 0.8 + Math.random() * 0.2; // 0.8-1.0
    const blinkDuration = 150 + Math.random() * 100; // 150-250ms

    applyMorphTargetInfluence(
      avatar,
      ["eyeBlinkLeft", "eyeBlinkRight"],
      blinkIntensity
    );

    setTimeout(() => {
      applyMorphTargetInfluence(avatar, ["eyeBlinkLeft", "eyeBlinkRight"], 0);
    }, blinkDuration);

    return elapsedTime;
  }

  return lastBlinkTime;
}

// SMOOTH LIP SYNC: Enhanced jaw movement with lerping - INCREASED INTENSITIES
function applyJawMovement(avatar: any, visemeName: string, intensity: number) {
  const vowelVisemes = [
    "viseme_aa",
    "viseme_O",
    "viseme_U",
    "viseme_E",
    "viseme_I",
  ];

  if (vowelVisemes.includes(visemeName)) {
    let jawIntensity = 0;

    switch (visemeName) {
      case "viseme_aa":
        jawIntensity = 1.0 * intensity; // INCREASED from 0.7 - widest mouth opening for "ah"
        break;
      case "viseme_O":
        jawIntensity = 0.8 * intensity; // INCREASED from 0.5 - round mouth opening for "oh"
        break;
      case "viseme_E":
        jawIntensity = 0.6 * intensity; // INCREASED from 0.4 - mid opening for "eh"
        break;
      case "viseme_I":
        jawIntensity = 0.5 * intensity; // INCREASED from 0.3 - smaller opening for "ih"
        break;
      case "viseme_U":
        jawIntensity = 0.7 * intensity; // INCREASED from 0.35 - rounded opening for "oo"
        break;
    }

    // SMOOTH LIP SYNC: Use lerping for jaw movement too - INCREASED MAX
    const lerpSpeed = getLerpSpeed(visemeName, true);
    applyMorphTargetInfluence(
      avatar,
      ["jawOpen"],
      Math.min(1.0, jawIntensity), // INCREASED max from 0.8 to 1.0 for full jaw opening
      lerpSpeed
    );
  }
}

// ENHANCED LIP SYNC: Apply consonant-specific jaw and lip movements
function applyConsonantMovement(
  avatar: any,
  visemeName: string,
  intensity: number
) {
  const consonantType = getConsonantType(visemeName);
  const lerpSpeed = getLerpSpeed(visemeName, true);

  switch (consonantType) {
    case "labial":
      // Lip-based consonants need slight jaw opening for visibility
      if (visemeName === "viseme_PP") {
        // P, B, M - lips pressed together, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.3 * intensity,
          lerpSpeed
        ); // INCREASED from 0.2
      } else if (visemeName === "viseme_FF") {
        // F, V - lower lip to upper teeth, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.35 * intensity,
          lerpSpeed
        ); // INCREASED from 0.25
      }
      break;

    case "dental":
      // Tongue-teeth sounds need moderate jaw opening
      if (visemeName === "viseme_TH") {
        // TH - tongue between teeth, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.4 * intensity,
          lerpSpeed
        ); // INCREASED from 0.3
      } else if (visemeName === "viseme_DD") {
        // T, D, N, L - tongue to ridge, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.35 * intensity,
          lerpSpeed
        ); // INCREASED from 0.25
      }
      break;

    case "fricative":
      // Fricatives need slight jaw opening for air flow visibility
      if (visemeName === "viseme_CH") {
        // CH, SH, J - tongue up front, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.3 * intensity,
          lerpSpeed
        ); // INCREASED from 0.2
      } else if (visemeName === "viseme_SS") {
        // S, Z - tongue front down, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.25 * intensity,
          lerpSpeed
        ); // INCREASED from 0.15
      }
      break;

    case "plosive":
      // Plosives need more jaw opening for explosive release
      if (visemeName === "viseme_kk") {
        // K, G - back tongue contact, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.5 * intensity,
          lerpSpeed
        ); // INCREASED from 0.4
      }
      break;

    case "liquid":
      // Liquids need slight jaw opening
      if (visemeName === "viseme_RR") {
        // R - tongue back, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.3 * intensity,
          lerpSpeed
        ); // INCREASED from 0.2
      } else if (visemeName === "viseme_nn") {
        // N - nasal, INCREASED jaw opening
        applyMorphTargetInfluence(
          avatar,
          ["jawOpen"],
          0.25 * intensity,
          lerpSpeed
        ); // INCREASED from 0.15
      }
      break;
  }
}

// Helper function to log available morph targets for debugging
function logAvailableMorphTargets(avatar: any) {
  if (!avatar) return;

  avatar.traverse((child: any) => {
    if (child.morphTargetInfluences && child.morphTargetDictionary) {
      const availableTargets = Object.keys(child.morphTargetDictionary);
      // Production: Morph targets are available but not logged
    }
  });
}

export function LipSyncController({
  avatar,
  facialAnimationData,
  isPlaying,
  speechText = "",
  onAnimationComplete,
  audioRef,
}: FacialAnimationControllerProps) {
  const animationStateRef = useRef<AnimationState>({
    isRunning: false,
    startTime: 0,
    animationId: null,
    hasLoggedTargets: false,
    lastVisemeIndex: -1,
    currentEmotion: "neutral",
    lastBlinkTime: 0,
    animationState: "idle",
  });

  // Track if we have valid viseme data
  const hasVisemeData =
    facialAnimationData.visemes && facialAnimationData.visemes.length > 0;

  const animate = useCallback(() => {
    const state = animationStateRef.current;

    if (!state.isRunning || !avatar || !facialAnimationData.visemes.length) {
      return;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - state.startTime;
    state.animationState = "playing";

    // SMOOTH LIP SYNC: Get amplitude for mouth movement intensity
    const amplitude = getAmplitudeAt(currentTime);

    // Enhanced blinking
    state.lastBlinkTime = applyEnhancedBlinking(
      avatar,
      elapsedTime,
      state.lastBlinkTime
    );

    const visemeEvents = facialAnimationData.visemes;
    let currentViseme: VisemeData | null = null;
    let currentVisemeIndex = -1;

    // Find current viseme
    for (let i = 0; i < visemeEvents.length; i++) {
      const viseme = visemeEvents[i];
      if (
        elapsedTime >= viseme.offset &&
        elapsedTime < viseme.offset + viseme.duration
      ) {
        currentViseme = viseme;
        currentVisemeIndex = i;
        break;
      }
    }

    // SMOOTH LIP SYNC: Always fade out inactive visemes gradually
    let activeVisemeName: string | null = null;

    if (currentViseme) {
      const visemeName = AZURE_TO_RPM_VISEMES[currentViseme.visemeId];

      if (visemeName && currentViseme.duration >= 30) {
        activeVisemeName = visemeName;
        const mappedMorphTargets = VISEME_TO_MORPH_MAPPING[visemeName];

        if (mappedMorphTargets) {
          const visemeProgress =
            (elapsedTime - currentViseme.offset) / currentViseme.duration;

          // SMOOTH LIP SYNC: Enhanced animation curve for natural transitions
          let influence = 0;
          if (visemeProgress < 0.4) {
            const rampProgress = visemeProgress / 0.4;
            influence = easeInOutCubic(rampProgress) * amplitude;
          } else if (visemeProgress < 0.6) {
            influence = amplitude;
          } else {
            const rampProgress = (visemeProgress - 0.6) / 0.4;
            influence = amplitude * (1 - easeInOutCubic(rampProgress));
          }

          // ENHANCED VISEME BOOST: Apply intensity multiplier based on viseme type
          const intensityMultiplier = getVisemeIntensityMultiplier(visemeName);
          influence = Math.min(1.0, influence * intensityMultiplier);

          // SMOOTH LIP SYNC: Apply viseme with appropriate lerp speed
          const lerpSpeed = getLerpSpeed(visemeName, true);
          applyMorphTargetInfluence(
            avatar,
            mappedMorphTargets,
            influence,
            lerpSpeed
          );

          // ENHANCED LIP SYNC: Apply vowel jaw movement OR consonant movement
          const isVowel = isVowelViseme(visemeName);
          if (isVowel) {
            // SMOOTH LIP SYNC: Apply jaw movement with lerping - INCREASED MULTIPLIER
            applyJawMovement(avatar, visemeName, influence * 0.9); // INCREASED from 0.7 to 0.9
          } else {
            // ENHANCED LIP SYNC: Apply consonant-specific movements
            applyConsonantMovement(avatar, visemeName, influence);
          }
        }
      }
    }

    // SMOOTH LIP SYNC: Fade out all inactive visemes smoothly
    fadeOutInactiveVisemes(avatar, activeVisemeName);

    if (!activeVisemeName) {
      // SMOOTH LIP SYNC: Idle state with gentle lerping to subtle position - INCREASED for maximum contrast
      applyMorphTargetInfluence(avatar, ["jawOpen"], 0.12, 0.1); // INCREASED from 0.08 to 0.12 for maximum contrast
    }

    // Reset when viseme changes for immediate transition start
    if (currentVisemeIndex !== state.lastVisemeIndex) {
      state.lastVisemeIndex = currentVisemeIndex;
    }

    // Check for animation end
    const lastViseme = visemeEvents[visemeEvents.length - 1];
    const animationEndTime = lastViseme
      ? lastViseme.offset + lastViseme.duration + 500
      : elapsedTime + 1000;

    if (elapsedTime < animationEndTime) {
      state.animationId = requestAnimationFrame(animate);
    } else {
      state.animationState = "idle";
      onAnimationComplete?.();
    }
  }, [avatar, facialAnimationData, speechText, onAnimationComplete]);

  const startAnimation = useCallback(() => {
    const state = animationStateRef.current;

    if (state.isRunning) {
      stopAnimation();
    }

    state.currentEmotion = detectEmotionFromText(speechText);

    if (avatar && !state.hasLoggedTargets) {
      // Production: Morph targets available but not logged
      state.hasLoggedTargets = true;
    }

    state.startTime = Date.now();
    state.isRunning = true;
    state.lastVisemeIndex = -1;
    state.lastBlinkTime = 0;
    state.animationId = requestAnimationFrame(animate);
  }, [animate, avatar, speechText]);

  const stopAnimation = useCallback(() => {
    const state = animationStateRef.current;

    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    state.isRunning = false;
    state.lastVisemeIndex = -1;

    if (avatar) {
      // REPLAY FIX: Use immediate reset to ensure clean state for replays
      resetAllVisemeMorphTargets(avatar, true); // immediate = true
    }
  }, [avatar]);

  // Track audio events for replay support
  useEffect(() => {
    if (!audioRef?.current || !hasVisemeData) return;

    const audioElement = audioRef.current;

    const handleAudioPlay = () => {
      if (hasVisemeData) {
        // REPLAY FIX: Ensure we stop any existing animation first
        stopAnimation();
        // Small delay to ensure reset is complete before starting new animation
        setTimeout(() => {
          startAnimation();
        }, 10);
      }
    };

    const handleAudioEnded = () => {
      stopAnimation();
    };

    const handleAudioPause = () => {
      stopAnimation();
    };

    const handleAudioError = () => {
      stopAnimation();
    };

    // Add event listeners
    addEventListeners();

    function addEventListeners() {
      if (audioElement) {
        audioElement.addEventListener("play", handleAudioPlay);
        audioElement.addEventListener("ended", handleAudioEnded);
        audioElement.addEventListener("pause", handleAudioPause);
        audioElement.addEventListener("error", handleAudioError);
      }
    }

    function removeEventListeners() {
      if (audioElement) {
        audioElement.removeEventListener("play", handleAudioPlay);
        audioElement.removeEventListener("ended", handleAudioEnded);
        audioElement.removeEventListener("pause", handleAudioPause);
        audioElement.removeEventListener("error", handleAudioError);
      }
    }

    // Cleanup function
    return () => {
      removeEventListeners();
      stopAnimation();
    };
  }, [audioRef, hasVisemeData, startAnimation, stopAnimation]);

  // Enhanced effect to handle audio source changes
  useEffect(() => {
    if (!audioRef?.current) return;

    const audioElement = audioRef.current;
    let lastSrc = audioElement.src;

    const checkSrcChange = () => {
      if (audioElement.src !== lastSrc) {
        lastSrc = audioElement.src;
        // Re-attach event listeners when source changes
        // The main useEffect will handle this automatically
      }
    };

    const interval = setInterval(checkSrcChange, 100);

    return () => {
      clearInterval(interval);
    };
  }, [audioRef]);

  useEffect(() => {
    if (isPlaying && facialAnimationData.visemes.length > 0) {
      // Production: Starting lip sync with visemes
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [
    isPlaying,
    facialAnimationData.visemes.length,
    startAnimation,
    stopAnimation,
  ]);

  // Log available morph targets for debugging
  useEffect(() => {
    if (avatar) {
      const morphTargets: string[] = [];
      avatar.traverse((child: any) => {
        if (child.morphTargetDictionary) {
          Object.keys(child.morphTargetDictionary).forEach(key => {
            if (!morphTargets.includes(key)) {
              morphTargets.push(key);
            }
          });
        }
      });
      // Production: Morph targets are available but not logged
    }
  }, [avatar]);

  return null;
}
