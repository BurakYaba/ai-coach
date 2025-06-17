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
  title: "English Reading Comprehension Module | Fluenta",
  description:
    "Improve your English reading comprehension skills with Fluenta's AI-powered reading module. Personalized texts, interactive questions, and vocabulary learning to enhance your level.",
  keywords:
    "English reading, reading comprehension, English text reading, AI reading training, English comprehension, reading skill development, English vocabulary learning, reading practice",
  alternates: {
    canonical: "/en/modules/reading-comprehension",
    languages: {
      en: "/en/modules/reading-comprehension",
      tr: "/moduller/okuma",
    },
  },
  openGraph: {
    title:
      "English Reading Module - AI-Powered Reading Comprehension Training | Fluenta",
    description:
      "Personalized English reading training with AI technology. Level-appropriate texts, comprehension questions, and vocabulary learning to improve your reading skills.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-reading-module-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Reading Module",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50">
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {children}
      </span>
    </div>
  </div>
);

export default function ReadingModulePage() {
  const features = [
    {
      icon: "🎯",
      title: "Personalized Content",
      description: "AI creates custom texts based on your level and interests",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Track your reading speed, comprehension rate, and vocabulary development",
    },
    {
      icon: "💡",
      title: "Smart Vocabulary Learning",
      description: "Learn new words from texts in context",
    },
    {
      icon: "🎮",
      title: "Interactive Questions",
      description: "Test your comprehension with interactive questions",
    },
    {
      icon: "📚",
      title: "Diverse Text Types",
      description: "News, stories, articles, and more text types",
    },
    {
      icon: "⚡",
      title: "Instant Feedback",
      description: "Get detailed explanations for your answers immediately",
    },
  ];

  const levels = [
    {
      level: "A1-A2",
      title: "Beginner",
      description: "Simple sentences and daily topics",
      topics: ["Family", "Hobbies", "Daily routines", "Shopping"],
    },
    {
      level: "B1-B2",
      title: "Intermediate",
      description: "More complex texts and topics",
      topics: ["News", "Travel", "Technology", "Culture"],
    },
    {
      level: "C1-C2",
      title: "Advanced",
      description: "Academic and professional texts",
      topics: ["Science", "Literature", "Business", "Philosophy"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/en/modules/reading" language="en" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/en" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <Link href="/en/modules" className="hover:text-primary">
            Modules
          </Link>
          <span>›</span>
          <span>Reading Module</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI-Powered Reading Training</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            English Reading Module
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience personalized reading with artificial intelligence
            technology. Improve your reading comprehension skills with
            level-appropriate texts and expand your vocabulary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
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

        {/* Features Section */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Reading Module Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Systematically improve your reading skills with AI-powered
              features
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

        {/* How It Works */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Effective reading learning process in 4 steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Level Assessment</h3>
              <p className="text-muted-foreground text-sm">
                AI analyzes your reading level and selects appropriate texts for
                you
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Text Reading</h3>
              <p className="text-muted-foreground text-sm">
                Read personalized texts with integrated vocabulary support
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Comprehension Test</h3>
              <p className="text-muted-foreground text-sm">
                Answer interactive questions to test your understanding
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Feedback & Progress
              </h3>
              <p className="text-muted-foreground text-sm">
                Get detailed feedback and track your improvement over time
              </p>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Reading Levels</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Content tailored to every proficiency level
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {levels.map((level, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <Badge variant="outline" className="w-fit mx-auto mb-2">
                    {level.level}
                  </Badge>
                  <CardTitle className="text-2xl">{level.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {level.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Sample Topics:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {level.topics.map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="secondary"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Our Reading Module?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced features that make reading learning effective and
              enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adaptive Learning</h3>
                  <p className="text-muted-foreground text-sm">
                    Content difficulty automatically adjusts based on your
                    performance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contextual Vocabulary</h3>
                  <p className="text-muted-foreground text-sm">
                    Learn new words naturally within reading contexts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Comprehensive Analytics
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Detailed insights into your reading speed and comprehension
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Diverse Content</h3>
                  <p className="text-muted-foreground text-sm">
                    From news articles to literature, practice with varied text
                    types
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-2xl font-bold">Start Reading Today</h3>
                <p className="text-muted-foreground">
                  Join thousands of learners improving their English reading
                  skills
                </p>
                <Link href="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
                Ready to Improve Your Reading Skills?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Start with our AI-powered reading module and experience
                personalized learning that adapts to your pace and interests.
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
