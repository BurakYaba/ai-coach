import {
  AvatarCharacter,
  VisemeMapping,
  LoadingStrategy,
  AvatarSettings,
  EmotionConfig,
} from "./types";

// 6 Avatar Characters mapped to existing OpenAI voices
export const AVATAR_CHARACTERS: AvatarCharacter[] = [
  // Professional Characters
  {
    id: "marcus-business",
    name: "Marcus",
    voiceId: "onyx",
    personality: "Professional Business Mentor",
    description: "Expert in job interviews and business communication",
    scenarios: ["interview", "workplace_meeting", "business_presentation"],
    avatar: {
      gender: "male",
      age: "35-40",
      style: "business-professional",
      url: "https://models.readyplayer.me/6854ea76b09fea26fadfd0e4.glb?morphTargets=Oculus%20Visemes,ARKit&textureAtlas=1024&meshLod=1",
    },
  },
  {
    id: "sarah-coach",
    name: "Sarah",
    voiceId: "alloy",
    personality: "Professional Language Coach",
    description: "Clear guidance for academic and workplace scenarios",
    scenarios: ["university_enrollment", "customer_service", "formal"],
    avatar: {
      gender: "female",
      age: "30-35",
      style: "professional-coach",
      url: "https://models.readyplayer.me/6854ea2226f7cecac59c6e2b.glb?morphTargets=Oculus%20Visemes,ARKit&textureAtlas=1024&meshLod=1",
    },
  },

  // Casual Characters
  {
    id: "alex-friendly",
    name: "Alex",
    voiceId: "echo",
    personality: "Friendly Conversation Partner",
    description: "Perfect for everyday situations and casual practice",
    scenarios: ["restaurant", "cafe", "grocery_shopping", "casual"],
    avatar: {
      gender: "male",
      age: "25-30",
      style: "casual-friendly",
      url: "https://models.readyplayer.me/6854ea44f0493e6ae09cb6e2.glb?morphTargets=Oculus%20Visemes,ARKit&textureAtlas=1024&meshLod=1",
    },
  },
  {
    id: "emma-supportive",
    name: "Emma",
    voiceId: "shimmer",
    personality: "Supportive Learning Companion",
    description: "Encouraging practice partner for building confidence",
    scenarios: ["family_conversations", "social_situations", "casual"],
    avatar: {
      gender: "female",
      age: "25-30",
      style: "casual-supportive",
      url: "https://models.readyplayer.me/6854e9a8b09fea26fadfc2f0.glb?morphTargets=Oculus%20Visemes,ARKit&textureAtlas=1024&meshLod=1",
    },
  },

  // Expert Characters
  {
    id: "oliver-academic",
    name: "Oliver",
    voiceId: "fable",
    personality: "Academic English Expert",
    description: "Specialist in academic and formal English contexts",
    scenarios: ["academic_presentation", "research_discussion", "formal"],
    avatar: {
      gender: "male",
      age: "40-45",
      style: "academic-expert",
      url: "https://models.readyplayer.me/6854e95d913cd24e83a67f67.glb?morphTargets=Oculus%20Visemes,ARKit&textureAtlas=1024&meshLod=1",
    },
  },
  {
    id: "zoe-creative",
    name: "Zoe",
    voiceId: "nova",
    personality: "Creative Communication Coach",
    description: "Dynamic coach for creative and expressive communication",
    scenarios: ["creative_presentation", "storytelling", "artistic"],
    avatar: {
      gender: "female",
      age: "28-33",
      style: "creative-dynamic",
      url: "https://models.readyplayer.me/6854e9cf26f7cecac59c6831.glb?morphTargets=Oculus%20Visemes,ARKit&textureAtlas=1024&meshLod=1",
    },
  },
];

// PHASE 2: Enhanced Azure Speech viseme to Ready Player Me morph target mapping
export const AZURE_TO_RPM_VISEMES: { [key: number]: string } = {
  0: "viseme_sil", // Silence -> mouth closed
  1: "viseme_PP", // PP, BB, MM -> lips together
  2: "viseme_FF", // FF, VV -> bottom lip to top teeth
  3: "viseme_TH", // TH -> tongue tip to top teeth
  4: "viseme_DD", // DD, TT, NN, LL -> tongue tip to gum
  5: "viseme_kk", // KK, GG, NG -> tongue back up
  6: "viseme_CH", // CH, JJ, SH -> tongue up front
  7: "viseme_SS", // SS, ZZ -> tongue front down
  8: "viseme_nn", // NN -> tongue tip to gum
  9: "viseme_RR", // RR -> tongue back
  10: "viseme_aa", // AA -> jaw open, tongue down
  11: "viseme_E", // E -> tongue mid front
  12: "viseme_I", // I -> tongue high front
  13: "viseme_O", // O -> lips forward
  14: "viseme_U", // U -> lips tight forward
  15: "viseme_aa", // AH -> jaw open (same as AA for simplicity)
  16: "viseme_E", // EH -> tongue mid (same as E)
  17: "viseme_I", // IH -> tongue high (same as I)
  18: "viseme_O", // OH -> lips forward (same as O)
  19: "viseme_U", // UH -> lips forward (same as U)
  20: "viseme_aa", // AX -> jaw slightly open
  21: "viseme_sil", // Silence -> mouth closed
};

// CONFIRMED READY PLAYER ME: Only using verified ARKit blendshapes
export const VISEME_TO_MORPH_MAPPING: { [key: string]: string[] } = {
  // Silence - use minimal jaw opening instead of mouth close to avoid tongue issues
  viseme_sil: [], // No morph targets - let avatar stay in natural neutral position

  // Lip closure sounds (M, B, P) - press lips together
  viseme_PP: ["mouthPressLeft", "mouthPressRight"],

  // Lip-teeth sounds (F, V) - lower lip down to touch upper teeth
  viseme_FF: ["mouthLowerDownLeft", "mouthLowerDownRight"],

  // Tongue-teeth sounds (TH) - stretch mouth slightly for tongue between teeth
  viseme_TH: ["mouthStretchLeft", "mouthStretchRight"],

  // Tongue-ridge sounds (D, T, N, L) - raise upper lip slightly for tongue contact
  viseme_DD: ["mouthUpperUpLeft", "mouthUpperUpRight"],

  // Back consonants (K, G, NG) - open jaw for back tongue contact
  viseme_kk: ["jawOpen"],

  // Fricatives (CH, J, SH) - pucker lips forward
  viseme_CH: ["mouthPucker"],

  // Sibilants (S, Z) - subtle lip position, NO SMILE
  viseme_SS: ["mouthPucker"],

  // Nasals (N) - use minimal mouth press instead of close
  viseme_nn: ["mouthPressLeft", "mouthPressRight"],

  // Liquids (R) - round lips
  viseme_RR: ["mouthPucker"],

  // Open vowels (AA, AH, AX) - open jaw wide
  viseme_aa: ["jawOpen"],

  // Mid front vowels (E, EH) - just jaw opening, NO SMILE
  viseme_E: ["jawOpen"],

  // High front vowels (I, IY, IH) - slight jaw opening, NO SMILE
  viseme_I: ["jawOpen"],

  // Rounded vowels (O, OW, OH) - round lips forward
  viseme_O: ["mouthPucker"],

  // High rounded vowels (U, UW, UH) - tight lip rounding
  viseme_U: ["mouthPucker"],
};

// Helper function to find the best matching morph target name
export function findBestVisemeName(
  targetName: string,
  availableTargets: string[]
): string | null {
  // First try exact match
  if (availableTargets.includes(targetName)) {
    return targetName;
  }

  // The mapping now only uses confirmed blendshapes, so direct lookup should work
  return null;
}

// Confirmed Ready Player Me neutral mouth options in order of preference
export const NEUTRAL_MOUTH_OPTIONS = [
  "mouthClose", // Primary neutral position
  "jawOpen", // Slight opening if needed
];

// Function to find the best neutral mouth position
export const findBestNeutralMouth = (
  availableMorphTargets: string[]
): string | null => {
  // Try each neutral option in order of preference
  for (const option of NEUTRAL_MOUTH_OPTIONS) {
    if (availableMorphTargets.includes(option)) {
      return option;
    }
  }

  return null;
};

// Performance settings for different platforms
export const PERFORMANCE_SETTINGS = {
  mobile: {
    quality: "medium" as const,
    textureSize: 512,
    meshLod: 1,
    animationFPS: 20,
    enableLipSync: true,
    enableBlinking: true,
  },
  desktop: {
    quality: "high" as const,
    textureSize: 1024,
    meshLod: 0,
    animationFPS: 30,
    enableLipSync: true,
    enableBlinking: true,
  },
  lowEnd: {
    quality: "low" as const,
    textureSize: 256,
    meshLod: 2,
    animationFPS: 15,
    enableLipSync: false,
    enableBlinking: false,
  },
} as const;

// Progressive loading strategy
export const LOADING_STRATEGY: LoadingStrategy = {
  // 1. Immediate: Load selected avatar (medium quality)
  immediate: {
    quality: "medium",
    textureSize: 512,
    meshLod: 1,
    animationFPS: 20,
    enableLipSync: true,
    enableBlinking: true,
  },

  // 2. Background: Upgrade to high quality
  background: {
    quality: "high",
    textureSize: 1024,
    meshLod: 0,
    animationFPS: 30,
    enableLipSync: true,
    enableBlinking: true,
  },

  // 3. Preload: Most likely next avatars
  preload: {
    avatars: ["sarah-coach", "alex-friendly"], // Most popular defaults
    quality: "medium",
    priority: "idle",
  },
};

// Helper function to get avatar character by voice ID
export const getAvatarByVoiceId = (
  voiceId: string
): AvatarCharacter | undefined => {
  return AVATAR_CHARACTERS.find(character => character.voiceId === voiceId);
};

// Helper function to get avatar character by ID
export const getAvatarById = (id: string): AvatarCharacter | undefined => {
  return AVATAR_CHARACTERS.find(character => character.id === id);
};

// Helper function to generate avatar URL with quality settings
export const generateAvatarUrl = (
  character: AvatarCharacter,
  settings: AvatarSettings
): string => {
  const baseUrl = character.avatar.url.split("?")[0]; // Remove existing params
  const params = new URLSearchParams({
    morphTargets: "Oculus Visemes,ARKit", // Enhanced lip sync with Oculus Visemes + ARKit
    pose: "A", // A-pose for half-body
    meshLod: settings.meshLod.toString(),
    textureAtlas: settings.textureSize.toString(),
    meshCompression: "true", // Reduce file size
  });

  return `${baseUrl}?${params.toString()}`;
};

// Default avatar for fallback
export const DEFAULT_AVATAR = AVATAR_CHARACTERS[1]; // Sarah as default

// ENHANCEMENT 1: Co-articulation settings for natural viseme blending
export const CO_ARTICULATION_SETTINGS = {
  enabled: true,
  blendWindow: 3, // Use 3-viseme sliding window (prev, current, next)
  blendStrength: 0.5, // How much neighboring visemes influence current
  minDuration: 120, // Skip visemes shorter than 120ms (too fast to see)
  transitionTime: 80, // Smooth transition time between visemes
};

// ENHANCEMENT 2: Emotion-based facial expression mappings
export const EMOTION_TO_MORPHS: { [key: string]: EmotionConfig } = {
  happy: {
    base: [], // Removed smile blendshapes
    intensity: 0.0, // Disabled
    eyes: ["eyeSquintLeft", "eyeSquintRight"],
    eyeIntensity: 0.1, // Reduced intensity
  },
  sad: {
    base: ["mouthFrownLeft", "mouthFrownRight"],
    intensity: 0.25,
    brows: ["browDownLeft", "browDownRight"],
    browIntensity: 0.2,
  },
  surprised: {
    base: ["jawOpen"],
    intensity: 0.4,
    brows: ["browOuterUpLeft", "browOuterUpRight", "browInnerUp"],
    browIntensity: 0.3,
    eyes: ["eyeWideLeft", "eyeWideRight"],
    eyeIntensity: 0.3,
  },
  questioning: {
    base: ["mouthStretchLeft", "mouthStretchRight"],
    intensity: 0.2,
    brows: ["browInnerUp"],
    browIntensity: 0.25,
  },
  neutral: {
    base: [],
    intensity: 0,
  },
};

// ENHANCEMENT 3: Viseme prioritization - some phonemes are more visually important
export const VISEME_PRIORITY = {
  // High priority - very visible mouth shapes
  high: ["viseme_PP", "viseme_FF", "viseme_O", "viseme_U", "viseme_aa"],
  // Medium priority - moderately visible
  medium: ["viseme_CH", "viseme_SS", "viseme_E", "viseme_I", "viseme_kk"],
  // Low priority - subtle or internal tongue movements
  low: ["viseme_TH", "viseme_DD", "viseme_nn", "viseme_RR"],
  // Skip if too short
  skip: ["viseme_sil"], // Silence handled separately
};

// Get priority level for a viseme
export const getVisemePriority = (
  visemeName: string
): "high" | "medium" | "low" | "skip" => {
  if (VISEME_PRIORITY.high.includes(visemeName)) return "high";
  if (VISEME_PRIORITY.medium.includes(visemeName)) return "medium";
  if (VISEME_PRIORITY.low.includes(visemeName)) return "low";
  return "skip";
};

// ENHANCEMENT 4: Head motion and breathing patterns
export const HEAD_MOTION_SETTINGS = {
  enabled: true,
  breathing: {
    frequency: 0.3, // Breaths per second
    intensity: 0.01, // Subtle chest movement
  },
  emphasis: {
    nodIntensity: 0.02, // Head nod on stressed syllables
    tiltIntensity: 0.015, // Head tilt on questions
  },
  idle: {
    microMovements: 0.005, // Subtle idle head movements
    blinkFrequency: 0.2, // Blinks per second during speech
  },
};

// ENHANCEMENT 5: Improved animation curves with co-articulation
export const ENHANCED_ANIMATION_CURVES = {
  // Standard curve for isolated visemes
  standard: {
    rampUp: 0.3,
    hold: 0.4,
    rampDown: 0.3,
    peakIntensity: 0.6,
  },
  // Blended curve for co-articulated visemes
  blended: {
    rampUp: 0.2,
    hold: 0.6,
    rampDown: 0.2,
    peakIntensity: 0.7,
  },
  // High priority visemes get more emphasis
  emphasized: {
    rampUp: 0.25,
    hold: 0.5,
    rampDown: 0.25,
    peakIntensity: 0.8,
  },
};

// ENHANCEMENT 6: Noise injection for natural variation
export const NATURAL_VARIATION = {
  enabled: true,
  morphNoise: 0.02, // ±2% random variation in morph influences
  timingJitter: 0.05, // ±5% variation in timing
  microExpressions: {
    frequency: 0.1, // Chance per frame for micro-expressions
    intensity: 0.1, // Subtle intensity
    duration: 200, // Short duration micro-expressions
  },
};

// Helper function to apply natural variation to influence values
export const applyNaturalVariation = (baseInfluence: number): number => {
  if (!NATURAL_VARIATION.enabled) return baseInfluence;

  const noise = (Math.random() - 0.5) * NATURAL_VARIATION.morphNoise;
  return Math.max(0, Math.min(0.9, baseInfluence + noise));
};

// Helper function to detect emotion from text content
export const detectEmotionFromText = (
  text: string
): keyof typeof EMOTION_TO_MORPHS => {
  const lowerText = text.toLowerCase();

  // Simple keyword-based emotion detection
  if (
    lowerText.includes("!") ||
    /\b(great|amazing|wonderful|excellent|fantastic)\b/.test(lowerText)
  ) {
    return "happy";
  }
  if (
    lowerText.includes("?") ||
    /\b(how|what|when|where|why|which)\b/.test(lowerText)
  ) {
    return "questioning";
  }
  if (/\b(sad|sorry|unfortunately|disappointed|terrible)\b/.test(lowerText)) {
    return "sad";
  }
  if (/\b(wow|oh|really|incredible|unbelievable)\b/.test(lowerText)) {
    return "surprised";
  }

  return "neutral";
};

// ENHANCEMENT 7: Improved viseme blending function
export const blendVisemes = (
  prevViseme: string | null,
  currentViseme: string,
  nextViseme: string | null,
  transitionProgress: number
): { [viseme: string]: number } => {
  const blend: { [viseme: string]: number } = {};

  // Current viseme gets full weight
  blend[currentViseme] = 1.0;

  // Add influence from neighboring visemes based on transition progress
  if (prevViseme && transitionProgress < 0.5) {
    const prevWeight =
      (0.5 - transitionProgress) * CO_ARTICULATION_SETTINGS.blendStrength;
    blend[prevViseme] = prevWeight;
  }

  if (nextViseme && transitionProgress > 0.5) {
    const nextWeight =
      (transitionProgress - 0.5) * CO_ARTICULATION_SETTINGS.blendStrength;
    blend[nextViseme] = nextWeight;
  }

  // Normalize blend weights
  const totalWeight = Object.values(blend).reduce(
    (sum, weight) => sum + weight,
    0
  );
  if (totalWeight > 0) {
    Object.keys(blend).forEach(viseme => {
      blend[viseme] = blend[viseme] / totalWeight;
    });
  }

  return blend;
};
