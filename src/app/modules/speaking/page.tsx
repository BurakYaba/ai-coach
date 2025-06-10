import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "English Speaking Practice Module - AI-Powered Conversation Training",
  description:
    "Improve your English speaking skills with Fluenta's AI conversation practice module. Real-time feedback on pronunciation, fluency, and grammar. Build confidence through daily practice.",
  keywords:
    "English speaking practice, AI conversation practice, pronunciation training, English speaking module, speaking fluency improvement, conversation practice online, English speaking skills",
  openGraph: {
    title:
      "English Speaking Practice Module - AI-Powered Conversation Training",
    description:
      "Master English speaking with AI conversation partners. Get instant feedback on pronunciation, fluency, and grammar in real-time.",
    type: "website",
    images: [
      {
        url: "/og-images/og-speaking-module.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Speaking Practice Module",
      },
    ],
  },
};

export default function SpeakingModule() {
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
                All Modules
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
                <Button size="sm">Start Free Trial</Button>
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
          <span>Speaking Practice</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="outline">🗣️ Speaking</Badge>
              <Badge variant="outline">AI-Powered</Badge>
              <Badge variant="outline">Real-time Feedback</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master English Speaking with AI Conversation Practice
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Build speaking confidence through personalized AI conversations.
              Get instant feedback on pronunciation, fluency, and grammar while
              practicing real-world scenarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Speaking Practice Free
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Fluenta Speaking Practice?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets proven language learning methods to
              accelerate your speaking progress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  🎯 Real-time AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Get instant pronunciation analysis, grammar corrections, and
                  fluency scores as you speak. Our AI identifies specific areas
                  for improvement and provides actionable suggestions.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Phoneme-level pronunciation accuracy</li>
                  <li>Word stress and intonation analysis</li>
                  <li>Speaking pace optimization</li>
                  <li>Grammar error detection in speech</li>
                </ul>
              </CardContent>
            </GradientCard>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  🤖 Intelligent Conversation Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Practice with AI conversation partners that adapt to your
                  level and interests. Each partner has unique personality and
                  speaking style for varied practice.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>10+ AI personalities to choose from</li>
                  <li>Adaptive conversation difficulty</li>
                  <li>Context-aware responses</li>
                  <li>Natural conversation flow</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  📊 Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Track your speaking improvement with detailed analytics and
                  progress reports. See how your pronunciation, fluency, and
                  confidence grow over time.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Daily speaking streak tracking</li>
                  <li>Skill improvement metrics</li>
                  <li>Weekly progress reports</li>
                  <li>Achievement badges and milestones</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Practice Scenarios */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Practice Real-World Scenarios
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from 47+ conversation scenarios designed for practical
              English use in work, travel, and daily life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GradientCard>
              <CardHeader>
                <CardTitle className="text-center">💼 Job Interviews</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Practice answering common interview questions, discussing your
                  experience, and asking thoughtful questions about the role.
                </p>
              </CardContent>
            </GradientCard>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  ✈️ Travel & Tourism
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Navigate airports, hotels, restaurants, and tourist
                  attractions with confidence. Handle bookings, complaints, and
                  directions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  🏥 Medical Situations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Describe symptoms, understand medical advice, and communicate
                  with healthcare professionals in emergency and routine
                  situations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  🎓 Academic Discussions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Participate in classroom discussions, present research, ask
                  questions, and engage in academic debates with confidence.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  🛒 Shopping & Services
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Make purchases, compare products, handle returns, and
                  negotiate prices in various retail and service contexts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">🏠 Daily Life</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Handle everyday conversations with neighbors, service
                  providers, and in social situations like parties and community
                  events.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  💻 Business Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Lead presentations, participate in team meetings, negotiate
                  deals, and handle client communications professionally.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">🎉 Social Events</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm">
                  Make small talk, introduce yourself to new people, and engage
                  in social conversations at parties and networking events.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Speaking Practice Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, effective, and designed for rapid improvement in just 15
              minutes a day.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Choose Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Select from 47+ real-world conversation scenarios based on
                  your goals and interests.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Start Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Begin speaking with your AI conversation partner who adapts to
                  your level and provides context.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Get Real-time Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Receive instant feedback on pronunciation, grammar, and
                  fluency as you speak naturally.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <CardTitle>Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Review detailed analytics and track your improvement over time
                  with personalized insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of learners who've improved their English speaking
              confidence with Fluenta.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="mb-4 italic">
                  "The AI feedback is incredibly accurate. I've improved my
                  pronunciation more in 2 months with Fluenta than in 2 years of
                  traditional classes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold">Maria Rodriguez</div>
                    <div className="text-sm text-muted-foreground">
                      Software Engineer, Spain
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <GradientCard>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="mb-4 italic">
                  "The job interview practice scenarios helped me land my dream
                  job in Canada. The confidence I gained is invaluable!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">AK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ahmed Khalil</div>
                    <div className="text-sm text-muted-foreground/80">
                      Data Analyst, Egypt
                    </div>
                  </div>
                </div>
              </CardContent>
            </GradientCard>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="mb-4 italic">
                  "As a busy mom, the 15-minute daily sessions fit perfectly
                  into my schedule. My speaking has improved dramatically!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">LC</span>
                  </div>
                  <div>
                    <div className="font-semibold">Li Chen</div>
                    <div className="text-sm text-muted-foreground">
                      Marketing Manager, China
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Speaking Journey Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your learning goals and schedule.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Free Trial</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/7 days</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">5 conversation scenarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Basic AI feedback</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Progress tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">15 minutes daily practice</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <GradientCard>
              <CardHeader>
                <div className="text-center">
                  <Badge className="mb-2">Most Popular</Badge>
                  <CardTitle className="text-center">Premium</CardTitle>
                  <div className="text-center">
                    <span className="text-3xl font-bold">$14.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">50+ conversation scenarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Advanced AI feedback & analysis
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Unlimited practice time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Pronunciation coaching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Weekly progress reports</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full">Get Premium Access</Button>
                </Link>
              </CardContent>
            </GradientCard>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Annual</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$149.99</span>
                  <span className="text-muted-foreground">/year</span>
                  <div className="text-sm text-green-600">Save 17%</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Everything in Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Early access to new features
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Personalized coaching sessions
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">CEFR level certificate</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Choose Annual Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our speaking practice
              module.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  How accurate is the AI pronunciation feedback?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our AI pronunciation analysis achieves 98% accuracy compared
                  to human speech therapists. We use advanced phoneme
                  recognition and machine learning algorithms trained on
                  millions of speech samples.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Can I practice specific accents (American, British, etc.)?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes! You can choose from American, British, Australian, and
                  Canadian English accents. Our AI conversation partners are
                  trained on native speakers from each region.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How much time should I practice daily?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We recommend 15-20 minutes daily for optimal results.
                  Consistent daily practice is more effective than longer,
                  infrequent sessions for building speaking fluency.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Is this suitable for complete beginners?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Absolutely! Our AI adapts to your current level, from A1
                  beginner to C2 advanced. Beginners start with simple phrases
                  and gradually progress to complex conversations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your English Speaking?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who've built speaking confidence with
              Fluenta's AI-powered conversation practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Free 7-Day Trial
                </Button>
              </Link>
              <Link href="/blog/english-conversation-practice-app">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Read Success Stories
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
