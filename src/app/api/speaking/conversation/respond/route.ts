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

    // Generate response from GPT-4 with timeout handling
    console.log("Calling OpenAI chat completions API");
    let completion: any;
    try {
      completion = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Using gpt-3.5-turbo for faster responses
          messages: messages as any,
          max_tokens: 200, // Reduced token limit for faster responses
          temperature: 0.7,
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("OpenAI chat completion timeout")),
            25000
          )
        ),
      ]);
    } catch (error) {
      console.error("OpenAI chat completion failed:", error);
      throw new Error("Failed to generate AI response. Please try again.");
    }
    console.log("OpenAI completion received");

    const responseText =
      completion.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response.";
    console.log("AI response text:", responseText);

    // Generate speech from text with timeout handling and retry logic
    console.log("Generating speech with voice:", voice);
    let speechResponse: any;
    let ttsAttempts = 0;
    const maxTtsAttempts = 2;

    while (ttsAttempts < maxTtsAttempts && !speechResponse) {
      try {
        ttsAttempts++;
        console.log(`TTS attempt ${ttsAttempts}/${maxTtsAttempts}`);

        speechResponse = await Promise.race([
          openai.audio.speech.create({
            model: "tts-1", // Using tts-1 for faster speech generation
            voice: voice,
            input: responseText,
            speed: 1.0, // Normal speed for better reliability
          }),
          new Promise(
            (_, reject) =>
              setTimeout(
                () => reject(new Error("TTS generation timeout")),
                20000
              ) // Reduced to 20 seconds
          ),
        ]);

        console.log("TTS generation successful on attempt", ttsAttempts);
        break; // Success, exit retry loop
      } catch (error) {
        console.error(`TTS attempt ${ttsAttempts} failed:`, error);

        if (ttsAttempts >= maxTtsAttempts) {
          console.error("All TTS attempts failed, continuing without audio");
          speechResponse = null;
          break;
        } else {
          // Wait a shorter time before retrying for faster fallback
          console.log("Waiting 1 second before TTS retry...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    let audioUrl = null;
    if (speechResponse) {
      try {
        console.log("Speech generation successful");
        // Convert speech response to buffer
        const buffer = Buffer.from(await speechResponse.arrayBuffer());
        console.log("Converted speech to buffer, length:", buffer.length);

        // Convert buffer to base64
        const base64Audio = buffer.toString("base64");
        console.log("Converted buffer to base64, length:", base64Audio.length);

        // Create a data URL for the audio
        audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
        console.log("Created audio URL");
      } catch (audioError) {
        console.error("Audio processing failed:", audioError);
        // Continue without audio if processing fails
      }
    }

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
  let prompt = `You are a language learning assistant on Fluenta specializing in English conversation practice.
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
    // Food & Dining
    restaurant: "Ordering food and interacting with a waiter at a restaurant",
    cafe: "Ordering drinks, finding seating, and chatting with baristas at a coffee shop",
    grocery_shopping:
      "Shopping for groceries, asking for help finding items, and checking out",
    food_delivery: "Ordering food for delivery and handling delivery logistics",

    // Travel & Transportation
    airport: "Checking in for a flight and handling luggage at an airport",
    taxi_uber:
      "Taking a taxi or rideshare, giving directions and handling payment",
    public_transport:
      "Using public transportation, buying tickets and navigating transit systems",
    car_rental:
      "Renting a car, understanding insurance options, and handling pickup/return",
    train_station:
      "Booking train tickets, finding platforms, and handling delays or changes",

    // Accommodation
    hotel: "Checking into a hotel, asking about facilities and services",
    airbnb_host:
      "Meeting your Airbnb host, getting instructions, and asking about the area",
    apartment_viewing:
      "Touring an apartment, asking about amenities, and discussing lease terms",

    // Shopping & Services
    shopping:
      "Shopping for clothes, asking about products, and possibly bargaining",
    electronics_store:
      "Shopping for electronics, comparing products, and asking about warranties",
    pharmacy:
      "Getting prescription medication and asking about health products",
    post_office: "Sending packages, buying stamps, and handling mail services",
    hair_salon:
      "Booking appointments, describing desired haircuts, and discussing styling",

    // Healthcare & Wellness
    doctor:
      "Visiting a doctor, describing symptoms, and understanding treatment",
    dentist:
      "Having a dental appointment, discussing problems, and understanding procedures",
    gym_membership:
      "Signing up for gym membership, learning about facilities, and getting fitness advice",

    // Professional & Business
    interview:
      "Participating in a job interview, discussing experience and skills",
    workplace_meeting:
      "Participating in team meetings, presenting ideas, and collaborating",
    networking_event:
      "Attending a networking event, introducing yourself professionally, and making connections",
    customer_service:
      "Calling customer service to resolve issues, make complaints, and get assistance",
    business_presentation:
      "Giving a business presentation, handling questions, and discussing proposals",

    // Banking & Finance
    bank_visit:
      "Visiting a bank to open accounts, discuss loans, and handle banking services",
    insurance_consultation:
      "Consulting about insurance, comparing policies, and understanding coverage",

    // Education & Learning
    university_enrollment:
      "Enrolling in university, applying for courses, and getting academic advice",
    library_visit:
      "Visiting a library, finding books, and getting research assistance",
    language_exchange:
      "Participating in language exchange, practicing with native speakers",

    // Social & Entertainment
    party_invitation:
      "Planning social events, inviting friends, and coordinating activities",
    movie_theater:
      "Going to movies, buying tickets, choosing seats, and discussing films",
    sports_event:
      "Attending sports events, buying tickets, and interacting with other fans",
    concert_venue:
      "Going to concerts, buying tickets, finding seats, and talking about music",

    // Technology & Digital
    tech_support:
      "Calling tech support to troubleshoot problems and get technical help",
    phone_plan:
      "Setting up phone plans, understanding features, and resolving service issues",
    internet_setup:
      "Setting up internet service, troubleshooting connections, and understanding packages",

    // Emergency & Urgent Situations
    emergency_call:
      "Handling emergencies, calling for help, and communicating urgent needs",
    police_report:
      "Reporting incidents to police, providing information, and understanding procedures",

    // Home & Lifestyle
    real_estate_agent:
      "Working with real estate agents to buy or rent property and negotiate prices",
    home_repair:
      "Calling home repair services, describing problems, and getting quotes",
    utility_services:
      "Setting up utilities like electricity, water, gas, and handling billing issues",

    // Cultural & Community
    museum_visit:
      "Visiting museums, asking about exhibits, and discussing art and culture",
    religious_service:
      "Participating in religious or community center activities and cultural events",
    volunteer_work:
      "Signing up for volunteer work and participating in community service",

    // Casual & Daily Life
    neighborhood_chat:
      "Chatting with neighbors, discussing local issues, and building community",
    small_talk:
      "Making small talk and casual conversations about weather and daily life",
    hobby_discussion:
      "Discussing hobbies and interests, sharing experiences, and finding common ground",
  };

  return descriptions[scenario] || "General conversation practice";
}

function getAIRole(scenario: string): string {
  const roles: Record<string, string> = {
    // Food & Dining
    restaurant: "a waiter/waitress at a restaurant",
    cafe: "a barista at a coffee shop",
    grocery_shopping: "a grocery store employee or cashier",
    food_delivery: "a food delivery app representative or delivery driver",

    // Travel & Transportation
    airport: "an airport check-in staff member",
    taxi_uber: "a taxi or rideshare driver",
    public_transport: "a public transportation employee or fellow passenger",
    car_rental: "a car rental agent",
    train_station: "a train station employee or ticket agent",

    // Accommodation
    hotel: "a hotel receptionist",
    airbnb_host: "an Airbnb host",
    apartment_viewing: "a real estate agent or landlord",

    // Shopping & Services
    shopping: "a shop assistant in a clothing store",
    electronics_store: "an electronics store sales associate",
    pharmacy: "a pharmacist or pharmacy assistant",
    post_office: "a postal service employee",
    hair_salon: "a hairstylist or salon receptionist",

    // Healthcare & Wellness
    doctor: "a doctor in a medical clinic",
    dentist: "a dentist or dental hygienist",
    gym_membership: "a gym staff member or fitness consultant",

    // Professional & Business
    interview: "a job interviewer or hiring manager",
    workplace_meeting: "a colleague or team member",
    networking_event: "a fellow professional at a networking event",
    customer_service: "a customer service representative",
    business_presentation: "a business colleague or client",

    // Banking & Finance
    bank_visit: "a bank teller or financial advisor",
    insurance_consultation: "an insurance agent or consultant",

    // Education & Learning
    university_enrollment:
      "a university admissions counselor or academic advisor",
    library_visit: "a librarian or library assistant",
    language_exchange: "a language exchange partner or native speaker",

    // Social & Entertainment
    party_invitation: "a friend helping with event planning",
    movie_theater: "a movie theater employee or fellow moviegoer",
    sports_event: "a fellow sports fan or venue staff member",
    concert_venue: "a concert venue employee or fellow music fan",

    // Technology & Digital
    tech_support: "a technical support representative",
    phone_plan: "a mobile service provider representative",
    internet_setup: "an internet service provider technician",

    // Emergency & Urgent Situations
    emergency_call: "an emergency dispatcher or first responder",
    police_report: "a police officer taking a report",

    // Home & Lifestyle
    real_estate_agent: "a real estate agent",
    home_repair: "a maintenance technician or contractor",
    utility_services: "a utility company representative",

    // Cultural & Community
    museum_visit: "a museum guide or information desk staff",
    religious_service: "a community member or religious leader",
    volunteer_work: "a volunteer coordinator",

    // Casual & Daily Life
    neighborhood_chat: "a friendly neighbor",
    small_talk: "a casual conversation partner",
    hobby_discussion: "someone who shares similar interests",
  };

  return roles[scenario] || "a conversation partner";
}
