import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Advanced Vocabulary Building Strategies for 2025",
  description:
    "Discover proven methods to expand your English vocabulary effectively. From spaced repetition to contextual learning, master these advanced techniques and supercharge your language skills.",
  keywords:
    "vocabulary building, English vocabulary, vocabulary strategies, spaced repetition, vocabulary learning, English words, vocabulary improvement, language learning techniques, vocabulary methods",
  openGraph: {
    title: "Advanced Vocabulary Building Strategies for 2025",
    description:
      "Master advanced vocabulary building techniques with proven methods like spaced repetition and contextual learning for effective English improvement.",
    type: "article",
    images: [
      {
        url: "/og-images/og-vocabulary-strategies.png",
        width: 1200,
        height: 630,
        alt: "Advanced Vocabulary Building Strategies",
      },
    ],
  },
};

export default function VocabularyStrategiesBlogPost() {
  const vocabularyStrategies = [
    {
      strategy: "Spaced Repetition System (SRS)",
      description:
        "Review words at scientifically-optimized intervals to maximize retention",
      benefits: [
        "95% better retention rate",
        "Efficient time usage",
        "Long-term memory formation",
      ],
      tools: ["Anki", "Fluenta AI", "Memrise", "Quizlet"],
      icon: "🧠",
    },
    {
      strategy: "Contextual Learning",
      description:
        "Learn words in meaningful contexts rather than isolated definitions",
      benefits: [
        "Better understanding",
        "Natural usage patterns",
        "Improved recall",
      ],
      tools: ["Reading apps", "News articles", "Podcasts", "TV shows"],
      icon: "📖",
    },
    {
      strategy: "Word Families & Etymology",
      description:
        "Study related words and their origins to understand patterns",
      benefits: [
        "Faster learning",
        "Pattern recognition",
        "Deeper understanding",
      ],
      tools: ["Etymology dictionaries", "Word family lists", "Root word apps"],
      icon: "🌳",
    },
    {
      strategy: "Active Production Practice",
      description: "Use new vocabulary in speaking and writing exercises",
      benefits: [
        "Practical application",
        "Confidence building",
        "Muscle memory",
      ],
      tools: ["Writing prompts", "Speaking practice", "Conversation apps"],
      icon: "💬",
    },
    {
      strategy: "Multimodal Learning",
      description:
        "Engage multiple senses through visual, auditory, and kinesthetic methods",
      benefits: [
        "Enhanced memory",
        "Multiple retrieval paths",
        "Personalized learning",
      ],
      tools: ["Flashcards", "Audio resources", "Visual mnemonics", "Mind maps"],
      icon: "🎨",
    },
    {
      strategy: "Progressive Disclosure",
      description:
        "Gradually reveal word complexity from basic to advanced meanings",
      benefits: [
        "Structured learning",
        "Prevents overwhelm",
        "Building confidence",
      ],
      tools: [
        "Adaptive learning apps",
        "Graded readers",
        "Leveled vocabulary lists",
      ],
      icon: "📈",
    },
  ];

  const vocabularyGoals = [
    {
      level: "Beginner",
      words: "1,000-2,000",
      target: "10-15 new words/day",
      focus: "High-frequency words",
    },
    {
      level: "Intermediate",
      words: "3,000-5,000",
      target: "8-12 new words/day",
      focus: "Academic & professional vocabulary",
    },
    {
      level: "Advanced",
      words: "6,000-10,000",
      target: "5-8 new words/day",
      focus: "Specialized & nuanced vocabulary",
    },
    {
      level: "Expert",
      words: "10,000+",
      target: "3-5 new words/day",
      focus: "Field-specific & rare vocabulary",
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
                href="/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/modules/vocabulary-builder"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Vocabulary Builder
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm">Build Vocabulary Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>›</span>
          <span>Vocabulary Building Strategies</span>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Vocabulary</Badge>
              <Badge variant="outline">Learning Strategies</Badge>
              <Badge variant="outline">Advanced Methods</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Advanced Vocabulary Building Strategies for 2025
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover proven methods to expand your English vocabulary
              effectively. From spaced repetition to contextual learning, master
              these advanced techniques that top language learners use to
              supercharge their progress.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>November 25, 2024</span>
              <span>•</span>
              <span>11 min read</span>
              <span>•</span>
              <span>Advanced Learning</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-lg leading-relaxed mb-4">
              Building a strong vocabulary is one of the most impactful ways to
              improve your English proficiency. Research shows that vocabulary
              size directly correlates with reading comprehension, writing
              quality, and overall communication effectiveness. Yet many
              learners struggle with ineffective methods that lead to forgetting
              and frustration.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              In 2025, successful language learners are moving beyond simple
              memorization to embrace scientifically-backed strategies that
              maximize retention and practical application. This comprehensive
              guide reveals the advanced techniques that will transform your
              vocabulary learning journey.
            </p>
          </section>

          {/* Advanced Vocabulary Strategies */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              6 Advanced Vocabulary Building Strategies
            </h2>

            <div className="space-y-8">
              {vocabularyStrategies.map((strategy, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <span className="text-2xl">{strategy.icon}</span>
                      {index + 1}. {strategy.strategy}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {strategy.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">
                          ✅ Key Benefits:
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {strategy.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-green-500">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
                          🛠️ Recommended Tools:
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {strategy.tools.map((tool, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Vocabulary Learning Goals */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              Setting Realistic Vocabulary Goals by Level
            </h2>

            <div className="grid gap-6">
              {vocabularyGoals.map((goal, index) => (
                <GradientCard key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{goal.level} Level</span>
                      <Badge variant="outline">{goal.words} words</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong>Daily Target:</strong>
                        <p className="text-muted-foreground">{goal.target}</p>
                      </div>
                      <div>
                        <strong>Focus Area:</strong>
                        <p className="text-muted-foreground">{goal.focus}</p>
                      </div>
                      <div>
                        <strong>Time to Goal:</strong>
                        <p className="text-muted-foreground">
                          {goal.level === "Beginner"
                            ? "3-6 months"
                            : goal.level === "Intermediate"
                              ? "6-12 months"
                              : goal.level === "Advanced"
                                ? "12-18 months"
                                : "18+ months"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </GradientCard>
              ))}
            </div>
          </section>

          {/* Daily Vocabulary Practice Routine */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              The Ultimate Daily Vocabulary Practice Routine
            </h2>

            <GradientCard>
              <CardHeader>
                <CardTitle>20-Minute Daily Vocabulary Workout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold">Review Previous Words</h4>
                      <p className="text-sm text-muted-foreground">
                        Use spaced repetition to review words from previous days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                      8
                    </div>
                    <div>
                      <h4 className="font-semibold">Learn New Words</h4>
                      <p className="text-sm text-muted-foreground">
                        Encounter 5-10 new words in context through reading or
                        listening
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Active Practice</h4>
                      <p className="text-sm text-muted-foreground">
                        Use new words in sentences, conversations, or writing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Reflection & Planning</h4>
                      <p className="text-sm text-muted-foreground">
                        Track progress and plan tomorrow's vocabulary focus
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </GradientCard>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Supercharge Your Vocabulary with AI-Powered Learning
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Put these advanced strategies into practice with Fluenta's
              AI-powered vocabulary builder. Get personalized learning paths,
              spaced repetition, and contextual practice all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Building Vocabulary
                </Button>
              </Link>
              <Link href="/modules/vocabulary-builder">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Explore Vocabulary Module
                </Button>
              </Link>
            </div>
          </section>

          {/* Related Articles */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/blog/english-grammar-mistakes-avoid"
                      className="hover:text-primary"
                    >
                      10 Common English Grammar Mistakes
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Master English grammar by learning to avoid the most common
                    mistakes...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/blog/ai-english-conversation-practice"
                      className="hover:text-primary"
                    >
                      AI English Conversation Practice
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Improve your speaking skills with AI conversation
                    partners...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/blog/english-pronunciation-practice-online"
                      className="hover:text-primary"
                    >
                      English Pronunciation Practice Online
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Master English pronunciation with online tools and
                    techniques...
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
