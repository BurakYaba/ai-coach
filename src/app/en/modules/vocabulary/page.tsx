import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import PopularResourcesEn from "@/components/layout/PopularResourcesEn";
import FooterEn from "@/components/layout/FooterEn";

export const metadata: Metadata = {
  title: "English Vocabulary Module - AI-Powered Vocabulary Building | Fluenta",
  description:
    "Expand your English vocabulary with Fluenta's AI-powered vocabulary module. Spaced repetition, contextual learning, and personalized word banks for effective vocabulary growth.",
  keywords:
    "English vocabulary, vocabulary building, AI vocabulary training, English words, spaced repetition, vocabulary learning, word bank, contextual learning",
  alternates: {
    canonical: "/en/modules/vocabulary",
    languages: {
      en: "/en/modules/vocabulary",
      tr: "/moduller/kelime-hazinesi",
    },
  },
  openGraph: {
    title:
      "English Vocabulary Module - AI-Powered Vocabulary Building | Fluenta",
    description:
      "Systematic English vocabulary expansion with AI technology. Spaced repetition and contextual learning for long-term retention.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-vocabulary-module-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Vocabulary Module",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200/50 dark:border-yellow-700/50">
      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
        {children}
      </span>
    </div>
  </div>
);

export default function VocabularyModulePage() {
  const features = [
    {
      icon: "🧠",
      title: "Spaced Repetition",
      description: "Scientifically proven method for long-term retention",
    },
    {
      icon: "📖",
      title: "Contextual Learning",
      description: "Learn words in meaningful sentences and situations",
    },
    {
      icon: "🎯",
      title: "Personalized Word Bank",
      description: "AI curates vocabulary based on your level and interests",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your vocabulary growth with detailed analytics",
    },
    {
      icon: "🔄",
      title: "Interactive Flashcards",
      description: "Engaging flashcard system with multiple review modes",
    },
    {
      icon: "🌟",
      title: "Word Families",
      description: "Learn related words together for better understanding",
    },
  ];

  const vocabularyLevels = [
    {
      level: "Beginner (A1-A2)",
      description: "Essential everyday vocabulary",
      wordCount: "1,000+ words",
      topics: ["Family", "Food", "Colors", "Numbers", "Time", "Weather"],
    },
    {
      level: "Intermediate (B1-B2)",
      description: "Academic and professional vocabulary",
      wordCount: "3,000+ words",
      topics: [
        "Work",
        "Education",
        "Technology",
        "Health",
        "Travel",
        "Culture",
      ],
    },
    {
      level: "Advanced (C1-C2)",
      description: "Sophisticated and specialized vocabulary",
      wordCount: "5,000+ words",
      topics: [
        "Business",
        "Science",
        "Literature",
        "Politics",
        "Philosophy",
        "Arts",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/en/modules/vocabulary" language="en" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/en" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <Link href="/en/modules" className="hover:text-primary">
            Modules
          </Link>
          <span>›</span>
          <span>Vocabulary Module</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI-Powered Vocabulary Building</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            English Vocabulary Module
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Systematically expand your English vocabulary with AI-powered spaced
            repetition and contextual learning. Build a strong foundation for
            fluent communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-3"
              >
                Start Now
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Explore Features
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Vocabulary Module Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced learning techniques for effective vocabulary acquisition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Vocabulary Levels
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Structured vocabulary learning for every proficiency level
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {vocabularyLevels.map((level, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{level.wordCount}</Badge>
                    <span className="text-2xl">📚</span>
                  </div>
                  <CardTitle>{level.level}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {level.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Topics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {level.topics.map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="outline"
                          className="text-xs justify-center"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Effective vocabulary learning process in 4 steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Discover Words</h3>
              <p className="text-muted-foreground text-sm">
                AI introduces new words based on your level and interests
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn in Context</h3>
              <p className="text-muted-foreground text-sm">
                See words used in meaningful sentences and real situations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Practice & Review</h3>
              <p className="text-muted-foreground text-sm">
                Use interactive flashcards and spaced repetition system
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Master & Apply</h3>
              <p className="text-muted-foreground text-sm">
                Use learned words in writing and speaking exercises
              </p>
            </div>
          </div>
        </section>

        {/* Learning Methods */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Learning Methods</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple approaches to vocabulary acquisition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Visual Learning</h3>
                  <p className="text-muted-foreground text-sm">
                    Images and visual associations to enhance memory retention
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Audio Pronunciation</h3>
                  <p className="text-muted-foreground text-sm">
                    Native speaker pronunciation for every word and phrase
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contextual Examples</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-world sentences showing proper word usage
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adaptive Repetition</h3>
                  <p className="text-muted-foreground text-sm">
                    Smart algorithm determines optimal review timing
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-2xl font-bold">Build Your Vocabulary</h3>
                <p className="text-muted-foreground">
                  Join thousands of learners expanding their English vocabulary
                </p>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Begin Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <GradientCard>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Expand Your Vocabulary?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Start with our AI-powered vocabulary module and experience
                systematic word learning with spaced repetition and contextual
                practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/en#pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </GradientCard>
        </section>

        {/* Popular Resources */}
        <PopularResourcesEn />
      </main>

      {/* Footer */}
      <FooterEn />
    </div>
  );
}
