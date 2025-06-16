import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "English Learning Modules - AI-Powered Practice | Fluenta",
  description:
    "Explore Fluenta's comprehensive English learning modules. Practice speaking, pronunciation, grammar, vocabulary, writing, and reading with AI-powered feedback and personalized lessons.",
  keywords:
    "English learning modules, speaking practice, pronunciation training, grammar lessons, vocabulary builder, writing assistant, reading comprehension, AI English tutor",
  openGraph: {
    title: "English Learning Modules - AI-Powered Practice | Fluenta",
    description:
      "Master English with our comprehensive learning modules. AI-powered speaking, pronunciation, grammar, vocabulary, writing, and reading practice.",
    type: "website",
    images: [
      {
        url: "/og-images/og-modules.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Learning Modules",
      },
    ],
  },
};

export default function ModulesPage() {
  const modules = [
    {
      id: "speaking",
      title: "Speaking Practice",
      description:
        "Master English conversation with AI-powered speaking practice and real-time pronunciation feedback.",
      icon: "🗣️",
      features: [
        "AI Conversation Partners",
        "Pronunciation Analysis",
        "Real-world Scenarios",
        "Progress Tracking",
      ],
      href: "/modules/speaking",
      popular: true,
    },
    {
      id: "pronunciation",
      title: "Pronunciation Trainer",
      description:
        "Perfect your English pronunciation with phoneme-level feedback and accent training.",
      icon: "🎯",
      features: [
        "Phoneme Analysis",
        "Accent Training",
        "Word Stress Practice",
        "IPA Learning",
      ],
      href: "/modules/pronunciation-trainer",
      popular: false,
    },
    {
      id: "grammar",
      title: "Grammar Coach",
      description:
        "Master English grammar rules with interactive lessons and AI-powered error correction.",
      icon: "📝",
      features: [
        "Interactive Lessons",
        "Error Analysis",
        "Grammar Rules",
        "Practice Exercises",
      ],
      href: "/modules/grammar-coach",
      popular: false,
    },
    {
      id: "vocabulary",
      title: "Vocabulary Builder",
      description:
        "Expand your English vocabulary with spaced repetition and contextual learning.",
      icon: "📚",
      features: [
        "Spaced Repetition",
        "Contextual Learning",
        "Word Families",
        "Progress Tracking",
      ],
      href: "/modules/vocabulary-builder",
      popular: false,
    },
    {
      id: "writing",
      title: "Writing Assistant",
      description:
        "Improve your English writing with AI feedback on structure, style, and grammar.",
      icon: "✍️",
      features: [
        "Writing Analysis",
        "Style Suggestions",
        "Grammar Checking",
        "Essay Structure",
      ],
      href: "/modules/writing-assistant",
      popular: false,
    },
    {
      id: "reading",
      title: "Reading Comprehension",
      description:
        "Enhance reading skills with interactive texts and comprehension exercises.",
      icon: "📖",
      features: [
        "Interactive Texts",
        "Comprehension Questions",
        "Vocabulary Learning",
        "Speed Reading",
      ],
      href: "/modules/reading-comprehension",
      popular: false,
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
                href="/modules"
                className="text-sm font-medium text-primary"
              >
                Modules
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/testimonials"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Success Stories
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm">Start Learning Free</Button>
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
          <span>Learning Modules</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🚀 Learning Modules</Badge>
            <Badge variant="outline">AI-Powered</Badge>
            <Badge variant="outline">Personalized</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master English with AI-Powered Learning Modules
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose from our comprehensive collection of English learning
            modules. Each module uses advanced AI to provide personalized
            feedback and accelerate your progress.
          </p>
        </section>

        {/* Modules Grid */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map(module => (
              <div key={module.id}>
                {module.popular ? (
                  <GradientCard className="h-full group hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-3xl">{module.icon}</div>
                        <Badge className="bg-green-500">Most Popular</Badge>
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground/80 mb-4">
                        {module.description}
                      </p>
                      <div className="space-y-2 mb-6">
                        {module.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-green-400">✓</span>
                            <span className="text-muted-foreground/80">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link href={module.href}>
                        <Button className="w-full">Start Learning</Button>
                      </Link>
                    </CardContent>
                  </GradientCard>
                ) : (
                  <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-3xl">{module.icon}</div>
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {module.description}
                      </p>
                      <div className="space-y-2 mb-6">
                        {module.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={module.href}>
                        <Button variant="outline" className="w-full">
                          Explore Module
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your English Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who've improved their English with
              Fluenta's AI-powered modules. Start with any module that matches
              your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/blog/free-english-level-test">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Take Level Test First
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
