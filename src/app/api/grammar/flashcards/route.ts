import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GrammarIssue from "@/models/GrammarIssue";
import User from "@/models/User";

// Set route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

// Define types for grammar rules
interface GrammarRule {
  title: string;
  rule: string;
  example: {
    correct: string;
    incorrect: string;
  };
}

interface GrammarRulesCollection {
  [category: string]: GrammarRule[];
}

// Sample grammar rules for different categories
const grammarRules: GrammarRulesCollection = {
  tenses: [
    {
      title: "Present Simple vs Present Continuous",
      rule: "Use Present Simple for habits, facts, and routines. Use Present Continuous for actions happening now or temporary situations.",
      example: {
        correct:
          "I work here (general fact) vs I am working late today (temporary situation).",
        incorrect: "I am working here vs I work late today.",
      },
    },
    {
      title: "Past Simple vs Present Perfect",
      rule: "Use Past Simple for completed actions at a specific time in the past. Use Present Perfect for actions with a connection to the present or when the time is not specified.",
      example: {
        correct:
          "I visited Paris last year (specific time) vs I have visited Paris (connection to present).",
        incorrect: "I have visited Paris last year vs I visited Paris.",
      },
    },
  ],
  articles: [
    {
      title: "Definite Article (the)",
      rule: 'Use "the" when referring to something specific that both the speaker and listener know about.',
      example: {
        correct: "The book on the table is mine.",
        incorrect: "Book on table is mine.",
      },
    },
    {
      title: "Indefinite Articles (a/an)",
      rule: 'Use "a" before consonant sounds and "an" before vowel sounds when referring to something for the first time or something non-specific.',
      example: {
        correct: "I saw a cat and an owl.",
        incorrect: "I saw an cat and a owl.",
      },
    },
  ],
  prepositions: [
    {
      title: "Prepositions of Time",
      rule: 'Use "at" for specific times, "on" for days and dates, and "in" for longer periods like months or years.',
      example: {
        correct: "The meeting is at 3pm on Monday in July.",
        incorrect: "The meeting is on 3pm at Monday in July.",
      },
    },
    {
      title: "Prepositions of Place",
      rule: 'Use "at" for specific points, "in" for enclosed spaces, and "on" for surfaces.',
      example: {
        correct: "The book is on the table in the room at the corner.",
        incorrect: "The book is at the table on the room in the corner.",
      },
    },
  ],
};

// GET /api/grammar/flashcards - Get grammar flashcards
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get user's issues to determine which grammar areas to focus on
    const issues = await GrammarIssue.find({
      userId: session.user.id,
    })
      .select("category ceferLevel issue.type")
      .lean();

    if (issues.length === 0) {
      // If no issues, return default flashcards
      const defaultFlashcards = generateDefaultFlashcards();
      return NextResponse.json({ flashcards: defaultFlashcards });
    }

    // Count issues by category
    const categoryCounts: Record<string, { count: number; level: string }> = {};
    issues.forEach(issue => {
      if (!categoryCounts[issue.category]) {
        categoryCounts[issue.category] = {
          count: 0,
          level: issue.ceferLevel,
        };
      }
      categoryCounts[issue.category].count += 1;
    });

    // Sort categories by count (descending)
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([category, data]) => ({
        category,
        count: data.count,
        level: data.level,
      }));

    // Generate flashcards focused on the user's most common issue categories
    const flashcards = generateFlashcardsForCategories(sortedCategories);

    // Get user data to retrieve their mastery levels
    const user = await User.findById(session.user.id);
    if (user?.grammarProgress?.mastery) {
      // Prioritize flashcards based on user's mastery levels
      // Lower mastery = higher priority
      flashcards.forEach(card => {
        const mastery = user.grammarProgress.mastery.find(
          m => m.category === card.category
        );

        // Set priority (1-5, 5 being highest priority)
        if (mastery) {
          card.priority = 6 - mastery.level; // Invert the mastery level (1-5) to get priority (5-1)
        } else {
          card.priority = 3; // Default priority for categories without mastery data
        }
      });

      // Sort by priority (descending)
      flashcards.sort((a, b) => b.priority - a.priority);
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}

// Helper function to generate default flashcards
function generateDefaultFlashcards() {
  const flashcards: Array<{
    _id: string;
    category: string;
    title: string;
    rule: string;
    example: {
      correct: string;
      incorrect: string;
    };
    ceferLevel: string;
    priority: number;
  }> = [];

  for (const category in grammarRules) {
    grammarRules[category].forEach(rule => {
      flashcards.push({
        _id: `default_${category}_${flashcards.length + 1}`,
        category,
        title: rule.title,
        rule: rule.rule,
        example: rule.example,
        ceferLevel: "B1", // Default level
        priority: 3, // Default priority
      });
    });
  }

  return flashcards;
}

// Helper function to generate flashcards based on user's common issue categories
function generateFlashcardsForCategories(
  categories: { category: string; level: string; count: number }[]
) {
  const flashcards: Array<{
    _id: string;
    category: string;
    title: string;
    rule: string;
    example: {
      correct: string;
      incorrect: string;
    };
    ceferLevel: string;
    priority: number;
  }> = [];

  // Add flashcards for each category the user has issues with
  categories.forEach(catData => {
    const category = catData.category;

    if (grammarRules[category]) {
      grammarRules[category].forEach(rule => {
        flashcards.push({
          _id: `${category}_${flashcards.length + 1}`,
          category,
          title: rule.title,
          rule: rule.rule,
          example: rule.example,
          ceferLevel: catData.level || "B1",
          priority: 3, // Default priority, will be updated based on mastery
        });
      });
    }
  });

  // If we don't have enough flashcards from the user's categories, add some defaults
  if (flashcards.length < 6) {
    const defaultCards = generateDefaultFlashcards()
      .filter(card => !flashcards.some(f => f.title === card.title))
      .slice(0, 6 - flashcards.length);

    flashcards.push(...defaultCards);
  }

  return flashcards;
}
