import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log("Respond endpoint called");
  try {
    // Connect to database
    await dbConnect();
    console.log("Connected to database");

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("Authentication failed");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log("User authenticated:", session.user.id);

    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);

    const {
      speakingSessionId,
      userInput,
      scenario = "free",
      level = "b1",
      voice = "alloy",
      isInitial = false,
      potentialGrammarErrors,
    } = body;

    // Validate required fields
    if (!speakingSessionId) {
      console.error("Missing speakingSessionId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch speaking session from database
    console.log("Finding session by ID:", speakingSessionId);
    let speakingSession;

    try {
      // Try to find by direct ID
      speakingSession = await SpeakingSession.findById(speakingSessionId);
    } catch (err) {
      console.error("Error when finding by ID:", err);
      // If that fails, it might not be a valid MongoDB ID
      console.log("Trying to find session by alternative methods");
      speakingSession = await SpeakingSession.findOne({
        $or: [
          { _id: speakingSessionId },
          { "metadata.sessionId": speakingSessionId },
        ],
      });
    }

    if (!speakingSession) {
      console.error("Speaking session not found with ID:", speakingSessionId);
      return NextResponse.json(
        { error: "Speaking session not found" },
        { status: 404 }
      );
    }
    console.log("Speaking session found:", speakingSession._id);

    // Build conversation history from transcripts
    console.log("Building conversation history from transcripts");
    const conversationHistory = speakingSession.transcripts.map(transcript => ({
      role: transcript.role,
      content: transcript.text,
    }));
    console.log("Conversation history:", JSON.stringify(conversationHistory));

    // Handle the system prompt
    let systemPrompt: string;

    // Initialize metadata if it doesn't exist
    if (!speakingSession.metadata) {
      speakingSession.metadata = {};
    }

    // Check if we already have a stored system prompt
    if (speakingSession.metadata.systemPrompt) {
      // Reuse the existing system prompt
      console.log("Reusing existing system prompt from session metadata");
      systemPrompt = speakingSession.metadata.systemPrompt;
    } else {
      // Generate a new system prompt
      console.log(
        "Building system prompt for scenario:",
        scenario,
        "level:",
        level
      );
      systemPrompt = buildSystemPrompt(scenario, level, isInitial);

      // Save the system prompt to the session for future use
      speakingSession.metadata.systemPrompt = systemPrompt;
    }

    // Format messages for OpenAI API
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
    ];

    // If this is a new user input (not initial prompt), add it
    if (userInput && !isInitial) {
      // If we have potential grammar errors, add them to help the AI identify issues
      if (
        potentialGrammarErrors &&
        Array.isArray(potentialGrammarErrors) &&
        potentialGrammarErrors.length > 0
      ) {
        const errorInfo = potentialGrammarErrors
          .map(
            err =>
              `Possible error: "${err.pattern}" - Consider correcting to "${err.correctedForm}"`
          )
          .join("\n");

        messages.push({
          role: "system",
          content: `The user's message may contain grammar errors. Please consider these potential issues when responding and offer corrections using "Did you mean [correction]?" format:\n${errorInfo}`,
        });
      }

      messages.push({ role: "user", content: userInput });
      console.log("Added user input to messages");
    } else if (isInitial) {
      console.log("Generating initial greeting (no user input needed)");
    }

    console.log("Final messages for OpenAI:", JSON.stringify(messages));

    // Generate response from GPT-4
    console.log("Calling OpenAI chat completions API");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Falling back to gpt-3.5-turbo for faster responses and lower cost
      messages: messages as any,
      max_tokens: 300,
      temperature: 0.7,
    });
    console.log("OpenAI completion received");

    const responseText =
      completion.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response.";
    console.log("AI response text:", responseText);

    // Generate speech from text
    console.log("Generating speech with voice:", voice);
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: responseText,
    });
    console.log("Speech generation successful");

    // Convert speech response to buffer
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    console.log("Converted speech to buffer, length:", buffer.length);

    // Convert buffer to base64
    const base64Audio = buffer.toString("base64");
    console.log("Converted buffer to base64, length:", base64Audio.length);

    // Create a data URL for the audio
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
    console.log("Created audio URL");

    // Save the AI response to the session
    console.log("Saving AI response to session");
    speakingSession.transcripts.push({
      role: "assistant",
      text: responseText,
      timestamp: new Date(),
    });

    await speakingSession.save();
    console.log("Session saved with new transcript");

    // Return the response
    console.log("Returning response to client");
    return NextResponse.json({
      text: responseText,
      audioUrl,
    });
  } catch (error: any) {
    console.error("Error generating AI response:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message,
        stack: error.stack,
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
  // Base system prompt
  let prompt = `You are an AI language coach specializing in English conversation practice.
Your goal is to help the user improve their English speaking skills through natural conversation.

The user's English level is ${level.toUpperCase()} (${getLevelDescription(level)}).
Adjust your vocabulary and sentence complexity to match this level.

Follow these guidelines:
1. Use natural conversational language appropriate for a ${level.toUpperCase()} level English learner
2. Keep your responses brief (2-4 sentences)
3. Ask a follow-up question at the end of each response to encourage further conversation
4. When the user makes a grammar error, explicitly acknowledge it by saying "Did you mean [correction]?" before continuing the conversation
5. Pay special attention to subject-verb agreement, verb tense, articles, and prepositions as these are common errors
6. Use vocabulary and expressions appropriate for the level
`;

  // Add role-play scenario instructions if not free conversation
  if (scenario !== "free") {
    prompt += `\nThis is a role-play scenario: "${getScenarioDescription(scenario)}".
You should act as ${getAIRole(scenario)} and guide the conversation naturally as it would occur in this situation.
Stay in character throughout the conversation while helping the user practice English.
When correcting grammar, briefly step out of character to provide the correction ("Did you mean [correction]?") and then continue in character.
`;

    // Add extra initial guidance for the AI
    if (isInitial) {
      prompt += `\nThis is the beginning of the conversation. Introduce yourself according to your role in this scenario, explain the situation briefly, and start the interaction naturally.`;
    }
  }

  return prompt;
}

function getLevelDescription(level: string): string {
  const descriptions: Record<string, string> = {
    a1: "Beginner - Can understand and use familiar everyday expressions and basic phrases",
    a2: "Elementary - Can communicate in simple and routine tasks on familiar topics",
    b1: "Intermediate - Can deal with most situations likely to arise while traveling",
    b2: "Upper Intermediate - Can interact with a degree of fluency with native speakers",
    c1: "Advanced - Can express ideas fluently and spontaneously without much searching for expressions",
    c2: "Proficiency - Can understand with ease virtually everything heard or read",
  };

  return descriptions[level] || "Intermediate level";
}

function getScenarioDescription(scenario: string): string {
  const descriptions: Record<string, string> = {
    restaurant: "Ordering food and interacting with a waiter at a restaurant",
    airport: "Checking in for a flight and handling luggage at an airport",
    shopping:
      "Shopping for clothes, asking about products, and possibly bargaining",
    doctor:
      "Visiting a doctor, describing symptoms, and understanding treatment",
    interview:
      "Participating in a job interview, discussing experience and skills",
    hotel: "Checking into a hotel, asking about facilities and services",
  };

  return descriptions[scenario] || "General conversation practice";
}

function getAIRole(scenario: string): string {
  const roles: Record<string, string> = {
    restaurant: "a waiter/waitress at a restaurant",
    airport: "an airport check-in staff member",
    shopping: "a shop assistant in a clothing store",
    doctor: "a doctor in a medical clinic",
    interview: "a job interviewer",
    hotel: "a hotel receptionist",
  };

  return roles[scenario] || "a conversation partner";
}
