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
  title: "English Listening Module - AI-Powered Listening Training | Fluenta",
  description:
    "Improve your English listening skills with Fluenta's AI-powered listening module. Practice with diverse audio content, interactive exercises, and real-time feedback.",
  keywords:
    "English listening, listening skills, AI listening training, English comprehension, audio practice, listening exercises, pronunciation training, conversation practice",
  alternates: {
    canonical: "/en/modules/listening",
    languages: {
      en: "/en/modules/listening",
      tr: "/moduller/dinleme",
    },
  },
  openGraph: {
    title: "English Listening Module - AI-Powered Listening Training | Fluenta",
    description:
      "Personalized English listening training with AI technology. Diverse audio content and interactive exercises to improve your listening comprehension.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-listening-module-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Listening Module",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50">
      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
        {children}
      </span>
    </div>
  </div>
);

export default function ListeningModulePage() {
  const features = [
    {
      icon: "🎧",
      title: "Diverse Audio Content",
      description: "Podcasts, news, conversations, and academic lectures",
    },
    {
      icon: "🎯",
      title: "Adaptive Difficulty",
      description: "Content automatically adjusts to your listening level",
    },
    {
      icon: "📝",
      title: "Interactive Exercises",
      description: "Comprehension questions and fill-in-the-blank activities",
    },
    {
      icon: "🔄",
      title: "Repeat & Review",
      description: "Loop difficult sections and review transcripts",
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      description: "Track your listening improvement over time",
    },
    {
      icon: "🌍",
      title: "Multiple Accents",
      description: "Practice with American, British, Australian, and more",
    },
  ];

  const contentTypes = [
    {
      type: "Conversations",
      description: "Real-life dialogues and everyday conversations",
      topics: ["Shopping", "Travel", "Work", "Social"],
      level: "A1-B2",
    },
    {
      type: "News & Media",
      description: "Current events and news broadcasts",
      topics: ["Politics", "Technology", "Sports", "Culture"],
      level: "B1-C2",
    },
    {
      type: "Academic Content",
      description: "University lectures and educational material",
      topics: ["Science", "History", "Literature", "Business"],
      level: "B2-C2",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/en/modules/listening" language="en" />

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
          <span>Listening Module</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI-Powered Listening Training</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            English Listening Module
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sharpen your English listening skills with diverse audio content and
            interactive exercises. Practice understanding native speakers in
            various contexts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
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
              Listening Module Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Systematically improve your listening skills with AI-powered tools
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
            <h2 className="text-3xl md:text-4xl font-bold">Content Types</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Practice with various audio formats and topics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contentTypes.map((type, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{type.level}</Badge>
                    <span className="text-2xl">🎧</span>
                  </div>
                  <CardTitle>{type.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Topics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {type.topics.map((topic, topicIndex) => (
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
              Effective listening learning process in 4 steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Content</h3>
              <p className="text-muted-foreground text-sm">
                Select from conversations, news, podcasts, or academic content
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Listen & Learn</h3>
              <p className="text-muted-foreground text-sm">
                Listen to audio with optional subtitles and vocabulary support
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Practice Exercises</h3>
              <p className="text-muted-foreground text-sm">
                Complete comprehension questions and interactive activities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Review & Repeat</h3>
              <p className="text-muted-foreground text-sm">
                Review difficult sections and track your progress
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Our Listening Module?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced features that make listening learning effective and
              enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Natural Speech Patterns
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Learn to understand natural speech with contractions,
                    idioms, and colloquialisms
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Accent Training</h3>
                  <p className="text-muted-foreground text-sm">
                    Practice with multiple English accents to improve global
                    comprehension
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Interactive Transcripts
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Click on words for instant definitions and pronunciation
                    guides
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Speed Control</h3>
                  <p className="text-muted-foreground text-sm">
                    Adjust playback speed to match your current listening level
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🎧</div>
                <h3 className="text-2xl font-bold">Start Listening Today</h3>
                <p className="text-muted-foreground">
                  Join thousands of learners improving their English listening
                  skills
                </p>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
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
                Ready to Improve Your Listening Skills?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Start with our AI-powered listening module and experience
                personalized learning with diverse audio content and interactive
                exercises.
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
