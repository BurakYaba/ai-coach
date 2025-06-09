import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "English Learning FAQ - Common Questions About Fluenta AI",
  description:
    "Get answers to frequently asked questions about English learning, AI tutoring, pronunciation practice, grammar checking, and Fluenta's features. Find solutions to common English learning challenges.",
  keywords:
    "English learning FAQ, AI English tutor questions, pronunciation practice help, grammar checker support, English learning tips, common English problems, language learning guide",
  openGraph: {
    title: "English Learning FAQ - Common Questions About Fluenta AI",
    description:
      "Find answers to common English learning questions and get the most out of Fluenta's AI-powered language learning platform.",
    type: "website",
    images: [
      {
        url: "/og-images/og-faq.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Learning FAQ",
      },
    ],
  },
};

export default function FAQ() {
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
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Learning Modules
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm">Try Fluenta Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <span>FAQ</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">❓ FAQ</Badge>
            <Badge variant="outline">Support</Badge>
            <Badge variant="outline">Help Center</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Find answers to common questions about English learning, Fluenta's
            features, and how to make the most of your language learning
            journey.
          </p>
        </section>

        {/* Quick Search */}
        <section className="mb-12">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-center">
                Quick Topic Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <a
                  href="#getting-started"
                  className="p-3 bg-background rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="font-semibold">🚀 Getting Started</div>
                  <div className="text-sm text-muted-foreground">
                    Account & Setup
                  </div>
                </a>
                <a
                  href="#features"
                  className="p-3 bg-background rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="font-semibold">⚡ Features</div>
                  <div className="text-sm text-muted-foreground">
                    AI Tools & Modules
                  </div>
                </a>
                <a
                  href="#learning"
                  className="p-3 bg-background rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="font-semibold">📚 Learning</div>
                  <div className="text-sm text-muted-foreground">
                    Study Tips & Methods
                  </div>
                </a>
                <a
                  href="#technical"
                  className="p-3 bg-background rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="font-semibold">🔧 Technical</div>
                  <div className="text-sm text-muted-foreground">
                    Troubleshooting
                  </div>
                </a>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-3xl font-bold mb-8">🚀 Getting Started</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What is Fluenta and how does it work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Fluenta is an AI-powered English learning platform that
                  provides personalized tutoring, conversation practice,
                  pronunciation coaching, and grammar checking. Our advanced AI
                  adapts to your learning style and pace to accelerate your
                  English improvement.
                </p>
                <p>
                  Key features include: real-time conversation practice with AI
                  tutors, pronunciation analysis with instant feedback, grammar
                  checking with explanations, and personalized learning paths
                  based on your goals and current level.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  How do I create an account and get started?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Click "Start Free Trial" on our homepage</li>
                  <li>Enter your email and create a password</li>
                  <li>Take our 5-minute English level assessment</li>
                  <li>
                    Choose your learning goals (speaking, writing,
                    pronunciation, etc.)
                  </li>
                  <li>Start your first lesson with our AI tutor</li>
                </ol>
                <p className="mt-4">
                  Your free trial includes access to all features for 7 days, no
                  credit card required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Is Fluenta suitable for my English level?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Yes! Fluenta adapts to all English levels from A1 (complete
                  beginner) to C2 (advanced proficiency). Our AI assessment
                  determines your current level and creates a personalized
                  learning path.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <strong>Beginners (A1-A2):</strong> Basic vocabulary,
                    grammar fundamentals, simple conversations
                  </div>
                  <div>
                    <strong>Intermediate (B1-B2):</strong> Complex grammar,
                    fluency building, professional English
                  </div>
                  <div>
                    <strong>Advanced (C1-C2):</strong> Nuanced communication,
                    academic writing, business English
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How much does Fluenta cost?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Free Trial:</strong> 7 days with full access to all
                    features
                  </div>
                  <div>
                    <strong>Monthly Plan:</strong> $14.99/month (cancel anytime)
                  </div>
                  <div>
                    <strong>Annual Plan:</strong> $149.99/year (17% savings,
                    equivalent to $12.50/month)
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  All plans include unlimited access to AI tutoring,
                  conversation practice, pronunciation coaching, grammar
                  checking, and progress tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-12">
          <h2 className="text-3xl font-bold mb-8">⚡ Features & AI Tools</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  How accurate is Fluenta's AI pronunciation feedback?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our AI pronunciation analysis achieves 98% accuracy compared
                  to human speech therapists. We use advanced phoneme
                  recognition technology trained on millions of speech samples
                  from native English speakers.
                </p>
                <p>
                  The AI provides feedback on: individual sound accuracy, word
                  stress patterns, intonation and rhythm, speaking pace, and
                  overall clarity. You'll see specific recommendations for
                  improvement with practice exercises.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Can the AI tutor help with grammar and writing?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Absolutely! Our AI grammar checker identifies errors in
                  real-time and provides detailed explanations. Unlike basic
                  grammar checkers, Fluenta explains the "why" behind
                  corrections to help you learn.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <strong>Grammar Features:</strong>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Real-time error detection</li>
                      <li>Contextual corrections</li>
                      <li>Grammar rule explanations</li>
                      <li>Style and tone suggestions</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Writing Support:</strong>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Essay structure guidance</li>
                      <li>Vocabulary enhancement</li>
                      <li>Academic writing help</li>
                      <li>Business communication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  What conversation scenarios are available?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  We offer 50+ real-world conversation scenarios covering
                  professional, academic, and daily life situations:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <strong>Professional:</strong>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Job interviews</li>
                      <li>Business meetings</li>
                      <li>Presentations</li>
                      <li>Networking events</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Travel & Daily:</strong>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Airport navigation</li>
                      <li>Restaurant ordering</li>
                      <li>Shopping</li>
                      <li>Medical appointments</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Academic:</strong>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Class discussions</li>
                      <li>Thesis defense</li>
                      <li>Study groups</li>
                      <li>Professor meetings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How does progress tracking work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Fluenta provides comprehensive analytics to track your
                  improvement across all English skills:
                </p>
                <div className="space-y-3">
                  <div>
                    <strong>Daily Metrics:</strong> Speaking time, accuracy
                    scores, new vocabulary learned
                  </div>
                  <div>
                    <strong>Weekly Reports:</strong> Skill improvement trends,
                    goal achievement, areas for focus
                  </div>
                  <div>
                    <strong>Monthly Assessments:</strong> Overall level
                    progress, certification updates, personalized
                    recommendations
                  </div>
                  <div>
                    <strong>Streak Tracking:</strong> Consecutive days of
                    practice, motivation badges, achievement milestones
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learning Section */}
        <section id="learning" className="mb-12">
          <h2 className="text-3xl font-bold mb-8">
            📚 Learning Tips & Methods
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How much time should I practice daily?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  We recommend 15-30 minutes of daily practice for optimal
                  results. Consistency is more important than duration - daily
                  15-minute sessions are more effective than weekly 2-hour
                  sessions.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Beginner</div>
                    <div className="text-sm">15-20 min/day</div>
                    <div className="text-xs text-muted-foreground">
                      Focus on fundamentals
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Intermediate</div>
                    <div className="text-sm">20-30 min/day</div>
                    <div className="text-xs text-muted-foreground">
                      Build fluency
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Advanced</div>
                    <div className="text-sm">25-45 min/day</div>
                    <div className="text-xs text-muted-foreground">
                      Perfect nuances
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  What's the best way to improve my English accent?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Improving your accent requires focused practice on
                  pronunciation, rhythm, and intonation. Here's our proven
                  approach:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Sound Training:</strong> Practice individual
                    phonemes with Fluenta's pronunciation module
                  </li>
                  <li>
                    <strong>Word Stress:</strong> Learn stress patterns in
                    common words and phrases
                  </li>
                  <li>
                    <strong>Rhythm & Flow:</strong> Practice connected speech
                    and natural intonation
                  </li>
                  <li>
                    <strong>Shadowing:</strong> Repeat after native speakers to
                    develop muscle memory
                  </li>
                  <li>
                    <strong>Record & Compare:</strong> Use our feedback system
                    to track improvement
                  </li>
                </ol>
                <p className="mt-4 text-sm text-muted-foreground">
                  Remember: accent reduction takes time. Focus on clarity and
                  confidence rather than perfect imitation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  How can I overcome my fear of speaking English?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Speaking anxiety is common among English learners. Fluenta's
                  AI tutors provide a judgment-free environment to build
                  confidence:
                </p>
                <div className="space-y-3">
                  <div>
                    <strong>Start Small:</strong> Begin with short responses and
                    gradually increase complexity
                  </div>
                  <div>
                    <strong>Practice Privately:</strong> Build confidence with
                    AI before speaking to humans
                  </div>
                  <div>
                    <strong>Focus on Communication:</strong> Prioritize getting
                    your message across over perfect grammar
                  </div>
                  <div>
                    <strong>Celebrate Progress:</strong> Acknowledge
                    improvements, no matter how small
                  </div>
                  <div>
                    <strong>Use Scenarios:</strong> Practice specific situations
                    you'll encounter in real life
                  </div>
                </div>
                <p className="mt-4">
                  Our AI tutors are designed to be patient, encouraging, and
                  supportive - creating a safe space to make mistakes and learn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  What's the fastest way to expand my vocabulary?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Effective vocabulary building requires strategic learning and
                  regular practice:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <strong>Learning Strategies:</strong>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Learn words in context, not isolation</li>
                      <li>Focus on high-frequency words first</li>
                      <li>Use spaced repetition for retention</li>
                      <li>Learn word families and collocations</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Practice Methods:</strong>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Use new words in conversation practice</li>
                      <li>Write sentences with target vocabulary</li>
                      <li>Read texts at your level</li>
                      <li>Keep a personal vocabulary journal</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Fluenta's AI identifies vocabulary gaps and suggests relevant
                  words based on your goals and interests.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Section */}
        <section id="technical" className="mb-12">
          <h2 className="text-3xl font-bold mb-8">🔧 Technical Support</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  What devices and browsers does Fluenta support?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Fluenta works on all modern devices and browsers with internet
                  access:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <strong>Computers:</strong>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Windows 10+</li>
                      <li>macOS 10.14+</li>
                      <li>Linux (most distros)</li>
                      <li>Chromebook</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Mobile Devices:</strong>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>iPhone (iOS 14+)</li>
                      <li>Android (8.0+)</li>
                      <li>iPad (iPadOS 14+)</li>
                      <li>Android tablets</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Browsers:</strong>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Chrome (recommended)</li>
                      <li>Safari</li>
                      <li>Firefox</li>
                      <li>Edge</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  For best performance, we recommend using Chrome or Safari with
                  a stable internet connection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  My microphone isn't working for speaking practice. What should
                  I do?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Microphone issues are usually easy to fix. Try these
                  troubleshooting steps:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Check permissions:</strong> Ensure your browser has
                    microphone access for Fluenta
                  </li>
                  <li>
                    <strong>Test your mic:</strong> Verify it works in other
                    applications
                  </li>
                  <li>
                    <strong>Close other apps:</strong> Some programs can block
                    microphone access
                  </li>
                  <li>
                    <strong>Refresh the page:</strong> Sometimes a simple
                    refresh resolves the issue
                  </li>
                  <li>
                    <strong>Try a different browser:</strong> Chrome typically
                    has the best compatibility
                  </li>
                  <li>
                    <strong>Check system settings:</strong> Ensure the correct
                    microphone is selected
                  </li>
                </ol>
                <p className="mt-4">
                  If issues persist, contact our support team for personalized
                  assistance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I use Fluenta offline?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Fluenta requires an internet connection for AI features like
                  conversation practice, pronunciation analysis, and real-time
                  feedback. However, some features work offline:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <strong>Online Required:</strong>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>AI conversation practice</li>
                      <li>Pronunciation analysis</li>
                      <li>Grammar checking</li>
                      <li>Progress sync</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Offline Available:</strong>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Downloaded lesson materials</li>
                      <li>Vocabulary flashcards</li>
                      <li>Grammar reference</li>
                      <li>Reading exercises</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  We're working on expanding offline capabilities in future
                  updates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I cancel my subscription?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  You can cancel your subscription anytime without penalties:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Log into your Fluenta account</li>
                  <li>Go to Settings &gt; Subscription</li>
                  <li>Click "Cancel Subscription"</li>
                  <li>Choose your reason (optional feedback)</li>
                  <li>Confirm cancellation</li>
                </ol>
                <p className="mt-4">
                  After cancellation, you'll retain access until your current
                  billing period ends. All your progress and data remain saved
                  if you decide to reactivate later.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Can't find the answer you're looking for? Our support team is
                here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">Contact Support</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </CardContent>
          </GradientCard>
        </section>
      </main>
    </div>
  );
}
