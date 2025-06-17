import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import PopularResourcesEn from "@/components/layout/PopularResourcesEn";
import FooterEn from "@/components/layout/FooterEn";

export const metadata: Metadata = {
  title: "Complete English Grammar Guide | Fluenta",
  description:
    "Master all aspects of English grammar with this comprehensive guide. From basic sentence structures to advanced grammar rules, includes practical examples and exercises for all levels.",
  keywords:
    "English grammar guide, English grammar rules, basic English grammar, advanced English grammar, English sentence structure, grammar exercises, English tenses, English grammar book",
  alternates: {
    canonical: "/en/blog/complete-english-grammar-guide",
    languages: {
      en: "/en/blog/complete-english-grammar-guide",
      tr: "/blog/ingilizce-gramer-rehberi",
    },
  },
  openGraph: {
    title: "Complete English Grammar Guide: From Basics to Advanced",
    description:
      "Master all aspects of English grammar with this comprehensive guide. From basic sentence structures to advanced grammar rules, includes practical examples and exercises.",
    type: "article",
    locale: "en_US",
    publishedTime: "2024-12-28",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/english-grammar-guide-en.jpg",
        width: 1200,
        height: 630,
        alt: "Complete English Grammar Guide",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200/50 dark:border-green-700/50">
      <span className="text-sm font-medium text-green-700 dark:text-green-300">
        {children}
      </span>
    </div>
  </div>
);

export default function CompleteEnglishGrammarGuide() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav currentPath="/en/blog" language="en" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/en" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <Link href="/en/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>›</span>
          <span>Grammar Guide</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>From Basics to Advanced</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">Grammar</Badge>
              <Badge variant="outline">Complete Guide</Badge>
              <Badge variant="outline">18 min read</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Complete English Grammar Guide: From Basics to Advanced
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master all aspects of English grammar with this comprehensive
              guide. From basic sentence structures to advanced grammar rules,
              this guide includes practical examples and exercises for learners
              at all levels.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>December 28, 2024</span>
              <span>•</span>
              <span>18 min read</span>
              <span>•</span>
              <span>Grammar</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  📚 Why Grammar Matters in English Learning
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Grammar is the foundation of effective communication in
                  English. It's not just about following rules—it's about
                  expressing your ideas clearly and being understood by others.
                  This comprehensive guide will take you from basic concepts to
                  advanced structures, helping you build confidence in your
                  English communication.
                </p>
              </div>
            </GradientCard>
          </section>

          <h2>Part 1: Basic Grammar Foundations</h2>

          <h3>1.1 Parts of Speech</h3>
          <p>
            Understanding the eight parts of speech is essential for building
            sentences correctly:
          </p>
          <ul>
            <li>
              <strong>Nouns:</strong> Person, place, thing, or idea (cat,
              London, happiness)
            </li>
            <li>
              <strong>Pronouns:</strong> Replace nouns (he, she, it, they)
            </li>
            <li>
              <strong>Verbs:</strong> Action or state words (run, is, think)
            </li>
            <li>
              <strong>Adjectives:</strong> Describe nouns (beautiful, tall,
              smart)
            </li>
            <li>
              <strong>Adverbs:</strong> Describe verbs, adjectives, or other
              adverbs (quickly, very, well)
            </li>
            <li>
              <strong>Prepositions:</strong> Show relationships (in, on, at,
              with)
            </li>
            <li>
              <strong>Conjunctions:</strong> Connect words or phrases (and, but,
              or)
            </li>
            <li>
              <strong>Interjections:</strong> Express emotions (oh, wow, ouch)
            </li>
          </ul>

          <h3>1.2 Basic Sentence Structure</h3>
          <p>
            English sentences follow a basic Subject-Verb-Object (SVO) pattern:
          </p>
          <ul>
            <li>
              <strong>Subject:</strong> Who or what performs the action
            </li>
            <li>
              <strong>Verb:</strong> The action or state
            </li>
            <li>
              <strong>Object:</strong> Who or what receives the action
            </li>
          </ul>
          <p>
            <strong>Example:</strong> "Sarah (Subject) reads (Verb) books
            (Object)."
          </p>

          <Card className="my-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                💡 Grammar Practice Tip
              </h3>
              <p>
                Start with simple sentences and gradually add complexity.
                Fluenta's AI grammar checker can help you identify and correct
                common mistakes in real-time, making your learning process more
                efficient.
              </p>
            </CardContent>
          </Card>

          <h2>Part 2: Verb Tenses and Forms</h2>

          <h3>2.1 Present Tenses</h3>
          <p>English has four present tenses, each with specific uses:</p>
          <ul>
            <li>
              <strong>Simple Present:</strong> Habits, facts, general truths
              <br />
              Example: "I work every day."
            </li>
            <li>
              <strong>Present Continuous:</strong> Actions happening now
              <br />
              Example: "I am working right now."
            </li>
            <li>
              <strong>Present Perfect:</strong> Past actions with present
              relevance
              <br />
              Example: "I have worked here for five years."
            </li>
            <li>
              <strong>Present Perfect Continuous:</strong> Ongoing actions that
              started in the past
              <br />
              Example: "I have been working since morning."
            </li>
          </ul>

          <h3>2.2 Past Tenses</h3>
          <p>
            The four past tenses help express different types of past actions:
          </p>
          <ul>
            <li>
              <strong>Simple Past:</strong> Completed actions in the past
              <br />
              Example: "I worked yesterday."
            </li>
            <li>
              <strong>Past Continuous:</strong> Ongoing past actions
              <br />
              Example: "I was working when you called."
            </li>
            <li>
              <strong>Past Perfect:</strong> Actions completed before another
              past action
              <br />
              Example: "I had worked before the meeting started."
            </li>
            <li>
              <strong>Past Perfect Continuous:</strong> Ongoing actions up to a
              past point
              <br />
              Example: "I had been working for hours before taking a break."
            </li>
          </ul>

          <h3>2.3 Future Tenses</h3>
          <p>Express future actions and plans with these tense forms:</p>
          <ul>
            <li>
              <strong>Simple Future:</strong> Future plans and predictions
              <br />
              Example: "I will work tomorrow."
            </li>
            <li>
              <strong>Future Continuous:</strong> Ongoing future actions
              <br />
              Example: "I will be working at 3 PM."
            </li>
            <li>
              <strong>Future Perfect:</strong> Actions completed by a future
              time
              <br />
              Example: "I will have worked 40 hours by Friday."
            </li>
            <li>
              <strong>Future Perfect Continuous:</strong> Ongoing actions up to
              a future point
              <br />
              Example: "By next year, I will have been working here for a
              decade."
            </li>
          </ul>

          <h2>Part 3: Advanced Grammar Concepts</h2>

          <h3>3.1 Conditional Sentences</h3>
          <p>
            Conditionals express hypothetical situations and their consequences:
          </p>
          <ul>
            <li>
              <strong>Zero Conditional:</strong> General truths
              <br />
              Example: "If you heat water to 100°C, it boils."
            </li>
            <li>
              <strong>First Conditional:</strong> Real future possibilities
              <br />
              Example: "If it rains, I will stay home."
            </li>
            <li>
              <strong>Second Conditional:</strong> Unreal present situations
              <br />
              Example: "If I were rich, I would travel the world."
            </li>
            <li>
              <strong>Third Conditional:</strong> Unreal past situations
              <br />
              Example: "If I had studied harder, I would have passed the exam."
            </li>
          </ul>

          <h3>3.2 Passive Voice</h3>
          <p>
            Use passive voice when the action is more important than who
            performs it:
          </p>
          <ul>
            <li>
              <strong>Active:</strong> "The chef prepared the meal."
            </li>
            <li>
              <strong>Passive:</strong> "The meal was prepared by the chef."
            </li>
          </ul>
          <p>
            Passive voice is formed with: <strong>be + past participle</strong>
          </p>

          <Card className="my-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                🎯 Advanced Grammar Practice
              </h3>
              <p>
                Complex grammar structures require practice in context.
                Fluenta's AI conversation partner provides opportunities to use
                advanced grammar naturally in realistic conversations, helping
                you internalize these patterns.
              </p>
            </CardContent>
          </Card>

          <h3>3.3 Reported Speech</h3>
          <p>When reporting what someone said, several changes occur:</p>
          <ul>
            <li>
              <strong>Tense changes:</strong> Present → Past, Past → Past
              Perfect
            </li>
            <li>
              <strong>Pronoun changes:</strong> "I" → "he/she"
            </li>
            <li>
              <strong>Time expressions:</strong> "now" → "then", "today" → "that
              day"
            </li>
          </ul>
          <p>
            <strong>Direct:</strong> "I am tired," she said.
            <br />
            <strong>Reported:</strong> She said that she was tired.
          </p>

          <h2>Part 4: Common Grammar Mistakes to Avoid</h2>

          <h3>4.1 Subject-Verb Agreement</h3>
          <p>Ensure subjects and verbs agree in number:</p>
          <ul>
            <li>❌ "The team are playing well."</li>
            <li>✅ "The team is playing well."</li>
            <li>❌ "Each of the students have a book."</li>
            <li>✅ "Each of the students has a book."</li>
          </ul>

          <h3>4.2 Article Usage</h3>
          <p>Master the use of a, an, and the:</p>
          <ul>
            <li>
              <strong>A/An:</strong> Indefinite articles for singular countable
              nouns
            </li>
            <li>
              <strong>The:</strong> Definite article for specific nouns
            </li>
            <li>
              <strong>No article:</strong> With plural countable nouns (general)
              and uncountable nouns
            </li>
          </ul>

          <h3>4.3 Preposition Confusion</h3>
          <p>Common preposition mistakes:</p>
          <ul>
            <li>❌ "I'm interested about music."</li>
            <li>✅ "I'm interested in music."</li>
            <li>❌ "I depend of my parents."</li>
            <li>✅ "I depend on my parents."</li>
          </ul>

          <h2>Part 5: Grammar in Context</h2>

          <h3>5.1 Formal vs. Informal Grammar</h3>
          <p>Adjust your grammar based on the situation:</p>
          <ul>
            <li>
              <strong>Formal:</strong> "I would like to request a meeting."
            </li>
            <li>
              <strong>Informal:</strong> "Can we meet?"
            </li>
            <li>
              <strong>Formal:</strong> "It is I who called you."
            </li>
            <li>
              <strong>Informal:</strong> "It's me who called you."
            </li>
          </ul>

          <h3>5.2 Grammar for Different Text Types</h3>
          <p>Different writing styles require different grammar approaches:</p>
          <ul>
            <li>
              <strong>Academic Writing:</strong> Complex sentences, passive
              voice, formal vocabulary
            </li>
            <li>
              <strong>Business Communication:</strong> Clear, concise,
              professional tone
            </li>
            <li>
              <strong>Creative Writing:</strong> Varied sentence structures,
              descriptive language
            </li>
            <li>
              <strong>Conversational English:</strong> Contractions, informal
              structures
            </li>
          </ul>

          <GradientCard className="my-8">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Master Grammar with AI-Powered Practice
              </h3>
              <p className="text-muted-foreground mb-6">
                Take your grammar skills to the next level with Fluenta's
                personalized grammar exercises and real-time feedback system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8">
                    Start Grammar Practice
                  </Button>
                </Link>
                <Link href="/en/modules/grammar">
                  <Button variant="outline" size="lg" className="text-lg px-8">
                    Explore Grammar Module
                  </Button>
                </Link>
              </div>
            </div>
          </GradientCard>

          <h2>Grammar Learning Strategies</h2>
          <p>Effective grammar learning requires the right approach:</p>
          <ol>
            <li>
              <strong>Learn in Context:</strong> Study grammar within meaningful
              sentences
            </li>
            <li>
              <strong>Practice Regularly:</strong> Consistent practice is key to
              retention
            </li>
            <li>
              <strong>Use Real Examples:</strong> Apply grammar rules to your
              own writing
            </li>
            <li>
              <strong>Get Feedback:</strong> Use AI tools or teachers to correct
              mistakes
            </li>
            <li>
              <strong>Read Extensively:</strong> Exposure to correct grammar
              through reading
            </li>
            <li>
              <strong>Write Daily:</strong> Apply grammar rules in your own
              compositions
            </li>
          </ol>

          <h2>Conclusion</h2>
          <p>
            Mastering English grammar is a journey that requires patience,
            practice, and the right resources. This comprehensive guide provides
            the foundation you need, but remember that grammar is best learned
            through use, not just memorization.
          </p>
          <p>
            Start with the basics, practice consistently, and gradually work
            your way up to more complex structures. With dedication and the
            right tools, you can achieve grammatical accuracy and express
            yourself confidently in English.
          </p>

          {/* Related Articles */}
          <section className="mt-16 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">
                    <Link
                      href="/en/blog/ai-english-grammar-checker"
                      className="hover:text-primary"
                    >
                      AI English Grammar Checker Review
                    </Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Discover the best AI grammar checking tools to improve your
                    writing accuracy.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">
                    <Link
                      href="/en/blog/business-english-career-guide"
                      className="hover:text-primary"
                    >
                      Business English Career Guide
                    </Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Learn professional English grammar and communication skills
                    for your career.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>

        {/* Popular Resources */}
        <PopularResourcesEn />
      </main>

      {/* Footer */}
      <FooterEn />
    </div>
  );
}
