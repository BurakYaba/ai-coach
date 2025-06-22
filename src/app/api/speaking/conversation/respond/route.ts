import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// Initialize OpenAI with timeout configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 45000, // 45-second timeout for API calls
  maxRetries: 2, // Limit retries to prevent excessive delays
});

// Helper function to generate viseme data using Azure Speech
async function generateVisemeData(text: string, voice: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    try {
      // DEBUG: Log the input text to see what we're processing
      console.log(`🎤 AZURE SPEECH INPUT: "${text}" (length: ${text.length})`);

      // DEBUG: Test if the text contains M sounds that should generate viseme_PP (ID 1)
      const mSounds = (text.match(/[mbp]/gi) || []).length;
      console.log(
        `🎤 EXPECTED M/B/P SOUNDS: ${mSounds} (should generate viseme ID 1)`
      );

      // Map OpenAI voices to Azure voices with better voice matching
      const azureVoiceMap: { [key: string]: string } = {
        alloy: "en-US-AriaNeural", // Female, clear
        echo: "en-US-AndrewNeural", // Male, energetic
        fable: "en-US-BrianNeural", // Male, storytelling
        onyx: "en-US-ChristopherNeural", // Male, deep
        nova: "en-US-EmmaNeural", // Female, clear
        shimmer: "en-US-JennyNeural", // Female, warm
      };

      const azureVoice = azureVoiceMap[voice] || "en-US-AriaNeural";

      // DEBUG: Log voice selection
      console.log(`🎤 AZURE VOICE: ${voice} -> ${azureVoice}`);

      // PHASE 2: Enhanced speech configuration for better viseme accuracy
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.AZURE_SPEECH_KEY!,
        process.env.AZURE_SPEECH_REGION!
      );
      speechConfig.speechSynthesisVoiceName = azureVoice;
      speechConfig.speechSynthesisOutputFormat =
        sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

      // PHASE 2: Enable additional speech synthesis events for better timing
      speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps,
        "true"
      );

      // Create synthesizer with enhanced event handling
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

      const visemeData: any[] = [];
      const wordBoundaryData: any[] = [];
      const audioStartTime = 0;

      // PHASE 2: Subscribe to word boundary events for better timing
      synthesizer.wordBoundary = (s, e) => {
        wordBoundaryData.push({
          text: e.text,
          offset: e.audioOffset / 10000, // Convert to milliseconds
          duration: e.duration / 10000,
          wordLength: e.wordLength,
        });
      };

      // PHASE 2: Enhanced viseme event handling with better timing
      synthesizer.visemeReceived = (s, e) => {
        const offsetMs = e.audioOffset / 10000; // Convert to milliseconds

        // DEBUG: Log each viseme as it's received
        console.log(
          `🎤 AZURE VISEME RECEIVED: ID ${e.visemeId} at ${offsetMs}ms`
        );

        visemeData.push({
          visemeId: e.visemeId,
          offset: offsetMs,
          duration: 100, // Will be calculated more accurately below
          audioOffset: e.audioOffset, // Keep original for debugging
        });
      };

      // PHASE 2: Track synthesis start for timing accuracy
      synthesizer.SynthesisCanceled = (s: any, e: any) => {
        console.warn("Azure Speech synthesis canceled:", e.reason);
        synthesizer.close();
        resolve([]); // Return empty array on cancellation
      };

      // PHASE 2: Enhanced text synthesis with better error handling
      synthesizer.speakTextAsync(
        text,
        result => {
          try {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              // SMOOTH NATURAL TIMING: Moderate durations for smooth, natural speech
              for (let i = 0; i < visemeData.length - 1; i++) {
                const currentViseme = visemeData[i];
                const nextViseme = visemeData[i + 1];

                // Calculate moderate duration based on next viseme timing
                const calculatedDuration =
                  nextViseme.offset - currentViseme.offset;

                // SMOOTH SPEECH: Use moderate minimum and maximum durations
                const minDuration = 120; // 120ms minimum for smooth consonants
                const maxDuration = 500; // 500ms maximum for smooth vowels and long sounds

                currentViseme.duration = Math.max(
                  minDuration,
                  Math.min(maxDuration, calculatedDuration)
                );
              }

              // SMOOTH ENDING: Final viseme gets moderate duration
              if (visemeData.length > 0) {
                const lastViseme = visemeData[visemeData.length - 1];
                lastViseme.duration = Math.max(150, lastViseme.duration || 250); // 150-250ms for smooth ending
              }

              // PHASE 2: Add timing metadata for debugging and optimization
              const metadata = {
                totalVisemes: visemeData.length,
                totalWords: wordBoundaryData.length,
                estimatedDuration:
                  visemeData.length > 0
                    ? visemeData[visemeData.length - 1].offset +
                      visemeData[visemeData.length - 1].duration
                    : 0,
                azureVoice,
                textLength: text.length,
              };

              console.log(
                `🎭 Generated ${visemeData.length} visemes for "${text.substring(0, 50)}..." using ${azureVoice}`
              );

              // DEBUG: Log summary of viseme types generated
              const visemeCounts: { [key: number]: number } = {};
              visemeData.forEach(v => {
                visemeCounts[v.visemeId] = (visemeCounts[v.visemeId] || 0) + 1;
              });
              console.log(
                `🎤 VISEME SUMMARY:`,
                Object.entries(visemeCounts)
                  .map(([id, count]) => `ID${id}:${count}`)
                  .join(", ")
              );

              // PROFESSIONAL ANIMATION: Key frame selection and timing optimization
              const processedVisemes = [];

              // Step 1: Filter out rapid-fire visemes and identify key frames
              for (let i = 0; i < visemeData.length; i++) {
                const currentViseme = visemeData[i];
                const nextViseme = visemeData[i + 1];

                if (nextViseme) {
                  const calculatedDuration =
                    nextViseme.offset - currentViseme.offset;

                  // MUCH SLOWER: Even longer durations for very natural movement
                  const minMeaningfulDuration = 80; // Increased from 60ms to 80ms for much slower transitions

                  if (calculatedDuration >= minMeaningfulDuration) {
                    // This is a key frame - important enough to animate
                    currentViseme.duration = Math.max(
                      150, // Increased from 120ms to 150ms for much slower movement
                      Math.min(600, calculatedDuration) // Increased max from 500ms to 600ms
                    );
                    currentViseme.isKeyFrame = true;
                    processedVisemes.push(currentViseme);
                  } else {
                    // MUCH SLOWER: Keep short visemes too, just with longer minimum duration
                    currentViseme.duration = 100; // Increased from 80ms to 100ms for much slower transitions
                    currentViseme.isKeyFrame = false;
                    processedVisemes.push(currentViseme);
                    console.log(
                      `🎭 KEEPING short viseme ID ${currentViseme.visemeId} (${calculatedDuration}ms with 100ms minimum)`
                    );
                  }
                } else {
                  // Last viseme - always keep it
                  currentViseme.duration = Math.max(
                    200,
                    currentViseme.duration || 300
                  );
                  currentViseme.isKeyFrame = true;
                  processedVisemes.push(currentViseme);
                }
              }

              // Step 2: Add in-betweens for smooth transitions between key frames
              const finalVisemes = [];
              for (let i = 0; i < processedVisemes.length; i++) {
                const currentKey = processedVisemes[i];
                const nextKey = processedVisemes[i + 1];

                finalVisemes.push(currentKey);

                // Add in-between if there's a significant gap between key frames
                if (
                  nextKey &&
                  nextKey.offset - (currentKey.offset + currentKey.duration) >
                    150
                ) {
                  const inBetweenOffset =
                    currentKey.offset + currentKey.duration;
                  const inBetweenDuration = nextKey.offset - inBetweenOffset;

                  // Add neutral in-between for smooth transition
                  finalVisemes.push({
                    visemeId: 0, // Silence/neutral
                    offset: inBetweenOffset,
                    duration: inBetweenDuration,
                    isKeyFrame: false,
                    isInBetween: true,
                  });
                }
              }

              console.log(
                `🎭 KEY FRAME OPTIMIZATION: ${visemeData.length} raw visemes -> ${processedVisemes.length} key frames -> ${finalVisemes.length} final visemes`
              );

              // Replace original viseme data with processed key frames
              visemeData.length = 0;
              visemeData.push(...finalVisemes);

              synthesizer.close();
              resolve(visemeData);
            } else {
              console.warn("Azure Speech synthesis failed:", result.reason);
              synthesizer.close();
              resolve([]); // Return empty array on failure
            }
          } catch (processingError) {
            console.error(
              "Error processing Azure Speech result:",
              processingError
            );
            synthesizer.close();
            resolve([]); // Return empty array on processing error
          }
        },
        error => {
          console.warn("Azure Speech synthesis error:", error);
          synthesizer.close();
          resolve([]); // Return empty array on error, don't break the flow
        }
      );
    } catch (error) {
      console.warn("Azure Speech setup failed:", error);
      resolve([]); // Return empty array on error
    }
  });
}

// PERFORMANCE OPTIMIZED: Minimal facial animations focused on lip sync quality
function generateFacialAnimations(text: string, visemeData: any[]): any {
  if (!visemeData.length) return { visemes: visemeData };

  const totalDuration =
    visemeData[visemeData.length - 1].offset +
    visemeData[visemeData.length - 1].duration;

  // PERFORMANCE FOCUS: Only generate essential animations - MUCH SLOWER

  // 1. ULTRA-MINIMAL eye movements - only for very long speeches, much slower
  const eyeMovements = [];
  if (totalDuration > 20000) {
    // Only for speeches longer than 20 seconds (increased from 15s)
    const numEyeMovements = Math.floor(totalDuration / 30000); // Every 30 seconds (increased from 20s)
    for (let i = 0; i < Math.min(numEyeMovements, 1); i++) {
      // Max 1 eye movement (reduced from 2)
      const offset = i * 30000 + Math.random() * 10000; // 30-40 second intervals
      eyeMovements.push({
        offset,
        duration: 2000, // Increased from 1000ms to 2000ms for much slower movement
        lookDirection: "center",
        intensity: 0.05, // Reduced from 0.1 to 0.05 for even more subtle
      });
    }
  }

  // 2. ULTRA-MINIMAL eyebrow expressions - only for very clear questions, much slower
  const eyebrowExpressions = [];
  const isQuestion = /[?]/.test(text);
  if (isQuestion && Math.random() < 0.15) {
    // Reduced from 30% to 15% chance
    eyebrowExpressions.push({
      offset: totalDuration * 0.8,
      duration: 1500, // Increased from 800ms to 1500ms for much slower movement
      expression: "raised",
      intensity: 0.08, // Reduced from 0.15 to 0.08 for even more subtle
    });
  }

  // 3. REMOVE head gestures completely for performance
  const headGestures: any[] = []; // Properly typed empty array

  // 4. ULTRA-MINIMAL blinking - only for very long speeches, much slower
  const blinkPatterns = [];
  if (totalDuration > 15000) {
    // Only for speeches longer than 15 seconds (increased from 10s)
    const numBlinks = Math.floor(totalDuration / 25000); // Every 25 seconds (increased from 15s)
    for (let i = 0; i < Math.min(numBlinks, 1); i++) {
      // Max 1 blink
      blinkPatterns.push({
        offset: i * 25000 + Math.random() * 10000, // 25-35 second intervals
        duration: 300, // Increased from 150ms to 300ms for much slower blink
        blinkType: "normal",
      });
    }
  }

  return {
    visemes: visemeData,
    eyeMovements,
    eyebrowExpressions,
    headGestures,
    blinkPatterns,
  };
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    const body = await req.json();
    const {
      speakingSessionId,
      userInput,
      scenario,
      level,
      voice = "alloy",
      isInitial = false,
      potentialGrammarErrors = [],
      userName,
    } = body;

    // Validate required fields
    if (!speakingSessionId || !scenario || !level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the speaking session
    const speakingSession = await SpeakingSession.findById(speakingSessionId);

    if (!speakingSession) {
      return NextResponse.json(
        { error: "Speaking session not found" },
        { status: 404 }
      );
    }

    // Handle fixed initial message for Free Conversation
    if (isInitial && scenario === "free") {
      const aiVoiceName = getAIVoiceName(voice);
      const userDisplayName = userName ? userName.split(" ")[0] : "there"; // Use only first name
      const fixedMessage = `Hi, ${userDisplayName}. I am ${aiVoiceName}. I am your speaking assistant today. What would you like to talk about?`;

      // Generate speech and viseme data for the fixed message
      let speechResponse: any;
      let audioUrl = null;
      let facialAnimationData: any = { visemes: [] };

      try {
        // Generate both TTS and viseme data in parallel
        const [ttsResponse, visemeResponse] = await Promise.all([
          openai.audio.speech.create({
            model: "tts-1",
            voice: voice,
            input: fixedMessage,
            speed: 1.0,
          }),
          generateVisemeData(fixedMessage, voice),
        ]);

        speechResponse = ttsResponse;

        // PHASE 2: Generate enhanced facial animations
        facialAnimationData = generateFacialAnimations(
          fixedMessage,
          visemeResponse
        );

        if (speechResponse) {
          const buffer = Buffer.from(await speechResponse.arrayBuffer());
          const base64Audio = buffer.toString("base64");
          audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
        }

        if (facialAnimationData.visemes.length > 0) {
          console.log(
            `🎭 Generated ${facialAnimationData.visemes.length} visemes + facial animations for initial message`
          );
        }
      } catch (audioError) {
        console.error(
          "Audio/viseme generation failed for fixed message:",
          audioError
        );
        // Continue without audio/viseme if generation fails
      }

      // Save the fixed message to the session with retry logic
      const maxRetries = 3;
      let retryCount = 0;

      while (retryCount < maxRetries) {
        try {
          // Refresh the session document to get latest version
          const freshSession =
            await SpeakingSession.findById(speakingSessionId);

          if (!freshSession) {
            throw new Error(
              "Speaking session not found during initial message save"
            );
          }

          freshSession.transcripts.push({
            role: "assistant",
            text: fixedMessage,
            timestamp: new Date(),
          });

          await freshSession.save();
          // console.log("Initial message saved successfully");
          break; // Success, exit retry loop
        } catch (saveError: any) {
          retryCount++;
          // console.log(
          //   `Initial message save attempt ${retryCount}/${maxRetries} failed:`,
          //   saveError.message
          // );

          if (saveError.name === "VersionError" && retryCount < maxRetries) {
            // Version conflict - wait a bit and retry with fresh document
            await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
            continue;
          } else {
            // Non-recoverable error or max retries reached
            console.error(
              "Failed to save initial message after retries:",
              saveError
            );
            // Continue anyway since the message generation succeeded
            break;
          }
        }
      }

      // Return the fixed response
      return NextResponse.json({
        text: fixedMessage,
        role: "assistant",
        audioUrl,
        facialAnimationData, // PHASE 2: Enhanced facial animation data
      });
    }

    // Build conversation history from session transcripts
    const conversationHistory = speakingSession.transcripts
      .slice(-12) // Keep last 12 messages for context (6 exchanges)
      .map((transcript: any) => ({
        role: transcript.role,
        content: transcript.text,
      }));

    // Build system prompt
    let systemPrompt;
    if (speakingSession.metadata?.systemPrompt) {
      // Reuse existing system prompt for consistency
      systemPrompt = speakingSession.metadata.systemPrompt;
    } else {
      // Create new system prompt and save it
      systemPrompt = buildSystemPrompt(scenario, level, isInitial);

      if (!speakingSession.metadata) {
        speakingSession.metadata = {};
      }
      speakingSession.metadata.systemPrompt = systemPrompt;
      await speakingSession.save();
    }

    // Build messages array for OpenAI
    const messages: any[] = [{ role: "system", content: systemPrompt }];

    // Add conversation history
    messages.push(...conversationHistory);

    // Add user input if provided
    if (userInput) {
      // Add grammar error context if detected
      let grammarErrors = [];

      // Parse potentialGrammarErrors if it's a string (JSON)
      if (potentialGrammarErrors) {
        try {
          grammarErrors =
            typeof potentialGrammarErrors === "string"
              ? JSON.parse(potentialGrammarErrors)
              : potentialGrammarErrors;
        } catch (parseError) {
          console.warn("Failed to parse grammar errors:", parseError);
          grammarErrors = [];
        }
      }

      if (grammarErrors.length > 0) {
        messages.push({
          role: "system",
          content: `The user's message may contain grammar errors. Please consider these potential issues when responding and offer corrections using "Did you mean [correction]?" format:\n${grammarErrors
            .map(
              (error: any) =>
                `Possible error: "${error.pattern}" - ${error.possibleError}`
            )
            .join("\n")}`,
        });
      }

      messages.push({ role: "user", content: userInput });
    }

    // Generate response from GPT-4 with timeout handling
    let completion: any;
    try {
      completion = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Using gpt-3.5-turbo for faster responses
          messages: messages as any,
          max_tokens: 120, // Increased from 80 to 120 for more verbose responses
          temperature: 0.7, // Increased from 0.5 to 0.7 for more natural, varied responses
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("OpenAI chat completion timeout")),
            12000 // PHASE 1 OPTIMIZATION: Reduced from 15000 to 12000 for faster error recovery
          )
        ),
      ]);
    } catch (error) {
      console.error("OpenAI chat completion failed:", error);
      throw new Error("Failed to generate AI response. Please try again.");
    }

    const responseText =
      completion.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response.";

    // Generate speech from text with timeout handling and retry logic + viseme data
    let speechResponse: any;
    let facialAnimationData: any = { visemes: [] };
    let ttsAttempts = 0;
    const maxTtsAttempts = 2;

    // SMART TTS: Check text length and adjust timeout accordingly
    const textLength = responseText.length;
    const baseTtsTimeout = textLength > 60 ? 12000 : 8000;

    // PHASE 2: Generate viseme data in parallel with TTS for lip sync
    const visemePromise = generateVisemeData(responseText, voice);

    while (ttsAttempts < maxTtsAttempts && !speechResponse) {
      try {
        ttsAttempts++;

        speechResponse = await Promise.race([
          openai.audio.speech.create({
            model: "tts-1", // Using tts-1 for faster speech generation
            voice: voice,
            input: responseText,
            speed: 1.0, // Normal speed for better reliability
          }),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("TTS generation timeout")),
              baseTtsTimeout // PHASE 1: Faster timeout for quicker fallback
            )
          ),
        ]);

        break; // Success, exit retry loop
      } catch (error: any) {
        // Log specific error types for debugging
        if (error.message?.includes("timeout")) {
          console.error(
            `TTS timeout on attempt ${ttsAttempts}/${maxTtsAttempts} (${baseTtsTimeout}ms timeout)`
          );
        } else if (error.message?.includes("rate")) {
          console.error(
            `TTS rate limit on attempt ${ttsAttempts}/${maxTtsAttempts}`
          );
        } else if (error.message?.includes("quota")) {
          console.error(
            `TTS quota exceeded on attempt ${ttsAttempts}/${maxTtsAttempts}`
          );
        } else {
          console.error(`TTS attempt ${ttsAttempts} failed:`, error.message);
        }

        if (ttsAttempts >= maxTtsAttempts) {
          console.error("All TTS attempts failed, continuing without audio");
          speechResponse = null;
          break;
        } else {
          // OPTIMIZATION: Smart retry delay - shorter delays for faster recovery
          const retryDelay = error.message?.includes("rate") ? 1500 : 500; // Reduced delays
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // PHASE 2: Wait for viseme data generation and create facial animations
    try {
      const visemeData = await Promise.race([
        visemePromise,
        new Promise<any[]>(
          resolve =>
            setTimeout(() => {
              console.warn(
                "Viseme generation timeout, continuing without lip sync"
              );
              resolve([]);
            }, 12000) // Increased from 8000 to 12000 for more reliable generation
        ),
      ]);

      // PHASE 2: Generate enhanced facial animations
      facialAnimationData = generateFacialAnimations(responseText, visemeData);

      if (facialAnimationData.visemes.length > 0) {
        console.log(
          `🎭 Generated ${facialAnimationData.visemes.length} visemes + facial animations for response`
        );
      } else {
        console.warn("No visemes generated, speech will not have lip sync");
      }
    } catch (error) {
      console.warn("Facial animation generation failed:", error);
      facialAnimationData = { visemes: [] };
    }

    let audioUrl = null;
    if (speechResponse) {
      try {
        // Convert speech response to buffer
        const buffer = Buffer.from(await speechResponse.arrayBuffer());

        // Convert buffer to base64
        const base64Audio = buffer.toString("base64");

        // Create a data URL for the audio
        audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
      } catch (audioError) {
        console.error("Audio processing failed:", audioError);
        // Continue without audio if processing fails
      }
    }

    // Save the AI response to the session with retry logic to prevent version conflicts
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Refresh the session document to get latest version
        const freshSession = await SpeakingSession.findById(speakingSessionId);

        if (!freshSession) {
          throw new Error("Speaking session not found during AI response save");
        }

        freshSession.transcripts.push({
          role: "assistant",
          text: responseText,
          timestamp: new Date(),
        });

        await freshSession.save();
        console.log("AI response saved successfully");
        break; // Success, exit retry loop
      } catch (saveError: any) {
        retryCount++;
        console.log(
          `AI response save attempt ${retryCount}/${maxRetries} failed:`,
          saveError.message
        );

        if (saveError.name === "VersionError" && retryCount < maxRetries) {
          // Version conflict - wait a bit and retry with fresh document
          await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
          continue;
        } else {
          // Non-recoverable error or max retries reached
          console.error("Failed to save AI response after retries:", saveError);
          // Continue anyway since the response generation succeeded
          break;
        }
      }
    }

    // Return the response
    return NextResponse.json({
      text: responseText,
      role: "assistant",
      audioUrl,
      facialAnimationData, // PHASE 2: Enhanced facial animation data
    });
  } catch (error: any) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(
  scenario: string,
  level: string,
  isInitial: boolean
): string {
  // Updated system prompt for more engaging, verbose responses
  let prompt = `You are a friendly English conversation tutor. User level: ${level.toUpperCase()}.

Guidelines:
- Give engaging, natural responses (2-4 sentences)
- Show genuine interest in the conversation
- Ask follow-up questions to keep dialogue flowing
- Gently correct errors: "Did you mean [correction]?"
- Share relevant thoughts or experiences when appropriate
- Focus on: ${getGrammarFocus(level)}`;

  // Add role-play scenario if not free conversation
  if (scenario !== "free") {
    const roleDescription = getAIRole(scenario);
    prompt += `\n- Role: Act as ${roleDescription}`;

    if (isInitial) {
      prompt += `\n- Begin with a warm, professional greeting`;
    }
  } else if (isInitial) {
    prompt += `\n- Start with a friendly greeting and ask what they'd like to discuss`;
  }

  return prompt;
}

// Helper function to get grammar focus based on level
function getGrammarFocus(level: string): string {
  const focus: Record<string, string> = {
    a1: "basic verb forms, articles",
    a2: "past tense, plurals, prepositions",
    b1: "verb tenses, subject-verb agreement",
    b2: "conditionals, passive voice, articles",
    c1: "advanced grammar, natural expressions",
    c2: "subtle errors, idiomatic usage",
  };

  return focus[level] || "common grammar errors";
}

function getAIRole(scenario: string): string {
  const roles: Record<string, string> = {
    // Food & Dining
    restaurant: "a restaurant server",
    cafe: "a coffee shop barista",
    grocery_shopping: "a grocery store employee",
    food_delivery: "a food delivery service representative",

    // Travel & Transportation
    airport: "an airport check-in agent",
    taxi_uber: "a taxi/rideshare driver",
    public_transport: "a transit employee",
    car_rental: "a car rental agent",
    train_station: "a train station agent",

    // Accommodation
    hotel: "a hotel receptionist",
    airbnb_host: "an Airbnb host",
    apartment_viewing: "a real estate agent",

    // Shopping & Services
    shopping: "a store clerk",
    electronics_store: "an electronics store associate",
    pharmacy: "a pharmacist",
    post_office: "a postal worker",
    hair_salon: "a hair salon receptionist",

    // Healthcare & Wellness
    doctor: "a doctor",
    dentist: "a dentist",
    gym_membership: "a gym staff member",

    // Professional & Business
    interview: "a job interviewer",
    workplace_meeting: "a work colleague",
    networking_event: "a networking professional",
    customer_service: "a customer service rep",
    business_presentation: "a business audience member",

    // Banking & Finance
    bank_visit: "a bank teller",
    insurance_consultation: "an insurance agent",

    // Education & Learning
    university_enrollment: "a university advisor",
    library_visit: "a librarian",
    language_exchange: "a language exchange partner",

    // Social & Entertainment
    party_invitation: "a friend being invited to events",
    movie_theater: "a fellow moviegoer",
    sports_event: "a fellow sports fan",
    concert_venue: "a fellow concert attendee",

    // Technology & Digital
    tech_support: "a tech support specialist",
    phone_plan: "a mobile service rep",
    internet_setup: "an internet technician",

    // Emergency & Urgent Situations
    emergency_call: "an emergency dispatcher",
    police_report: "a police officer",

    // Home & Lifestyle
    real_estate_agent: "a real estate agent",
    home_repair: "a repair technician",
    utility_services: "a utility company rep",

    // Cultural & Community
    museum_visit: "a museum guide",
    religious_service: "a community member",
    volunteer_work: "a volunteer coordinator",

    // Casual & Daily Life
    neighborhood_chat: "a friendly neighbor",
    small_talk: "a conversation partner",
    hobby_discussion: "someone with shared interests",
  };

  return roles[scenario] || "a conversation partner";
}

function getAIVoiceName(voice: string): string {
  // Map voice IDs to character names from the avatar system
  const voiceToCharacter: Record<string, string> = {
    onyx: "Marcus", // marcus-business
    alloy: "Sarah", // sarah-coach
    echo: "Alex", // alex-friendly
    shimmer: "Emma", // emma-supportive
    fable: "Oliver", // oliver-academic
    nova: "Zoe", // zoe-creative
  };

  return voiceToCharacter[voice] || "your AI assistant";
}
