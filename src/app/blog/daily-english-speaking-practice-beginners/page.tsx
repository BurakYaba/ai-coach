import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title:
    "Daily English Speaking Practice for Beginners: Your 30-Day Plan | Fluenta",
  description:
    "Transform your English speaking skills with this comprehensive 30-day practice plan. Perfect for beginners who want to build confidence and fluency with daily speaking exercises and proven techniques.",
  keywords:
    "English speaking practice beginners, daily English speaking, English conversation practice, English speaking confidence, learn English speaking, English fluency practice, beginner English speaking tips",
  openGraph: {
    title:
      "Daily English Speaking Practice for Beginners: Your 30-Day Plan | Fluenta",
    description:
      "Transform your English speaking skills with this comprehensive 30-day practice plan. Perfect for beginners who want to build confidence and fluency with daily speaking exercises and proven techniques.",
    type: "article",
  },
};

const weeklyPlans = [
  {
    week: 1,
    title: "Foundation Week: Building Basic Confidence",
    focus: "Getting comfortable with basic sounds and simple phrases",
    dailyMinutes: "10-15 minutes",
    activities: [
      "Practice alphabet pronunciation",
      "Record yourself saying basic greetings",
      "Learn 5 new words daily with pronunciation",
      "Repeat after audio materials",
      "Practice introducing yourself",
    ],
    goals: [
      "Familiarize with English sounds",
      "Build basic pronunciation habits",
      "Overcome initial speaking anxiety",
      "Create daily practice routine",
    ],
  },
  {
    week: 2,
    title: "Vocabulary Week: Expanding Your Word Bank",
    focus: "Learning essential everyday vocabulary with pronunciation",
    dailyMinutes: "15-20 minutes",
    activities: [
      "Practice common verbs and actions",
      "Learn family and relationship words",
      "Practice numbers and time expressions",
      "Describe daily routine activities",
      "Use new words in simple sentences",
    ],
    goals: [
      "Master 50+ essential words",
      "Practice word stress patterns",
      "Connect vocabulary to daily life",
      "Build sentence formation skills",
    ],
  },
  {
    week: 3,
    title: "Conversation Week: Basic Interactions",
    focus: "Engaging in simple conversations and dialogues",
    dailyMinutes: "20-25 minutes",
    activities: [
      "Practice asking and answering questions",
      "Role-play basic conversations",
      "Learn phone conversation basics",
      "Practice ordering food dialogue",
      "Express likes and dislikes",
    ],
    goals: [
      "Handle basic conversational exchanges",
      "Use question and answer patterns",
      "Practice turn-taking in dialogue",
      "Express basic opinions",
    ],
  },
  {
    week: 4,
    title: "Fluency Week: Putting It All Together",
    focus: "Improving flow and natural speaking patterns",
    dailyMinutes: "25-30 minutes",
    activities: [
      "Tell simple stories about your day",
      "Practice longer conversations",
      "Work on connected speech",
      "Express future plans and past events",
      "Practice speaking without preparation",
    ],
    goals: [
      "Speak in longer stretches",
      "Improve rhythm and flow",
      "Reduce hesitation and pauses",
      "Build speaking confidence",
    ],
  },
];

const dailyRoutines = [
  {
    time: "Morning (5 minutes)",
    activity: "Pronunciation Warm-up",
    description:
      "Start your day by practicing challenging sounds and tongue twisters",
    tips: [
      "Focus on sounds you find difficult",
      "Use a mirror to watch your mouth movements",
      "Record yourself for later review",
      "Repeat the same exercises for a week",
    ],
  },
  {
    time: "Midday (10 minutes)",
    activity: "Vocabulary Practice",
    description: "Learn and practice new words with proper pronunciation",
    tips: [
      "Use words in complete sentences",
      "Practice word stress and intonation",
      "Connect new words to your experiences",
      "Review previous day's vocabulary",
    ],
  },
  {
    time: "Evening (15 minutes)",
    activity: "Conversation Practice",
    description: "Engage in speaking activities and dialogue practice",
    tips: [
      "Talk to yourself about your day",
      "Practice with language exchange partners",
      "Use AI conversation tools",
      "Record conversations for review",
    ],
  },
];

const commonChallenges = [
  {
    challenge: "Fear of Making Mistakes",
    solution: "Embrace mistakes as learning opportunities",
    strategies: [
      "Remember that mistakes are natural",
      "Focus on communication over perfection",
      "Practice in a safe, judgment-free environment",
      "Celebrate small improvements daily",
    ],
  },
  {
    challenge: "Lack of Vocabulary",
    solution: "Build vocabulary systematically and practically",
    strategies: [
      "Learn words in context, not isolation",
      "Focus on high-frequency words first",
      "Use new words immediately in sentences",
      "Create personal vocabulary journals",
    ],
  },
  {
    challenge: "Pronunciation Difficulties",
    solution: "Practice with systematic pronunciation training",
    strategies: [
      "Learn International Phonetic Alphabet basics",
      "Use pronunciation apps and tools",
      "Practice minimal pairs exercises",
      "Record and compare with native speakers",
    ],
  },
  {
    challenge: "Lack of Practice Partners",
    solution: "Use technology and creative practice methods",
    strategies: [
      "Practice with AI conversation partners",
      "Join online language exchange platforms",
      "Talk to yourself throughout the day",
      "Use mirror practice for confidence",
    ],
  },
];

const speakingTips = [
  {
    category: "Pronunciation",
    tips: [
      "Focus on clear vowel sounds",
      "Practice word stress patterns",
      "Learn common English rhythm",
      "Use tongue twisters for difficult sounds",
    ],
  },
  {
    category: "Fluency",
    tips: [
      "Don't pause to translate in your head",
      "Use fillers like 'well', 'you know' naturally",
      "Practice speaking at normal speed",
      "Think in English, not your native language",
    ],
  },
  {
    category: "Confidence",
    tips: [
      "Start with topics you know well",
      "Practice positive self-talk",
      "Set small, achievable daily goals",
      "Celebrate every speaking success",
    ],
  },
  {
    category: "Grammar",
    tips: [
      "Focus on basic sentence patterns first",
      "Don't worry about perfect grammar initially",
      "Learn chunks and common phrases",
      "Practice verb tenses in context",
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
    title: "How to Prepare for IELTS Using AI: Complete Guide",
    href: "/blog/ielts-preparation-ai-guide",
    category: "IELTS",
  },
  {
    title: "10 Common English Grammar Mistakes and How to Avoid Them",
    href: "/blog/english-grammar-mistakes-avoid",
    category: "Grammar",
  },
];

export default function DailySpeakingPractice() {
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
          <span>Daily English Speaking Practice for Beginners</span>
        </nav>

        {/* Article Header */}
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Speaking</Badge>
              <Badge variant="secondary">10 min read</Badge>
              <Badge variant="secondary">December 5, 2024</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Daily English Speaking Practice for Beginners: Your 30-Day Plan
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transform your English speaking skills with this comprehensive
              30-day practice plan. Perfect for beginners who want to build
              confidence and fluency through structured daily exercises and
              proven speaking techniques.
            </p>
          </header>

          {/* Introduction */}
          <section className="mb-12 text-foreground">
            <p className="text-lg leading-relaxed mb-6">
              Learning to speak English confidently is one of the biggest
              challenges for beginners. Many students can read and write English
              reasonably well, but when it comes to speaking, they freeze up or
              feel embarrassed about their pronunciation and grammar. The good
              news is that speaking skills improve dramatically with consistent
              daily practice.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              This 30-day plan is specifically designed for beginners who want
              to develop their speaking skills systematically. Each week focuses
              on different aspects of speaking, from basic pronunciation to
              conversational fluency. By following this plan for just 10-30
              minutes daily, you'll see significant improvement in your
              confidence and ability to communicate in English.
            </p>
            <div className="p-6 bg-primary/10 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-lg mb-2">
                What You'll Achieve in 30 Days:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Overcome speaking
                  anxiety and build confidence
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Master essential
                  pronunciation patterns
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Learn 200+
                  practical vocabulary words
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Handle basic
                  conversations independently
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>Develop natural
                  speaking rhythm and flow
                </li>
              </ul>
            </div>
          </section>

          {/* 30-Day Plan */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Your 30-Day Speaking Transformation Plan
            </h2>
            <div className="space-y-8">
              {weeklyPlans.map((week, index) => (
                <GradientCard key={week.week} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Week {week.week}: {week.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">{week.focus}</p>
                      <Badge variant="outline">
                        Daily Practice: {week.dailyMinutes}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {week.week}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Daily Activities:</h4>
                      <ul className="space-y-2">
                        {week.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <span className="text-primary mr-2">•</span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Week Goals:</h4>
                      <ul className="space-y-2">
                        {week.goals.map((goal, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <span className="text-primary mr-2">→</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GradientCard>
              ))}
            </div>
          </section>

          {/* Daily Routine Structure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Perfect Daily Speaking Routine
            </h2>
            <div className="space-y-6">
              {dailyRoutines.map((routine, index) => (
                <Card key={routine.time} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center">
                        <span className="text-primary mr-3">{index + 1}</span>
                        {routine.activity}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {routine.time}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {routine.description}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Pro Tips:</h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {routine.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="text-primary mr-2">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Common Challenges */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Overcoming Common Speaking Challenges
            </h2>
            <div className="space-y-6">
              {commonChallenges.map((item, index) => (
                <Card key={item.challenge} className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                      Challenge: {item.challenge}
                    </h3>
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      Solution: {item.solution}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Strategies:</h4>
                    <ul className="space-y-2">
                      {item.strategies.map((strategy, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="text-primary mr-2">✓</span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Speaking Tips by Category */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Essential Speaking Tips by Category
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {speakingTips.map(category => (
                <GradientCard key={category.category} className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-3">
                      {category.category === "Pronunciation" && "🗣️"}
                      {category.category === "Fluency" && "🌊"}
                      {category.category === "Confidence" && "💪"}
                      {category.category === "Grammar" && "📝"}
                    </span>
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </GradientCard>
              ))}
            </div>
          </section>

          {/* Progress Tracking */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Track Your Speaking Progress
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Week 1 Milestones</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Recorded self-introduction
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Practiced 35+ new words
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Comfortable with basic greetings
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Daily practice routine established
                  </li>
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Week 2-3 Milestones</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Can ask basic questions
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Learned 100+ vocabulary words
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Participated in simple dialogues
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Improved pronunciation clarity
                  </li>
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Week 4 Achievements</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Can tell simple stories
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Comfortable with longer conversations
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Reduced speaking anxiety
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Confident in basic English communication
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Tools and Resources */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Recommended Tools and Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Free Resources:</h3>
                <ul className="space-y-2">
                  <li className="p-3 border rounded-lg">
                    <strong>Voice Recorder Apps:</strong> Practice and review
                    your speaking
                  </li>
                  <li className="p-3 border rounded-lg">
                    <strong>YouTube Channels:</strong> English pronunciation and
                    speaking practice
                  </li>
                  <li className="p-3 border rounded-lg">
                    <strong>Language Exchange Apps:</strong> Practice with
                    native speakers
                  </li>
                  <li className="p-3 border rounded-lg">
                    <strong>Online Dictionaries:</strong> Learn correct
                    pronunciation
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Premium Tools:</h3>
                <ul className="space-y-2">
                  <li className="p-3 border rounded-lg">
                    <strong>Fluenta AI Coach:</strong> Personalized speaking
                    practice and feedback
                  </li>
                  <li className="p-3 border rounded-lg">
                    <strong>Speech Recognition Apps:</strong> Pronunciation
                    accuracy training
                  </li>
                  <li className="p-3 border rounded-lg">
                    <strong>Online Tutoring:</strong> One-on-one speaking
                    practice sessions
                  </li>
                  <li className="p-3 border rounded-lg">
                    <strong>Pronunciation Software:</strong> Advanced phonetic
                    training
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Your Speaking Success Starts Today
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Remember, learning to speak English confidently is a journey, not
              a destination. This 30-day plan provides you with a structured
              approach to build your speaking skills systematically. The key to
              success is consistency— even 10-15 minutes of daily practice will
              yield remarkable results.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Don't worry about making mistakes; they're an essential part of
              the learning process. Focus on communication over perfection, and
              celebrate every small victory along the way. By the end of 30
              days, you'll be amazed at how much more confident and fluent
              you've become.
            </p>
            <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <h3 className="font-bold text-xl mb-3">
                Ready to Transform Your English Speaking?
              </h3>
              <p className="mb-4">
                Start your 30-day speaking journey today with AI-powered
                practice and personalized feedback.
              </p>
              <div className="flex gap-3">
                <Link href="/register">
                  <Button size="lg">Start Speaking Practice</Button>
                </Link>
                <Link href="/speaking-assessment">
                  <Button variant="outline" size="lg">
                    Take Speaking Assessment
                  </Button>
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
