import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "10 Common English Grammar Mistakes and How to Avoid Them",
  description:
    "Learn about the most common grammar mistakes English learners make and get practical tips to avoid them. Improve your writing and speaking accuracy with expert guidance.",
  keywords:
    "English grammar mistakes, common grammar errors, grammar tips, English writing, grammar rules, language learning mistakes, grammar improvement, English accuracy",
  openGraph: {
    title: "10 Common English Grammar Mistakes and How to Avoid Them",
    description:
      "Master English grammar by learning to avoid the most common mistakes. Expert tips for better writing and speaking accuracy.",
    type: "article",
    images: [
      {
        url: "/og-images/og-grammar-mistakes.png",
        width: 1200,
        height: 630,
        alt: "Common English Grammar Mistakes Guide",
      },
    ],
  },
};

export default function BlogPost() {
  const grammarMistakes = [
    {
      mistake: "Subject-Verb Disagreement",
      wrong: "The list of students are long.",
      correct: "The list of students is long.",
      explanation:
        "The subject 'list' is singular, so it requires a singular verb 'is'.",
      tip: "Identify the main subject, not the words in between.",
    },
    {
      mistake: "Using 'There' vs 'Their' vs 'They're'",
      wrong: "Their going to they're house over there.",
      correct: "They're going to their house over there.",
      explanation:
        "They're = they are, their = possessive, there = location/existence.",
      tip: "Substitute 'they are' to check if 'they're' is correct.",
    },
    {
      mistake: "Dangling Modifiers",
      wrong: "Walking to the store, the rain started falling.",
      correct: "Walking to the store, I noticed the rain started falling.",
      explanation: "The modifier should clearly relate to who was walking.",
      tip: "Make sure the modifier clearly describes the intended subject.",
    },
    {
      mistake: "Apostrophe Errors",
      wrong: "The cat's are sleeping. Its a nice day.",
      correct: "The cats are sleeping. It's a nice day.",
      explanation: "Apostrophes show possession or contractions, not plurals.",
      tip: "Its = possessive, It's = it is. Don't use apostrophes for plurals.",
    },
    {
      mistake: "Run-on Sentences",
      wrong: "I went to the store I bought milk I came home.",
      correct: "I went to the store, bought milk, and came home.",
      explanation:
        "Connect related ideas properly with punctuation or conjunctions.",
      tip: "Use periods, semicolons, or coordinating conjunctions to separate ideas.",
    },
    {
      mistake: "Sentence Fragments",
      wrong: "Because I was tired.",
      correct: "Because I was tired, I went to bed early.",
      explanation:
        "Dependent clauses need an independent clause to be complete.",
      tip: "Ensure every sentence expresses a complete thought.",
    },
    {
      mistake: "Who vs Whom",
      wrong: "Who did you give the book to?",
      correct:
        "Whom did you give the book to? / To whom did you give the book?",
      explanation: "Use 'whom' when the person is the object of the sentence.",
      tip: "If you can replace it with 'him/her', use 'whom'. If 'he/she', use 'who'.",
    },
    {
      mistake: "Less vs Fewer",
      wrong: "There are less people today.",
      correct: "There are fewer people today.",
      explanation:
        "Use 'fewer' with countable nouns, 'less' with uncountable nouns.",
      tip: "If you can count it, use 'fewer'. If you can't count it, use 'less'.",
    },
    {
      mistake: "Double Negatives",
      wrong: "I don't have no money.",
      correct: "I don't have any money. / I have no money.",
      explanation: "Two negatives make a positive in English.",
      tip: "Use only one negative word per clause.",
    },
    {
      mistake: "Misplaced Commas in Lists",
      wrong: "I like apples, oranges, and, bananas.",
      correct: "I like apples, oranges, and bananas.",
      explanation:
        "Commas separate items in a list, with optional Oxford comma before 'and'.",
      tip: "Don't put commas before and after 'and' in the same list.",
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
                href="/modules/grammar-coach"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Grammar Coach
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm">Start Grammar Practice</Button>
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
          <span>Grammar Mistakes to Avoid</span>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Grammar</Badge>
              <Badge variant="outline">Writing Tips</Badge>
              <Badge variant="outline">Language Learning</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              10 Common English Grammar Mistakes and How to Avoid Them
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Master English grammar by learning to identify and avoid the most
              common mistakes. This comprehensive guide provides practical tips
              for better writing and speaking accuracy.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>November 28, 2024</span>
              <span>•</span>
              <span>9 min read</span>
              <span>•</span>
              <span>Grammar Guide</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-lg leading-relaxed mb-4">
              Even advanced English learners make grammar mistakes. The key to
              improving your English is recognizing these common errors and
              understanding how to correct them. Whether you're writing an
              email, preparing for an exam, or having a conversation, avoiding
              these mistakes will make your English sound more natural and
              professional.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              In this comprehensive guide, we'll explore the 10 most common
              grammar mistakes English learners make, provide clear examples,
              and give you practical strategies to avoid them in your own
              writing and speaking.
            </p>
          </section>

          {/* Why Grammar Matters */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              Why Grammar Accuracy Matters
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <GradientCard>
                <CardHeader>
                  <CardTitle>Professional Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Proper grammar makes you appear more credible and
                    professional in business settings, academic writing, and
                    formal communications.
                  </p>
                </CardContent>
              </GradientCard>

              <Card>
                <CardHeader>
                  <CardTitle>Clear Understanding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Correct grammar ensures your message is understood exactly
                    as you intended, preventing miscommunication and confusion.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Grammar Mistakes List */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              The 10 Most Common Grammar Mistakes
            </h2>

            <div className="space-y-8">
              {grammarMistakes.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {index + 1}. {item.mistake}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                          ❌ Incorrect:
                        </h4>
                        <p className="italic">{item.wrong}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                          ✅ Correct:
                        </h4>
                        <p className="italic">{item.correct}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        📖 Explanation:
                      </h4>
                      <p>{item.explanation}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">
                        💡 Pro Tip:
                      </h4>
                      <p>{item.tip}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Grammar Practice Tips */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              How to Practice and Improve Your Grammar
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <GradientCard>
                <CardHeader>
                  <CardTitle>Read Actively</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Read high-quality English content daily</li>
                    <li>Pay attention to sentence structure</li>
                    <li>Note how professional writers use grammar</li>
                    <li>Keep a grammar journal of new patterns</li>
                  </ul>
                </CardContent>
              </GradientCard>

              <Card>
                <CardHeader>
                  <CardTitle>Write Regularly</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Practice writing emails, essays, and reports</li>
                    <li>Use grammar-checking tools for feedback</li>
                    <li>Rewrite sentences to practice different structures</li>
                    <li>Focus on one grammar rule at a time</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Use Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>AI grammar checkers for instant feedback</li>
                    <li>Grammar apps for daily practice</li>
                    <li>Online exercises and quizzes</li>
                    <li>Voice recognition for speaking practice</li>
                  </ul>
                </CardContent>
              </Card>

              <GradientCard>
                <CardHeader>
                  <CardTitle>Get Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Join writing groups or language exchanges</li>
                    <li>Ask native speakers to review your writing</li>
                    <li>Work with an English tutor or AI coach</li>
                    <li>Record yourself speaking to identify patterns</li>
                  </ul>
                </CardContent>
              </GradientCard>
            </div>
          </section>

          {/* Common Grammar Resources */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">
              Grammar Learning Resources
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Essential Grammar Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• English Grammar in Use by Raymond Murphy</li>
                    <li>• The Elements of Style by Strunk & White</li>
                    <li>• Oxford English Grammar by Sidney Greenbaum</li>
                    <li>• Practical English Usage by Michael Swan</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Online Grammar Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Grammarly for instant error detection</li>
                    <li>• Fluenta AI for personalized feedback</li>
                    <li>• Purdue OWL for comprehensive guides</li>
                    <li>• Grammar Girl for quick tips</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Practice Websites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• English Grammar Online exercises</li>
                    <li>• Khan Academy grammar lessons</li>
                    <li>• BBC Learning English grammar</li>
                    <li>• Cambridge Assessment English</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quiz Section */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Quick Grammar Quiz</h2>

            <GradientCard>
              <CardHeader>
                <CardTitle>Test Your Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Can you identify and correct the grammar mistakes in these
                  sentences? (Answers at the bottom)
                </p>
                <ol className="list-decimal list-inside space-y-2 mb-6">
                  <li>The team of players are ready for the game.</li>
                  <li>Their going to they're new house over there.</li>
                  <li>I have less books than you.</li>
                  <li>Who did you give the gift to?</li>
                  <li>I don't have no time for this.</li>
                </ol>
                <details className="bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold">
                    Click to see answers
                  </summary>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      1. The team of players <strong>is</strong> ready for the
                      game.
                    </p>
                    <p>
                      2. <strong>They're</strong> going to{" "}
                      <strong>their</strong> new house over there.
                    </p>
                    <p>
                      3. I have <strong>fewer</strong> books than you.
                    </p>
                    <p>
                      4. <strong>Whom</strong> did you give the gift to? / To{" "}
                      <strong>whom</strong> did you give the gift?
                    </p>
                    <p>
                      5. I don't have <strong>any</strong> time for this. / I
                      have <strong>no</strong> time for this.
                    </p>
                  </div>
                </details>
              </CardContent>
            </GradientCard>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Master English Grammar with AI-Powered Practice
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get personalized grammar feedback and practice exercises tailored
              to your common mistakes. Fluenta's AI grammar coach helps you
              improve faster than traditional methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Grammar Practice
                </Button>
              </Link>
              <Link href="/blog/ai-english-grammar-checker">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Compare Grammar Tools
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
                      href="/blog/ai-english-grammar-checker"
                      className="hover:text-primary"
                    >
                      AI English Grammar Checker: Top 8 Tools Compared
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Discover the best AI grammar checkers and find the perfect
                    tool for error-free writing...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/blog/vocabulary-building-strategies-2025"
                      className="hover:text-primary"
                    >
                      Advanced Vocabulary Building Strategies for 2025
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Expand your English vocabulary with proven methods and
                    advanced techniques...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link
                      href="/blog/5-ai-tools-improve-english-2025"
                      className="hover:text-primary"
                    >
                      5 AI Tools to Improve Your English in 2025
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Explore the latest AI-powered tools revolutionizing English
                    learning...
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
