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
  title: "Business English Career Guide | Fluenta",
  description:
    "Learn essential business English skills to boost your career. From job interviews to presentations, master professional communication in English and advance your career prospects.",
  keywords:
    "business English, professional English, career advancement, job interview English, business communication, workplace English, professional development, business writing, presentation skills",
  alternates: {
    canonical: "/en/blog/business-english-career-guide",
    languages: {
      en: "/en/blog/business-english-career-guide",
      tr: "/blog/is-ingilizcesi-rehberi",
    },
  },
  openGraph: {
    title: "Business English Career Guide: Advance Your Professional Skills",
    description:
      "Learn essential business English skills to boost your career. From job interviews to presentations, master professional communication in English.",
    type: "article",
    locale: "en_US",
    publishedTime: "2024-12-27",
    authors: ["Fluenta AI"],
    images: [
      {
        url: "/blog-images/business-english-career-en.jpg",
        width: 1200,
        height: 630,
        alt: "Business English Career Guide",
      },
    ],
  },
};

// Tagline component
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50">
      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
        {children}
      </span>
    </div>
  </div>
);

export default function BusinessEnglishCareerGuide() {
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
          <span>Business English Career Guide</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <Tagline>Advance Your Professional Skills</Tagline>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">Business English</Badge>
              <Badge variant="outline">Career Development</Badge>
              <Badge variant="outline">12 min read</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Business English Career Guide: Advance Your Professional Skills
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Learn essential business English skills to boost your career. From
              job interviews to presentations, master professional communication
              in English and unlock new opportunities in the global marketplace.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
              <span>December 27, 2024</span>
              <span>•</span>
              <span>12 min read</span>
              <span>•</span>
              <span>Business English</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-16">
            <GradientCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  💼 Why Business English is Your Career Game-Changer
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  In today's global economy, business English proficiency is no
                  longer optional—it's essential. Whether you're seeking
                  promotion, changing careers, or expanding internationally,
                  strong business English skills can be the difference between
                  success and missed opportunities. This guide will help you
                  master the professional communication skills that employers
                  value most.
                </p>
              </div>
            </GradientCard>
          </section>

          <h2>Chapter 1: Mastering Job Interview English</h2>

          <h3>1.1 Essential Interview Vocabulary</h3>
          <p>Build confidence with key interview terms and phrases:</p>
          <ul>
            <li>
              <strong>Strengths & Weaknesses:</strong> "My strength is
              problem-solving" / "I'm working on improving my delegation skills"
            </li>
            <li>
              <strong>Experience:</strong> "I have extensive experience in..." /
              "I've been responsible for..."
            </li>
            <li>
              <strong>Achievements:</strong> "I successfully led a team that..."
              / "I increased sales by 25%"
            </li>
            <li>
              <strong>Goals:</strong> "My career objective is..." / "I'm looking
              to develop my skills in..."
            </li>
          </ul>

          <h3>1.2 Common Interview Questions & Answers</h3>
          <p>Practice these frequently asked questions:</p>
          <ul>
            <li>
              <strong>"Tell me about yourself"</strong>
              <br />
              Focus on professional background, key achievements, and career
              goals
            </li>
            <li>
              <strong>"Why do you want this job?"</strong>
              <br />
              Connect your skills to the company's needs and values
            </li>
            <li>
              <strong>"Where do you see yourself in 5 years?"</strong>
              <br />
              Show ambition while demonstrating loyalty to the company
            </li>
            <li>
              <strong>"What's your greatest weakness?"</strong>
              <br />
              Choose a real weakness and explain how you're addressing it
            </li>
          </ul>

          <Card className="my-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                💡 Interview Success Tip
              </h3>
              <p>
                Practice mock interviews with Fluenta's AI conversation partner.
                Get real-time feedback on your pronunciation, grammar, and
                professional communication style to build confidence before the
                real interview.
              </p>
            </CardContent>
          </Card>

          <h2>Chapter 2: Professional Email Communication</h2>

          <h3>2.1 Email Structure and Etiquette</h3>
          <p>Master the components of professional emails:</p>
          <ul>
            <li>
              <strong>Subject Line:</strong> Clear, specific, action-oriented
            </li>
            <li>
              <strong>Greeting:</strong> "Dear Mr./Ms. [Name]" or "Hello [Name]"
            </li>
            <li>
              <strong>Opening:</strong> State purpose immediately
            </li>
            <li>
              <strong>Body:</strong> Organize information logically
            </li>
            <li>
              <strong>Closing:</strong> Clear next steps or call to action
            </li>
            <li>
              <strong>Sign-off:</strong> "Best regards," "Sincerely," or "Kind
              regards"
            </li>
          </ul>

          <h3>2.2 Essential Email Phrases</h3>
          <p>Use these professional phrases to enhance your emails:</p>
          <ul>
            <li>
              <strong>Opening:</strong> "I hope this email finds you well" /
              "Thank you for your email"
            </li>
            <li>
              <strong>Requesting:</strong> "I would appreciate if you could..."
              / "Could you please..."
            </li>
            <li>
              <strong>Apologizing:</strong> "I apologize for the delay" / "I'm
              sorry for any inconvenience"
            </li>
            <li>
              <strong>Following up:</strong> "I wanted to follow up on..." /
              "Just checking in regarding..."
            </li>
            <li>
              <strong>Closing:</strong> "Please let me know if you need any
              clarification" / "I look forward to hearing from you"
            </li>
          </ul>

          <h2>Chapter 3: Presentation and Meeting Skills</h2>

          <h3>3.1 Presentation Structure</h3>
          <p>Organize your presentations for maximum impact:</p>
          <ul>
            <li>
              <strong>Introduction:</strong> "Good morning, everyone. Today I'll
              be presenting..."
            </li>
            <li>
              <strong>Agenda:</strong> "I'll cover three main points: first...
              second... finally..."
            </li>
            <li>
              <strong>Main Content:</strong> Use signposting: "Moving on to..."
              / "Let's look at..."
            </li>
            <li>
              <strong>Conclusion:</strong> "To summarize..." / "In
              conclusion..."
            </li>
            <li>
              <strong>Q&A:</strong> "I'd be happy to answer any questions"
            </li>
          </ul>

          <h3>3.2 Meeting Participation</h3>
          <p>Contribute effectively in business meetings:</p>
          <ul>
            <li>
              <strong>Agreeing:</strong> "I completely agree with..." / "That's
              an excellent point"
            </li>
            <li>
              <strong>Disagreeing:</strong> "I see your point, but..." / "I have
              a different perspective"
            </li>
            <li>
              <strong>Suggesting:</strong> "What if we..." / "I'd like to
              propose..."
            </li>
            <li>
              <strong>Clarifying:</strong> "Could you elaborate on..." / "What
              do you mean by..."
            </li>
            <li>
              <strong>Interrupting politely:</strong> "Sorry to interrupt,
              but..." / "If I may add..."
            </li>
          </ul>

          <Card className="my-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                🎯 Presentation Confidence
              </h3>
              <p>
                Build presentation skills with Fluenta's AI-powered speaking
                practice. Record yourself, get feedback on delivery, and
                practice with virtual audiences to overcome presentation anxiety
                and improve your professional presence.
              </p>
            </CardContent>
          </Card>

          <h2>Chapter 4: Networking and Relationship Building</h2>

          <h3>4.1 Small Talk and Conversation Starters</h3>
          <p>Build professional relationships with effective small talk:</p>
          <ul>
            <li>
              <strong>Industry topics:</strong> "How's business in your sector?"
              / "What trends are you seeing?"
            </li>
            <li>
              <strong>Current events:</strong> "Did you see the news about..." /
              "What's your take on..."
            </li>
            <li>
              <strong>Professional development:</strong> "Are you attending any
              conferences this year?"
            </li>
            <li>
              <strong>Company updates:</strong> "How's the new project going?" /
              "Tell me about your recent launch"
            </li>
          </ul>

          <h3>4.2 Professional Networking Phrases</h3>
          <p>Make lasting professional connections:</p>
          <ul>
            <li>
              <strong>Introductions:</strong> "I'd like you to meet..." / "Let
              me introduce you to..."
            </li>
            <li>
              <strong>Exchanging contacts:</strong> "Could I get your business
              card?" / "Let's connect on LinkedIn"
            </li>
            <li>
              <strong>Following up:</strong> "It was great meeting you" / "I
              enjoyed our conversation about..."
            </li>
            <li>
              <strong>Offering help:</strong> "Please let me know if I can
              assist" / "I'd be happy to introduce you to..."
            </li>
          </ul>

          <h2>Chapter 5: Negotiation and Persuasion</h2>

          <h3>5.1 Negotiation Language</h3>
          <p>Navigate business negotiations effectively:</p>
          <ul>
            <li>
              <strong>Making offers:</strong> "We're prepared to offer..." /
              "Our proposal is..."
            </li>
            <li>
              <strong>Counteroffers:</strong> "What if we..." / "Would you
              consider..."
            </li>
            <li>
              <strong>Conditions:</strong> "Provided that..." / "On the
              condition that..."
            </li>
            <li>
              <strong>Compromise:</strong> "We could meet in the middle" /
              "Let's find a win-win solution"
            </li>
            <li>
              <strong>Closing:</strong> "Do we have a deal?" / "Shall we move
              forward with this?"
            </li>
          </ul>

          <h3>5.2 Persuasive Communication</h3>
          <p>Influence decisions with compelling language:</p>
          <ul>
            <li>
              <strong>Benefits:</strong> "This will result in..." / "The
              advantage is..."
            </li>
            <li>
              <strong>Evidence:</strong> "Research shows..." / "Our data
              indicates..."
            </li>
            <li>
              <strong>Urgency:</strong> "Time is of the essence" / "This
              opportunity won't last"
            </li>
            <li>
              <strong>Social proof:</strong> "Other companies have seen..." /
              "Industry leaders are..."
            </li>
          </ul>

          <h2>Chapter 6: Cultural Awareness in Business</h2>

          <h3>6.1 Cross-Cultural Communication</h3>
          <p>Navigate international business successfully:</p>
          <ul>
            <li>
              <strong>Directness levels:</strong> Adapt your communication style
              to cultural preferences
            </li>
            <li>
              <strong>Hierarchy awareness:</strong> Understand formal vs.
              informal address
            </li>
            <li>
              <strong>Meeting styles:</strong> Some cultures prefer consensus,
              others prefer quick decisions
            </li>
            <li>
              <strong>Relationship building:</strong> Some cultures prioritize
              personal relationships before business
            </li>
          </ul>

          <h3>6.2 Global Business Etiquette</h3>
          <p>Avoid common cultural mistakes:</p>
          <ul>
            <li>
              <strong>Greetings:</strong> Handshakes, bows, or verbal greetings
            </li>
            <li>
              <strong>Business cards:</strong> Proper exchange protocols
            </li>
            <li>
              <strong>Punctuality:</strong> Varying expectations across cultures
            </li>
            <li>
              <strong>Gift-giving:</strong> When appropriate and what to avoid
            </li>
          </ul>

          <GradientCard className="my-8">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Accelerate Your Career with Business English
              </h3>
              <p className="text-muted-foreground mb-6">
                Master professional communication skills with Fluenta's
                specialized business English modules. Practice real workplace
                scenarios with AI-powered feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8">
                    Start Business English
                  </Button>
                </Link>
                <Link href="/en/modules/speaking">
                  <Button variant="outline" size="lg" className="text-lg px-8">
                    Practice Speaking
                  </Button>
                </Link>
              </div>
            </div>
          </GradientCard>

          <h2>Chapter 7: Industry-Specific Vocabulary</h2>

          <h3>7.1 Finance and Banking</h3>
          <p>Essential terms for financial professionals:</p>
          <ul>
            <li>
              <strong>Investment:</strong> ROI, portfolio, assets, liabilities,
              equity
            </li>
            <li>
              <strong>Banking:</strong> Credit, loans, interest rates, mortgage,
              collateral
            </li>
            <li>
              <strong>Accounting:</strong> Balance sheet, cash flow, profit &
              loss, audit
            </li>
            <li>
              <strong>Market terms:</strong> Bull market, bear market,
              volatility, liquidity
            </li>
          </ul>

          <h3>7.2 Technology and IT</h3>
          <p>Key vocabulary for tech professionals:</p>
          <ul>
            <li>
              <strong>Development:</strong> Agile, sprint, deployment,
              debugging, integration
            </li>
            <li>
              <strong>Security:</strong> Encryption, firewall, vulnerability,
              compliance
            </li>
            <li>
              <strong>Data:</strong> Analytics, database, cloud computing,
              machine learning
            </li>
            <li>
              <strong>Project management:</strong> Milestone, deliverable,
              stakeholder, scope
            </li>
          </ul>

          <h2>Action Plan: Implementing Your Business English Skills</h2>
          <p>Transform your career with this practical implementation plan:</p>
          <ol>
            <li>
              <strong>Assess Your Current Level:</strong> Identify strengths and
              areas for improvement
            </li>
            <li>
              <strong>Set Specific Goals:</strong> Define what you want to
              achieve (promotion, new job, international role)
            </li>
            <li>
              <strong>Practice Daily:</strong> Dedicate 30 minutes daily to
              business English practice
            </li>
            <li>
              <strong>Seek Feedback:</strong> Use AI tools or mentors to improve
              your communication
            </li>
            <li>
              <strong>Apply Immediately:</strong> Use new skills in real
              workplace situations
            </li>
            <li>
              <strong>Network Actively:</strong> Practice business English in
              professional settings
            </li>
            <li>
              <strong>Stay Updated:</strong> Keep learning industry-specific
              vocabulary and trends
            </li>
          </ol>

          <h2>Conclusion</h2>
          <p>
            Mastering business English is an investment in your professional
            future. The skills covered in this guide—from interview techniques
            to presentation skills—will serve you throughout your career.
            Remember, business English is not just about perfect grammar; it's
            about communicating effectively, building relationships, and
            achieving your professional goals.
          </p>
          <p>
            Start implementing these strategies today, practice consistently,
            and watch as new opportunities open up in your career. With strong
            business English skills, you'll be ready to compete in the global
            marketplace and advance to the next level of professional success.
          </p>

          {/* Related Articles */}
          <section className="mt-16 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">
                    <Link
                      href="/en/blog/english-conversation-practice-app"
                      className="hover:text-primary"
                    >
                      Best English Conversation Practice Apps
                    </Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Improve your speaking skills with top-rated conversation
                    practice applications.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">
                    <Link
                      href="/en/blog/english-pronunciation-practice-online"
                      className="hover:text-primary"
                    >
                      English Pronunciation Practice Online
                    </Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Master professional pronunciation with online tools and
                    techniques.
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
