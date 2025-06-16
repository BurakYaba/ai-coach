import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "How to Prepare for IELTS Using AI: Complete Guide 2025 | Fluenta",
  description:
    "Master IELTS with AI-powered preparation strategies. Learn how artificial intelligence can help you achieve your target band score faster and more efficiently with personalized study plans and practice.",
  keywords:
    "IELTS preparation AI, IELTS study guide 2025, artificial intelligence IELTS, IELTS band score improvement, AI IELTS practice, IELTS exam preparation, IELTS speaking practice AI, IELTS writing AI feedback",
  openGraph: {
    title: "How to Prepare for IELTS Using AI: Complete Guide 2025 | Fluenta",
    description:
      "Master IELTS with AI-powered preparation strategies. Learn how artificial intelligence can help you achieve your target band score faster and more efficiently with personalized study plans and practice.",
    type: "article",
  },
};

const ieltsModules = [
  {
    name: "Listening",
    description:
      "AI-powered listening practice with adaptive difficulty and instant feedback",
    features: [
      "Variety of accents and topics",
      "Real-time comprehension analysis",
      "Weakness identification",
      "Targeted practice recommendations",
    ],
    aiAdvantage:
      "AI adapts question difficulty based on your performance and provides detailed analysis of your listening patterns.",
    tips: [
      "Practice with different accents daily",
      "Use AI prediction of question types",
      "Focus on note-taking strategies",
      "Analyze your common mistakes with AI",
    ],
  },
  {
    name: "Reading",
    description:
      "Personalized reading comprehension training with AI-generated passages",
    features: [
      "Adaptive reading difficulty",
      "Time management training",
      "Vocabulary in context",
      "Question type mastery",
    ],
    aiAdvantage:
      "AI creates personalized reading passages based on your interests and difficulty level, making practice more engaging.",
    tips: [
      "Practice skimming and scanning techniques",
      "Use AI to identify your weak question types",
      "Build vocabulary with AI flashcards",
      "Track reading speed improvements",
    ],
  },
  {
    name: "Writing",
    description: "AI writing coach with detailed feedback on Task 1 and Task 2",
    features: [
      "Grammar and vocabulary analysis",
      "Coherence and cohesion scoring",
      "Band score prediction",
      "Personalized improvement plans",
    ],
    aiAdvantage:
      "Get instant, detailed feedback on your essays with specific suggestions for improvement and band score predictions.",
    tips: [
      "Practice both Task 1 and Task 2 regularly",
      "Use AI for grammar checking",
      "Learn from AI-generated model answers",
      "Focus on coherence and cohesion",
    ],
  },
  {
    name: "Speaking",
    description: "AI conversation partner for realistic speaking practice",
    features: [
      "Pronunciation feedback",
      "Fluency analysis",
      "Vocabulary usage tracking",
      "Mock interview sessions",
    ],
    aiAdvantage:
      "Practice speaking anytime with AI that provides detailed pronunciation and fluency feedback without human judgment.",
    tips: [
      "Record yourself speaking daily",
      "Use AI for pronunciation practice",
      "Practice all three parts of the test",
      "Work on fluency and coherence",
    ],
  },
];

const studyPlan = [
  {
    phase: "Assessment Phase",
    duration: "Week 1",
    description:
      "Use AI diagnostic tests to identify your current level and weak areas",
    activities: [
      "Complete AI-powered diagnostic test",
      "Analyze results with AI insights",
      "Set target band score goals",
      "Create personalized study plan",
    ],
  },
  {
    phase: "Foundation Building",
    duration: "Weeks 2-4",
    description: "Strengthen fundamental skills with AI-guided practice",
    activities: [
      "Daily vocabulary building with AI",
      "Grammar practice with instant feedback",
      "Basic skill exercises for each module",
      "Weekly progress assessments",
    ],
  },
  {
    phase: "Intensive Practice",
    duration: "Weeks 5-8",
    description: "Intensive skill development with AI-powered simulations",
    activities: [
      "Full-length practice tests with AI",
      "Targeted weakness elimination",
      "Advanced strategy implementation",
      "Mock exam conditions",
    ],
  },
  {
    phase: "Final Preparation",
    duration: "Weeks 9-10",
    description: "Fine-tune skills and build confidence for exam day",
    activities: [
      "Final mock tests with AI analysis",
      "Exam strategy refinement",
      "Stress management techniques",
      "Last-minute tips and tricks",
    ],
  },
];

const relatedPosts = [
  {
    title: "5 AI Tools to Improve Your English in 2025",
    href: "/blog/5-ai-tools-improve-english-2025",
    category: "AI Tools",
  },
  {
    title: "Daily English Speaking Practice for Beginners",
    href: "/blog/daily-english-speaking-practice-beginners",
    category: "Speaking",
  },
  {
    title: "Advanced Vocabulary Building Strategies for 2025",
    href: "/blog/vocabulary-building-strategies-2025",
    category: "Vocabulary",
  },
];

export default function IELTSPreparationGuide() {
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
                href="/pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>→</span>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>→</span>
          <span>How to Prepare for IELTS Using AI</span>
        </nav>

        {/* Article Header */}
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">IELTS</Badge>
              <Badge variant="secondary">12 min read</Badge>
              <Badge variant="secondary">December 10, 2024</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              How to Prepare for IELTS Using AI: Complete Guide
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Master IELTS with AI-powered preparation strategies. Learn how
              artificial intelligence can help you achieve your target band
              score faster and more efficiently than traditional study methods,
              with personalized feedback and adaptive learning technology.
            </p>
          </header>

          {/* Introduction */}
          <section className="mb-12 text-foreground">
            <p className="text-lg leading-relaxed mb-6">
              The IELTS exam is a gateway to international education and career
              opportunities, but preparing for it can be overwhelming.
              Traditional study methods often involve generic materials that
              don't address your specific weaknesses or learning style. This is
              where artificial intelligence revolutionizes IELTS preparation.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              AI-powered IELTS preparation offers personalized learning
              experiences, instant feedback, and adaptive practice materials
              that evolve with your progress. Whether you're aiming for academic
              or general training IELTS, AI can significantly accelerate your
              preparation and improve your chances of achieving your target band
              score.
            </p>
            <div className="p-6 bg-primary/10 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-lg mb-2">
                Why AI for IELTS Preparation?
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Personalized study
                  plans based on your current level
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Instant feedback
                  on speaking and writing
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Adaptive practice
                  materials that adjust to your progress
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>24/7 availability
                  for practice and feedback
                </li>
              </ul>
            </div>
          </section>

          {/* IELTS Modules with AI */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              AI-Powered Preparation for Each IELTS Module
            </h2>
            <div className="space-y-8">
              {ieltsModules.map((module, index) => (
                <GradientCard key={module.name} className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 flex items-center">
                      <span className="text-primary mr-3">{index + 1}</span>
                      {module.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3">AI Features:</h4>
                      <ul className="space-y-2">
                        {module.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <span className="text-primary mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">AI-Powered Tips:</h4>
                      <ul className="space-y-2">
                        {module.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <span className="text-primary mr-2">→</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">AI Advantage:</h4>
                    <p className="text-sm">{module.aiAdvantage}</p>
                  </div>
                </GradientCard>
              ))}
            </div>
          </section>

          {/* 10-Week Study Plan */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              AI-Guided 10-Week IELTS Study Plan
            </h2>
            <div className="space-y-6">
              {studyPlan.map((phase, index) => (
                <Card key={phase.phase} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{phase.phase}</h3>
                      <Badge variant="outline" className="mt-1">
                        {phase.duration}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {phase.description}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Activities:</h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {phase.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="text-primary mr-2">✓</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Tools Comparison */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Best AI Tools for IELTS Preparation
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-secondary/20">
                    <th className="border border-gray-300 p-3 text-left">
                      Tool
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      Strengths
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      Best For
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold">
                      Fluenta IELTS AI
                    </td>
                    <td className="border border-gray-300 p-3">
                      Complete preparation, personalized feedback
                    </td>
                    <td className="border border-gray-300 p-3">
                      All modules, comprehensive prep
                    </td>
                    <td className="border border-gray-300 p-3">
                      Free trial available
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold">
                      IELTS Prep AI
                    </td>
                    <td className="border border-gray-300 p-3">
                      Writing feedback, band score prediction
                    </td>
                    <td className="border border-gray-300 p-3">
                      Writing Task 1 & 2
                    </td>
                    <td className="border border-gray-300 p-3">$29/month</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold">
                      SpeechAce
                    </td>
                    <td className="border border-gray-300 p-3">
                      Pronunciation analysis, speaking practice
                    </td>
                    <td className="border border-gray-300 p-3">
                      Speaking module
                    </td>
                    <td className="border border-gray-300 p-3">$19/month</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold">
                      AI Tutor IELTS
                    </td>
                    <td className="border border-gray-300 p-3">
                      Listening practice, adaptive difficulty
                    </td>
                    <td className="border border-gray-300 p-3">
                      Listening & Reading
                    </td>
                    <td className="border border-gray-300 p-3">$15/month</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Success Strategies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Proven AI-Enhanced Success Strategies
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                    Daily Practice Routine
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Dedicate 2-3 hours daily using AI tools for different
                    modules, with AI tracking your consistency and progress.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                    Weakness-Focused Learning
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Let AI identify your weak areas and spend 60% of your time
                    improving these specific skills.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                  <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">
                    Mock Test Strategy
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Take AI-powered mock tests weekly to simulate real exam
                    conditions and track improvement.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                  <h3 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">
                    Vocabulary Building
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Use AI-powered spaced repetition to learn and retain new
                    vocabulary effectively for all modules.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                  <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">
                    Time Management
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Practice with AI timing tools to master time allocation for
                    each section of the exam.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-teal-500 bg-teal-50 dark:bg-teal-900/20">
                  <h3 className="font-semibold mb-2 text-teal-800 dark:text-teal-200">
                    Continuous Assessment
                  </h3>
                  <p className="text-sm text-teal-700 dark:text-teal-300">
                    Regular AI assessment helps you understand your progress and
                    adjust your study plan accordingly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Band Score Breakdown */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Understanding Band Scores with AI Analytics
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Band Score 6.5 - 7.0</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>AI Focus Areas:</strong>
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Grammar accuracy improvement</li>
                    <li>• Vocabulary range expansion</li>
                    <li>• Coherence in writing and speaking</li>
                    <li>• Listening for specific information</li>
                  </ul>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Band Score 7.5 - 8.0</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>AI Focus Areas:</strong>
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Complex sentence structures</li>
                    <li>• Idiomatic expressions usage</li>
                    <li>• Critical thinking in writing</li>
                    <li>• Natural pronunciation patterns</li>
                  </ul>
                </div>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Your AI-Powered IELTS Success Journey
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Preparing for IELTS with AI is not just about using
              technology—it's about leveraging intelligent systems that
              understand your learning patterns, adapt to your needs, and
              provide the personalized guidance you need to succeed. The
              combination of AI-powered practice, instant feedback, and adaptive
              learning creates an optimal environment for IELTS preparation.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Remember, consistency is key. Use AI tools daily, trust the
              personalized recommendations, and focus on your identified weak
              areas. With the right AI-powered approach, achieving your target
              band score is not just possible—it's inevitable.
            </p>
            <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <h3 className="font-bold text-xl mb-3">
                Ready to Start Your AI-Powered IELTS Journey?
              </h3>
              <p className="mb-4">
                Join thousands of successful IELTS candidates who used AI to
                achieve their target scores.
              </p>
              <div className="flex gap-3">
                <Link href="/register">
                  <Button size="lg">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </section>
        </article>

        {/* Related Posts */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map(post => (
              <Card
                key={post.title}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {post.category}
                  </Badge>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    <Link href={post.href}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="font-bold text-xl">
                Fluenta
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Master English with AI-powered learning
              </p>
            </div>
            <div className="flex gap-6">
              <Link
                href="/blog"
                className="text-sm hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/pricing"
                className="text-sm hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
