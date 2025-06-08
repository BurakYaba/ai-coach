import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SkillAssessment from "@/models/SkillAssessment";

// Assessment questions pool - This would ideally be stored in a database
const ASSESSMENT_QUESTIONS = {
  // Main reading passage for comprehensive assessment
  readingPassage: {
    id: "main_passage",
    title: "The Digital Revolution in Education",
    content: `The digital revolution has transformed education in unprecedented ways over the past two decades. Traditional classrooms, once dominated by blackboards and textbooks, now incorporate interactive whiteboards, tablets, and sophisticated learning management systems. This technological shift has created both opportunities and challenges for educators and students alike.

Online learning platforms have made education more accessible than ever before. Students from remote areas can now access courses from prestigious universities around the world. The COVID-19 pandemic accelerated this trend, forcing educational institutions to rapidly adapt to digital teaching methods. Video conferencing tools, collaborative platforms, and virtual reality applications have become commonplace in modern educational settings.

However, this digital transformation is not without its drawbacks. The "digital divide" has become more apparent, with students from lower-income families struggling to access necessary technology and reliable internet connections. Teachers have had to quickly adapt their teaching methods, often without adequate training or support. Additionally, concerns about screen time, reduced face-to-face interaction, and the effectiveness of online assessment methods continue to be debated among educators.

Despite these challenges, research suggests that when implemented effectively, digital tools can enhance learning outcomes. Personalized learning algorithms can adapt to individual student needs, while gamification elements can increase engagement and motivation. The key lies in finding the right balance between traditional teaching methods and innovative digital approaches.

Looking forward, the future of education will likely involve a hybrid model that combines the best of both digital and traditional learning environments. As artificial intelligence and machine learning technologies continue to advance, we can expect even more sophisticated educational tools that will further revolutionize how we teach and learn.`,
    questions: [
      {
        id: "rp1",
        type: "reading" as const,
        difficulty: "B2" as const,
        question:
          "According to the passage, what accelerated the adoption of digital teaching methods?",
        options: [
          "Government policies",
          "The COVID-19 pandemic",
          "Student demand",
          "Technological advances",
        ],
        correctAnswer: "The COVID-19 pandemic",
      },
      {
        id: "rp2",
        type: "reading" as const,
        difficulty: "B2" as const,
        question: "What is the 'digital divide' mentioned in the passage?",
        options: [
          "The gap between old and new teaching methods",
          "The difference between online and offline students",
          "The inequality in access to technology and internet",
          "The separation between teachers and students",
        ],
        correctAnswer: "The inequality in access to technology and internet",
      },
      {
        id: "rp3",
        type: "reading" as const,
        difficulty: "B1" as const,
        question:
          "What does the passage suggest about the future of education?",
        options: [
          "It will be completely digital",
          "It will return to traditional methods",
          "It will use a hybrid model",
          "It will focus only on artificial intelligence",
        ],
        correctAnswer: "It will use a hybrid model",
      },
      {
        id: "rp4",
        type: "reading" as const,
        difficulty: "B2" as const,
        question:
          "Which of the following is NOT mentioned as a benefit of digital tools in education?",
        options: [
          "Personalized learning algorithms",
          "Increased engagement through gamification",
          "Reduced education costs",
          "Enhanced learning outcomes",
        ],
        correctAnswer: "Reduced education costs",
      },
      {
        id: "rp5",
        type: "reading" as const,
        difficulty: "B1" as const,
        question: "What is the main idea of the passage?",
        options: [
          "Digital technology has completely replaced traditional education",
          "The digital revolution in education has both benefits and challenges",
          "Online learning is better than classroom learning",
          "Teachers are not adapting well to digital technology",
        ],
        correctAnswer:
          "The digital revolution in education has both benefits and challenges",
      },
    ],
  },
  grammar: [
    // A1-A2 Level Grammar
    {
      id: "g1",
      difficulty: "A1" as const,
      question: "She _____ to school every day.",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: "goes",
    },
    {
      id: "g2",
      difficulty: "A1" as const,
      question: "There _____ three cats in the garden.",
      options: ["is", "are", "am", "be"],
      correctAnswer: "are",
    },
    {
      id: "g3",
      difficulty: "A2" as const,
      question: "I _____ TV when you called me yesterday.",
      options: ["watch", "watched", "was watching", "am watching"],
      correctAnswer: "was watching",
    },
    {
      id: "g4",
      difficulty: "A2" as const,
      question: "We _____ live in Paris, but now we live in London.",
      options: ["used to", "use to", "are used to", "get used to"],
      correctAnswer: "used to",
    },
    // B1-B2 Level Grammar
    {
      id: "g5",
      difficulty: "B1" as const,
      question: "If I _____ more time, I would travel around the world.",
      options: ["have", "had", "would have", "will have"],
      correctAnswer: "had",
    },
    {
      id: "g6",
      difficulty: "B1" as const,
      question: "The book _____ by millions of people around the world.",
      options: ["has read", "has been read", "is reading", "reads"],
      correctAnswer: "has been read",
    },
    {
      id: "g7",
      difficulty: "B2" as const,
      question:
        "The report _____ by the time you arrive at the office tomorrow.",
      options: [
        "will finish",
        "will be finished",
        "will have been finished",
        "is finished",
      ],
      correctAnswer: "will have been finished",
    },
    {
      id: "g8",
      difficulty: "B2" as const,
      question: "I wish I _____ that mistake. Now everything is ruined.",
      options: ["didn't make", "hadn't made", "wouldn't make", "don't make"],
      correctAnswer: "hadn't made",
    },
  ],
  vocabulary: [
    // A1-A2 Level Vocabulary
    {
      id: "v1",
      difficulty: "A1" as const,
      question: "Choose the word that means 'very big':",
      options: ["tiny", "huge", "small", "medium"],
      correctAnswer: "huge",
    },
    {
      id: "v2",
      difficulty: "A2" as const,
      question: "What is the opposite of 'expensive'?",
      options: ["costly", "cheap", "valuable", "precious"],
      correctAnswer: "cheap",
    },
    {
      id: "v3",
      difficulty: "A2" as const,
      question: "Someone who is 'reliable' is:",
      options: ["untrustworthy", "dependable", "lazy", "careless"],
      correctAnswer: "dependable",
    },
    // B1-B2 Level Vocabulary
    {
      id: "v4",
      difficulty: "B1" as const,
      question:
        "Choose the word that best completes: 'The evidence was _____, leaving no doubt about his guilt.'",
      options: ["confusing", "overwhelming", "insufficient", "irrelevant"],
      correctAnswer: "overwhelming",
    },
    {
      id: "v5",
      difficulty: "B1" as const,
      question: "To 'implement' something means to:",
      options: ["destroy it", "put it into action", "ignore it", "postpone it"],
      correctAnswer: "put it into action",
    },
    {
      id: "v6",
      difficulty: "B2" as const,
      question: "What does 'meticulous' mean?",
      options: ["careless", "extremely careful", "very fast", "somewhat lazy"],
      correctAnswer: "extremely careful",
    },
    {
      id: "v7",
      difficulty: "B2" as const,
      question:
        "Choose the word that means 'to make something seem less important':",
      options: ["emphasize", "highlight", "diminish", "amplify"],
      correctAnswer: "diminish",
    },
  ],
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate 20 questions: 8 grammar + 7 vocabulary + 5 reading comprehension
    const selectedQuestions = [
      ...ASSESSMENT_QUESTIONS.grammar, // 8 questions
      ...ASSESSMENT_QUESTIONS.vocabulary, // 7 questions
    ];

    // Shuffle the grammar and vocabulary questions
    const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

    // Remove correct answers from the response (for security)
    const questionsForClient = shuffledQuestions.map(
      ({ correctAnswer, ...question }) => question
    );

    return NextResponse.json({
      questions: questionsForClient,
      readingPassage: {
        id: ASSESSMENT_QUESTIONS.readingPassage.id,
        title: ASSESSMENT_QUESTIONS.readingPassage.title,
        content: ASSESSMENT_QUESTIONS.readingPassage.content,
        questions: ASSESSMENT_QUESTIONS.readingPassage.questions.map(
          ({ correctAnswer, ...question }) => question
        ),
      },
      totalQuestions: 20, // 15 grammar/vocab + 5 reading
    });
  } catch (error) {
    console.error("Assessment generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate assessment" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers, timeSpent } = await request.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Calculate scores
    const results = calculateAssessmentResults(answers, timeSpent || 0);

    // Create assessment record
    const assessment = new SkillAssessment({
      userId: session.user.id,
      questions: getQuestionsWithAnswers(answers),
      results,
      status: "completed",
      startedAt: new Date(Date.now() - (timeSpent || 0) * 1000),
      completedAt: new Date(),
    });

    await assessment.save();

    // Update user onboarding data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize onboarding if it doesn't exist
    if (!user.onboarding) {
      user.onboarding = {
        completed: false,
        currentStep: 1,
        skillAssessment: {
          completed: false,
          ceferLevel: "B1",
          weakAreas: [],
          strengths: [],
          assessmentDate: new Date(),
          scores: {
            reading: 0,
            writing: 0,
            listening: 0,
            speaking: 0,
            vocabulary: 0,
            grammar: 0,
          },
        },
        preferences: {
          learningGoals: [],
          interests: [],
          timeAvailable: "flexible",
          preferredTime: "evening",
          learningStyle: "mixed",
        },
        recommendedPath: {
          primaryFocus: [],
          suggestedOrder: [],
          estimatedWeeks: 12,
        },
        tours: {
          completed: [],
          skipped: [],
        },
        moduleVisits: {},
      };
    }

    user.onboarding.skillAssessment = {
      completed: true,
      ceferLevel: results.recommendedLevel,
      overallScore: results.overallScore,
      weakAreas: results.weakAreas,
      strengths: results.strengths,
      assessmentDate: new Date(),
      scores: {
        ...results.skillScores,
        writing: 0, // Not assessed in initial assessment
        speaking: 0, // Not assessed in initial assessment
      },
    };

    user.onboarding.currentStep = 2; // Move to next step

    await user.save();

    return NextResponse.json({
      results,
      assessmentId: assessment._id,
    });
  } catch (error) {
    console.error("Assessment processing error:", error);
    return NextResponse.json(
      { error: "Failed to process assessment" },
      { status: 500 }
    );
  }
}

function calculateAssessmentResults(
  answers: Record<string, string>,
  timeSpent: number
) {
  const allQuestions = [
    ...ASSESSMENT_QUESTIONS.grammar,
    ...ASSESSMENT_QUESTIONS.vocabulary,
    ...ASSESSMENT_QUESTIONS.readingPassage.questions,
  ];

  let totalCorrect = 0;
  const skillScores = {
    reading: { correct: 0, total: 0 },
    grammar: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    listening: { correct: 0, total: 0 }, // Not used in initial assessment
  };

  // Calculate scores for each question
  for (const question of allQuestions) {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) {
      totalCorrect++;
    }

    // Update skill-specific scores - determine type from question id
    const skillType = getQuestionType(question.id);
    if (skillScores[skillType]) {
      skillScores[skillType].total++;
      if (isCorrect) {
        skillScores[skillType].correct++;
      }
    }
  }

  const overallScore = (totalCorrect / allQuestions.length) * 100;

  // Calculate skill percentages
  const finalSkillScores = {
    reading:
      skillScores.reading.total > 0
        ? (skillScores.reading.correct / skillScores.reading.total) * 100
        : 0,
    grammar:
      skillScores.grammar.total > 0
        ? (skillScores.grammar.correct / skillScores.grammar.total) * 100
        : 0,
    vocabulary:
      skillScores.vocabulary.total > 0
        ? (skillScores.vocabulary.correct / skillScores.vocabulary.total) * 100
        : 0,
    listening: 0, // Not assessed initially
  };

  // Determine CEFR level based on overall score with reading as a factor, not requirement
  let recommendedLevel = "A1";
  const readingScore = finalSkillScores.reading;

  // More balanced CEFR calculation - 60% should be B1
  if (overallScore >= 85) recommendedLevel = "C2";
  else if (overallScore >= 75) recommendedLevel = "C1";
  else if (overallScore >= 65)
    recommendedLevel = "B2"; // 65%+ for B2
  else if (overallScore >= 45)
    recommendedLevel = "B1"; // 45-64% for B1 (60% will be B1)
  else if (overallScore >= 30)
    recommendedLevel = "A2"; // 30-44% for A2
  else recommendedLevel = "A1"; // Below 30%

  // Adjust down one level if reading is significantly weak (more than 25 points below overall)
  if (readingScore < overallScore - 25 && readingScore < 35) {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const currentIndex = levels.indexOf(recommendedLevel);
    if (currentIndex > 0) {
      recommendedLevel = levels[currentIndex - 1];
    }
  }

  // Identify weak areas and strengths - adjust thresholds
  const weakAreas: string[] = [];
  const strengths: string[] = [];

  Object.entries(finalSkillScores).forEach(([skill, score]) => {
    if (score < 50 && skill !== "listening") {
      weakAreas.push(skill);
    } else if (score >= 75) {
      strengths.push(skill);
    }
  });

  return {
    totalQuestions: allQuestions.length,
    correctAnswers: totalCorrect,
    overallScore: Math.round(overallScore),
    skillScores: {
      reading: Math.round(finalSkillScores.reading),
      grammar: Math.round(finalSkillScores.grammar),
      vocabulary: Math.round(finalSkillScores.vocabulary),
      listening: Math.round(finalSkillScores.listening),
    },
    recommendedLevel,
    weakAreas,
    strengths,
    timeSpent,
  };
}

function getQuestionsWithAnswers(answers: Record<string, string>) {
  const allQuestions = [
    ...ASSESSMENT_QUESTIONS.grammar,
    ...ASSESSMENT_QUESTIONS.vocabulary,
    ...ASSESSMENT_QUESTIONS.readingPassage.questions,
  ];

  return allQuestions.map(question => ({
    id: question.id,
    type: getQuestionType(question.id),
    question: question.question,
    passage: "passage" in question ? question.passage : undefined,
    options: question.options,
    correctAnswer: question.correctAnswer,
    userAnswer: answers[question.id] || "",
    isCorrect: answers[question.id] === question.correctAnswer,
    difficulty: question.difficulty,
  }));
}

function getQuestionType(
  questionId: string
): "reading" | "grammar" | "vocabulary" | "listening" {
  if (questionId.startsWith("rp")) return "reading"; // Reading passage questions
  if (questionId.startsWith("r")) return "reading";
  if (questionId.startsWith("g")) return "grammar";
  if (questionId.startsWith("v")) return "vocabulary";
  return "listening";
}
