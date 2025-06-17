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
  title: "English Grammar Module - AI-Powered Grammar Training | Fluenta",
  description:
    "Master English grammar with Fluenta's AI-powered grammar module. Interactive lessons, error analysis, and personalized practice for perfect grammar skills.",
  keywords:
    "English grammar, grammar rules, AI grammar training, grammar exercises, grammar lessons, English syntax, grammar practice, grammar correction",
  alternates: {
    canonical: "/en/modules/grammar",
    languages: {
      en: "/en/modules/grammar",
      tr: "/moduller/gramer",
    },
  },
  openGraph: {
    title: "English Grammar Module - AI-Powered Grammar Training | Fluenta",
    description:
      "Comprehensive English grammar training with AI technology. Interactive lessons and personalized practice to master grammar rules.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-grammar-module-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Grammar Module",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-200/50 dark:border-indigo-700/50">
      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {children}
      </span>
    </div>
  </div>
);

export default function GrammarModulePage() {
  const features = [
    {
      icon: "📚",
      title: "Structured Lessons",
      description: "Comprehensive grammar lessons from basic to advanced",
    },
    {
      icon: "🔍",
      title: "Error Analysis",
      description: "AI identifies and explains your grammar mistakes",
    },
    {
      icon: "🎯",
      title: "Targeted Practice",
      description: "Focus on your weak areas with personalized exercises",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your grammar improvement over time",
    },
    {
      icon: "🔄",
      title: "Interactive Exercises",
      description: "Engaging activities to reinforce grammar rules",
    },
    {
      icon: "⚡",
      title: "Instant Feedback",
      description: "Get immediate explanations for every exercise",
    },
  ];

  const grammarTopics = [
    {
      category: "Basic Grammar",
      description: "Fundamental grammar concepts",
      level: "A1-A2",
      topics: [
        "Present Simple",
        "Present Continuous",
        "Past Simple",
        "Articles (a, an, the)",
        "Plural Forms",
        "Basic Question Forms",
      ],
    },
    {
      category: "Intermediate Grammar",
      description: "Complex grammar structures",
      level: "B1-B2",
      topics: [
        "Present Perfect",
        "Past Perfect",
        "Future Tenses",
        "Conditional Sentences",
        "Passive Voice",
        "Reported Speech",
      ],
    },
    {
      category: "Advanced Grammar",
      description: "Sophisticated grammar patterns",
      level: "C1-C2",
      topics: [
        "Mixed Conditionals",
        "Subjunctive Mood",
        "Inversion",
        "Cleft Sentences",
        "Advanced Modals",
        "Complex Sentence Structures",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/en/modules/grammar" language="en" />

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
          <span>Grammar Module</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI-Powered Grammar Training</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            English Grammar Module
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master English grammar with structured lessons and personalized
            practice. AI analyzes your mistakes and provides targeted exercises
            to strengthen your weaknesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3"
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
              Grammar Module Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools for mastering English grammar
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
            <h2 className="text-3xl md:text-4xl font-bold">Grammar Topics</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive grammar curriculum for all levels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {grammarTopics.map((category, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{category.level}</Badge>
                    <span className="text-2xl">📖</span>
                  </div>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Topics:</h4>
                    <div className="space-y-1">
                      {category.topics.map((topic, topicIndex) => (
                        <div
                          key={topicIndex}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {topic}
                        </div>
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
              Effective grammar learning process in 4 steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn Rules</h3>
              <p className="text-muted-foreground text-sm">
                Study grammar rules with clear explanations and examples
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Practice Exercises</h3>
              <p className="text-muted-foreground text-sm">
                Complete interactive exercises to apply grammar rules
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Feedback</h3>
              <p className="text-muted-foreground text-sm">
                Receive instant feedback and explanations for your answers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Master & Apply</h3>
              <p className="text-muted-foreground text-sm">
                Use learned grammar in real writing and speaking contexts
              </p>
            </div>
          </div>
        </section>

        {/* Learning Approach */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Learning Approach
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our methodology for effective grammar acquisition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pattern Recognition</h3>
                  <p className="text-muted-foreground text-sm">
                    Learn to identify grammar patterns in natural language
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contextual Learning</h3>
                  <p className="text-muted-foreground text-sm">
                    Practice grammar rules in meaningful contexts and situations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Error Correction</h3>
                  <p className="text-muted-foreground text-sm">
                    AI analyzes your mistakes and provides targeted corrections
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Progressive Difficulty</h3>
                  <p className="text-muted-foreground text-sm">
                    Exercises adapt to your skill level and gradually increase
                    complexity
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-2xl font-bold">Master Grammar Today</h3>
                <p className="text-muted-foreground">
                  Join thousands of learners perfecting their English grammar
                </p>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700"
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
                Ready to Perfect Your Grammar?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Start with our AI-powered grammar module and experience
                structured learning with personalized feedback and targeted
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
