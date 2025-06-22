// OCULUS LIP SYNC VISEME MAPPING (replacing Azure)
// This matches Ready Player Me's actual blend shape names and Oculus standards
export const OCULUS_VISEME_MAPPING: Record<string, string> = {
  // Silence and breathing
  sil: "viseme_sil",
  PP: "viseme_PP", // Bilabial sounds: P, B, M
  FF: "viseme_FF", // Labiodental: F, V
  TH: "viseme_TH", // Dental: TH (as in "think")
  DD: "viseme_DD", // Alveolar: T, D, N, L
  kk: "viseme_kk", // Velar: K, G
  CH: "viseme_CH", // Postalveolar: CH, SH, J
  SS: "viseme_SS", // Sibilant: S, Z
  nn: "viseme_nn", // Nasal: N, NG
  RR: "viseme_RR", // Liquid: R
  aa: "viseme_aa", // Open vowel: "father"
  E: "viseme_E", // Mid vowel: "bed"
  I: "viseme_I", // Close vowel: "bit"
  O: "viseme_O", // Mid-back vowel: "thought"
  U: "viseme_U", // Close-back vowel: "boot"
};

// Phoneme to Oculus viseme mapping (more accurate than Azure)
export const PHONEME_TO_OCULUS_VISEME: Record<string, string> = {
  // Vowels
  AA: "aa", // "father", "palm"
  AE: "aa", // "cat", "bat"
  AH: "aa", // "but", "cup"
  AO: "O", // "thought", "law"
  AW: "O", // "about", "cow"
  AY: "aa", // "bite", "my"
  EH: "E", // "bed", "red"
  ER: "E", // "bird", "hurt"
  EY: "E", // "bait", "day"
  IH: "I", // "bit", "sit"
  IY: "I", // "beat", "see"
  OW: "O", // "boat", "show"
  OY: "O", // "boy", "toy"
  UH: "U", // "book", "could"
  UW: "U", // "boot", "two"

  // Consonants
  B: "PP", // "bat"
  CH: "CH", // "chat"
  D: "DD", // "dog"
  DH: "TH", // "this"
  F: "FF", // "fish"
  G: "kk", // "go"
  HH: "sil", // "house"
  JH: "CH", // "jump"
  K: "kk", // "cat"
  L: "DD", // "love"
  M: "PP", // "mouse"
  N: "DD", // "nose"
  NG: "nn", // "sing"
  P: "PP", // "pat"
  R: "RR", // "red"
  S: "SS", // "see"
  SH: "CH", // "she"
  T: "DD", // "top"
  TH: "TH", // "think"
  V: "FF", // "voice"
  W: "U", // "water"
  Y: "I", // "yes"
  Z: "SS", // "zoo"
  ZH: "CH", // "measure"

  // Silence
  SIL: "sil",
  SP: "sil",
};

// Oculus viseme characteristics for better animation
export const OCULUS_VISEME_PROPERTIES: Record<
  string,
  {
    duration: number;
    intensity: number;
    jawOpen: number;
    isVowel: boolean;
    coarticulation: string[];
  }
> = {
  viseme_sil: {
    duration: 0.1,
    intensity: 0.0,
    jawOpen: 0.0,
    isVowel: false,
    coarticulation: [],
  },
  viseme_PP: {
    duration: 0.08,
    intensity: 1.0,
    jawOpen: 0.1,
    isVowel: false,
    coarticulation: ["viseme_aa", "viseme_E"],
  },
  viseme_FF: {
    duration: 0.12,
    intensity: 0.9,
    jawOpen: 0.15,
    isVowel: false,
    coarticulation: ["viseme_aa", "viseme_E"],
  },
  viseme_TH: {
    duration: 0.1,
    intensity: 0.8,
    jawOpen: 0.2,
    isVowel: false,
    coarticulation: ["viseme_E", "viseme_I"],
  },
  viseme_DD: {
    duration: 0.08,
    intensity: 1.0,
    jawOpen: 0.25,
    isVowel: false,
    coarticulation: ["viseme_aa", "viseme_E", "viseme_I"],
  },
  viseme_kk: {
    duration: 0.08,
    intensity: 0.9,
    jawOpen: 0.3,
    isVowel: false,
    coarticulation: ["viseme_aa", "viseme_O"],
  },
  viseme_CH: {
    duration: 0.12,
    intensity: 0.9,
    jawOpen: 0.2,
    isVowel: false,
    coarticulation: ["viseme_I", "viseme_E"],
  },
  viseme_SS: {
    duration: 0.15,
    intensity: 0.8,
    jawOpen: 0.1,
    isVowel: false,
    coarticulation: ["viseme_I", "viseme_E"],
  },
  viseme_nn: {
    duration: 0.1,
    intensity: 0.7,
    jawOpen: 0.15,
    isVowel: false,
    coarticulation: ["viseme_aa", "viseme_E"],
  },
  viseme_RR: {
    duration: 0.1,
    intensity: 0.8,
    jawOpen: 0.2,
    isVowel: false,
    coarticulation: ["viseme_aa", "viseme_E", "viseme_O"],
  },
  viseme_aa: {
    duration: 0.2,
    intensity: 1.0,
    jawOpen: 0.8,
    isVowel: true,
    coarticulation: ["viseme_E", "viseme_O"],
  },
  viseme_E: {
    duration: 0.18,
    intensity: 0.9,
    jawOpen: 0.5,
    isVowel: true,
    coarticulation: ["viseme_aa", "viseme_I"],
  },
  viseme_I: {
    duration: 0.15,
    intensity: 0.8,
    jawOpen: 0.2,
    isVowel: true,
    coarticulation: ["viseme_E", "viseme_U"],
  },
  viseme_O: {
    duration: 0.2,
    intensity: 0.95,
    jawOpen: 0.6,
    isVowel: true,
    coarticulation: ["viseme_aa", "viseme_U"],
  },
  viseme_U: {
    duration: 0.18,
    intensity: 0.85,
    jawOpen: 0.4,
    isVowel: true,
    coarticulation: ["viseme_O", "viseme_I"],
  },
};
