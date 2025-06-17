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
  title: "English Writing Module - AI-Powered Writing Training | Fluenta",
  description:
    "Improve your English writing skills with Fluenta's AI-powered writing module. Get grammar analysis, style suggestions, and personalized feedback to write perfect texts.",
  keywords:
    "English writing, writing skills, AI writing training, English composition, grammar analysis, writing practice, English essay, writing feedback",
  alternates: {
    canonical: "/en/modules/writing",
    languages: {
      en: "/en/modules/writing",
      tr: "/moduller/yazma",
    },
  },
  openGraph: {
    title: "English Writing Module - AI-Powered Writing Training | Fluenta",
    description:
      "Personalized English writing training with AI technology. Grammar, style, and content analysis to take your writing skills to professional level.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-writing-module-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Writing Module",
      },
    ],
  },
};

const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200/50 dark:border-green-700/50">
      <span className="text-sm font-medium text-green-700 dark:text-green-300">
        {children}
      </span>
    </div>
  </div>
);

export default function WritingModulePage() {
  const features = [
    {
      icon: "🤖",
      title: "AI Writing Assistant",
      description: "Get real-time grammar, style, and content suggestions",
    },
    {
      icon: "📝",
      title: "Diverse Writing Types",
      description: "Essays, emails, reports, stories, and more",
    },
    {
      icon: "🎯",
      title: "Goal-Oriented Practice",
      description: "Special preparation for IELTS, TOEFL, and academic writing",
    },
    {
      icon: "📊",
      title: "Detailed Analysis",
      description:
        "Grammar, vocabulary choice, and sentence structure analysis",
    },
    {
      icon: "🔄",
      title: "Version Comparison",
      description: "Track your writing improvement step by step",
    },
    {
      icon: "⚡",
      title: "Instant Correction",
      description: "Detect and correct errors as you write",
    },
  ];

  const writingTypes = [
    {
      type: "Academic Writing",
      description: "Essays, research papers, and academic reports",
      topics: [
        "Argumentative Essay",
        "Research Paper",
        "Literature Review",
        "Case Study",
      ],
      level: "B2-C2",
    },
    {
      type: "Business English",
      description: "Professional emails, reports, and presentation writing",
      topics: [
        "Business Email",
        "Report Writing",
        "Proposal",
        "Meeting Minutes",
      ],
      level: "B1-C1",
    },
    {
      type: "Creative Writing",
      description: "Blog posts, personal letters, and creative content",
      topics: ["Blog Post", "Personal Letter", "Story Writing", "Social Media"],
      level: "A2-B2",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/en/modules/writing" language="en" />

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
          <span>Writing Module</span>
        </nav>

        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>AI-Powered Writing Training</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            English Writing Module
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Take your English writing skills to professional level with AI
            writing assistant. Get instant feedback on grammar, style, and
            content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
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
              Writing Module Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Systematically improve your writing skills with AI-powered tools
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
            <h2 className="text-3xl md:text-4xl font-bold">Writing Types</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Writing practice tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {writingTypes.map((type, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{type.level}</Badge>
                    <span className="text-2xl">✍️</span>
                  </div>
                  <CardTitle>{type.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Practice Topics:</h4>
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
              Effective writing learning process in 4 steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Topic</h3>
              <p className="text-muted-foreground text-sm">
                Select from various writing prompts or create your own topic
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Write & Get Help</h3>
              <p className="text-muted-foreground text-sm">
                Write with real-time AI assistance and suggestions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Receive detailed feedback on grammar, style, and content
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Improve & Repeat</h3>
              <p className="text-muted-foreground text-sm">
                Apply suggestions and track your writing improvement
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Our Writing Module?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced features that make writing learning effective and
              enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real-time Feedback</h3>
                  <p className="text-muted-foreground text-sm">
                    Get instant suggestions as you write, improving your skills
                    in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Personalized Learning</h3>
                  <p className="text-muted-foreground text-sm">
                    AI adapts to your writing style and provides targeted
                    improvements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Progress Tracking</h3>
                  <p className="text-muted-foreground text-sm">
                    Monitor your writing improvement with detailed analytics and
                    reports
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Multiple Formats</h3>
                  <p className="text-muted-foreground text-sm">
                    Practice with essays, emails, reports, and creative writing
                    formats
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">✍️</div>
                <h3 className="text-2xl font-bold">Start Writing Today</h3>
                <p className="text-muted-foreground">
                  Join thousands of learners improving their English writing
                  skills
                </p>
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
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
                Ready to Improve Your Writing Skills?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Start with our AI-powered writing module and experience
                personalized learning that adapts to your writing style and
                goals.
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
