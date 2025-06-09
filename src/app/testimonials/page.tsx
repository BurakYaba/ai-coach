import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Student Success Stories & Testimonials - Fluenta AI English Learning",
  description:
    "Read inspiring success stories from Fluenta students who improved their English speaking, pronunciation, and confidence. Discover real results from our AI-powered English learning platform.",
  keywords:
    "English learning success stories, Fluenta testimonials, AI English tutor results, pronunciation improvement stories, English speaking confidence, language learning transformation",
  openGraph: {
    title:
      "Student Success Stories & Testimonials - Fluenta AI English Learning",
    description:
      "Discover how students worldwide have transformed their English skills with Fluenta's AI-powered learning platform. Real stories, real results.",
    type: "website",
    images: [
      {
        url: "/og-images/og-testimonials.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Student Success Stories",
      },
    ],
  },
};

export default function Testimonials() {
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
                <Button size="sm">Start Your Success Story</Button>
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
          <span>Success Stories</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🌟 Success Stories</Badge>
            <Badge variant="outline">Real Results</Badge>
            <Badge variant="outline">Student Testimonials</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transform Your English Like These Students Did
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover how students worldwide have improved their English
            speaking, pronunciation, and confidence with Fluenta's AI-powered
            learning platform.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="mb-16">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Success by the Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    50,000+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Students Worldwide
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    87%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Improved Speaking Confidence
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    92%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Better Pronunciation Scores
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    3 Months
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Time to Next Level
                  </div>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </section>

        {/* Featured Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Success Stories
          </h2>

          <div className="space-y-12">
            {/* Maria's Story */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <GradientCard>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-lg italic mb-6">
                      "I went from being terrified of job interviews to
                      confidently landing my dream position at Google. Fluenta's
                      AI interview practice was a game-changer!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-xl">MR</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Maria Rodriguez</div>
                        <div className="text-muted-foreground/80">
                          Software Engineer at Google
                        </div>
                        <div className="text-sm text-muted-foreground/60">
                          Madrid, Spain
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </GradientCard>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Maria's Journey: B1 to C1 in 4 Months</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Challenge:</strong> Software engineer with
                        strong technical skills but struggled with English
                        communication in professional settings.
                      </div>
                      <div>
                        <strong>Solution:</strong> Used Fluenta's job interview
                        scenarios and business English modules daily for 20
                        minutes.
                      </div>
                      <div>
                        <strong>Results:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Improved from B1 to C1 level in 4 months</li>
                          <li>95% pronunciation accuracy score</li>
                          <li>Successfully interviewed at 5 tech companies</li>
                          <li>Received job offers from Google and Microsoft</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Ahmed's Story */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Ahmed's Success: From Silent Student to Class Leader
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Challenge:</strong> Graduate student afraid to
                        participate in class discussions due to pronunciation
                        concerns.
                      </div>
                      <div>
                        <strong>Solution:</strong> Focused on pronunciation
                        coaching and academic conversation scenarios.
                      </div>
                      <div>
                        <strong>Results:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>
                            Increased pronunciation accuracy from 72% to 94%
                          </li>
                          <li>Now leads study groups and presentations</li>
                          <li>Received teaching assistant position</li>
                          <li>Gained confidence to pursue PhD program</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="order-1 md:order-2">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-lg italic mb-6">
                      "Fluenta helped me overcome my pronunciation anxiety. I
                      went from avoiding class discussions to leading them. The
                      AI feedback was so encouraging and precise!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-xl">AK</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Ahmed Khalil</div>
                        <div className="text-muted-foreground">
                          PhD Candidate, University of Toronto
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Originally from Cairo, Egypt
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Li's Story */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-lg italic mb-6">
                      "As a busy working mom, Fluenta's flexibility was perfect.
                      I could practice during my commute and evening breaks. My
                      English improved so much that I got promoted!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-xl">LC</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Li Chen</div>
                        <div className="text-muted-foreground">
                          Marketing Director
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Shanghai, China
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Li's Transformation: Career Advancement Through English
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Challenge:</strong> Marketing manager needing
                        better English for international campaigns and team
                        leadership.
                      </div>
                      <div>
                        <strong>Solution:</strong> Used business English modules
                        and presentation practice during daily commute.
                      </div>
                      <div>
                        <strong>Results:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Promoted to Marketing Director</li>
                          <li>Now manages international teams</li>
                          <li>Leads client presentations in English</li>
                          <li>Increased salary by 40%</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Students Say
          </h2>

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
                  "The pronunciation feedback is incredibly detailed. I can
                  finally hear the difference between 'ship' and 'sheep'!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">YT</span>
                  </div>
                  <div>
                    <div className="font-semibold">Yuki Tanaka</div>
                    <div className="text-sm text-muted-foreground">
                      Student, Tokyo
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  "Fluenta made learning English fun and engaging. The AI
                  conversations feel so natural!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">PM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Pierre Martin</div>
                    <div className="text-sm text-muted-foreground">
                      Engineer, Paris
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  "I love how the AI adapts to my level. It's like having a
                  personal tutor available 24/7."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ana Silva</div>
                    <div className="text-sm text-muted-foreground">
                      Doctor, São Paulo
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  "The grammar explanations are so clear. I finally understand
                  why we use different tenses!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">MK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Mikhail Kowalski</div>
                    <div className="text-sm text-muted-foreground">
                      Teacher, Warsaw
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  "Perfect for busy professionals. I improved my business
                  English during lunch breaks."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">RN</span>
                  </div>
                  <div>
                    <div className="font-semibold">Raj Nair</div>
                    <div className="text-sm text-muted-foreground">
                      Consultant, Mumbai
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  "My kids are amazed at how much my English has improved.
                  Fluenta made it possible!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">SK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Seo-jin Kim</div>
                    <div className="text-sm text-muted-foreground">
                      Nurse, Seoul
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results by Skill */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Results by Skill Area
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <GradientCard>
              <CardHeader>
                <CardTitle className="text-center">
                  Speaking & Pronunciation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Pronunciation Accuracy</span>
                    <span className="font-bold">+23% average</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Speaking Confidence</span>
                    <span className="font-bold">+87% students</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fluency Score</span>
                    <span className="font-bold">+31% improvement</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Natural Rhythm</span>
                    <span className="font-bold">+45% better</span>
                  </div>
                </div>
              </CardContent>
            </GradientCard>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Grammar & Writing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Grammar Accuracy</span>
                    <span className="font-bold">+29% average</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Writing Clarity</span>
                    <span className="font-bold">+42% improvement</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vocabulary Usage</span>
                    <span className="font-bold">+38% growth</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Error Reduction</span>
                    <span className="font-bold">-65% fewer mistakes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Career Impact */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Career & Academic Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Job Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">73%</div>
                <p className="text-sm">
                  Students reported getting better job opportunities after
                  improving their English with Fluenta
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Academic Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">81%</div>
                <p className="text-sm">
                  Students improved their academic performance in English-taught
                  courses
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Confidence Boost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">94%</div>
                <p className="text-sm">
                  Students feel more confident speaking English in professional
                  and social settings
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Video Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Hear From Our Students
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <div className="font-semibold">
                      Maria's Interview Success
                    </div>
                    <div className="text-sm text-muted-foreground">
                      3:24 min
                    </div>
                  </div>
                </div>
                <h3 className="font-bold mb-2">From Nervous to Confident</h3>
                <p className="text-sm text-muted-foreground">
                  Watch Maria share how Fluenta helped her overcome interview
                  anxiety and land her dream job at a top tech company.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <div className="font-semibold">
                      Ahmed's Academic Journey
                    </div>
                    <div className="text-sm text-muted-foreground">
                      2:47 min
                    </div>
                  </div>
                </div>
                <h3 className="font-bold mb-2">From Silent to Leader</h3>
                <p className="text-sm text-muted-foreground">
                  Ahmed explains how improved pronunciation gave him the
                  confidence to actively participate in academic discussions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who've transformed their English skills
              and achieved their goals with Fluenta's AI-powered learning
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Your Free Trial Today
                </Button>
              </Link>
              <Link href="/blog/free-english-level-test">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Take Free Level Test
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
