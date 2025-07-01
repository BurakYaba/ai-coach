import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title:
    "Vocabulary Builder - AI-Powered English Vocabulary Learning | Fluenta",
  description:
    "Expand your English vocabulary with AI-powered spaced repetition, contextual learning, and personalized word lists. Master 10,000+ words efficiently.",
  keywords:
    "English vocabulary builder, vocabulary learning, spaced repetition, word learning, vocabulary app, English words, vocabulary practice, vocabulary expansion",
  openGraph: {
    title:
      "Vocabulary Builder - AI-Powered English Vocabulary Learning | Fluenta",
    description:
      "Master English vocabulary with AI-powered spaced repetition and contextual learning for rapid vocabulary expansion.",
    type: "website",
    images: [
      {
        url: "/og-images/og-vocabulary-builder.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Vocabulary Builder",
      },
    ],
  },
};

export default function VocabularyBuilderPage() {
  const vocabularyFeatures = [
    {
      title: "Smart Spaced Repetition",
      description:
        "AI optimizes review timing for maximum retention and minimal time investment",
      icon: "🧠",
      benefits: [
        "95% retention rate",
        "Optimal review scheduling",
        "Long-term memory formation",
      ],
    },
    {
      title: "Contextual Learning",
      description:
        "Learn words in real contexts from news, books, and conversations",
      icon: "📖",
      benefits: [
        "Natural usage patterns",
        "Better comprehension",
        "Practical application",
      ],
    },
    {
      title: "Visual Memory Aids",
      description:
        "Images, mnemonics, and visual associations enhance word retention",
      icon: "🎨",
      benefits: [
        "Visual memory triggers",
        "Creative associations",
        "Faster recall",
      ],
    },
    {
      title: "Personalized Word Lists",
      description: "AI selects words based on your goals, level, and interests",
      icon: "🎯",
      benefits: [
        "Relevant vocabulary",
        "Goal-oriented learning",
        "Efficient progression",
      ],
    },
  ];

  const vocabularyLevels = [
    {
      level: "Foundation",
      range: "1,000-2,000 words",
      description: "Essential high-frequency words for basic communication",
      color:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      features: [
        "Daily life vocabulary",
        "Basic verbs & nouns",
        "Common phrases",
        "Survival English",
      ],
    },
    {
      level: "Intermediate",
      range: "3,000-5,000 words",
      description:
        "Academic and professional vocabulary for advanced communication",
      color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      features: [
        "Academic words",
        "Business terms",
        "Complex concepts",
        "Formal writing",
      ],
    },
    {
      level: "Advanced",
      range: "6,000-10,000+ words",
      description: "Sophisticated vocabulary for native-like proficiency",
      color:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      features: [
        "Literary language",
        "Specialized terms",
        "Idiomatic expressions",
        "Nuanced meanings",
      ],
    },
  ];

  const studyMethods = [
    {
      method: "Active Recall",
      description:
        "Test yourself before looking at answers to strengthen memory",
      effectiveness: "95%",
    },
    {
      method: "Contextual Practice",
      description: "Use new words in sentences and real-life situations",
      effectiveness: "88%",
    },
    {
      method: "Visual Association",
      description: "Connect words with images and mental pictures",
      effectiveness: "82%",
    },
    {
      method: "Word Families",
      description: "Learn related words and morphological patterns together",
      effectiveness: "79%",
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
                href="/en/modules"
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
                <Button size="sm">Build Vocabulary</Button>
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
          <Link href="/en/modules" className="hover:text-primary">
            Modules
          </Link>
          <span>›</span>
          <span>Vocabulary Builder</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">📚 Vocabulary</Badge>
            <Badge variant="outline">Spaced Repetition</Badge>
            <Badge variant="outline">AI-Powered</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build Your English Vocabulary Systematically
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Master 10,000+ English words with scientifically-proven spaced
            repetition and contextual learning. Build vocabulary that sticks for
            life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Building Vocabulary
              </Button>
            </Link>
            <Link href="/en/blog/vocabulary-building-strategies-2025">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Learning Strategies
              </Button>
            </Link>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Smart Vocabulary Learning Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {vocabularyFeatures.map((feature, index) => (
              <GradientCard key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Vocabulary Levels */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vocabulary Learning Levels
          </h2>
          <div className="grid gap-8">
            {vocabularyLevels.map((level, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{level.level}</CardTitle>
                      <p className="text-muted-foreground">
                        {level.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}
                    >
                      {level.range}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {level.features.map((feature, i) => (
                      <div
                        key={i}
                        className="bg-muted/50 p-3 rounded-lg text-center"
                      >
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Study Methods */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Scientifically-Proven Learning Methods
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {studyMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{method.method}</CardTitle>
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                      {method.effectiveness}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Vocabulary Builder Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <CardTitle className="text-lg">Level Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Take a vocabulary test to determine your current level and
                  learning goals.
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
                  AI creates a custom word list and study schedule based on your
                  needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <CardTitle className="text-lg">Daily Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn new words and review previous ones using spaced
                  repetition.
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
                  Monitor your vocabulary growth and retention with detailed
                  analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sample Words */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Experience Interactive Word Learning
          </h2>
          <GradientCard className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Sample Vocabulary Cards</CardTitle>
              <p className="text-muted-foreground">
                See how our AI presents words with context and memory aids
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background p-6 rounded-lg border">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      Serendipity
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      /ˌserənˈdɪpəti/ • noun
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-primary">Definition:</strong>
                      <p className="text-sm">
                        A pleasant surprise; finding something good by accident
                      </p>
                    </div>
                    <div>
                      <strong className="text-primary">Example:</strong>
                      <p className="text-sm italic">
                        "Meeting my best friend at the coffee shop was pure
                        serendipity."
                      </p>
                    </div>
                    <div>
                      <strong className="text-primary">Memory Aid:</strong>
                      <p className="text-sm">
                        Think "serene" + "dipity" = peaceful discovery
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-6 rounded-lg border">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      Ubiquitous
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      /juˈbɪkwətəs/ • adjective
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-primary">Definition:</strong>
                      <p className="text-sm">
                        Present everywhere; seeming to be in all places at once
                      </p>
                    </div>
                    <div>
                      <strong className="text-primary">Example:</strong>
                      <p className="text-sm italic">
                        "Smartphones have become ubiquitous in modern society."
                      </p>
                    </div>
                    <div>
                      <strong className="text-primary">Memory Aid:</strong>
                      <p className="text-sm">
                        Latin "ubique" = everywhere + "ous" = full of
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <Link href="/register">
                  <Button size="lg">Try Full Vocabulary Builder</Button>
                </Link>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vocabulary Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Anna Martinez</h4>
                    <p className="text-sm text-muted-foreground">
                      Graduate Student
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "I expanded my vocabulary from 3,000 to 8,000 words in 6
                  months. The spaced repetition system made learning effortless
                  and fun."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    5,000 words learned
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    D
                  </div>
                  <div>
                    <h4 className="font-semibold">David Kim</h4>
                    <p className="text-sm text-muted-foreground">
                      Software Engineer
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The contextual learning approach helped me understand how
                  words are really used. My reading comprehension improved
                  dramatically."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Reading level advanced
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div>
                    <h4 className="font-semibold">Priya Patel</h4>
                    <p className="text-sm text-muted-foreground">
                      Business Analyst
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The visual memory aids made difficult words stick. I can now
                  express myself more precisely in professional settings."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    Professional vocabulary
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
              Build Your Vocabulary Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners using AI-powered spaced repetition to
              build comprehensive English vocabulary efficiently and
              effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Building Now
                </Button>
              </Link>
              <Link href="/en/modules">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Explore All Modules
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
