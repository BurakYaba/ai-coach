import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Writing Assistant - AI-Powered English Writing Coach | Fluenta",
  description:
    "Improve your English writing with AI-powered feedback on grammar, style, clarity, and structure. Perfect for essays, emails, reports, and creative writing.",
  keywords:
    "English writing assistant, writing coach, essay writing, grammar checker, style improvement, writing feedback, academic writing, business writing, AI writing help",
  openGraph: {
    title: "Writing Assistant - AI-Powered English Writing Coach | Fluenta",
    description:
      "Enhance your English writing skills with AI-powered feedback on grammar, style, and structure for academic and professional success.",
    type: "website",
    images: [
      {
        url: "/og-images/og-writing-assistant.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Writing Assistant",
      },
    ],
  },
};

export default function WritingAssistantPage() {
  const writingFeatures = [
    {
      title: "Grammar & Syntax Check",
      description:
        "Advanced AI identifies and corrects grammar errors, punctuation, and sentence structure issues",
      icon: "✏️",
      benefits: [
        "Real-time error detection",
        "Contextual corrections",
        "Learning explanations",
      ],
    },
    {
      title: "Style Enhancement",
      description:
        "Improve clarity, conciseness, and readability of your writing with intelligent suggestions",
      icon: "✨",
      benefits: [
        "Clarity improvements",
        "Tone adjustments",
        "Readability scoring",
      ],
    },
    {
      title: "Structure Analysis",
      description:
        "Get feedback on essay organization, paragraph flow, and logical progression",
      icon: "🏗️",
      benefits: [
        "Essay structure",
        "Coherence analysis",
        "Transition suggestions",
      ],
    },
    {
      title: "Plagiarism Detection",
      description:
        "Ensure originality with comprehensive plagiarism checking and citation help",
      icon: "🔍",
      benefits: [
        "Originality verification",
        "Citation guidance",
        "Source identification",
      ],
    },
  ];

  const writingTypes = [
    {
      type: "Academic Writing",
      description:
        "Essays, research papers, dissertations, and academic reports",
      features: [
        "Citation checking",
        "Academic tone",
        "Argument structure",
        "Research integration",
      ],
      color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    },
    {
      type: "Business Writing",
      description:
        "Emails, proposals, reports, and professional communications",
      features: [
        "Professional tone",
        "Clear messaging",
        "Persuasive structure",
        "Executive summaries",
      ],
      color:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    },
    {
      type: "Creative Writing",
      description: "Stories, blogs, personal essays, and creative content",
      features: [
        "Voice development",
        "Narrative flow",
        "Creative language",
        "Character consistency",
      ],
      color:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    },
    {
      type: "Test Preparation",
      description: "IELTS, TOEFL, SAT, and standardized test writing tasks",
      features: [
        "Test format training",
        "Time management",
        "Scoring criteria",
        "Practice prompts",
      ],
      color:
        "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    },
  ];

  const writingSteps = [
    {
      step: "Draft Analysis",
      description: "AI analyzes your writing for grammar, style, and structure",
      icon: "📊",
    },
    {
      step: "Instant Feedback",
      description:
        "Get detailed suggestions with explanations for each improvement",
      icon: "💡",
    },
    {
      step: "Guided Revision",
      description: "Follow step-by-step guidance to implement improvements",
      icon: "🔄",
    },
    {
      step: "Final Polish",
      description:
        "Ensure your writing meets the highest standards before submission",
      icon: "✅",
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
                <Button size="sm">Improve Writing</Button>
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
          <span>Writing Assistant</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">✍️ Writing</Badge>
            <Badge variant="outline">AI-Powered</Badge>
            <Badge variant="outline">Real-time Feedback</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transform Your English Writing with AI Coaching
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get instant feedback on grammar, style, and structure. Improve your
            academic, business, and creative writing with personalized AI
            coaching that adapts to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Writing Better
              </Button>
            </Link>
            <Link href="/blog/english-grammar-mistakes-avoid">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Writing Tips Guide
              </Button>
            </Link>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Writing Enhancement Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {writingFeatures.map((feature, index) => (
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

        {/* Writing Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Specialized Writing Support
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {writingTypes.map((type, index) => (
              <Card key={index} className="border-l-4 border-l-primary h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{type.type}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${type.color}`}
                    >
                      Specialized
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {type.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {type.features.map((feature, i) => (
                      <div
                        key={i}
                        className="bg-muted/50 p-2 rounded-lg text-center"
                      >
                        <span className="text-xs font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Writing Assistant Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {writingSteps.map((step, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.step}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Writing Sample Analysis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            See AI Writing Analysis in Action
          </h2>
          <GradientCard className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Sample Writing Analysis</CardTitle>
              <p className="text-muted-foreground">
                Watch how our AI improves a real writing sample
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                    Original Draft:
                  </h4>
                  <p className="text-sm">
                    "The climate change is a very important issue that effects
                    everyone in the world. There is many reasons why we should
                    do something about it. First, the temperature is rising and
                    this causes problems. Also, the ice caps are melting which
                    is bad."
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                      Grammar Issues:
                    </h5>
                    <ul className="space-y-1">
                      <li>• "The climate change" → "Climate change"</li>
                      <li>• "effects" → "affects"</li>
                      <li>• "There is many" → "There are many"</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Style Improvements:
                    </h5>
                    <ul className="space-y-1">
                      <li>• More specific language</li>
                      <li>• Stronger transitions</li>
                      <li>• Varied sentence structure</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                    <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">
                      Structure Notes:
                    </h5>
                    <ul className="space-y-1">
                      <li>• Add thesis statement</li>
                      <li>• Expand evidence</li>
                      <li>• Improve conclusion</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                    AI-Improved Version:
                  </h4>
                  <p className="text-sm">
                    "Climate change represents one of the most pressing
                    challenges affecting global communities today. Multiple
                    compelling factors demonstrate why immediate action is
                    essential. Primarily, rising global temperatures are
                    disrupting weather patterns and agricultural systems
                    worldwide. Furthermore, accelerating ice cap melting
                    threatens coastal communities and marine ecosystems."
                  </p>
                </div>

                <div className="text-center">
                  <Link href="/register">
                    <Button size="lg">Try Writing Assistant</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* Writing Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Track Your Writing Progress
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">95%</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Grammar Accuracy
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Average improvement in grammar scores after 4 weeks
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">8.5/10</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Readability Score
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Target readability for academic and professional writing
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">73%</CardTitle>
                <p className="text-sm text-muted-foreground">Faster Writing</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Reduction in revision time with AI assistance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">4.8★</CardTitle>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Average satisfaction rating from students and professionals
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Writing Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    E
                  </div>
                  <div>
                    <h4 className="font-semibold">Emma Thompson</h4>
                    <p className="text-sm text-muted-foreground">PhD Student</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Writing Assistant transformed my dissertation writing. The
                  structure analysis helped me organize complex arguments, and
                  my advisor was impressed with the clarity."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Academic excellence
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    J
                  </div>
                  <div>
                    <h4 className="font-semibold">James Wilson</h4>
                    <p className="text-sm text-muted-foreground">
                      Marketing Manager
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "My business proposals are now more persuasive and
                  professional. The AI feedback helped me develop a clearer,
                  more confident writing voice."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    Career advancement
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Maya Patel</h4>
                    <p className="text-sm text-muted-foreground">
                      IELTS Test Taker
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "I improved my IELTS writing score from 6.0 to 8.0 in just 8
                  weeks. The test-specific feedback was incredibly valuable for
                  exam preparation."
                </p>
                <div className="mt-4">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    IELTS 8.0 achieved
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
              Elevate Your Writing Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students and professionals who've transformed
              their English writing with AI-powered feedback and coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Writing Better
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
