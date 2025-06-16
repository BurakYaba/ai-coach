import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// Initialize OpenAI with timeout configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 45000, // 45-second timeout for API calls
  maxRetries: 2, // Limit retries to prevent excessive delays
});

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
      const userDisplayName = userName || "there";
      const fixedMessage = `Hi, ${userDisplayName}. I am ${aiVoiceName}. I am your speaking assistant today. What would you like to talk about?`;

      // Generate speech for the fixed message
      let speechResponse: any;
      let audioUrl = null;

      try {
        speechResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: voice,
          input: fixedMessage,
          speed: 1.0,
        });

        if (speechResponse) {
          const buffer = Buffer.from(await speechResponse.arrayBuffer());
          const base64Audio = buffer.toString("base64");
          audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
        }
      } catch (audioError) {
        console.error("Audio generation failed for fixed message:", audioError);
        // Continue without audio if TTS fails
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
        audioUrl,
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

    // Generate speech from text with timeout handling and retry logic
    let speechResponse: any;
    let ttsAttempts = 0;
    const maxTtsAttempts = 2;
    const ttsStartTime = Date.now();

    // SMART TTS: Check text length and adjust timeout accordingly
    const textLength = responseText.length;
    const baseTtsTimeout = textLength > 60 ? 12000 : 8000; // PHASE 1 OPTIMIZATION: Reduced timeouts for faster response

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
      audioUrl,
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
  const voiceNames: Record<string, string> = {
    alloy: "Alloy",
    echo: "Echo",
    fable: "Fable",
    onyx: "Onyx",
    nova: "Nova",
    shimmer: "Shimmer",
  };

  return voiceNames[voice] || "your AI assistant";
}
