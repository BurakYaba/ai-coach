import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import WritingPrompt from "@/models/WritingPrompt";

import { generatePrompt } from "../route";

// Function to check if two strings are similar
function stringSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0; // If strings are identical

  // Convert both strings to lowercase for better comparison
  const str1 = s1.toLowerCase();
  const str2 = s2.toLowerCase();

  // Count matching words
  const words1 = str1.split(/\s+/).filter(Boolean);
  const words2 = str2.split(/\s+/).filter(Boolean);

  let matchingWords = 0;

  // Count how many words from str1 appear in str2
  const wordSet2 = new Set(words2);
  for (const word of words1) {
    if (wordSet2.has(word)) {
      matchingWords++;
    }
  }

  // Calculate Jaccard similarity coefficient
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  return totalUniqueWords > 0 ? matchingWords / totalUniqueWords : 0;
}

// POST /api/writing/prompts/generate - Generate a writing prompt
export async function POST(req: NextRequest) {
  try {
    // Validate user authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { level, topic, type } = body;

    // Validate required fields
    if (!level || !type) {
      return NextResponse.json(
        {
          error: "Missing required fields: level and type are required",
        },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["essay", "letter", "story", "argument"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid writing type: ${type}. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        {
          error: `Invalid level: ${level}. Must be one of: ${validLevels.join(", ")}`,
        },
        { status: 400 }
      );
    }

    console.log(
      `Generating prompt with validated parameters: type=${type}, level=${level}, topic=${topic || "not specified"}`
    );

    // Generate prompt using the function from parent route file with parameters in the correct order:
    // generatePrompt(level: string, type: string, topic?: string)
    const generatedPrompt = await generatePrompt(level, type, topic);

    // Connect to the database and save the prompt
    try {
      await dbConnect();

      // Get existing prompts with similar type, level, and topic for similarity check (user-specific)
      const similarPrompts = await WritingPrompt.find({
        userId: session.user.id, // Only check user's own prompts
        type: generatedPrompt.type,
        level: generatedPrompt.level,
        ...(topic ? { topic: { $regex: new RegExp(topic, "i") } } : {}),
      })
        .sort({ createdAt: -1 })
        .limit(20) // Check the most recent 20 matching prompts
        .lean();

      // Check for duplicates or similar prompts
      let isDuplicate = false;
      let similarPrompt = null;

      for (const existingPrompt of similarPrompts) {
        // Check text similarity
        const textSimilarity = stringSimilarity(
          generatedPrompt.text,
          existingPrompt.text
        );

        // If the similarity is high (above 0.7 or 70%), consider it a duplicate
        if (textSimilarity > 0.7) {
          isDuplicate = true;
          similarPrompt = existingPrompt;
          console.log(
            `Found similar prompt with ID: ${existingPrompt._id} (similarity: ${textSimilarity.toFixed(2)})`
          );
          break;
        }
      }

      if (isDuplicate && similarPrompt) {
        // If a similar prompt exists, return it instead of creating a duplicate
        console.log(
          `Returning existing similar prompt instead of creating duplicate`
        );
        return NextResponse.json({ prompt: similarPrompt });
      }

      // Save the generated prompt to the database with userId
      const promptData = {
        ...generatedPrompt,
        userId: session.user.id,
      };
      const savedPrompt = await WritingPrompt.create(promptData);
      console.log(
        `Saved generated prompt to database with ID: ${savedPrompt._id}`
      );

      // Return the saved prompt (which now has an _id)
      return NextResponse.json({ prompt: savedPrompt });
    } catch (dbError) {
      console.error("Error saving prompt to database:", dbError);
      // If saving fails, still return the generated prompt to the user
      // so they can continue with their writing session
      return NextResponse.json({ prompt: generatedPrompt });
    }
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
