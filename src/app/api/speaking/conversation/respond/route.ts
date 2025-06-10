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
      if (potentialGrammarErrors.length > 0) {
        messages.push({
          role: "system",
          content: `The user's message may contain grammar errors. Please consider these potential issues when responding and offer corrections using "Did you mean [correction]?" format:\n${potentialGrammarErrors
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
          max_tokens: 120, // OPTIMIZATION: Reduced from 200 to 120 for faster generation
          temperature: 0.6, // OPTIMIZATION: Reduced from 0.7 to 0.6 for more focused responses
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("OpenAI chat completion timeout")),
            15000 // OPTIMIZATION: Reduced from 20000 to 15000 for faster error recovery
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
    const baseTtsTimeout = textLength > 80 ? 15000 : 12000; // PHASE 1: Reduced timeout (was 20-25s, now 12-15s)

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

    // Save the AI response to the session
    speakingSession.transcripts.push({
      role: "assistant",
      text: responseText,
      timestamp: new Date(),
    });

    await speakingSession.save();

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
  // PHASE 2: More concise base system prompt
  let prompt = `You are an English conversation tutor. User level: ${level.toUpperCase()}.

Rules:
- Keep responses brief (2-3 sentences)
- Ask follow-up questions
- Correct grammar gently: "Did you mean [correction]?"
- Focus on ${getGrammarFocus(level)}`;

  // Add role-play scenario if not free conversation
  if (scenario !== "free") {
    const roleDescription = getAIRole(scenario);
    prompt += `\n- You are: ${roleDescription}
- Stay in character throughout the conversation`;

    if (isInitial) {
      prompt += `\n- Start with a natural greeting appropriate for your role`;
    }
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
