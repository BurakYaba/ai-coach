import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";

import { uploadAudioBuffer } from "./cloudinary";

const execPromise = promisify(exec);
const writeFilePromise = promisify(fs.writeFile);
const unlinkPromise = promisify(fs.unlink);
const mkdtempPromise = promisify(fs.mkdtemp);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 115000, // 115 seconds timeout to match admin route timeout
  maxRetries: 3, // Increase retries for better reliability
});

// Define voices by gender for better matching
const MALE_VOICES = ["onyx", "echo", "alloy"] as const;
const FEMALE_VOICES = ["nova", "shimmer", "fable"] as const;
const NEUTRAL_VOICES = ["alloy"] as const; // For gender-neutral or unknown speakers

// Combined list of all available voices
const ALL_VOICES = [...MALE_VOICES, ...FEMALE_VOICES] as const;
type Voice = (typeof ALL_VOICES)[number];

// Common male and female names for gender detection
const MALE_NAMES = [
  "john",
  "david",
  "michael",
  "james",
  "robert",
  "william",
  "joseph",
  "thomas",
  "charles",
  "ahmed",
  "mohamed",
  "ali",
  "juan",
  "carlos",
  "josé",
  "wei",
  "ming",
  "yuki",
  "hiroshi",
  "abdul",
  "sergei",
  "dmitri",
  "hans",
  "klaus",
  "paul",
  "mark",
  "luke",
  "matthew",
  "george",
  "sam",
  "alex",
  "frank",
  "dan",
  "andy",
  "tony",
  "steve",
  "brian",
  "kevin",
  "ronald",
  "jason",
  "edward",
  "eric",
  "steven",
  "patrick",
  "sean",
  "adam",
  "jack",
  "jonathan",
  "harry",
  "peter",
];

const FEMALE_NAMES = [
  "mary",
  "patricia",
  "jennifer",
  "linda",
  "elizabeth",
  "barbara",
  "susan",
  "jessica",
  "maria",
  "sarah",
  "karen",
  "nancy",
  "lisa",
  "betty",
  "anna",
  "fatima",
  "aisha",
  "mei",
  "yuki",
  "rosa",
  "olga",
  "natasha",
  "lucia",
  "carmen",
  "andrea",
  "julia",
  "sofia",
  "isabella",
  "emily",
  "amanda",
  "jane",
  "amy",
  "diana",
  "kate",
  "helen",
  "laura",
  "olivia",
  "emma",
  "zoe",
  "sophia",
  "mia",
  "lily",
  "victoria",
  "grace",
  "sophie",
  "lauren",
  "charlotte",
  "hannah",
  "lucy",
  "rachel",
];

// Full path to FFmpeg executable (can be configured via env variable or default)
const FFMPEG_PATH = process.env.FFMPEG_PATH || "ffmpeg";

/**
 * Determine gender from a name
 * @param name The speaker's name
 * @returns The likely gender of the person with that name
 */
function determineGenderFromName(name: string): "male" | "female" | "unknown" {
  const lowerName = name.toLowerCase();

  // Check common name lists first
  if (MALE_NAMES.includes(lowerName)) {
    return "male";
  }

  if (FEMALE_NAMES.includes(lowerName)) {
    return "female";
  }

  // If not in our lists, use common name endings as a heuristic
  // This is not perfect but provides a reasonable guess
  if (
    lowerName.endsWith("a") ||
    lowerName.endsWith("ia") ||
    lowerName.endsWith("ina") ||
    lowerName.endsWith("elle") ||
    lowerName.endsWith("ette")
  ) {
    return "female";
  }

  if (
    lowerName.endsWith("o") ||
    lowerName.endsWith("n") ||
    lowerName.endsWith("k") ||
    lowerName.endsWith("s") ||
    lowerName.endsWith("r")
  ) {
    return "male";
  }

  // If we cannot determine gender, return unknown
  return "unknown";
}

/**
 * Parse a transcript to separate different named speakers
 * @param transcript The conversation transcript
 * @returns Array of speaker segments with speaker names and detected genders
 */
export function parseTranscriptBySpeaker(transcript: string): Array<{
  speakerIndex: number; // For backward compatibility and audio sequencing
  speakerName: string; // The name of the speaker
  text: string; // The spoken text
  detectedGender: "male" | "female" | "unknown"; // Gender based on name
}> {
  // Try to match named speakers first (e.g., "John: Hello")
  const namedRegex =
    /([A-Za-z]+(?:\s[A-Za-z]+)?):\s*([\s\S]*?)(?=(?:[A-Za-z]+(?:\s[A-Za-z]+)?):|\s*$)/g;

  // Fall back to numbered speakers if needed (for backward compatibility)
  const numberedRegex = /Speaker (\d+):\s*([\s\S]*?)(?=Speaker \d+:|$)/g;

  const segments: Array<{
    speakerIndex: number;
    speakerName: string;
    text: string;
    detectedGender: "male" | "female" | "unknown";
  }> = [];

  // Track unique speakers to maintain consistent indexing
  const speakerIndices: Record<string, number> = {};
  let nextSpeakerIndex = 1;

  // Try to match named speakers
  let namedMatch;
  let hasNamedSpeakers = false;

  // Test if transcript has named speakers
  if (namedRegex.test(transcript)) {
    hasNamedSpeakers = true;
    // Reset regex state
    namedRegex.lastIndex = 0;

    while ((namedMatch = namedRegex.exec(transcript)) !== null) {
      const speakerName = namedMatch[1].trim();
      const text = namedMatch[2].trim();

      // Assign a consistent index for this speaker
      if (!speakerIndices[speakerName]) {
        speakerIndices[speakerName] = nextSpeakerIndex++;
      }

      // Determine gender from name
      const detectedGender = determineGenderFromName(speakerName);

      segments.push({
        speakerIndex: speakerIndices[speakerName],
        speakerName,
        text,
        detectedGender,
      });
    }
  }

  // If no named speakers were found, fall back to numbered speakers
  if (!hasNamedSpeakers) {
    let numberedMatch;
    while ((numberedMatch = numberedRegex.exec(transcript)) !== null) {
      const speakerIndex = parseInt(numberedMatch[1]);
      const text = numberedMatch[2].trim();
      const speakerName = `Speaker ${speakerIndex}`;

      // For backward compatibility, try to infer gender from content
      // This uses a simplified approach compared to the original complex algorithm
      const lowerText = text.toLowerCase();
      let detectedGender: "male" | "female" | "unknown" = "unknown";

      // Simple pronoun-based detection
      if (
        /\b(he|him|his|himself|mr\.)\b/i.test(lowerText) &&
        !/\b(she|her|hers|herself|mrs\.|ms\.)\b/i.test(lowerText)
      ) {
        detectedGender = "male";
      } else if (
        !/\b(he|him|his|himself|mr\.)\b/i.test(lowerText) &&
        /\b(she|her|hers|herself|mrs\.|ms\.)\b/i.test(lowerText)
      ) {
        detectedGender = "female";
      } else {
        // Alternate for variety
        detectedGender = speakerIndex % 2 === 0 ? "male" : "female";
      }

      segments.push({
        speakerIndex,
        speakerName,
        text,
        detectedGender,
      });
    }
  }

  return segments;
}

/**
 * Get a voice for a speaker based on detected gender
 * @param speakerIndex The speaker's index
 * @param detectedGender The detected gender of the speaker
 * @returns A voice for the speaker
 */
export function getVoiceForSpeaker(
  speakerIndex: number,
  detectedGender: "male" | "female" | "unknown" = "unknown"
): Voice {
  if (detectedGender === "male") {
    // Select from male voices
    return MALE_VOICES[(speakerIndex - 1) % MALE_VOICES.length];
  } else if (detectedGender === "female") {
    // Select from female voices
    return FEMALE_VOICES[(speakerIndex - 1) % FEMALE_VOICES.length];
  } else {
    // For unknown gender, alternate between all voices
    return ALL_VOICES[(speakerIndex - 1) % ALL_VOICES.length];
  }
}

/**
 * Generate audio for a single speaker segment
 * @param text The text to convert to speech
 * @param voice The voice to use
 * @returns Path to the temporary audio file
 */
export async function generateSpeakerAudio(
  text: string,
  voice: Voice
): Promise<string> {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const tempDir = await mkdtempPromise(path.join(os.tmpdir(), "tts-"));
    const tempFilePath = path.join(tempDir, `${uuidv4()}.mp3`);
    await writeFilePromise(tempFilePath, buffer);

    return tempFilePath;
  } catch (error) {
    console.error("Error generating speaker audio:", error);
    throw error;
  }
}

/**
 * Create a multi-speaker audio file from a transcript
 * @param transcript The conversation transcript
 * @returns Upload result from Cloudinary or local data URL
 */
export async function createMultiSpeakerAudio(transcript: string) {
  let tempDir = "";
  const tempFiles: string[] = [];

  try {
    // Create temporary directory
    tempDir = await mkdtempPromise(path.join(os.tmpdir(), "multi-speaker-"));

    // Parse transcript to get speaker segments
    const segments = parseTranscriptBySpeaker(transcript);

    // Generate audio for each segment
    const audioFilePaths = await Promise.all(
      segments.map(async segment => {
        const voice = getVoiceForSpeaker(
          segment.speakerIndex,
          segment.detectedGender
        );
        const filePath = await generateSpeakerAudio(segment.text, voice);
        tempFiles.push(filePath);
        return {
          path: filePath,
          speakerIndex: segment.speakerIndex,
          speakerName: segment.speakerName,
        };
      })
    );

    // Create file with concatenation instructions for FFmpeg
    const concatFilePath = path.join(tempDir, "concat.txt");
    const concatFileContent = audioFilePaths
      .map(file => `file '${file.path.replace(/'/g, "'\\''")}'`)
      .join("\n");

    await writeFilePromise(concatFilePath, concatFileContent);
    tempFiles.push(concatFilePath);

    // Combine audio files with FFmpeg using mp3 format with LAME encoder
    // This ensures consistency for all files
    const combinedPath = path.join(tempDir, `combined-${uuidv4()}.mp3`);
    await execPromise(
      `"${FFMPEG_PATH}" -f concat -safe 0 -i "${concatFilePath}" -c:a libmp3lame -q:a 4 "${combinedPath}"`
    );
    tempFiles.push(combinedPath);

    // Read the combined file
    const combinedBuffer = fs.readFileSync(combinedPath);

    try {
      // Try to upload to Cloudinary with specific encoding settings
      // This tells Cloudinary exactly what format to expect
      const cloudinaryResult = await uploadAudioBuffer(combinedBuffer, {
        folder: "listening-sessions",
        resource_type: "video",
        format: "mp3", // Explicitly specify format
        audio_codec: "mp3", // Explicitly specify codec
      });

      return {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
        duration: cloudinaryResult.duration,
        speakerCount: new Set(segments.map(s => s.speakerIndex)).size,
      };
    } catch (cloudinaryError) {
      console.warn(
        "Cloudinary upload failed, using local audio:",
        cloudinaryError
      );

      // Try once more with raw upload approach
      try {
        // Create a properly formatted MP3 file with two-pass encoding for better compatibility
        const finalAudioPath = path.join(tempDir, `final-${uuidv4()}.mp3`);
        await execPromise(
          `"${FFMPEG_PATH}" -i "${combinedPath}" -c:a libmp3lame -b:a 128k "${finalAudioPath}"`
        );
        tempFiles.push(finalAudioPath);

        // Read the final file
        const finalBuffer = fs.readFileSync(finalAudioPath);

        // Try uploading with raw resource type
        const cloudinaryResult = await uploadAudioBuffer(finalBuffer, {
          folder: "listening-sessions",
          resource_type: "raw",
          format: "mp3",
        });

        return {
          url: cloudinaryResult.url,
          publicId: cloudinaryResult.publicId,
          duration:
            cloudinaryResult.duration || estimateAudioDuration(transcript),
          speakerCount: new Set(segments.map(s => s.speakerIndex)).size,
        };
      } catch (secondError) {
        console.warn("Secondary upload attempt failed:", secondError);

        // Convert buffer to base64 data URL as final fallback
        const base64Audio = combinedBuffer.toString("base64");
        const dataUrl = `data:audio/mp3;base64,${base64Audio}`;

        return {
          url: dataUrl,
          publicId: `local-${uuidv4()}`,
          duration: estimateAudioDuration(transcript),
          speakerCount: new Set(segments.map(s => s.speakerIndex)).size,
        };
      }
    }
  } catch (error) {
    console.error("Error creating multi-speaker audio:", error);
    throw error;
  } finally {
    // Clean up temporary files
    await Promise.all(
      tempFiles.map(file =>
        unlinkPromise(file).catch(err =>
          console.warn(`Failed to delete temporary file ${file}:`, err)
        )
      )
    );

    // Try to remove the temporary directory if it was created
    if (tempDir) {
      try {
        fs.rmdirSync(tempDir);
      } catch (error) {
        console.warn(`Failed to remove temporary directory ${tempDir}:`, error);
      }
    }
  }
}

/**
 * Estimate the duration of audio based on text content
 * @param text The text to estimate duration for
 * @returns Estimated duration in seconds
 */
export function estimateAudioDuration(text: string): number {
  // Identify if the text has multiple speakers
  const speakerLines = text.split(/\n/).filter(line => /\w+\s*:/.test(line));
  const uniqueSpeakers = new Set(
    speakerLines
      .map(line => {
        const match = line.match(/^(\w+(?:\s+\w+)?)\s*:/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  );

  const speakerCount = uniqueSpeakers.size || 1;

  // Count words
  const words = text.trim().split(/\s+/).length;

  // Base speaking rate (words per minute)
  // The more speakers, the slower the overall pace due to turn-taking
  let wordsPerMinute = 150;

  // Adjust for number of speakers
  if (speakerCount > 1) {
    // More speakers = more pauses between exchanges
    wordsPerMinute -= (speakerCount - 1) * 5;
  }

  // Basic duration calculation
  const durationSeconds = (words / wordsPerMinute) * 60;

  // Add time for pauses and natural speech rhythm
  const pauseTime = speakerCount > 1 ? speakerCount * 5 : 0;

  // Ensure minimum duration
  const minDuration = Math.max(30, words / 5); // At least 30 seconds or 1 second per 5 words

  // Return the calculated duration, ensuring it's at least the minimum
  return Math.max(Math.ceil(durationSeconds + pauseTime), minDuration);
}

/**
 * Generate a title from a transcript
 * @param transcript The conversation transcript
 * @param topic The conversation topic
 * @returns A title for the listening session
 */
export async function generateTitleFromTranscript(
  transcript: string,
  topic: string
): Promise<string> {
  try {
    // Generate a title using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates concise, engaging titles.",
        },
        {
          role: "user",
          content: `Create a short, engaging title (maximum 8 words) for a language learning listening exercise about ${topic} based on this transcript. Don't use quotes in the title:\n\n${transcript.substring(0, 1000)}...`,
        },
      ],
      temperature: 0.7,
      max_tokens: 30,
    });

    const title =
      response.choices[0].message.content?.trim() ||
      `Conversation about ${topic}`;
    return title.replace(/["']/g, ""); // Remove quotes if they exist
  } catch (error) {
    console.error("Error generating title:", error);
    return `Conversation about ${topic}`;
  }
}
