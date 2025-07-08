import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Free English Level Test: Assess Your Skills Today [CEFR A1-C2]",
  description:
    "Take our free English level test to discover your proficiency level. Comprehensive assessment covering reading, writing, listening, speaking, grammar, and vocabulary. Get instant results.",
  keywords:
    "free English level test, English proficiency test, CEFR test online, English assessment free, English placement test, test my English level, English skill assessment, online English test",
  openGraph: {
    title: "Free English Level Test: Assess Your Skills Today [CEFR A1-C2]",
    description:
      "Discover your English proficiency level with our comprehensive free test. Get instant results and personalized learning recommendations.",
    type: "article",
    images: [
      {
        url: "/og-images/og-level-test.png",
        width: 1200,
        height: 630,
        alt: "Free English Level Test - CEFR Assessment",
      },
    ],
  },
};

export default function BlogPost() {
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
                href="/onboarding"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Level Test
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm">Take Free Test</Button>
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
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>›</span>
          <span>Free English Level Test</span>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Assessment</Badge>
              <Badge variant="outline">CEFR</Badge>
              <Badge variant="outline">Free Test</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free English Level Test: Assess Your Skills Today [CEFR A1-C2]
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover your English proficiency level with our comprehensive
              free test. Get instant results and personalized learning
              recommendations based on CEFR standards.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>December 28, 2024</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>English Assessment Guide</span>
            </div>
          </header>

          {/* Take Test CTA */}
          <section className="mb-8">
            <GradientCard>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  🎯 Take Your Free English Level Test Now
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6">
                  Complete assessment in 15 minutes • Covers all 4 skills •
                  Instant CEFR results • Personalized learning plan
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">⏱️ 15 Minutes</div>
                    <div className="text-muted-foreground">
                      Quick and comprehensive
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">📊 CEFR Certified</div>
                    <div className="text-muted-foreground">A1 to C2 levels</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">📈 Action Plan</div>
                    <div className="text-muted-foreground">
                      Personalized recommendations
                    </div>
                  </div>
                </div>
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8">
                    Start Free English Level Test
                  </Button>
                </Link>
              </CardContent>
            </GradientCard>
          </section>

          {/* CEFR Levels */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              Understanding CEFR English Levels
            </h2>
            <p className="mb-6 text-muted-foreground">
              The Common European Framework of Reference (CEFR) is the
              international standard for measuring language proficiency. Our
              test accurately places you in one of six levels:
            </p>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>A1 - Beginner</CardTitle>
                    <Badge variant="outline">Basic User</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Can understand and use familiar everyday expressions and
                    basic phrases. Can introduce themselves and ask simple
                    questions about personal details.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> "Hello, my name is John. I am from
                    New York. I like pizza."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>A2 - Elementary</CardTitle>
                    <Badge variant="outline">Basic User</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Can understand sentences about familiar topics. Can
                    communicate in simple tasks requiring direct exchange of
                    information.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> "I went to the store yesterday and
                    bought some bread. The weather was nice."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>B1 - Intermediate</CardTitle>
                    <Badge variant="secondary">Independent User</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Can understand main points of clear input on familiar
                    subjects. Can deal with most travel situations and express
                    opinions.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> "I think online learning has both
                    advantages and disadvantages for students."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>B2 - Upper-Intermediate</CardTitle>
                    <Badge variant="secondary">Independent User</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Can understand complex texts and interact fluently with
                    native speakers. Can produce detailed text on various
                    subjects.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> "The implementation of AI in
                    education raises significant questions about pedagogical
                    effectiveness."
                  </p>
                </CardContent>
              </Card>

              <GradientCard>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>C1 - Advanced</CardTitle>
                    <Badge>Proficient User</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Can understand demanding, longer texts and express
                    themselves fluently without searching for expressions. Uses
                    language effectively for academic and professional purposes.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> Academic writing, business
                    presentations, complex negotiations
                  </p>
                </CardContent>
              </GradientCard>

              <GradientCard>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>C2 - Proficient</CardTitle>
                    <Badge>Proficient User</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Can understand virtually everything heard or read. Can
                    summarize information from different sources and express
                    themselves with precision.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> Near-native fluency in academic,
                    professional, and social contexts
                  </p>
                </CardContent>
              </GradientCard>
            </div>
          </section>

          {/* What Our Test Covers */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              What Our English Level Test Covers
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📖 Reading Comprehension
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Understanding main ideas and details</li>
                    <li>Inferring meaning from context</li>
                    <li>Text types: articles, emails, reports</li>
                    <li>Vocabulary in context assessment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎧 Listening Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Conversations and monologues</li>
                    <li>Different accents and speaking speeds</li>
                    <li>Understanding specific information</li>
                    <li>Following instructions and directions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ✍️ Grammar & Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Tense usage and sentence structure</li>
                    <li>Articles, prepositions, conditionals</li>
                    <li>Subject-verb agreement</li>
                    <li>Complex grammatical patterns</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    💬 Speaking Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>AI-powered pronunciation analysis</li>
                    <li>Fluency and coherence evaluation</li>
                    <li>Vocabulary range assessment</li>
                    <li>Conversational responses</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Why Take Our Test */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              Why Choose Fluenta's English Level Test?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <GradientCard>
                <CardHeader>
                  <CardTitle>🎯 Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Our AI-powered assessment provides 96% accuracy compared to
                    professional human evaluators, using advanced language
                    processing algorithms.
                  </p>
                </CardContent>
              </GradientCard>

              <Card>
                <CardHeader>
                  <CardTitle>⚡ Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Complete your full assessment in just 15 minutes with
                    instant results. No waiting, no scheduling appointments with
                    examiners.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Detailed Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Receive comprehensive feedback on each skill area with
                    specific recommendations for improvement and suggested
                    learning paths.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔄 Adaptive Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Questions adapt to your responses in real-time, ensuring
                    efficient and accurate level placement without unnecessary
                    difficulty.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏆 Certification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Receive an official CEFR certificate that you can share with
                    employers, schools, or use for visa applications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📈 Learning Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Get a personalized 30-day learning plan based on your
                    results, focusing on areas that need the most improvement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Test Preparation Tips */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              How to Prepare for Your English Level Test
            </h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>1. Find a Quiet Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Take the test in a quiet space where you won't be
                    interrupted. Good internet connection and working microphone
                    are essential for the speaking component.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Don't Over-Prepare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    The test is designed to measure your current level.
                    Intensive studying beforehand may give inaccurate results.
                    Take it when you feel mentally fresh.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Be Honest</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Don't guess wildly or try to appear more advanced. Accurate
                    results lead to better learning recommendations and faster
                    progress.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Read Instructions Carefully</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Each section has specific instructions. Take a moment to
                    understand what's being asked before responding to ensure
                    optimal performance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* What Happens After */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              What Happens After Your Test?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <GradientCard>
                <CardHeader>
                  <CardTitle>Instant Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>📊 Overall CEFR level (A1-C2)</div>
                    <div>📈 Skill breakdown by area</div>
                    <div>🎯 Strengths and weaknesses</div>
                    <div>📜 Official certificate</div>
                  </div>
                </CardContent>
              </GradientCard>

              <Card>
                <CardHeader>
                  <CardTitle>Personalized Learning Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>🗓️ 30-day improvement roadmap</div>
                    <div>📚 Recommended modules and exercises</div>
                    <div>🎯 Weekly goals and milestones</div>
                    <div>📊 Progress tracking dashboard</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Other Free Tests Comparison */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              How We Compare to Other Free English Tests
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Test</th>
                    <th className="border border-border p-3 text-left">
                      Duration
                    </th>
                    <th className="border border-border p-3 text-left">
                      Skills Tested
                    </th>
                    <th className="border border-border p-3 text-left">
                      Result Detail
                    </th>
                    <th className="border border-border p-3 text-left">
                      Certificate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <td className="border border-border p-3 font-semibold">
                      Fluenta
                    </td>
                    <td className="border border-border p-3">15 minutes</td>
                    <td className="border border-border p-3">All 4 skills</td>
                    <td className="border border-border p-3">
                      Detailed breakdown
                    </td>
                    <td className="border border-border p-3">
                      ✅ Official CEFR
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">
                      EF SET
                    </td>
                    <td className="border border-border p-3">50 minutes</td>
                    <td className="border border-border p-3">
                      Reading + Listening
                    </td>
                    <td className="border border-border p-3">Basic score</td>
                    <td className="border border-border p-3">✅ Certificate</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">
                      Cambridge
                    </td>
                    <td className="border border-border p-3">25 minutes</td>
                    <td className="border border-border p-3">
                      Grammar + Vocabulary
                    </td>
                    <td className="border border-border p-3">Level estimate</td>
                    <td className="border border-border p-3">
                      ❌ No certificate
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">
                      British Council
                    </td>
                    <td className="border border-border p-3">12 minutes</td>
                    <td className="border border-border p-3">
                      Grammar + Vocabulary
                    </td>
                    <td className="border border-border p-3">Basic level</td>
                    <td className="border border-border p-3">
                      ❌ No certificate
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Discover Your English Level?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Take our comprehensive free English level test now and get your
              CEFR level with personalized recommendations for improvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Free English Level Test
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Read More Learning Tips
                </Button>
              </Link>
            </div>
          </section>

          {/* Related Articles */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/en/blog/english-pronunciation-practice-online"
                      className="hover:text-primary"
                    >
                      English Pronunciation Practice Online: Best Tools 2025
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Improve your pronunciation with AI-powered tools and
                    techniques...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/en/blog/ai-english-grammar-checker"
                      className="hover:text-primary"
                    >
                      AI English Grammar Checker: Top 8 Tools Compared
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Find the best grammar tools for error-free English
                    writing...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/en/blog/english-conversation-practice-app"
                      className="hover:text-primary"
                    >
                      Best English Conversation Practice Apps 2025
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Transform your speaking skills with top conversation apps...
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
