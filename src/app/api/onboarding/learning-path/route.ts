import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      learningGoals,
      timeAvailable,
      difficultyPreference,
      focusAreas,
      learningStyle,
      strengths,
      weaknesses,
      otherPreferences,
    } = body;

    // Validate required fields
    if (!learningGoals || !timeAvailable || !learningStyle) {
      return NextResponse.json(
        {
          error:
            "Learning goals, time availability, and learning style are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.onboarding) {
      return NextResponse.json(
        { error: "User onboarding not initialized" },
        { status: 400 }
      );
    }

    if (
      !user.onboarding.skillAssessment ||
      !user.onboarding.skillAssessment.completed
    ) {
      return NextResponse.json(
        { error: "Skill assessment must be completed first" },
        { status: 400 }
      );
    }

    // Prepare comprehensive preferences object
    const preferences = {
      learningGoals: Array.isArray(learningGoals)
        ? learningGoals
        : [learningGoals],
      timeAvailable,
      difficultyPreference: difficultyPreference || "moderate",
      focusAreas: Array.isArray(focusAreas)
        ? focusAreas
        : focusAreas
          ? [focusAreas]
          : [],
      learningStyle,
      strengths: Array.isArray(strengths)
        ? strengths
        : strengths
          ? [strengths]
          : [],
      weaknesses: Array.isArray(weaknesses)
        ? weaknesses
        : weaknesses
          ? [weaknesses]
          : [],
      ...otherPreferences,
    };

    // Generate personalized learning path
    const learningPath = generateLearningPath(
      preferences,
      user.onboarding.skillAssessment
    );

    // Update user onboarding with comprehensive preferences and recommended path
    user.onboarding.preferences = {
      ...user.onboarding.preferences,
      learningGoals: preferences.learningGoals,
      timeAvailable: preferences.timeAvailable,
      difficultyPreference: preferences.difficultyPreference,
      focusAreas: preferences.focusAreas,
      learningStyle: preferences.learningStyle,
      strengths: preferences.strengths,
      weaknesses: preferences.weaknesses,
    };

    user.onboarding.recommendedPath = learningPath;
    user.onboarding.currentStep = 4; // Move to completion step, not final step

    await user.save();

    return NextResponse.json({
      success: true,
      learningPath,
      preferences,
    });
  } catch (error) {
    console.error("Error generating learning path:", error);
    return NextResponse.json(
      { error: "Failed to generate learning path. Please try again." },
      { status: 500 }
    );
  }
}

function generateLearningPath(preferences: any, skillAssessment: any) {
  const {
    learningGoals,
    timeAvailable,
    learningStyle,
    difficultyPreference,
    focusAreas,
    strengths: userStrengths,
    weaknesses: userWeaknesses,
  } = preferences;

  const {
    weakAreas,
    strengths: assessmentStrengths,
    ceferLevel,
    scores,
  } = skillAssessment;

  // Combine assessment-based and user-selected strengths/weaknesses
  const combinedWeakAreas = Array.from(
    new Set([...weakAreas, ...userWeaknesses])
  );
  const combinedStrengths = Array.from(
    new Set([...assessmentStrengths, ...userStrengths])
  );

  // Base module order for different CEFR levels and difficulty preferences
  const baseOrderByLevel = {
    A1: {
      easy: [
        "vocabulary",
        "reading",
        "games",
        "grammar",
        "writing",
        "listening",
        "speaking",
      ],
      moderate: [
        "vocabulary",
        "reading",
        "grammar",
        "writing",
        "listening",
        "speaking",
        "games",
      ],
      challenging: [
        "grammar",
        "vocabulary",
        "reading",
        "writing",
        "listening",
        "speaking",
        "games",
      ],
    },
    A2: {
      easy: [
        "reading",
        "vocabulary",
        "games",
        "grammar",
        "writing",
        "listening",
        "speaking",
      ],
      moderate: [
        "reading",
        "vocabulary",
        "grammar",
        "writing",
        "listening",
        "speaking",
        "games",
      ],
      challenging: [
        "grammar",
        "reading",
        "vocabulary",
        "writing",
        "listening",
        "speaking",
        "games",
      ],
    },
    B1: {
      easy: [
        "reading",
        "writing",
        "vocabulary",
        "games",
        "grammar",
        "listening",
        "speaking",
      ],
      moderate: [
        "reading",
        "writing",
        "vocabulary",
        "grammar",
        "listening",
        "speaking",
        "games",
      ],
      challenging: [
        "writing",
        "reading",
        "grammar",
        "vocabulary",
        "listening",
        "speaking",
        "games",
      ],
    },
    B2: {
      easy: [
        "writing",
        "reading",
        "games",
        "speaking",
        "listening",
        "vocabulary",
        "grammar",
      ],
      moderate: [
        "writing",
        "reading",
        "speaking",
        "listening",
        "vocabulary",
        "grammar",
        "games",
      ],
      challenging: [
        "speaking",
        "writing",
        "reading",
        "listening",
        "vocabulary",
        "grammar",
        "games",
      ],
    },
    C1: {
      easy: [
        "writing",
        "speaking",
        "reading",
        "games",
        "listening",
        "vocabulary",
        "grammar",
      ],
      moderate: [
        "writing",
        "speaking",
        "reading",
        "listening",
        "vocabulary",
        "grammar",
        "games",
      ],
      challenging: [
        "speaking",
        "writing",
        "listening",
        "reading",
        "vocabulary",
        "grammar",
        "games",
      ],
    },
    C2: {
      easy: [
        "speaking",
        "writing",
        "listening",
        "games",
        "reading",
        "vocabulary",
        "grammar",
      ],
      moderate: [
        "speaking",
        "writing",
        "listening",
        "reading",
        "vocabulary",
        "grammar",
        "games",
      ],
      challenging: [
        "speaking",
        "writing",
        "listening",
        "reading",
        "vocabulary",
        "grammar",
        "games",
      ],
    },
  };

  const difficulty = difficultyPreference || "moderate";
  const suggestedOrder =
    baseOrderByLevel[ceferLevel as keyof typeof baseOrderByLevel]?.[
      difficulty as keyof (typeof baseOrderByLevel)["A1"]
    ] || baseOrderByLevel.B1.moderate;

  // Prioritize based on focus areas selected by user
  let prioritizedModules = [...suggestedOrder];
  if (focusAreas && focusAreas.length > 0) {
    const focusModules = focusAreas.filter((area: string) =>
      suggestedOrder.includes(area)
    );
    const nonFocusModules = suggestedOrder.filter(
      (module: string) => !focusAreas.includes(module)
    );
    prioritizedModules = [...focusModules, ...nonFocusModules];
  }

  // Further adjust order based on weak areas (move to front)
  const weakAreaPriority = combinedWeakAreas
    .map((area: string) => {
      if (area === "grammar") return "grammar";
      if (area === "vocabulary") return "vocabulary";
      if (area === "reading") return "reading";
      if (area === "writing") return "writing";
      if (area === "listening") return "listening";
      if (area === "speaking") return "speaking";
      return area;
    })
    .filter((area: string) => prioritizedModules.includes(area));

  // Move weak areas to the front, but respect user focus areas
  const reorderedModules = [
    ...weakAreaPriority,
    ...prioritizedModules.filter(module => !weakAreaPriority.includes(module)),
  ];

  // Determine primary focus areas (up to 3)
  const primaryFocus: string[] = [];

  // Start with user-selected focus areas
  if (focusAreas && focusAreas.length > 0) {
    primaryFocus.push(...focusAreas.slice(0, 2));
  }

  // Add weak areas if not already included
  if (combinedWeakAreas.length > 0) {
    const weakNotInFocus = combinedWeakAreas.filter(
      area => !primaryFocus.includes(area)
    );
    primaryFocus.push(...weakNotInFocus.slice(0, 3 - primaryFocus.length));
  }

  // Add based on learning goals if still need more
  if (learningGoals.includes("business") && !primaryFocus.includes("writing")) {
    primaryFocus.push("writing");
  }
  if (learningGoals.includes("travel") && !primaryFocus.includes("speaking")) {
    primaryFocus.push("speaking");
  }
  if (learningGoals.includes("academic") && !primaryFocus.includes("reading")) {
    primaryFocus.push("reading");
  }
  if (
    learningGoals.includes("conversation") &&
    !primaryFocus.includes("speaking")
  ) {
    primaryFocus.push("speaking");
  }

  // Fill remaining slots with areas that need improvement based on assessment scores
  const allAreas = [
    "reading",
    "writing",
    "listening",
    "speaking",
    "vocabulary",
    "grammar",
  ];
  const areasNeedingWork = allAreas.filter(
    area => scores[area] < 70 && !primaryFocus.includes(area)
  );

  while (primaryFocus.length < 3 && areasNeedingWork.length > 0) {
    primaryFocus.push(areasNeedingWork.shift()!);
  }

  // Calculate time recommendations based on availability and goals
  const timeRecommendations = calculateTimeRecommendations(
    timeAvailable,
    difficultyPreference,
    ceferLevel
  );

  // Estimate weeks based on time availability, current level, and difficulty preference
  const timeMultiplier = {
    "15min": 1.4,
    "30min": 1.0,
    "60min": 0.7,
    flexible: 0.9,
  };

  const difficultyMultiplier = {
    easy: 0.8,
    moderate: 1.0,
    challenging: 1.2,
  };

  const levelMultiplier = {
    A1: 12,
    A2: 10,
    B1: 8,
    B2: 7,
    C1: 6,
    C2: 5,
  };

  const baseWeeks =
    levelMultiplier[ceferLevel as keyof typeof levelMultiplier] || 8;
  const timeModifier =
    timeMultiplier[timeAvailable as keyof typeof timeMultiplier] || 1.0;
  const difficultyModifier =
    difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] ||
    1.0;
  const estimatedWeeks = Math.max(
    4,
    Math.min(16, Math.round(baseWeeks * timeModifier * difficultyModifier))
  );

  // Generate comprehensive recommendations
  const recommendations = generateRecommendations(preferences, skillAssessment);

  return {
    primaryFocus: primaryFocus.slice(0, 3),
    suggestedOrder: reorderedModules,
    estimatedWeeks,
    timeRecommendations,
    recommendations,
    studyPlan: generateStudyPlan(
      timeAvailable,
      primaryFocus,
      ceferLevel,
      difficulty
    ),
    generatedAt: new Date(),
  };
}

function calculateTimeRecommendations(
  timeAvailable: string,
  difficulty: string,
  ceferLevel: string
) {
  const baseTime = {
    "15min": { daily: 15, weekly: 105 },
    "30min": { daily: 30, weekly: 210 },
    "60min": { daily: 60, weekly: 420 },
    flexible: { daily: 45, weekly: 315 },
  };

  const timeRec =
    baseTime[timeAvailable as keyof typeof baseTime] || baseTime.flexible;

  return {
    dailyMinutes: timeRec.daily,
    weeklyMinutes: timeRec.weekly,
    sessionsPerWeek: timeAvailable === "flexible" ? "5-7" : "7",
    recommendedBreakdown: generateTimeBreakdown(timeRec.daily),
  };
}

function generateTimeBreakdown(dailyMinutes: number) {
  if (dailyMinutes <= 15) {
    return {
      vocabulary: 5,
      grammar: 5,
      reading: 3,
      other: 2,
    };
  } else if (dailyMinutes <= 30) {
    return {
      mainSkill: 15,
      vocabulary: 8,
      grammar: 5,
      review: 2,
    };
  } else {
    return {
      mainSkill: 25,
      secondarySkill: 15,
      vocabulary: 10,
      grammar: 7,
      review: 3,
    };
  }
}

function generateStudyPlan(
  timeAvailable: string,
  primaryFocus: string[],
  ceferLevel: string,
  difficulty: string
) {
  const plan = {
    phase1: {
      weeks: "1-4",
      focus: "Foundation Building",
      activities: [] as string[],
    },
    phase2: {
      weeks: "5-8",
      focus: "Skill Development",
      activities: [] as string[],
    },
    phase3: {
      weeks: "9-12",
      focus: "Integration & Practice",
      activities: [] as string[],
    },
  };

  // Customize phases based on primary focus and level
  if (primaryFocus.includes("vocabulary")) {
    plan.phase1.activities.push("Daily vocabulary building with flashcards");
    plan.phase2.activities.push("Context-based vocabulary exercises");
    plan.phase3.activities.push("Advanced vocabulary in specialized topics");
  }

  if (primaryFocus.includes("grammar")) {
    plan.phase1.activities.push("Core grammar patterns and rules");
    plan.phase2.activities.push("Complex grammar structures");
    plan.phase3.activities.push("Grammar in real-world contexts");
  }

  if (primaryFocus.includes("reading")) {
    plan.phase1.activities.push("Short articles and basic comprehension");
    plan.phase2.activities.push("Longer texts with critical analysis");
    plan.phase3.activities.push("Diverse reading materials and speed reading");
  }

  if (primaryFocus.includes("writing")) {
    plan.phase1.activities.push("Basic sentence and paragraph structure");
    plan.phase2.activities.push("Essay writing and organization");
    plan.phase3.activities.push("Advanced writing styles and editing");
  }

  if (primaryFocus.includes("speaking")) {
    plan.phase1.activities.push("Basic conversation practice");
    plan.phase2.activities.push("Structured discussions and presentations");
    plan.phase3.activities.push("Advanced speaking scenarios and fluency");
  }

  if (primaryFocus.includes("listening")) {
    plan.phase1.activities.push("Simple audio content with transcripts");
    plan.phase2.activities.push("Diverse audio materials without support");
    plan.phase3.activities.push("Complex listening and note-taking");
  }

  return plan;
}

function generateRecommendations(preferences: any, skillAssessment: any) {
  const {
    learningGoals,
    timeAvailable,
    learningStyle,
    difficultyPreference,
    focusAreas,
    strengths,
    weaknesses,
  } = preferences;
  const { weakAreas, ceferLevel, scores } = skillAssessment;

  const recommendations = [
    {
      type: "welcome",
      title: "Your Personalized Learning Journey",
      description: `Based on your assessment and preferences, we've created a customized learning path for your ${ceferLevel} level English.`,
    },
  ];

  // Time-based recommendations
  if (timeAvailable === "15min") {
    recommendations.push({
      type: "time",
      title: "Micro-Learning Strategy",
      description:
        "Perfect for busy schedules! Focus on daily vocabulary building and short grammar exercises. Use flashcards during breaks and commute time.",
    });
  } else if (timeAvailable === "30min") {
    recommendations.push({
      type: "time",
      title: "Balanced Daily Practice",
      description:
        "Great commitment level! Spend 20 minutes on your main skill and 10 minutes on vocabulary review each day.",
    });
  } else if (timeAvailable === "60min") {
    recommendations.push({
      type: "time",
      title: "Intensive Learning Approach",
      description:
        "Excellent dedication! Take advantage of longer sessions to practice speaking and writing, which require more concentrated time.",
    });
  }

  // Goal-based recommendations
  if (learningGoals.includes("business")) {
    recommendations.push({
      type: "goal",
      title: "Business English Focus",
      description:
        "Prioritize writing skills for professional communication. Practice email writing, reports, and presentation skills regularly.",
    });
  }

  if (learningGoals.includes("travel")) {
    recommendations.push({
      type: "goal",
      title: "Travel Communication",
      description:
        "Focus on speaking and listening skills. Practice common travel scenarios, asking for directions, and making reservations.",
    });
  }

  if (learningGoals.includes("academic")) {
    recommendations.push({
      type: "goal",
      title: "Academic English Preparation",
      description:
        "Emphasize reading comprehension and academic writing. Practice analyzing texts and expressing complex ideas clearly.",
    });
  }

  if (learningGoals.includes("conversation")) {
    recommendations.push({
      type: "goal",
      title: "Conversational Fluency",
      description:
        "Regular speaking practice is key. Use the conversation feature daily and focus on natural expressions and idioms.",
    });
  }

  // Difficulty-based recommendations
  if (difficultyPreference === "easy") {
    recommendations.push({
      type: "difficulty",
      title: "Gentle Learning Approach",
      description:
        "We'll start with comfortable exercises and gradually increase difficulty. Focus on building confidence through consistent practice.",
    });
  } else if (difficultyPreference === "challenging") {
    recommendations.push({
      type: "difficulty",
      title: "Accelerated Learning Path",
      description:
        "You'll tackle advanced materials from the start. Expect intensive practice sessions that will rapidly improve your skills.",
    });
  }

  // Skill-based recommendations
  if (weakAreas.includes("grammar") || weaknesses.includes("grammar")) {
    recommendations.push({
      type: "skill",
      title: "Grammar Foundation Priority",
      description:
        "Strong grammar is essential for all language skills. Start with basic rules and practice with targeted exercises daily.",
    });
  }

  if (weakAreas.includes("speaking") || weaknesses.includes("speaking")) {
    recommendations.push({
      type: "skill",
      title: "Speaking Confidence Building",
      description:
        "Use the conversation feature regularly. Start with structured scenarios before moving to free conversation. Practice speaking aloud daily.",
    });
  }

  if (weakAreas.includes("listening") || weaknesses.includes("listening")) {
    recommendations.push({
      type: "skill",
      title: "Listening Skill Development",
      description:
        "Start with slower audio content and gradually increase speed. Use subtitles initially, then practice without them.",
    });
  }

  // Learning style recommendations
  if (learningStyle === "visual") {
    recommendations.push({
      type: "style",
      title: "Visual Learning Optimization",
      description:
        "Use reading materials with images, mind maps for vocabulary, and visual grammar charts. Take advantage of infographics and diagrams.",
    });
  } else if (learningStyle === "auditory") {
    recommendations.push({
      type: "style",
      title: "Audio-Focused Learning",
      description:
        "Prioritize listening exercises and speaking practice. Use text-to-speech features and listen to English podcasts regularly.",
    });
  } else if (learningStyle === "kinesthetic") {
    recommendations.push({
      type: "style",
      title: "Interactive Learning Approach",
      description:
        "Engage with hands-on activities, writing exercises, and interactive games. Practice speaking with gestures and movement.",
    });
  }

  // Level-specific recommendations
  if (ceferLevel === "A1" || ceferLevel === "A2") {
    recommendations.push({
      type: "level",
      title: "Foundation Building Phase",
      description:
        "Focus on high-frequency vocabulary and basic grammar patterns. Consistency is more important than intensity at your current level.",
    });
  } else if (ceferLevel === "B1" || ceferLevel === "B2") {
    recommendations.push({
      type: "level",
      title: "Intermediate Development",
      description:
        "Work on complex sentence structures and nuanced vocabulary. Practice expressing opinions and abstract concepts.",
    });
  } else if (ceferLevel === "C1" || ceferLevel === "C2") {
    recommendations.push({
      type: "level",
      title: "Advanced Mastery",
      description:
        "Focus on sophisticated language use, idiomatic expressions, and cultural nuances. Practice advanced academic and professional communication.",
    });
  }

  return recommendations;
}
