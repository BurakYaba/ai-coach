import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000,
  maxRetries: 2,
});

// Language mapping for OpenAI
const LANGUAGE_MAP: { [key: string]: string } = {
  turkish: "Turkish",
  english: "English",
  german: "German",
  french: "French",
  spanish: "Spanish",
  italian: "Italian",
  russian: "Russian",
  arabic: "Arabic",
  chinese: "Chinese",
  japanese: "Japanese",
  korean: "Korean",
  // Add more mappings as needed
};

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

    const body = await req.json();
    const { text, targetLanguage } = body;

    // Validate required fields
    if (!text) {
      return NextResponse.json(
        { error: "Text to translate is required" },
        { status: 400 }
      );
    }

    // Connect to database to get user's native language
    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use provided target language or fall back to user's native language
    let nativeLanguage = targetLanguage || user.onboarding?.nativeLanguage;

    // If no native language is set, default to Turkish for backward compatibility
    if (!nativeLanguage) {
      nativeLanguage = "turkish";
    }

    // Map the language code to a proper language name for OpenAI
    const targetLanguageName = LANGUAGE_MAP[nativeLanguage] || nativeLanguage;

    // Translate using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given English text to ${targetLanguageName}. Provide only the translation, no explanations or additional text.`,
        },
        {
          role: "user",
          content: `Translate this English text to ${targetLanguageName}: "${text}"`,
        },
      ],
      max_tokens: 200,
      temperature: 0.3, // Lower temperature for more consistent translations
    });

    const translation =
      completion.choices[0].message.content || "Translation failed";

    return NextResponse.json({
      originalText: text,
      translatedText: translation,
      targetLanguage: nativeLanguage,
    });
  } catch (error: any) {
    console.error("Translation error:", error);
    return NextResponse.json(
      {
        error: "Failed to translate text",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
