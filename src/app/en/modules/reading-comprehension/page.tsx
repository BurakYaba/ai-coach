import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Reading Comprehension - AI-Powered English Reading Skills | Fluenta",
  description:
    "Improve your English reading comprehension with AI-powered analysis, speed reading techniques, and comprehension strategies. Master academic and professional texts.",
  keywords:
    "English reading comprehension, reading skills, speed reading, reading strategies, text analysis, academic reading, reading improvement, comprehension techniques",
  openGraph: {
    title:
      "Reading Comprehension - AI-Powered English Reading Skills | Fluenta",
    description:
      "Master English reading comprehension with AI-powered analysis and personalized practice for academic and professional success.",
    type: "website",
    images: [
      {
        url: "/og-images/og-reading-comprehension.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Reading Comprehension",
      },
    ],
  },
};

export default function ReadingComprehensionPage() {
  const readingFeatures = [
    {
      title: "Text Analysis & Insights",
      description:
        "AI breaks down complex texts, identifying key themes, arguments, and vocabulary",
      icon: "🔍",
      benefits: [
        "Text structure analysis",
        "Key concept identification",
        "Vocabulary highlighting",
      ],
    },
    {
      title: "Adaptive Reading Levels",
      description:
        "Personalized content selection matching your current reading proficiency",
      icon: "📊",
      benefits: [
        "Progressive difficulty",
        "Level-appropriate texts",
        "Skill-based progression",
      ],
    },
    {
      title: "Speed Reading Training",
      description:
        "Develop faster reading speeds while maintaining comprehension accuracy",
      icon: "⚡",
      benefits: [
        "Speed tracking",
        "Comprehension testing",
        "Efficiency metrics",
      ],
    },
    {
      title: "Interactive Exercises",
      description:
        "Engaging activities to test understanding and reinforce learning",
      icon: "🎯",
      benefits: [
        "Multiple question types",
        "Instant feedback",
        "Progress tracking",
      ],
    },
  ];

  const readingTypes = [
    {
      type: "Academic Reading",
      description:
        "Research papers, textbooks, scholarly articles, and academic materials",
      skills: [
        "Critical analysis",
        "Research comprehension",
        "Academic vocabulary",
        "Citation understanding",
      ],
      icon: "🎓",
    },
    {
      type: "Business Reading",
      description: "Reports, emails, proposals, and professional documentation",
      skills: [
        "Executive summaries",
        "Data interpretation",
        "Professional context",
        "Strategic thinking",
      ],
      icon: "💼",
    },
    {
      type: "News & Media",
      description:
        "Current events, journalism, opinion pieces, and media analysis",
      skills: [
        "Fact vs opinion",
        "Bias detection",
        "Current affairs",
        "Media literacy",
      ],
      icon: "📰",
    },
    {
      type: "Literature & Fiction",
      description:
        "Novels, short stories, poetry, and creative writing analysis",
      skills: [
        "Literary devices",
        "Character analysis",
        "Theme identification",
        "Cultural context",
      ],
      icon: "📚",
    },
  ];

  const comprehensionStrategies = [
    {
      strategy: "Skimming & Scanning",
      description:
        "Quickly identify main ideas and locate specific information",
      effectiveness: "40% faster",
      techniques: [
        "Topic sentences",
        "Keywords",
        "Text structure",
        "Headlines",
      ],
    },
    {
      strategy: "Active Reading",
      description: "Engage with text through questioning and annotation",
      effectiveness: "60% better retention",
      techniques: ["Prediction", "Questioning", "Summarizing", "Connecting"],
    },
    {
      strategy: "Inference Making",
      description: "Read between the lines to understand implicit meanings",
      effectiveness: "50% deeper understanding",
      techniques: [
        "Context clues",
        "Prior knowledge",
        "Text evidence",
        "Logical reasoning",
      ],
    },
    {
      strategy: "Critical Analysis",
      description: "Evaluate arguments, evidence, and author perspectives",
      effectiveness: "70% better analysis",
      techniques: [
        "Argument mapping",
        "Evidence evaluation",
        "Bias recognition",
        "Source credibility",
      ],
    },
  ];

  const readingLevels = [
    {
      level: "Beginner",
      wpm: "150-200",
      texts: "Simple articles, basic news",
      skills: "Main ideas, basic vocabulary",
    },
    {
      level: "Intermediate",
      wpm: "200-250",
      texts: "Academic articles, business reports",
      skills: "Inference, complex ideas",
    },
    {
      level: "Advanced",
      wpm: "250-300+",
      texts: "Research papers, literature",
      skills: "Critical analysis, nuanced understanding",
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
                <Button size="sm">Improve Reading</Button>
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
          <span>Reading Comprehension</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">📖 Reading</Badge>
            <Badge variant="outline">AI Analysis</Badge>
            <Badge variant="outline">Comprehension</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master English Reading Comprehension with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Develop advanced reading skills with AI-powered text analysis,
            personalized practice, and proven comprehension strategies for
            academic and professional success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Reading Better
              </Button>
            </Link>
            <Link href="/blog/vocabulary-building-strategies-2025">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Reading Strategies
              </Button>
            </Link>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Advanced Reading Comprehension Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {readingFeatures.map((feature, index) => (
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

        {/* Reading Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Specialized Reading Practice
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {readingTypes.map((type, index) => (
              <Card key={index} className="border-l-4 border-l-primary h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    {type.type}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {type.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {type.skills.map((skill, i) => (
                      <div
                        key={i}
                        className="bg-muted/50 p-2 rounded-lg text-center"
                      >
                        <span className="text-xs font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Reading Strategies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Proven Reading Comprehension Strategies
          </h2>
          <div className="grid gap-6">
            {comprehensionStrategies.map((strategy, index) => (
              <Card key={index} className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {strategy.strategy}
                    </CardTitle>
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                      {strategy.effectiveness}
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {strategy.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-3">
                    {strategy.techniques.map((technique, i) => (
                      <div
                        key={i}
                        className="bg-muted/50 p-3 rounded-lg text-center"
                      >
                        <span className="text-sm font-medium">{technique}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Reading Levels */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Reading Proficiency Levels
          </h2>
          <div className="grid gap-6">
            {readingLevels.map((level, index) => (
              <GradientCard key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{level.level}</CardTitle>
                    <Badge variant="outline">{level.wpm} words/min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-primary">Text Types:</strong>
                      <p className="text-muted-foreground mt-1">
                        {level.texts}
                      </p>
                    </div>
                    <div>
                      <strong className="text-primary">Key Skills:</strong>
                      <p className="text-muted-foreground mt-1">
                        {level.skills}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Interactive Reading Sample */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Try Interactive Reading Analysis
          </h2>
          <GradientCard className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Sample Reading Exercise</CardTitle>
              <p className="text-muted-foreground">
                Experience AI-powered reading comprehension analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-background p-6 rounded-lg border">
                  <h4 className="font-semibold mb-4 text-primary">
                    Sample Text: "The Future of Remote Work"
                  </h4>
                  <p className="text-sm leading-relaxed mb-4">
                    The pandemic has fundamentally transformed the landscape of
                    work, accelerating a shift toward remote employment that was
                    already gaining momentum.{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                      Companies worldwide
                    </span>{" "}
                    have discovered that productivity can remain high—or even
                    improve—when employees work from home. However, this
                    transition presents both{" "}
                    <span className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">
                      opportunities and challenges
                    </span>{" "}
                    that organizations must carefully navigate.
                  </p>
                  <p className="text-sm leading-relaxed">
                    While remote work offers flexibility and reduced commuting
                    stress, it also raises concerns about team collaboration and
                    company culture.{" "}
                    <span className="bg-green-100 dark:bg-green-900/30 px-1 rounded">
                      Forward-thinking organizations
                    </span>{" "}
                    are now developing hybrid models that combine the benefits
                    of both remote and in-person work.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Comprehension Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">
                          1. What is the main idea of this passage?
                        </p>
                        <div className="space-y-2 text-xs">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="q1"
                              className="text-primary"
                            />
                            <span>
                              Remote work is always better than office work
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="q1"
                              className="text-primary"
                              defaultChecked
                            />
                            <span>
                              The pandemic changed work patterns with both
                              benefits and challenges
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="q1"
                              className="text-primary"
                            />
                            <span>
                              Companies should eliminate all remote work
                            </span>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-3">
                      <div>
                        <strong className="text-primary">
                          Key Vocabulary:
                        </strong>
                        <p>transformed, accelerating, momentum, navigate</p>
                      </div>
                      <div>
                        <strong className="text-primary">
                          Text Structure:
                        </strong>
                        <p>Problem-solution with balanced perspective</p>
                      </div>
                      <div>
                        <strong className="text-primary">Author's Tone:</strong>
                        <p>Objective, analytical, balanced</p>
                      </div>
                      <div>
                        <strong className="text-primary">Reading Level:</strong>
                        <p>Intermediate (B2)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Link href="/register">
                    <Button size="lg">Try Full Reading Course</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* Reading Progress Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Track Your Reading Progress
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">250</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Words Per Minute
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Average reading speed improvement after 8 weeks
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">85%</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comprehension Rate
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Accuracy on comprehension questions and exercises
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">50+</CardTitle>
                <p className="text-sm text-muted-foreground">Text Types</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Different genres and difficulty levels available
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">92%</CardTitle>
                <p className="text-sm text-muted-foreground">Student Success</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Learners who improve reading skills within 12 weeks
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Reading Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    C
                  </div>
                  <div>
                    <h4 className="font-semibold">Carlos Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">MBA Student</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "My reading speed doubled from 120 to 250 WPM while
                  maintaining 90% comprehension. The case study analysis skills
                  helped me excel in business school."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Speed doubled
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    N
                  </div>
                  <div>
                    <h4 className="font-semibold">Nana Asante</h4>
                    <p className="text-sm text-muted-foreground">
                      Research Scientist
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The academic reading module was a game-changer. I can now
                  efficiently process research papers and extract key findings
                  for my literature reviews."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    Research efficiency
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    T
                  </div>
                  <div>
                    <h4 className="font-semibold">Takeshi Yamamoto</h4>
                    <p className="text-sm text-muted-foreground">
                      IELTS Candidate
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The reading strategies and practice tests boosted my IELTS
                  reading score from 6.5 to 8.5. The inference training was
                  particularly helpful."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    IELTS 8.5 achieved
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
              Unlock Your Reading Potential
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who've mastered English reading
              comprehension with AI-powered analysis and proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Reading Journey
                </Button>
              </Link>
              <Link href="/modules">
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
