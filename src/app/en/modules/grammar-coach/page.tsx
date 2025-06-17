import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Grammar Coach - AI-Powered English Grammar Learning | Fluenta",
  description:
    "Master English grammar with AI-powered lessons, error analysis, and personalized practice. Get instant feedback on grammar rules and improve your writing accuracy.",
  keywords:
    "English grammar coach, grammar lessons, grammar practice, AI grammar tutor, grammar rules, grammar exercises, grammar improvement, English grammar app",
  openGraph: {
    title: "Grammar Coach - AI-Powered English Grammar Learning | Fluenta",
    description:
      "Master English grammar with AI-powered lessons, personalized practice, and instant error analysis.",
    type: "website",
    images: [
      {
        url: "/og-images/og-grammar-coach.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Grammar Coach",
      },
    ],
  },
};

export default function GrammarCoachPage() {
  const grammarTopics = [
    {
      title: "Verb Tenses",
      description:
        "Master all 12 English tenses with contextual examples and practice",
      icon: "⏰",
      lessons: 24,
      difficulty: "Beginner to Advanced",
    },
    {
      title: "Articles & Determiners",
      description:
        "Learn when to use a, an, the, and other determiners correctly",
      icon: "📝",
      lessons: 12,
      difficulty: "Intermediate",
    },
    {
      title: "Conditionals",
      description:
        "Understand if-clauses, hypothetical situations, and modal verbs",
      icon: "🤔",
      lessons: 18,
      difficulty: "Intermediate to Advanced",
    },
    {
      title: "Passive Voice",
      description: "Transform active sentences to passive and understand usage",
      icon: "🔄",
      lessons: 15,
      difficulty: "Intermediate",
    },
    {
      title: "Reported Speech",
      description: "Learn to quote and report what others have said accurately",
      icon: "💬",
      lessons: 16,
      difficulty: "Advanced",
    },
    {
      title: "Complex Sentences",
      description:
        "Build sophisticated sentences with clauses and conjunctions",
      icon: "🏗️",
      lessons: 20,
      difficulty: "Advanced",
    },
  ];

  const grammarFeatures = [
    {
      title: "Personalized Error Analysis",
      description:
        "AI identifies your most common mistakes and creates targeted lessons",
      icon: "🎯",
    },
    {
      title: "Interactive Lessons",
      description:
        "Engaging exercises with immediate feedback and explanations",
      icon: "💡",
    },
    {
      title: "Grammar Rules Database",
      description: "Comprehensive explanations with examples and exceptions",
      icon: "📚",
    },
    {
      title: "Progress Tracking",
      description: "Monitor your improvement across different grammar areas",
      icon: "📈",
    },
  ];

  const studentLevels = [
    {
      level: "Beginner",
      description: "A1-A2 Level",
      topics: ["Basic tenses", "Sentence structure", "Articles", "Plurals"],
      color:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    },
    {
      level: "Intermediate",
      description: "B1-B2 Level",
      topics: [
        "Perfect tenses",
        "Passive voice",
        "Conditionals",
        "Reported speech",
      ],
      color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    },
    {
      level: "Advanced",
      description: "C1-C2 Level",
      topics: [
        "Complex structures",
        "Subjunctive mood",
        "Advanced clauses",
        "Formal writing",
      ],
      color:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-xl hover:text-primary transition-colors"
            >
              Fluenta
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/modules"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Modules
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm">Start Learning</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <Link href="/modules" className="hover:text-primary">
            Modules
          </Link>
          <span>›</span>
          <span>Grammar Coach</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">📝 Grammar</Badge>
            <Badge variant="outline">AI-Powered</Badge>
            <Badge variant="outline">Personalized</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master English Grammar with Your AI Coach
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your English grammar skills with personalized AI coaching.
            Get instant feedback, targeted lessons, and error analysis to
            achieve perfect grammar accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Grammar Journey
              </Button>
            </Link>
            <Link href="/en/modules">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Explore All Modules
              </Button>
            </Link>
          </div>
        </section>

        {/* Grammar Topics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Grammar Curriculum
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grammarTopics.map((topic, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{topic.icon}</span>
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {topic.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary font-medium">Lessons:</span>
                      <span>{topic.lessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary font-medium">Level:</span>
                      <span>{topic.difficulty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            AI-Powered Grammar Learning Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {grammarFeatures.map((feature, index) => (
              <GradientCard key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Learning Path by Level */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Grammar Learning Path by Level
          </h2>
          <div className="grid gap-8">
            {studentLevels.map((level, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{level.level}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}
                    >
                      {level.description}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {level.topics.map((topic, i) => (
                      <div
                        key={i}
                        className="bg-muted/50 p-3 rounded-lg text-center"
                      >
                        <span className="text-sm font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How Grammar Coach Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Your AI Grammar Coach Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <CardTitle className="text-lg">Grammar Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Take a comprehensive test to identify your current grammar
                  level and weak areas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <CardTitle className="text-lg">Personalized Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI creates a custom learning path focusing on your specific
                  grammar challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <CardTitle className="text-lg">Interactive Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete exercises with instant feedback and detailed
                  explanations for each answer.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor your improvement and unlock new grammar topics as you
                  progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sample Lesson */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Try a Sample Grammar Lesson
          </h2>
          <GradientCard className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Present Perfect vs Simple Past</CardTitle>
              <p className="text-muted-foreground">
                Choose the correct tense for each sentence
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="mb-3 font-medium">
                    1. I _____ to Paris three times in my life.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-background border rounded-lg hover:bg-primary/10 transition-colors text-left">
                      A) went
                    </button>
                    <button className="p-3 bg-primary/10 border-2 border-primary rounded-lg text-left">
                      B) have been ✓
                    </button>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-sm">
                      <strong>Explanation:</strong> "Have been" is correct
                      because this is a life experience without a specific time
                      mentioned.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="mb-3 font-medium">
                    2. She _____ her homework yesterday evening.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-primary/10 border-2 border-primary rounded-lg text-left">
                      A) finished ✓
                    </button>
                    <button className="p-3 bg-background border rounded-lg hover:bg-primary/10 transition-colors text-left">
                      B) has finished
                    </button>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-sm">
                      <strong>Explanation:</strong> "Finished" is correct
                      because "yesterday evening" is a specific past time.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/register">
                    <Button size="lg">Try Full Grammar Course</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Grammar Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    L
                  </div>
                  <div>
                    <h4 className="font-semibold">Lisa Chen</h4>
                    <p className="text-sm text-muted-foreground">
                      Academic Researcher
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Grammar Coach helped me master complex sentence structures
                  for my research papers. My writing is now much more
                  professional and clear."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Academic writing improved
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    R
                  </div>
                  <div>
                    <h4 className="font-semibold">Roberto Silva</h4>
                    <p className="text-sm text-muted-foreground">
                      Business Manager
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The personalized error analysis was game-changing. It focused
                  on my specific weaknesses and helped me improve my business
                  communications."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    85% error reduction
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">
                      IELTS Candidate
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Thanks to Grammar Coach, I achieved a 7.5 in IELTS writing.
                  The comprehensive lessons covered everything I needed for the
                  exam."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    IELTS 7.5 achieved
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect Your Grammar Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who've mastered English grammar with
              personalized AI coaching and targeted practice exercises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Grammar Course
                </Button>
              </Link>
              <Link href="/en/blog/ai-english-grammar-checker">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Grammar Tools Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
