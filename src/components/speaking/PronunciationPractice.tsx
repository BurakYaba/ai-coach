"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Play,
  Pause,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  CheckCircle,
  Target,
  BookOpen,
  Headphones,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Pronunciation exercises data organized by CEFR levels
const PHONEME_EXERCISES = [
  // A1 LEVEL - Basic Individual Sounds
  {
    id: "a1_basic_vowels",
    title: "Basic Vowel Sounds /æ/, /ɑ/, /ɪ/, /i/",
    description: "Master fundamental English vowel sounds for beginners",
    difficulty: "A1",
    phonemes: ["/æ/", "/ɑ/", "/ɪ/", "/i/"],
    words: [
      { word: "cat", phonetic: "/kæt/", meaning: "small animal", audio: "cat" },
      {
        word: "bat",
        phonetic: "/bæt/",
        meaning: "flying animal",
        audio: "bat",
      },
      { word: "car", phonetic: "/kɑr/", meaning: "vehicle", audio: "car" },
      { word: "far", phonetic: "/fɑr/", meaning: "distant", audio: "far" },
      { word: "sit", phonetic: "/sɪt/", meaning: "to rest", audio: "sit" },
      { word: "bit", phonetic: "/bɪt/", meaning: "small piece", audio: "bit" },
      { word: "see", phonetic: "/si/", meaning: "to look", audio: "see" },
      { word: "tea", phonetic: "/ti/", meaning: "drink", audio: "tea" },
    ],
    minimalPairs: [
      { pair: ["cat", "cut"], explanation: "Practice /æ/ vs /ʌ/ distinction" },
      { pair: ["sit", "seat"], explanation: "Practice short /ɪ/ vs long /i/" },
      { pair: ["car", "care"], explanation: "Practice /ɑ/ vs /ɛr/ sounds" },
    ],
    tips: [
      "Open your mouth wider for /æ/ like in 'cat'",
      "Relax your tongue for /ɑ/ like in 'car'",
      "Keep /ɪ/ short and relaxed like in 'sit'",
      "Smile and tense your mouth for /i/ like in 'see'",
    ],
  },
  {
    id: "a1_consonant_basics",
    title: "Essential Consonants /p/, /b/, /t/, /d/",
    description: "Practice fundamental consonant sounds",
    difficulty: "A1",
    phonemes: ["/p/", "/b/", "/t/", "/d/"],
    words: [
      { word: "pen", phonetic: "/pen/", meaning: "writing tool", audio: "pen" },
      {
        word: "bed",
        phonetic: "/bed/",
        meaning: "sleeping place",
        audio: "bed",
      },
      { word: "top", phonetic: "/tɑp/", meaning: "highest part", audio: "top" },
      { word: "dog", phonetic: "/dɔg/", meaning: "animal pet", audio: "dog" },
      {
        word: "cup",
        phonetic: "/kʌp/",
        meaning: "drinking vessel",
        audio: "cup",
      },
      { word: "big", phonetic: "/bɪg/", meaning: "large", audio: "big" },
    ],
    minimalPairs: [
      {
        pair: ["pen", "ben"],
        explanation: "Practice voiceless /p/ vs voiced /b/",
      },
      { pair: ["tap", "tab"], explanation: "Practice /p/ vs /b/ at word end" },
      {
        pair: ["tear", "dear"],
        explanation: "Practice /t/ vs /d/ distinction",
      },
    ],
    tips: [
      "Feel air puff with /p/ and /t/ - no puff with /b/ and /d/",
      "Put your hand in front of your mouth to feel the difference",
      "/p/ and /t/ are voiceless - no vocal cord vibration",
      "/b/ and /d/ are voiced - feel vibration in your throat",
    ],
  },

  // A2 LEVEL - Sound Combinations and Problem Sounds
  {
    id: "a2_th_sounds",
    title: "/θ/ and /ð/ Sounds (TH)",
    description: "Master the challenging 'th' sounds",
    difficulty: "A2",
    phonemes: ["/θ/", "/ð/"],
    words: [
      {
        word: "think",
        phonetic: "/θɪŋk/",
        meaning: "to use your mind",
        audio: "think",
      },
      {
        word: "this",
        phonetic: "/ðɪs/",
        meaning: "referring to something nearby",
        audio: "this",
      },
      {
        word: "three",
        phonetic: "/θri/",
        meaning: "the number 3",
        audio: "three",
      },
      {
        word: "that",
        phonetic: "/ðæt/",
        meaning: "referring to something",
        audio: "that",
      },
      {
        word: "through",
        phonetic: "/θru/",
        meaning: "from one side to another",
        audio: "through",
      },
      {
        word: "breathe",
        phonetic: "/brið/",
        meaning: "to take air into lungs",
        audio: "breathe",
      },
      { word: "thumb", phonetic: "/θʌm/", meaning: "finger", audio: "thumb" },
      {
        word: "mother",
        phonetic: "/ˈmʌðər/",
        meaning: "female parent",
        audio: "mother",
      },
    ],
    minimalPairs: [
      {
        pair: ["think", "sink"],
        explanation: "Practice /θ/ vs /s/ distinction",
      },
      { pair: ["this", "dis"], explanation: "Practice /ð/ vs /d/ distinction" },
      {
        pair: ["three", "tree"],
        explanation: "Practice /θr/ vs /tr/ clusters",
      },
    ],
    tips: [
      "Put your tongue between your teeth for both sounds",
      "/θ/ is voiceless (no vibration) like in 'think'",
      "/ð/ is voiced (with vibration) like in 'this'",
      "Practice in front of a mirror to see tongue position",
    ],
  },
  {
    id: "a2_r_l_sounds",
    title: "/r/ and /l/ Sounds",
    description: "Master the distinction between R and L sounds",
    difficulty: "A2",
    phonemes: ["/r/", "/l/"],
    words: [
      { word: "red", phonetic: "/red/", meaning: "the color", audio: "red" },
      {
        word: "led",
        phonetic: "/led/",
        meaning: "past tense of lead",
        audio: "led",
      },
      {
        word: "right",
        phonetic: "/raɪt/",
        meaning: "correct or direction",
        audio: "right",
      },
      {
        word: "light",
        phonetic: "/laɪt/",
        meaning: "brightness",
        audio: "light",
      },
      { word: "rock", phonetic: "/rɑk/", meaning: "stone", audio: "rock" },
      {
        word: "lock",
        phonetic: "/lɑk/",
        meaning: "securing device",
        audio: "lock",
      },
      {
        word: "berry",
        phonetic: "/ˈberi/",
        meaning: "small fruit",
        audio: "berry",
      },
      {
        word: "belly",
        phonetic: "/ˈbeli/",
        meaning: "stomach",
        audio: "belly",
      },
    ],
    minimalPairs: [
      {
        pair: ["red", "led"],
        explanation: "Practice /r/ vs /l/ at word beginning",
      },
      {
        pair: ["right", "light"],
        explanation: "Focus on tongue position for /r/ vs /l/",
      },
      {
        pair: ["pray", "play"],
        explanation: "Practice /r/ and /l/ in consonant clusters",
      },
    ],
    tips: [
      "For /r/: curl your tongue back, don't touch the roof of your mouth",
      "For /l/: touch the tip of your tongue to the roof of your mouth",
      "Practice slowly at first, then increase speed",
      "Record yourself to hear the difference",
    ],
  },

  // B1 LEVEL - Vowel Distinctions and Combinations
  {
    id: "b1_vowel_pairs",
    title: "Long vs Short Vowels",
    description: "Distinguish between long and short vowel sounds",
    difficulty: "B1",
    phonemes: ["/i/", "/ɪ/", "/u/", "/ʊ/", "/ɔ/", "/ɑ/"],
    words: [
      {
        word: "sheep",
        phonetic: "/ʃip/",
        meaning: "farm animal",
        audio: "sheep",
      },
      { word: "ship", phonetic: "/ʃɪp/", meaning: "boat", audio: "ship" },
      {
        word: "fool",
        phonetic: "/ful/",
        meaning: "silly person",
        audio: "fool",
      },
      {
        word: "full",
        phonetic: "/fʊl/",
        meaning: "containing as much as possible",
        audio: "full",
      },
      { word: "beat", phonetic: "/bit/", meaning: "to hit", audio: "beat" },
      { word: "bit", phonetic: "/bɪt/", meaning: "small piece", audio: "bit" },
      { word: "pool", phonetic: "/pul/", meaning: "water area", audio: "pool" },
      { word: "pull", phonetic: "/pʊl/", meaning: "to drag", audio: "pull" },
    ],
    minimalPairs: [
      { pair: ["sheep", "ship"], explanation: "Long /i/ vs short /ɪ/" },
      { pair: ["fool", "full"], explanation: "Long /u/ vs short /ʊ/" },
      {
        pair: ["beat", "bit"],
        explanation: "Practice vowel length distinction",
      },
    ],
    tips: [
      "Long vowels are held longer than short vowels",
      "Feel the difference in your mouth position",
      "Long /i/ - smile widely, short /ɪ/ - more relaxed",
      "Practice with a mirror to see lip position",
    ],
  },
  {
    id: "b1_diphthongs",
    title: "Diphthongs /aɪ/, /aʊ/, /oɪ/",
    description: "Master English diphthongs and gliding vowels",
    difficulty: "B1",
    phonemes: ["/aɪ/", "/aʊ/", "/oɪ/", "/eɪ/", "/oʊ/"],
    words: [
      { word: "time", phonetic: "/taɪm/", meaning: "duration", audio: "time" },
      {
        word: "house",
        phonetic: "/haʊs/",
        meaning: "building",
        audio: "house",
      },
      { word: "boy", phonetic: "/boɪ/", meaning: "male child", audio: "boy" },
      {
        word: "face",
        phonetic: "/feɪs/",
        meaning: "front of head",
        audio: "face",
      },
      { word: "go", phonetic: "/goʊ/", meaning: "to move", audio: "go" },
      { word: "coin", phonetic: "/koɪn/", meaning: "money", audio: "coin" },
      { word: "now", phonetic: "/naʊ/", meaning: "at this time", audio: "now" },
      {
        word: "late",
        phonetic: "/leɪt/",
        meaning: "not on time",
        audio: "late",
      },
    ],
    minimalPairs: [
      {
        pair: ["time", "team"],
        explanation: "Practice /aɪ/ vs /i/ distinction",
      },
      {
        pair: ["house", "has"],
        explanation: "Practice /aʊ/ vs /æ/ distinction",
      },
      {
        pair: ["boy", "buy"],
        explanation: "Practice /oɪ/ vs /aɪ/ distinction",
      },
    ],
    tips: [
      "Diphthongs are two vowel sounds combined smoothly",
      "Start with the first vowel sound and glide to the second",
      "Practice slowly to feel the tongue movement",
      "Don't break the sounds - keep them connected",
    ],
  },

  // B2 LEVEL - Word Stress and Advanced Patterns
  {
    id: "b2_word_stress",
    title: "Word Stress Patterns",
    description: "Learn to stress the correct syllables in words",
    difficulty: "B2",
    phonemes: ["Stress"],
    words: [
      {
        word: "photograph",
        phonetic: "/ˈfoʊtəˌɡræf/",
        meaning: "a picture",
        audio: "photograph",
      },
      {
        word: "photography",
        phonetic: "/fəˈtɑɡrəfi/",
        meaning: "art of taking pictures",
        audio: "photography",
      },
      {
        word: "record",
        phonetic: "/ˈrekɔrd/ (noun), /rɪˈkɔrd/ (verb)",
        meaning: "to save sound/data",
        audio: "record",
      },
      {
        word: "present",
        phonetic: "/ˈprezənt/ (noun), /prɪˈzent/ (verb)",
        meaning: "gift or to give",
        audio: "present",
      },
      {
        word: "computer",
        phonetic: "/kəmˈpjutər/",
        meaning: "electronic device",
        audio: "computer",
      },
      {
        word: "important",
        phonetic: "/ɪmˈpɔrtənt/",
        meaning: "significant",
        audio: "important",
      },
      {
        word: "understand",
        phonetic: "/ˌʌndərˈstænd/",
        meaning: "to comprehend",
        audio: "understand",
      },
      {
        word: "university",
        phonetic: "/ˌjunəˈvɜrsəti/",
        meaning: "higher education",
        audio: "university",
      },
    ],
    minimalPairs: [
      {
        pair: ["REcord", "reCORD"],
        explanation: "Noun vs verb stress pattern",
      },
      {
        pair: ["PHOtograph", "phoTOgraphy"],
        explanation: "How stress changes with suffixes",
      },
      { pair: ["PREsent", "preSENT"], explanation: "Stress affects meaning" },
    ],
    tips: [
      "Stressed syllables are louder and longer",
      "Listen for the stressed syllable in new words",
      "Many 2-syllable nouns stress the first syllable",
      "Many 2-syllable verbs stress the second syllable",
    ],
  },
  {
    id: "b2_consonant_clusters",
    title: "Consonant Clusters",
    description: "Master complex consonant combinations",
    difficulty: "B2",
    phonemes: ["/str/", "/spr/", "/skr/", "/θr/", "/spl/"],
    words: [
      { word: "street", phonetic: "/strit/", meaning: "road", audio: "street" },
      {
        word: "spring",
        phonetic: "/sprɪŋ/",
        meaning: "season",
        audio: "spring",
      },
      {
        word: "scream",
        phonetic: "/skrim/",
        meaning: "to shout",
        audio: "scream",
      },
      { word: "throw", phonetic: "/θroʊ/", meaning: "to toss", audio: "throw" },
      {
        word: "split",
        phonetic: "/splɪt/",
        meaning: "to divide",
        audio: "split",
      },
      {
        word: "strong",
        phonetic: "/strɔŋ/",
        meaning: "powerful",
        audio: "strong",
      },
      {
        word: "spread",
        phonetic: "/spred/",
        meaning: "to extend",
        audio: "spread",
      },
      {
        word: "scratch",
        phonetic: "/skrætʃ/",
        meaning: "to scrape",
        audio: "scratch",
      },
    ],
    minimalPairs: [
      {
        pair: ["tree", "three"],
        explanation: "Practice /tr/ vs /θr/ clusters",
      },
      {
        pair: ["split", "spit"],
        explanation: "Practice consonant cluster vs single consonant",
      },
      {
        pair: ["stream", "steam"],
        explanation: "Practice adding consonants to clusters",
      },
    ],
    tips: [
      "Practice each consonant in the cluster clearly",
      "Don't add vowels between consonants",
      "Start slowly and gradually increase speed",
      "Use a mirror to watch your mouth movements",
    ],
  },

  // C1 LEVEL - Advanced Pronunciation Features
  {
    id: "c1_reduced_vowels",
    title: "Reduced Vowels and Schwa /ə/",
    description: "Master unstressed vowel reduction in connected speech",
    difficulty: "C1",
    phonemes: ["/ə/", "Reduction"],
    words: [
      {
        word: "about",
        phonetic: "/əˈbaʊt/",
        meaning: "concerning",
        audio: "about",
      },
      {
        word: "banana",
        phonetic: "/bəˈnænə/",
        meaning: "fruit",
        audio: "banana",
      },
      {
        word: "family",
        phonetic: "/ˈfæməli/",
        meaning: "relatives",
        audio: "family",
      },
      {
        word: "comfortable",
        phonetic: "/ˈkʌmftərbəl/",
        meaning: "at ease",
        audio: "comfortable",
      },
      {
        word: "temperature",
        phonetic: "/ˈtempərətʃər/",
        meaning: "heat level",
        audio: "temperature",
      },
      {
        word: "probably",
        phonetic: "/ˈprɑbəbli/",
        meaning: "likely",
        audio: "probably",
      },
      {
        word: "different",
        phonetic: "/ˈdɪfərənt/",
        meaning: "not same",
        audio: "different",
      },
      {
        word: "interesting",
        phonetic: "/ˈɪntrəstɪŋ/",
        meaning: "engaging",
        audio: "interesting",
      },
    ],
    minimalPairs: [
      {
        pair: ["about", "a boat"],
        explanation: "Practice schwa vs full vowel",
      },
      {
        pair: ["family", "fam-i-ly"],
        explanation: "Natural vs over-pronounced",
      },
      {
        pair: ["different", "dif-fer-ent"],
        explanation: "Reduction in natural speech",
      },
    ],
    tips: [
      "Schwa /ə/ is the most common vowel in English",
      "Unstressed syllables often use schwa",
      "Don't over-pronounce unstressed vowels",
      "Listen to natural speech patterns",
    ],
  },
  {
    id: "c1_linking_sounds",
    title: "Linking and Connected Speech",
    description: "Master how sounds connect in fluent speech",
    difficulty: "C1",
    phonemes: ["Linking", "Elision"],
    words: [
      {
        word: "turn_off",
        phonetic: "/ˈtɜrn ɔf/ → /ˈtɜrnɔf/",
        meaning: "to switch off",
        audio: "turn_off",
      },
      {
        word: "pick_it_up",
        phonetic: "/pɪk ɪt ʌp/ → /ˈpɪkɪtʌp/",
        meaning: "to lift",
        audio: "pick_it_up",
      },
      {
        word: "want_to",
        phonetic: "/wɑnt tu/ → /ˈwɑnə/",
        meaning: "desire to",
        audio: "want_to",
      },
      {
        word: "going_to",
        phonetic: "/ˈgoʊɪŋ tu/ → /ˈgoʊnə/",
        meaning: "future action",
        audio: "going_to",
      },
      {
        word: "used_to",
        phonetic: "/juzd tu/ → /ˈjustə/",
        meaning: "past habit",
        audio: "used_to",
      },
      {
        word: "a_lot_of",
        phonetic: "/ə lɑt ʌv/ → /əˈlɑdəv/",
        meaning: "many",
        audio: "a_lot_of",
      },
    ],
    minimalPairs: [
      { pair: ["want to", "wanna"], explanation: "Formal vs connected speech" },
      {
        pair: ["going to", "gonna"],
        explanation: "Pronunciation in natural speech",
      },
      {
        pair: ["pick it up", "pickitup"],
        explanation: "Word boundaries in speech",
      },
    ],
    tips: [
      "Words flow together in natural speech",
      "Consonants link to following vowels",
      "Some sounds disappear in connected speech",
      "Practice with common phrases and expressions",
    ],
  },

  // C2 LEVEL - Native-like Pronunciation
  {
    id: "c2_intonation_patterns",
    title: "Advanced Intonation Patterns",
    description: "Master complex intonation for natural-sounding speech",
    difficulty: "C2",
    phonemes: ["Intonation", "Pitch"],
    words: [
      {
        word: "Really?",
        phonetic: "/ˈrili/ ↗",
        meaning: "question intonation",
        audio: "really_question",
      },
      {
        word: "Really.",
        phonetic: "/ˈrili/ ↘",
        meaning: "statement intonation",
        audio: "really_statement",
      },
      {
        word: "I think so.",
        phonetic: "/aɪ ˈθɪŋk soʊ/ ↘",
        meaning: "confident statement",
        audio: "i_think_so",
      },
      {
        word: "I think so?",
        phonetic: "/aɪ ˈθɪŋk soʊ/ ↗",
        meaning: "uncertain question",
        audio: "i_think_so_question",
      },
      {
        word: "Well...",
        phonetic: "/wel/ ↗↘",
        meaning: "hesitation",
        audio: "well_hesitation",
      },
      {
        word: "Oh, I see.",
        phonetic: "/oʊ aɪ ˈsi/ ↘",
        meaning: "understanding",
        audio: "oh_i_see",
      },
    ],
    minimalPairs: [
      {
        pair: ["You're going ↗", "You're going ↘"],
        explanation: "Question vs statement intonation",
      },
      {
        pair: ["That's interesting ↗", "That's interesting ↘"],
        explanation: "Surprised vs neutral tone",
      },
      {
        pair: ["Maybe ↗", "Maybe ↘"],
        explanation: "Uncertain vs dismissive tone",
      },
    ],
    tips: [
      "Rising intonation often indicates questions or uncertainty",
      "Falling intonation shows certainty or completion",
      "Intonation conveys emotion and attitude",
      "Practice with different emotions and contexts",
    ],
  },
  {
    id: "c2_advanced_features",
    title: "Advanced Pronunciation Features",
    description: "Master subtle pronunciation features of native speakers",
    difficulty: "C2",
    phonemes: ["Glottal Stop", "Flapping", "Aspiration"],
    words: [
      {
        word: "button",
        phonetic: "/ˈbʌʔən/",
        meaning: "fastener (with glottal stop)",
        audio: "button",
      },
      {
        word: "water",
        phonetic: "/ˈwɑɾər/",
        meaning: "liquid (with flapping)",
        audio: "water",
      },
      {
        word: "better",
        phonetic: "/ˈbeɾər/",
        meaning: "superior (with flapping)",
        audio: "better",
      },
      {
        word: "top",
        phonetic: "/tʰɑp/",
        meaning: "highest (aspirated)",
        audio: "top_aspirated",
      },
      {
        word: "stop",
        phonetic: "/stɑp/",
        meaning: "cease (unaspirated)",
        audio: "stop_unaspirated",
      },
      {
        word: "uh-oh",
        phonetic: "/ˈʌʔoʊ/",
        meaning: "expression (glottal stops)",
        audio: "uh_oh",
      },
    ],
    minimalPairs: [
      { pair: ["button", "but-ton"], explanation: "Glottal stop vs clear /t/" },
      { pair: ["water", "wah-ter"], explanation: "Flapped vs clear /t/" },
      { pair: ["top", "stop"], explanation: "Aspirated vs unaspirated /t/" },
    ],
    tips: [
      "Glottal stops replace /t/ in some positions",
      "Flapping occurs between vowels in American English",
      "Aspiration varies based on position in word",
      "These features make speech sound more natural",
    ],
  },
];

const CEFR_LEVELS = [
  { id: "A1", name: "A1 - Beginner", color: "bg-emerald-100 text-emerald-800" },
  { id: "A2", name: "A2 - Elementary", color: "bg-green-100 text-green-800" },
  { id: "B1", name: "B1 - Intermediate", color: "bg-blue-100 text-blue-800" },
  {
    id: "B2",
    name: "B2 - Upper-Intermediate",
    color: "bg-indigo-100 text-indigo-800",
  },
  { id: "C1", name: "C1 - Advanced", color: "bg-purple-100 text-purple-800" },
  { id: "C2", name: "C2 - Proficient", color: "bg-pink-100 text-pink-800" },
];

interface PronunciationWord {
  word: string;
  phonetic: string;
  meaning: string;
  audio: string;
}

interface MinimalPair {
  pair: string[];
  explanation: string;
}

interface PhonemeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  phonemes: string[];
  words: PronunciationWord[];
  minimalPairs: MinimalPair[];
  tips: string[];
}

export function PronunciationPractice() {
  const { data: session } = useSession();
  const [selectedDifficulty, setSelectedDifficulty] = useState("A1");
  const [selectedExercise, setSelectedExercise] =
    useState<PhonemeExercise | null>(null);
  const [currentMode, setCurrentMode] = useState<
    "listen" | "practice" | "test"
  >("listen");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<{ [key: string]: Blob }>({});
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [showPhonetics, setShowPhonetics] = useState(true);
  const [activeTab, setActiveTab] = useState("words");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Filter exercises by CEFR level
  const filteredExercises = PHONEME_EXERCISES.filter(
    exercise => exercise.difficulty === selectedDifficulty
  );

  const getDifficultyInfo = (difficultyId: string) => {
    return CEFR_LEVELS.find(level => level.id === difficultyId);
  };

  // Helper function to get English voice
  const getEnglishVoice = (): Promise<SpeechSynthesisVoice | null> => {
    return new Promise(resolve => {
      const getVoice = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          // Voices not loaded yet, try again
          setTimeout(getVoice, 100);
          return;
        }

        // Prefer native English voices over Google voices
        const englishVoice =
          voices.find(
            voice =>
              voice.lang.startsWith("en") && !voice.name.includes("Google")
          ) || voices.find(voice => voice.lang.startsWith("en"));

        resolve(englishVoice || null);
      };

      getVoice();
    });
  };

  // Play word pronunciation using text-to-speech
  const playWord = async (word: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);

      try {
        const utterance = new SpeechSynthesisUtterance(word);

        // Set language to English
        utterance.lang = "en-US";

        // Get an English voice
        const englishVoice = await getEnglishVoice();
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        utterance.rate = 0.7;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Text-to-speech error:", error);
        setIsPlaying(false);
      }
    }
  };

  // Analyze recording with real Azure Speech API
  const analyzeRecording = async (wordKey: string, recording: Blob) => {
    if (!selectedExercise) return;

    const currentWordData = selectedExercise.words.find(
      w => w.word === wordKey
    );
    if (!currentWordData) return;

    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append("audio", recording, "pronunciation.wav");
      formData.append("referenceText", currentWordData.word);
      formData.append("word", currentWordData.word);

      // Call the pronunciation analysis API
      const response = await fetch("/api/speaking/pronunciation/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze pronunciation");
      }

      const data = await response.json();

      if (data.success && data.feedback) {
        // Update scores with real analysis results
        const score = Math.round(data.feedback.overallScore);
        setScores(prev => ({ ...prev, [wordKey]: score }));

        // Mark as completed if score is good enough
        if (score >= 80 && !completedWords.includes(wordKey)) {
          setCompletedWords(prev => [...prev, wordKey]);
        }

        // Create detailed feedback message
        let feedbackMessage = `Pronunciation Score: ${score}/100\n`;

        if (data.feedback.strengths && data.feedback.strengths.length > 0) {
          feedbackMessage += `\n✅ Strengths: ${data.feedback.strengths.join(", ")}\n`;
        }

        if (
          data.feedback.areasForImprovement &&
          data.feedback.areasForImprovement.length > 0
        ) {
          feedbackMessage += `\n🎯 Areas for improvement: ${data.feedback.areasForImprovement.join(", ")}\n`;
        }

        if (data.feedback.suggestions && data.feedback.suggestions.length > 0) {
          feedbackMessage += `\n💡 Suggestions: ${data.feedback.suggestions.slice(0, 2).join(". ")}.`;
        }

        setFeedback(prev => ({
          ...prev,
          [wordKey]: feedbackMessage,
        }));

        // Show success toast for good pronunciation
        if (score >= 80) {
          toast({
            title: "Great pronunciation!",
            description: `You scored ${score}/100 for "${wordKey}"`,
          });
        } else if (score >= 70) {
          toast({
            title: "Good effort!",
            description: `You scored ${score}/100 for "${wordKey}". Keep practicing!`,
          });
        } else {
          toast({
            title: "Keep practicing!",
            description: `You scored ${score}/100 for "${wordKey}". Try again!`,
            variant: "destructive",
          });
        }
      } else {
        // Fallback to encouraging message if API fails
        setFeedback(prev => ({
          ...prev,
          [wordKey]: `Good job practicing "${wordKey}"! Keep practicing to improve your pronunciation.`,
        }));
      }
    } catch (error) {
      console.error("Error analyzing pronunciation:", error);
      // Provide fallback feedback
      setFeedback(prev => ({
        ...prev,
        [wordKey]: `Good effort practicing "${wordKey}"! Keep working on your pronunciation.`,
      }));
      throw error; // Re-throw to show error toast
    }
  };

  // Start recording pronunciation
  const startRecording = async (wordKey: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please login to use this feature",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Try to use WAV format if supported, otherwise fall back to WebM
      let mimeType = "audio/wav";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm;codecs=opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/webm";
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Create blob with the actual recorded MIME type
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        // Convert to WAV if necessary
        let finalBlob = audioBlob;
        if (mimeType !== "audio/wav") {
          try {
            finalBlob = await convertToWav(audioBlob);
          } catch (conversionError) {
            console.warn(
              "Audio conversion failed, using original format:",
              conversionError
            );
            finalBlob = audioBlob;
          }
        }

        setRecordings(prev => ({ ...prev, [wordKey]: finalBlob }));
        stream.getTracks().forEach(track => track.stop());

        // Automatically analyze pronunciation with real Azure Speech API
        setIsProcessing(true);
        try {
          await analyzeRecording(wordKey, finalBlob);
        } catch (error) {
          console.error("Error analyzing pronunciation:", error);
          toast({
            title: "Analysis Error",
            description: "Could not analyze pronunciation. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Convert audio blob to WAV format using Web Audio API
  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Convert to WAV format
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  // Helper function to convert AudioBuffer to WAV format
  const audioBufferToWav = (audioBuffer: AudioBuffer): ArrayBuffer => {
    const length = audioBuffer.length;
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bytesPerSample = 2; // 16-bit
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // PCM format size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // 16 bits per sample
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    // Convert audio data
    let offset = 44;
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play user's recording
  const playRecording = (wordKey: string) => {
    const recording = recordings[wordKey];
    if (recording && audioElementRef.current) {
      const url = URL.createObjectURL(recording);
      audioElementRef.current.src = url;
      audioElementRef.current.play();
    }
  };

  // Get score color based on pronunciation accuracy
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Reset exercise progress
  const resetExercise = () => {
    setRecordings({});
    setScores({});
    setCompletedWords([]);
    setCurrentWordIndex(0);
    setFeedback({});
    setIsProcessing(false);
  };

  // Get AI feedback for the recording using the pronunciation analysis API
  const getFeedback = async (wordKey: string) => {
    const recording = recordings[wordKey];
    if (!recording || !selectedExercise) return;

    setIsProcessing(true);
    try {
      await analyzeRecording(wordKey, recording);
    } catch (error) {
      console.error("Error getting pronunciation feedback:", error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze pronunciation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedExercise) {
    return (
      <div className="space-y-6">
        {/* CEFR Level Selection */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
          <span className="font-medium">Select CEFR level:</span>
          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CEFR_LEVELS.map(level => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Available Exercises */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Available Exercises for{" "}
            {getDifficultyInfo(selectedDifficulty)?.name} Level
          </h3>

          {filteredExercises.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No exercises available for this CEFR level yet. Try a
                  different level or check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {filteredExercises.map(exercise => (
                <Card
                  key={exercise.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {exercise.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {exercise.description}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`${getDifficultyInfo(exercise.difficulty)?.color} flex-shrink-0`}
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          {exercise.words.length} words to practice
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {exercise.minimalPairs.length} minimal pairs
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {exercise.phonemes.map((phoneme, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {phoneme}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        onClick={() => setSelectedExercise(exercise)}
                        className="w-full"
                      >
                        Start Practice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentWord = selectedExercise.words[currentWordIndex];
  const progress =
    (completedWords.length / selectedExercise.words.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold">
            {selectedExercise.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {selectedExercise.description}
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2">
          <Button
            variant="outline"
            onClick={resetExercise}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedExercise(null)}
            className="w-full sm:w-auto"
          >
            Choose Different Exercise
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Mastered Words</span>
          <span>
            {completedWords.length} of {selectedExercise.words.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10 mb-6 sm:mb-8">
          <TabsTrigger
            value="words"
            className="text-sm py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Word Practice
          </TabsTrigger>
          <TabsTrigger
            value="pairs"
            className="text-sm py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Minimal Pairs
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="text-sm py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Tips & Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="space-y-4">
          {/* Mode Selection */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0">
            <span className="text-sm font-medium">Mode:</span>
            <div className="flex bg-secondary rounded-md p-1 w-full sm:w-auto">
              <Button
                variant={currentMode === "listen" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentMode("listen")}
                className="flex-1 sm:flex-none"
              >
                <Headphones className="h-4 w-4 mr-1" />
                Listen
              </Button>
              <Button
                variant={currentMode === "practice" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentMode("practice")}
                className="flex-1 sm:flex-none"
              >
                <Mic className="h-4 w-4 mr-1" />
                Practice
              </Button>
            </div>
          </div>

          {/* Word Navigation */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:space-y-0">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentWordIndex(Math.max(0, currentWordIndex - 1))
              }
              disabled={currentWordIndex === 0}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-center">
              {currentWordIndex + 1} of {selectedExercise.words.length}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentWordIndex(
                  Math.min(
                    selectedExercise.words.length - 1,
                    currentWordIndex + 1
                  )
                )
              }
              disabled={currentWordIndex === selectedExercise.words.length - 1}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>

          {/* Current Word Practice */}
          <Card>
            <CardHeader>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-2xl sm:text-3xl font-bold">
                    {currentWord.word}
                  </h3>
                  {completedWords.includes(currentWord.word) && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                </div>

                {showPhonetics && (
                  <p className="text-base sm:text-lg text-muted-foreground font-mono">
                    {currentWord.phonetic}
                  </p>
                )}

                <p className="text-sm text-muted-foreground mt-1">
                  {currentWord.meaning}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Listen Mode */}
              {currentMode === "listen" && (
                <div className="text-center space-y-4">
                  <Button
                    onClick={() => playWord(currentWord.word)}
                    disabled={isPlaying}
                    size="lg"
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Volume2 className="h-5 w-5" />
                    {isPlaying ? "Playing..." : "Listen to Pronunciation"}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    Listen carefully to the pronunciation and pay attention to
                    the sound patterns.
                  </p>
                </div>
              )}

              {/* Practice Mode */}
              {currentMode === "practice" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Button
                      onClick={() => playWord(currentWord.word)}
                      disabled={isPlaying}
                      variant="outline"
                      className="mb-4 w-full sm:w-auto"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen First
                    </Button>
                  </div>

                  <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:gap-3 sm:space-y-0">
                    <Button
                      onClick={() =>
                        isRecording
                          ? stopRecording()
                          : startRecording(currentWord.word)
                      }
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-5 w-5 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5 mr-2" />
                          Record Pronunciation
                        </>
                      )}
                    </Button>

                    {recordings[currentWord.word] && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => playRecording(currentWord.word)}
                          className="w-full sm:w-auto"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Recording
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => getFeedback(currentWord.word)}
                          disabled={isProcessing}
                          className="w-full sm:w-auto"
                        >
                          {isProcessing ? "Analyzing..." : "Get Feedback"}
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Score Display */}
                  {scores[currentWord.word] && (
                    <div className="text-center">
                      <div
                        className={cn(
                          "text-xl sm:text-2xl font-bold",
                          getScoreColor(scores[currentWord.word])
                        )}
                      >
                        Score: {scores[currentWord.word]}/100
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {scores[currentWord.word] >= 90
                          ? "Excellent!"
                          : scores[currentWord.word] >= 80
                            ? "Good job!"
                            : scores[currentWord.word] >= 70
                              ? "Keep practicing!"
                              : "Try again!"}
                      </p>
                    </div>
                  )}

                  {/* Processing Indicator */}
                  {isProcessing && (
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-medium text-blue-600">
                        Analyzing pronunciation...
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Please wait while we evaluate your recording
                      </p>
                    </div>
                  )}

                  {/* Detailed Feedback */}
                  {feedback[currentWord.word] && !isProcessing && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        AI Feedback:
                      </h4>
                      <div className="text-blue-800 dark:text-blue-200 text-sm whitespace-pre-line">
                        {feedback[currentWord.word]}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPhonetics}
                onChange={e => setShowPhonetics(e.target.checked)}
                className="rounded"
              />
              Show phonetic transcription
            </label>
          </div>
        </TabsContent>

        <TabsContent value="pairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minimal Pairs Practice</CardTitle>
              <CardDescription>
                Practice distinguishing between similar sounds by comparing word
                pairs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedExercise.minimalPairs.map((pair, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-2">
                    <div className="flex flex-col space-y-3 sm:flex-row sm:gap-4 sm:space-y-0">
                      {pair.pair.map((word, wordIndex) => (
                        <div key={wordIndex} className="text-center">
                          <div className="text-lg font-semibold">{word}</div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => playWord(word)}
                            className="mt-1 w-full sm:w-auto"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pair.explanation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pronunciation Tips</CardTitle>
              <CardDescription>
                Expert guidance for mastering{" "}
                {selectedExercise.title.toLowerCase()}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedExercise.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm">{tip}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Schedule Suggestion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Daily Practice:</strong> 10-15 minutes focusing on one
                  exercise
                </p>
                <p>
                  <strong>Weekly Goal:</strong> Master 5-10 words with 80%+
                  accuracy
                </p>
                <p>
                  <strong>Monthly Progress:</strong> Move to the next difficulty
                  level
                </p>
                <Separator className="my-3" />
                <p className="text-muted-foreground">
                  <strong>Remember:</strong> Pronunciation improvement takes
                  time and consistent practice. Focus on accuracy over speed,
                  and don't be discouraged by initial challenges!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden audio element for playback */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioElementRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
