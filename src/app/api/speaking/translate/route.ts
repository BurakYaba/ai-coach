import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";

import { authOptions } from "@/lib/auth";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000,
  maxRetries: 2,
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

    const body = await req.json();
    const { text } = body;

    // Validate required fields
    if (!text) {
      return NextResponse.json(
        { error: "Text to translate is required" },
        { status: 400 }
      );
    }

    // Translate using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Translate the given English text to Turkish. Provide only the translation, no explanations or additional text.",
        },
        {
          role: "user",
          content: `Translate this English text to Turkish: "${text}"`,
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
