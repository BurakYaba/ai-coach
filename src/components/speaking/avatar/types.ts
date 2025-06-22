// Avatar system types for Ready Player Me integration

export interface AvatarCharacter {
  id: string;
  name: string;
  voiceId: string;
  personality: string;
  description: string;
  scenarios: string[];
  avatar: {
    gender: "male" | "female";
    age: string;
    style: string;
    url: string;
  };
}

export interface VisemeData {
  visemeId: number; // Azure Speech viseme ID (0-21)
  offset: number; // Milliseconds from start
  duration: number; // Duration to hold this shape
  audioOffset?: number; // Original Azure offset for debugging
  isKeyFrame?: boolean; // Whether this is a key frame (important viseme)
  isInBetween?: boolean; // Whether this is an in-between frame for smooth transitions
}

export interface LipSyncController {
  avatar: any; // Three.js Object3D
  visemeEvents: VisemeData[];
  startTime: number;
  isPlaying: boolean;

  play(): void;
  stop(): void;
  update(currentTime: number): void;
}

export type AvatarState =
  | "idle"
  | "speaking"
  | "listening"
  | "loading"
  | "error";

export interface AvatarProps {
  character: AvatarCharacter;
  state: AvatarState;
  visemeData?: VisemeData[];
  quality?: "low" | "medium" | "high";
  onLoaded?: () => void;
  onError?: (error: Error) => void;
}

export interface AvatarSelectorProps {
  characters: AvatarCharacter[];
  selectedCharacter: AvatarCharacter;
  onCharacterChange: (character: AvatarCharacter) => void;
  disabled?: boolean;
}

// Azure Speech viseme IDs mapped to Ready Player Me blend shapes
export interface VisemeMapping {
  [visemeId: number]: string;
}

// Performance and quality settings
export interface AvatarSettings {
  quality: "low" | "medium" | "high";
  textureSize: 256 | 512 | 1024 | 2048;
  meshLod: 0 | 1 | 2; // Level of detail
  animationFPS: number;
  enableLipSync: boolean;
  enableBlinking: boolean;
}

// Loading strategies
export interface LoadingStrategy {
  immediate: AvatarSettings;
  background: AvatarSettings;
  preload: {
    avatars: string[];
    quality: "low" | "medium" | "high";
    priority: "high" | "low" | "idle";
  };
}

// PHASE 2: Enhanced facial animation data
export interface FacialAnimationData {
  visemes: VisemeData[];
  eyeMovements?: EyeMovementData[];
  eyebrowExpressions?: EyebrowExpressionData[];
  headGestures?: HeadGestureData[];
  blinkPatterns?: BlinkPatternData[];
}

export interface EyeMovementData {
  offset: number;
  duration: number;
  lookDirection: "center" | "left" | "right" | "up" | "down";
  intensity: number; // 0.0 to 1.0
}

export interface EyebrowExpressionData {
  offset: number;
  duration: number;
  expression: "neutral" | "raised" | "furrowed" | "surprised";
  intensity: number; // 0.0 to 1.0
}

export interface HeadGestureData {
  offset: number;
  duration: number;
  gesture: "nod" | "shake" | "tilt" | "neutral";
  intensity: number; // 0.0 to 1.0
}

export interface BlinkPatternData {
  offset: number;
  duration: number;
  blinkType: "normal" | "slow" | "emphasis";
}

// ENHANCEMENT: Add emotion configuration type
export interface EmotionConfig {
  base: string[];
  intensity: number;
  eyes?: string[];
  eyeIntensity?: number;
  brows?: string[];
  browIntensity?: number;
}
