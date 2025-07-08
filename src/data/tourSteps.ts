interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "hover" | "focus" | "none";
  optional?: boolean;
  tips?: string[];
}

export const tourSteps: Record<string, TourStep[]> = {
  reading: [
    {
      id: "reading-welcome",
      title: "Welcome to Reading Module!",
      content:
        "This module helps you improve your reading comprehension through AI-generated passages and interactive exercises.",
      target: "h1",
      position: "bottom",
      tips: [
        "Start with easier texts and gradually increase difficulty",
        "Focus on understanding main ideas before details",
      ],
    },
    {
      id: "reading-start-session",
      title: "Start New Session",
      content:
        "Click here to begin a new reading session. You'll get AI-generated content tailored to your current level.",
      target: "[data-tour='start-new-session']",
      position: "left",
      tips: [
        "Each session adapts to your performance",
        "Sessions typically take 15-30 minutes",
      ],
    },
    {
      id: "reading-tabs",
      title: "Reading Navigation",
      content:
        "Use these tabs to switch between your reading sessions and progress tracking.",
      target: "[data-tour='reading-tabs']",
      position: "top",
      tips: [
        "Sessions tab shows your current and past reading exercises",
        "Progress tab displays your improvement over time",
      ],
    },
    {
      id: "reading-sessions",
      title: "Your Reading Sessions",
      content:
        "Here you can see all your reading sessions, continue unfinished ones, or review completed sessions.",
      target: "[data-tour='reading-sessions']",
      position: "top",
      tips: [
        "Continue where you left off with unfinished sessions",
        "Review your answers and feedback from completed sessions",
      ],
    },
    {
      id: "reading-progress",
      title: "Track Your Progress",
      content:
        "Monitor your reading comprehension improvement with detailed analytics, statistics, and achievements.",
      target: "[data-tour='reading-progress']",
      position: "top",
      tips: [
        "Regular practice leads to measurable improvement",
        "Set daily reading goals to stay motivated",
      ],
    },
  ],

  writing: [
    {
      id: "writing-welcome",
      title: "Welcome to Writing Module!",
      content:
        "Develop your writing skills with AI-powered prompts, feedback, and guided exercises tailored to your level.",
      target: "h1",
      position: "bottom",
      tips: [
        "Start with simple topics and gradually increase complexity",
        "Focus on clarity and structure over perfection",
      ],
    },
    {
      id: "writing-prompts",
      title: "Writing Prompts",
      content:
        "Choose from various writing prompts designed to challenge different aspects of your writing skills.",
      target: "[data-tour='writing-prompts']",
      position: "right",
      tips: [
        "Choose topics that interest you for better engagement",
        "Don't be afraid to express your personal opinions",
      ],
    },
    {
      id: "writing-editor",
      title: "Writing Editor",
      content:
        "Use our smart editor with real-time suggestions and formatting tools to craft your responses.",
      target: "[data-tour='writing-editor']",
      position: "top",
      tips: [
        "Plan your writing before you start",
        "Use the outline feature for longer pieces",
      ],
    },
    {
      id: "writing-feedback",
      title: "AI Feedback",
      content:
        "Receive detailed feedback on grammar, vocabulary, coherence, and style to improve your writing skills.",
      target: "[data-tour='ai-feedback']",
      position: "left",
      tips: [
        "Read feedback carefully and take notes",
        "Apply suggestions in your next writing piece",
      ],
    },
    {
      id: "writing-history",
      title: "Writing History",
      content:
        "Review your past writings and track improvement over time. See how your skills have developed!",
      target: "[data-tour='writing-history']",
      position: "bottom",
      tips: [
        "Compare old and new writings to see progress",
        "Revisit successful techniques in new pieces",
      ],
    },
  ],

  speaking: [
    {
      id: "speaking-welcome",
      title: "Welcome to Speaking Module!",
      content:
        "Practice speaking English with AI conversation partners and get real-time feedback on pronunciation and fluency.",
      target: "h1",
      position: "bottom",
      tips: [
        "Don't worry about making mistakes - they're part of learning",
        "Practice a little bit every day for best results",
      ],
    },
    {
      id: "speaking-conversation",
      title: "AI Conversation",
      content:
        "Start a conversation with our AI partner. Choose topics that interest you and practice natural dialogue.",
      target: "[data-tour='conversation-start']",
      position: "right",
      tips: [
        "Speak clearly and at a comfortable pace",
        "Ask questions to keep the conversation flowing",
      ],
    },
    {
      id: "speaking-pronunciation",
      title: "Pronunciation Feedback",
      content:
        "Get instant feedback on your pronunciation, stress patterns, and intonation to sound more natural.",
      target: "[data-tour='pronunciation-feedback']",
      position: "top",
      tips: [
        "Listen to the feedback audio examples",
        "Practice problem sounds repeatedly",
      ],
    },
    {
      id: "speaking-scenarios",
      title: "Practice Scenarios",
      content:
        "Try different conversation scenarios like job interviews, casual chats, or business meetings.",
      target: "[data-tour='practice-scenarios']",
      position: "left",
      tips: [
        "Choose scenarios relevant to your goals",
        "Practice the same scenario multiple times",
      ],
    },
  ],

  listening: [
    {
      id: "welcome",
      title: "Welcome to Listening Practice",
      content:
        "This is your listening practice hub where you can improve your listening skills with AI-generated audio content. Let's explore the features!",
      target: "[data-tour='listening-header']",
      position: "center",
      action: "none",
      tips: [
        "Practice listening with authentic audio content",
        "Track your progress and improvement over time",
        "Choose from various difficulty levels and topics",
      ],
    },
    {
      id: "tabs",
      title: "Navigation Tabs",
      content:
        "Use these tabs to navigate between different sections: Library for new content, In Progress for ongoing sessions, Completed for finished sessions, and Progress to track your stats.",
      target: "[data-tour='listening-tabs']",
      position: "center",
      action: "none",
      tips: [
        "Library: Browse and start new listening sessions",
        "In Progress: Continue your current sessions",
        "Completed: Review your finished sessions",
        "Progress: View your listening statistics",
      ],
    },
    {
      id: "search-filters",
      title: "Search & Filters",
      content:
        "Use the search bar to find specific topics, and the filters to select difficulty levels (A1-C2) and content types like dialogues, interviews, or news.",
      target: "[data-tour='search-filters']",
      position: "center",
      action: "none",
      tips: [
        "Search by title, topic, or keywords",
        "Filter by CEFR levels (A1 = Beginner, C2 = Advanced)",
        "Choose content types that interest you most",
      ],
    },
    {
      id: "content-library",
      title: "Listening Content Library",
      content:
        "Browse through our extensive library of listening materials. Each card shows the difficulty level, duration, and content type. Click on any item to start practicing!",
      target: "[data-tour='content-library']",
      position: "center",
      action: "none",
      tips: [
        "Color-coded levels: Green (A1-A2), Blue (B1-B2), Purple (C1-C2)",
        "Duration shows how long each session takes",
        "Topics range from daily conversations to academic content",
      ],
    },
    {
      id: "content-card",
      title: "Content Cards",
      content:
        "Each content card displays key information: title, level, duration, and topic. Click 'Start Session' to begin listening practice with interactive features.",
      target: "[data-tour='content-card']",
      position: "center",
      action: "none",
      tips: [
        "Level badge shows CEFR difficulty rating",
        "Duration helps you plan your study time",
        "Topics cover real-world scenarios and academic subjects",
      ],
    },
    {
      id: "progress-tracking",
      title: "Progress Tracking",
      content:
        "Monitor your listening improvement with detailed statistics showing your completion rates, time spent, and skill development across different levels.",
      target: "[data-tour='progress-tab']",
      position: "center",
      action: "none",
      tips: [
        "Track completion rates by difficulty level",
        "Monitor time spent on listening practice",
        "See your improvement trends over time",
      ],
    },
    {
      id: "session-features",
      title: "Interactive Session Features",
      content:
        "During listening sessions, you'll have access to transcripts, vocabulary explanations, comprehension questions, and playback controls for optimal learning.",
      target: "[data-tour='listening-tabs']",
      position: "center",
      action: "none",
      tips: [
        "Synchronized transcripts help follow along",
        "Vocabulary panels explain difficult words",
        "Comprehension questions test understanding",
        "Playback controls let you repeat sections",
      ],
    },
    {
      id: "ready-to-start",
      title: "Ready to Improve Your Listening?",
      content:
        "You're all set! Start with content matching your level, use the filters to find interesting topics, and track your progress. Happy listening!",
      target: "[data-tour='content-library']",
      position: "center",
      action: "none",
      tips: [
        "Start with A1-A2 if you're a beginner",
        "Try B1-B2 for intermediate learners",
        "Challenge yourself with C1-C2 advanced content",
        "Regular practice leads to rapid improvement!",
      ],
    },
  ],

  vocabulary: [
    {
      id: "vocabulary-welcome",
      title: "Welcome to Vocabulary Module!",
      content:
        "Build your vocabulary systematically with spaced repetition, contextual learning, and personalized word lists.",
      target: "h1",
      position: "bottom",
      tips: [
        "Learn words in context rather than isolation",
        "Review regularly for better retention",
      ],
    },
    {
      id: "vocabulary-flashcards",
      title: "Smart Flashcards",
      content:
        "Study with adaptive flashcards that adjust based on your performance and learning patterns.",
      target: "[data-tour='flashcards']",
      position: "right",
      tips: [
        "Be honest about your knowledge - it helps the system",
        "Create mental associations with new words",
      ],
    },
    {
      id: "vocabulary-categories",
      title: "Word Categories",
      content:
        "Organize your vocabulary by themes, difficulty levels, or personal categories for better learning.",
      target: "[data-tour='word-categories']",
      position: "left",
      tips: [
        "Focus on high-frequency words first",
        "Group related words together",
      ],
    },
    {
      id: "vocabulary-practice",
      title: "Practice Exercises",
      content:
        "Reinforce learning with various exercises: sentence completion, word matching, and context usage.",
      target: "[data-tour='vocabulary-practice']",
      position: "bottom",
      tips: [
        "Try to use new words in your own sentences",
        "Pay attention to word collocations",
      ],
    },
  ],

  grammar: [
    {
      id: "grammar-welcome",
      title: "Welcome to Grammar Module!",
      content:
        "Master English grammar with adaptive lessons, targeted exercises, and personalized feedback.",
      target: "h1",
      position: "bottom",
      tips: [
        "Focus on understanding patterns rather than memorizing rules",
        "Practice with real examples from your writing",
      ],
    },
    {
      id: "grammar-lessons",
      title: "Adaptive Lessons",
      content:
        "Study grammar topics tailored to your needs, focusing on areas where you need the most improvement.",
      target: "[data-tour='grammar-lessons']",
      position: "right",
      tips: [
        "Start with the fundamentals before advanced topics",
        "Take notes on key patterns and exceptions",
      ],
    },
    {
      id: "grammar-exercises",
      title: "Interactive Exercises",
      content:
        "Practice with various exercise types designed to reinforce grammatical concepts and patterns.",
      target: "[data-tour='grammar-exercises']",
      position: "left",
      tips: [
        "Read explanations carefully when you make mistakes",
        "Try to understand why an answer is correct",
      ],
    },
    {
      id: "grammar-mistakes",
      title: "Mistake Analysis",
      content:
        "Review your common grammar mistakes and get targeted practice to overcome them.",
      target: "[data-tour='mistake-analysis']",
      position: "bottom",
      tips: [
        "Don't be discouraged by mistakes - they show learning",
        "Keep a personal grammar journal",
      ],
    },
  ],

  games: [
    {
      id: "games-welcome",
      title: "Welcome to Learning Games!",
      content:
        "Make learning fun with interactive games that reinforce your English skills through play.",
      target: "h1",
      position: "bottom",
      tips: [
        "Games are a great way to practice without pressure",
        "Challenge yourself with higher difficulty levels",
      ],
    },
    {
      id: "games-selection",
      title: "Game Selection",
      content:
        "Choose from various games targeting different skills: vocabulary, grammar, listening, and more.",
      target: "[data-tour='game-selection']",
      position: "right",
      tips: [
        "Try different games to find your favorites",
        "Use games as a fun break from regular study",
      ],
    },
    {
      id: "games-leaderboard",
      title: "Leaderboards & Achievements",
      content:
        "Compete with other learners and unlock achievements as you progress through the games.",
      target: "[data-tour='leaderboard']",
      position: "left",
      tips: [
        "Healthy competition can motivate learning",
        "Focus on personal improvement over rankings",
      ],
    },
    {
      id: "games-difficulty",
      title: "Adaptive Difficulty",
      content:
        "Games automatically adjust to your skill level, providing the right amount of challenge.",
      target: "[data-tour='difficulty-settings']",
      position: "bottom",
      optional: true,
      tips: [
        "Let the system adjust difficulty automatically",
        "Manually adjust if you want more or less challenge",
      ],
    },
  ],
};

// Common tour steps for dashboard
export const dashboardTourSteps: TourStep[] = [
  {
    id: "dashboard-welcome",
    title: "Welcome to Your Dashboard!",
    content:
      "This is your learning hub where you can access all modules, track progress, and manage your learning journey.",
    target: "main",
    position: "center",
    tips: [
      "Your dashboard shows personalized recommendations",
      "Check your daily goals and streaks regularly",
    ],
  },
  {
    id: "dashboard-modules",
    title: "Learning Modules",
    content:
      "Access all seven learning modules from here. Each module focuses on different aspects of English learning.",
    target: "[data-tour='module-grid']",
    position: "top",
    tips: [
      "Start with modules in your learning path",
      "Try all modules to find your preferences",
    ],
  },
  {
    id: "dashboard-progress",
    title: "Progress Overview",
    content:
      "Monitor your learning progress, streaks, and achievements to stay motivated and on track.",
    target: "[data-tour='progress-overview']",
    position: "bottom",
    tips: [
      "Regular practice helps maintain streaks",
      "Celebrate your achievements along the way",
    ],
  },
  {
    id: "dashboard-profile",
    title: "Profile & Settings",
    content:
      "Access your profile, learning path, and settings from the dropdown menu in the top-right corner.",
    target: "[data-tour='user-nav']",
    position: "left",
    action: "hover",
    tips: [
      "Check your learning path for personalized recommendations",
      "Adjust settings to match your preferences",
    ],
  },
];
