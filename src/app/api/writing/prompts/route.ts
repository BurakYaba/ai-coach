import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OpenAI } from "openai";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import WritingPrompt, { IWritingPrompt } from "@/models/WritingPrompt";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds timeout
  maxRetries: 2, // Retry failed requests up to 2 times
});

// GET /api/writing/prompts - Get writing prompts
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Parse query parameters
    const url = new URL(req.url);
    const level = url.searchParams.get("level");
    const type = url.searchParams.get("type");
    const topic = url.searchParams.get("topic");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Build query
    const query: any = {};
    if (level) query.level = level;
    if (type) query.type = type;
    if (topic) query.topic = { $regex: topic, $options: "i" };

    // Fetch prompts
    const prompts = await WritingPrompt.find(query)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("Error fetching writing prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch writing prompts" },
      { status: 500 }
    );
  }
}

// POST /api/writing/prompts - Create a new writing prompt
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "type",
      "level",
      "topic",
      "text",
      "requirements",
      "suggestedLength",
      "rubric",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new prompt
    const prompt = await WritingPrompt.create(body);

    return NextResponse.json({ prompt }, { status: 201 });
  } catch (error) {
    console.error("Error creating writing prompt:", error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create writing prompt" },
      { status: 500 }
    );
  }
}

// GET /api/writing/prompts/generate - Generate a writing prompt using AI
export async function generatePrompt(
  level: string,
  type: string,
  topic?: string
): Promise<IWritingPrompt> {
  // Add debug logging to see what parameters are received
  console.log(
    `Generating prompt with level: ${level}, type: ${type}, topic: ${topic}`
  );

  // Validate type parameter
  if (!["essay", "letter", "story", "argument"].includes(type)) {
    console.warn(
      `Invalid writing type received: ${type}, falling back to essay`
    );
    type = "essay";
  }

  try {
    // Define suggested length based on CEFR level
    const suggestedLength = {
      A1: { min: 80, max: 120 },
      A2: { min: 120, max: 180 },
      B1: { min: 180, max: 250 },
      B2: { min: 250, max: 350 },
      C1: { min: 350, max: 450 },
      C2: { min: 450, max: 600 },
    };

    // Define time limit based on CEFR level
    const getTimeLimit = (level: string): number => {
      switch (level) {
        case "A1":
          return 20;
        case "A2":
          return 25;
        case "B1":
          return 30;
        case "B2":
          return 40;
        case "C1":
          return 50;
        case "C2":
          return 60;
        default:
          return 30;
      }
    };

    // Define CEFR level guidelines for language complexity
    const levelGuidelines = {
      A1: "Use only the most basic vocabulary (500-800 words) and very simple present tense sentences. Keep sentences very short (5-8 words). Avoid idioms, phrasal verbs, and complex grammar. Use concrete, everyday topics only.",
      A2: "Use basic vocabulary (1000-1500 words) and simple sentences with basic past and future tenses. Keep sentences relatively short (8-10 words). Use only very common phrasal verbs and expressions.",
      B1: "Use moderate vocabulary (2000-2500 words) with a mix of simple and some complex sentences. Average sentence length should be 10-15 words. Include some common idiomatic expressions (1-2). Can cover somewhat abstract topics but with clear explanations.",
      B2: "Use broader vocabulary (3500-4000 words) with complex sentences. Average sentence length can be 15-20 words. Include various tenses and several idiomatic expressions. Can use passive constructions and complex conditionals.",
      C1: "Use sophisticated vocabulary (5000-6000 words) and complex sentence structures with multiple clauses. Include advanced grammatical structures and idiomatic expressions naturally. Can express nuanced opinions and hypothetical situations.",
      C2: "Use extensive vocabulary including specialized terms (8000+ words). Can include all grammatical structures including rare forms. Can use sophisticated rhetoric, metaphors, and cultural references. No simplification needed.",
    };

    // Prepare the system prompt
    const systemPrompt = `You are an expert language teacher who creates high-quality writing prompts for language learners. 
Your task is to create a writing prompt for CEFR level ${level} students in the format of a ${type}.

VERY IMPORTANT: The language you use in the prompt must be appropriate for CEFR ${level} students.
${levelGuidelines[level as keyof typeof levelGuidelines]}

The prompt should be challenging but achievable for students at this level.`;

    // Prepare the user prompt
    let userPrompt = `Create a writing prompt for a ${type} `;

    if (topic) {
      userPrompt += `about "${topic}" `;
    }

    userPrompt += `suitable for CEFR ${level} level English learners.

Return your response as a JSON object with the following fields:
{
  "text": "The main prompt text that clearly instructs what to write about",
  "requirements": ["5-6 specific requirements or elements that should be included in the response"],
  "rubric": [
    {"criterion": "Content", "description": "Description of what makes good content", "weight": 30},
    {"criterion": "Organization", "description": "Description of good organization", "weight": 20},
    {"criterion": "Language Use", "description": "Description of appropriate language use", "weight": 25},
    {"criterion": "Grammar & Mechanics", "description": "Description of grammar expectations", "weight": 25}
  ]
}

Remember that the language complexity of your prompt MUST match CEFR level ${level}. The requirements should be clear and achievable for students at this level.`;

    // Get suggested length range for this level
    const lengthRange =
      suggestedLength[level as keyof typeof suggestedLength] ||
      suggestedLength.B1;

    console.log("Calling OpenAI to generate writing prompt...");

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model:
        process.env.USE_GPT4_FOR_CONTENT === "true"
          ? "gpt-4o"
          : "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7, // A bit of creativity
      response_format: { type: "json_object" }, // Ensure we get valid JSON
    });

    // Parse the response
    const aiResponse = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    console.log("Successfully generated AI writing prompt");

    // Create prompt object with the AI-generated content
    const prompt: Partial<IWritingPrompt> = {
      type: type as "essay" | "letter" | "story" | "argument",
      level,
      topic: topic || "general",
      text: aiResponse.text,
      requirements: aiResponse.requirements || [],
      suggestedLength: lengthRange,
      timeLimit: getTimeLimit(level),
      rubric: aiResponse.rubric || [
        {
          criterion: "Content",
          description: "Addresses the prompt thoroughly with relevant ideas",
          weight: 30,
        },
        {
          criterion: "Organization",
          description: "Logical structure with clear transitions",
          weight: 20,
        },
        {
          criterion: "Language Use",
          description: "Appropriate vocabulary and sentence structures",
          weight: 25,
        },
        {
          criterion: "Grammar & Mechanics",
          description: "Correct grammar, spelling, and punctuation",
          weight: 25,
        },
      ],
    };

    return prompt as IWritingPrompt;
  } catch (error) {
    console.error("Error generating AI writing prompt:", error);

    // Fallback to template-based prompt if AI fails
    console.log("Falling back to template-based prompt generation");

    return generateTemplatePrompt(level, type, topic);
  }
}

// Renamed original template function as fallback
function generateTemplatePrompt(
  level: string,
  type: string,
  topic?: string
): IWritingPrompt {
  // Define suggested length based on CEFR level
  const suggestedLength = {
    A1: { min: 80, max: 120 },
    A2: { min: 120, max: 180 },
    B1: { min: 180, max: 250 },
    B2: { min: 250, max: 350 },
    C1: { min: 350, max: 450 },
    C2: { min: 450, max: 600 },
  };

  // Define time limit based on CEFR level
  const getTimeLimit = (level: string): number => {
    switch (level) {
      case "A1":
        return 20;
      case "A2":
        return 25;
      case "B1":
        return 30;
      case "B2":
        return 40;
      case "C1":
        return 50;
      case "C2":
        return 60;
      default:
        return 30;
    }
  };

  // Define topic categories if none provided
  const topicCategories = {
    technology: [
      "artificial intelligence",
      "social media",
      "remote work technology",
      "digital privacy",
      "automation",
      "virtual reality",
      "blockchain",
      "smart homes",
      "wearable technology",
      "cybersecurity",
    ],
    environment: [
      "climate change",
      "renewable energy",
      "sustainable living",
      "wildlife conservation",
      "ocean pollution",
      "deforestation",
      "urban gardening",
      "waste management",
      "air quality",
      "water conservation",
    ],
    education: [
      "online learning",
      "standardized testing",
      "arts in education",
      "multilingual education",
      "special education",
      "educational inequality",
      "lifelong learning",
      "early childhood education",
      "STEM education",
      "educational technology",
    ],
    health: [
      "mental health",
      "preventive healthcare",
      "telemedicine",
      "nutrition",
      "exercise",
      "healthcare access",
      "public health",
      "alternative medicine",
      "sleep habits",
      "stress management",
    ],
    society: [
      "cultural diversity",
      "generational differences",
      "community engagement",
      "urbanization",
      "social justice",
      "work-life balance",
      "immigration",
      "aging population",
      "gender equality",
      "economic inequality",
    ],
    sports: [
      "team sports",
      "individual sports",
      "extreme sports",
      "sports education",
      "professional vs. amateur sports",
      "sports and health",
      "sports technology",
      "sports and culture",
      "sports ethics",
      "inclusive sports",
    ],
    arts: [
      "visual arts",
      "performing arts",
      "digital art",
      "literature",
      "music",
      "film",
      "architecture",
      "traditional crafts",
      "public art",
      "art education",
    ],
  };

  // If no topic is provided, select a random category and topic
  if (!topic) {
    const categories = Object.keys(topicCategories);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const topicsInCategory =
      topicCategories[randomCategory as keyof typeof topicCategories];
    topic =
      topicsInCategory[Math.floor(Math.random() * topicsInCategory.length)];
  }

  // Define multiple prompt templates for each type to increase variety
  const promptTemplates = {
    essay: [
      {
        text: `Write an essay exploring how ${topic} has evolved over the past decade. Discuss key developments, current trends, and potential future directions.`,
        requirements: [
          "Introduction that provides context and a clear thesis",
          "Analysis of historical developments",
          "Discussion of current state and significance",
          "Exploration of future implications",
          "Conclusion that synthesizes your insights",
        ],
      },
      {
        text: `Write a comparative essay examining different perspectives on ${topic}. Analyze at least two contrasting viewpoints and evaluate their strengths and limitations.`,
        requirements: [
          "Introduction that presents the topic and its significance",
          "Clear presentation of different perspectives",
          "Balanced analysis of each viewpoint",
          "Thoughtful evaluation based on evidence",
          "Conclusion that offers your own informed position",
        ],
      },
      {
        text: `Write a cause-and-effect essay analyzing the impact of ${topic} on individuals and communities. Identify major causes, resulting effects, and potential solutions.`,
        requirements: [
          "Introduction with a clear thesis statement",
          "Logical organization of causes and effects",
          "Specific examples and evidence",
          "Analysis of short-term and long-term implications",
          "Conclusion with potential solutions or recommendations",
        ],
      },
      {
        text: `Write a reflective essay on how ${topic} relates to your personal experiences or observations. Connect your insights to broader social or cultural contexts.`,
        requirements: [
          "Introduction that engages the reader with your perspective",
          "Specific personal experiences or observations",
          "Thoughtful reflection and analysis",
          "Connections to wider contexts or universal themes",
          "Conclusion that offers meaningful insights",
        ],
      },
    ],
    letter: [
      {
        text: `Write a formal letter to a government official about ${topic}. Explain the need, benefits, and implementation steps for addressing this issue.`,
        requirements: [
          "Proper formal letter format with date, addresses, and salutation",
          "Clear introduction stating your purpose",
          "Detailed explanation with supporting evidence",
          "Discussion of benefits and addressing potential concerns",
          "Professional closing with a specific request for action",
        ],
      },
      {
        text: `Write a letter to the editor of a newspaper responding to a recent article about ${topic}. Express your agreement or disagreement, providing reasoned arguments and evidence.`,
        requirements: [
          "Appropriate letter format with date and salutation",
          "Reference to the original article in the opening",
          "Clear statement of your position",
          "Well-structured arguments with supporting evidence",
          "Concise conclusion reinforcing your main point",
        ],
      },
      {
        text: `Write a letter to a company regarding ${topic}. Describe your experiences, identify issues, and offer constructive suggestions for improvement.`,
        requirements: [
          "Professional letter format with appropriate headers",
          "Brief introduction explaining your relationship with the company",
          "Specific examples of issues or areas for improvement",
          "Constructive, actionable suggestions",
          "Positive closing expressing continued interest in their products/services",
        ],
      },
      {
        text: `Write a personal letter to a friend or family member about your experience with ${topic}. Share insights, lessons learned, and practical guidance.`,
        requirements: [
          "Informal letter format with appropriate greeting",
          "Personal anecdotes or experiences that illustrate your points",
          "Practical, actionable advice",
          "Empathetic and encouraging tone",
          "Warm conclusion with an invitation for further discussion",
        ],
      },
    ],
    story: [
      {
        text: `Write a short story in which the main character encounters ${topic} in an unexpected way. Focus on character development and emotional journey.`,
        requirements: [
          "Engaging opening that introduces the main character",
          "Vivid setting descriptions",
          "Meaningful character transformation",
          "Effective use of dialogue and sensory details",
          "Satisfying resolution that reflects the character's growth",
        ],
      },
      {
        text: `Write a mystery story centered around ${topic}. Include a puzzling situation, clues, and a resolution that explains the mystery.`,
        requirements: [
          "Intriguing opening that presents the mystery",
          "Well-developed characters including a protagonist who investigates",
          "Strategic placement of clues and red herrings",
          "Building tension and suspense",
          "Logical resolution that connects to the clues",
        ],
      },
      {
        text: `Write a creative short story that reimagines ${topic} in a fantasy or science fiction setting. Create unique characters and situations while exploring themes relevant to our world.`,
        requirements: [
          "Creative worldbuilding with consistent rules",
          "Engaging characters with clear motivations",
          "Plot that explores the speculative elements of your world",
          "Thematic connections to real-world issues",
          "Satisfying conclusion that resolves the main conflict",
        ],
      },
      {
        text: `Write a story from the first-person perspective of someone deeply affected by ${topic}. Focus on their experiences, challenges, and personal growth.`,
        requirements: [
          "Strong first-person narration with distinct voice",
          "Authentic character reactions and emotions",
          "Meaningful conflict related to the topic",
          "Development of the character's understanding or perspective",
          "Resolution that reflects the character's journey",
        ],
      },
    ],
    argument: [
      {
        text: `Write a persuasive argument proposing a specific solution to a problem related to ${topic}. Convince your audience that your approach is effective and feasible.`,
        requirements: [
          "Clear thesis statement presenting your solution",
          "Logical organization of supporting arguments",
          "Evidence including facts, statistics, and expert opinions",
          "Addressing potential counterarguments or concerns",
          "Strong conclusion emphasizing benefits and call to action",
        ],
      },
      {
        text: `Write an argumentative essay analyzing the ethical implications of ${topic}. Examine different ethical perspectives and defend your position on what approach is most justified.`,
        requirements: [
          "Introduction that presents the ethical dilemma",
          "Explanation of relevant ethical frameworks or principles",
          "Analysis of different positions with their strengths and weaknesses",
          "Well-reasoned defense of your position",
          "Conclusion that acknowledges complexity while affirming your stance",
        ],
      },
      {
        text: `Write a critical argument evaluating current approaches to ${topic}. Assess existing policies or practices and argue for maintaining or changing them.`,
        requirements: [
          "Clear thesis stating your evaluation and position",
          "Analysis of current approaches with specific examples",
          "Criteria for evaluation clearly established",
          "Evidence-based arguments for your position",
          "Practical recommendations consistent with your evaluation",
        ],
      },
      {
        text: `Write a persuasive argument examining how different groups are affected by ${topic}. Advocate for an approach that addresses inequities or disparities.`,
        requirements: [
          "Introduction highlighting the significance of the issue",
          "Analysis of impacts on different groups with supporting evidence",
          "Identification of underlying causes of disparities",
          "Persuasive case for your proposed approach",
          "Conclusion emphasizing social justice and collective benefit",
        ],
      },
    ],
  };

  // Select a random template based on validated type
  const templates =
    promptTemplates[type as keyof typeof promptTemplates] ||
    promptTemplates.essay;
  const template = templates[Math.floor(Math.random() * templates.length)];

  console.log(
    `Selected template for ${type} with topic: ${topic}. Template text: ${template.text.substring(0, 50)}...`
  );

  // Create prompt object
  const prompt: Partial<IWritingPrompt> = {
    type: type as "essay" | "letter" | "story" | "argument",
    level,
    topic: topic,
    text: template.text,
    requirements: template.requirements,
    suggestedLength:
      suggestedLength[level as keyof typeof suggestedLength] ||
      suggestedLength.B1,
    timeLimit: getTimeLimit(level),
    rubric: [
      {
        criterion: "Content",
        description: "Addresses the prompt thoroughly with relevant ideas",
        weight: 30,
      },
      {
        criterion: "Organization",
        description: "Logical structure with clear transitions",
        weight: 20,
      },
      {
        criterion: "Language Use",
        description: "Appropriate vocabulary and sentence structures",
        weight: 25,
      },
      {
        criterion: "Grammar & Mechanics",
        description: "Correct grammar, spelling, and punctuation",
        weight: 25,
      },
    ],
  };

  return prompt as IWritingPrompt;
}
