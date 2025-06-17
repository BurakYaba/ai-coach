import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title:
    "Pronunciation Trainer - AI-Powered English Pronunciation Practice | Fluenta",
  description:
    "Perfect your English pronunciation with AI-powered phoneme analysis, accent training, and real-time feedback. Master word stress, intonation, and IPA with personalized practice.",
  keywords:
    "English pronunciation trainer, pronunciation practice, phoneme analysis, accent training, IPA learning, word stress, intonation practice, pronunciation feedback, English pronunciation app",
  openGraph: {
    title:
      "Pronunciation Trainer - AI-Powered English Pronunciation Practice | Fluenta",
    description:
      "Master English pronunciation with AI-powered feedback, phoneme analysis, and personalized accent training.",
    type: "website",
    images: [
      {
        url: "/og-images/og-pronunciation-trainer.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Pronunciation Trainer",
      },
    ],
  },
};

export default function PronunciationTrainerPage() {
  const pronunciationFeatures = [
    {
      title: "Phoneme-Level Analysis",
      description:
        "Get detailed feedback on individual sounds with visual waveform analysis",
      icon: "🎵",
      benefits: [
        "Precise sound identification",
        "Visual feedback",
        "Error pattern detection",
      ],
    },
    {
      title: "Accent Training",
      description:
        "Choose your target accent and get specific coaching for American, British, or Australian English",
      icon: "🗣️",
      benefits: [
        "Multiple accent options",
        "Native speaker models",
        "Progressive difficulty",
      ],
    },
    {
      title: "Word Stress Practice",
      description:
        "Master English stress patterns with interactive exercises and real-time feedback",
      icon: "⚡",
      benefits: [
        "Stress pattern recognition",
        "Rhythm training",
        "Natural flow development",
      ],
    },
    {
      title: "IPA Learning System",
      description:
        "Learn International Phonetic Alphabet symbols to understand exact pronunciation",
      icon: "📝",
      benefits: [
        "Symbol recognition",
        "Sound-symbol mapping",
        "Pronunciation dictionary access",
      ],
    },
  ];

  const commonProblems = [
    {
      problem: "/θ/ and /ð/ sounds (th)",
      examples: ["think vs sink", "this vs dis"],
      practice: "Tongue position exercises, minimal pair drills",
    },
    {
      problem: "/l/ and /r/ sounds",
      examples: ["light vs right", "play vs pray"],
      practice: "Tongue placement training, repetition exercises",
    },
    {
      problem: "/v/ and /w/ sounds",
      examples: ["very vs wary", "vest vs west"],
      practice: "Lip position practice, breathing exercises",
    },
    {
      problem: "Word stress patterns",
      examples: ["PHOto vs phoTOgraphy", "REcord vs reCORD"],
      practice: "Stress timing drills, syllable counting",
    },
    {
      problem: "Final consonants",
      examples: ["bed vs bet", "pack vs packs"],
      practice: "Ending sound emphasis, clear articulation",
    },
    {
      problem: "Vowel length and quality",
      examples: ["sheep vs ship", "fool vs full"],
      practice: "Vowel space training, duration exercises",
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
                <Button size="sm">Start Training</Button>
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
          <span>Pronunciation Trainer</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🎯 Pronunciation</Badge>
            <Badge variant="outline">AI-Powered</Badge>
            <Badge variant="outline">Real-time Feedback</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master English Pronunciation with AI Precision
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your English pronunciation with advanced AI analysis. Get
            phoneme-level feedback, accent training, and personalized practice
            plans to sound like a native speaker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Free Training
              </Button>
            </Link>
            <Link href="/en/blog/english-pronunciation-practice-online">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Advanced Pronunciation Training Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {pronunciationFeatures.map((feature, index) => (
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

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            How AI Pronunciation Training Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <CardTitle className="text-lg">Record Your Speech</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Speak into your microphone using our pronunciation exercises
                  or read provided texts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <CardTitle className="text-lg">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms analyze your pronunciation at the phoneme
                  level for precise feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <CardTitle className="text-lg">Instant Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get detailed feedback on accuracy, timing, stress patterns,
                  and areas for improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <CardTitle className="text-lg">Practice & Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Follow personalized practice recommendations and track your
                  pronunciation progress over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Common Pronunciation Problems */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Common Pronunciation Challenges We Address
          </h2>
          <div className="grid gap-6">
            {commonProblems.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-lg">{item.problem}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong className="text-primary">Examples:</strong>
                      <ul className="mt-1 space-y-1">
                        {item.examples.map((example, i) => (
                          <li key={i} className="text-muted-foreground">
                            • {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <strong className="text-primary">Practice Method:</strong>
                      <p className="mt-1 text-muted-foreground">
                        {item.practice}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Pronunciation Training Plan
          </h2>
          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-xl">Basic Training</CardTitle>
                <div className="text-3xl font-bold">
                  $9.99
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Basic pronunciation analysis
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">5 practice sessions per day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Progress tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Basic accent training</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <GradientCard className="relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                RECOMMENDED
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Advanced Training</CardTitle>
                <div className="text-3xl font-bold">
                  $19.99
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Advanced phoneme analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Unlimited practice sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Detailed progress analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Multiple accent training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">IPA learning system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Personalized practice plans</span>
                  </li>
                </ul>
                <Button className="w-full">Start Advanced Training</Button>
              </CardContent>
            </GradientCard>
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Student Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Maria S.</h4>
                    <p className="text-sm text-muted-foreground">
                      Business Professional
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The phoneme analysis helped me finally master the 'th' sound.
                  My colleagues now compliment my clear pronunciation in
                  meetings."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    95% accuracy improvement
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    K
                  </div>
                  <div>
                    <h4 className="font-semibold">Kenji T.</h4>
                    <p className="text-sm text-muted-foreground">
                      University Student
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The L/R distinction was impossible for me before. Now I can
                  clearly differentiate and pronounce both sounds correctly."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    6 weeks to fluency
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Ahmed R.</h4>
                    <p className="text-sm text-muted-foreground">
                      Medical Resident
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Word stress training was crucial for my medical career.
                  Patients now understand me perfectly during consultations."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    Professional confidence
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
              Start Your Pronunciation Journey Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who've transformed their English
              pronunciation with Fluenta's AI-powered training system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
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
