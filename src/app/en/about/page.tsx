import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "About Us - Fluenta AI English Learning Platform",
  description:
    "Learn about Fluenta's mission to democratize English language learning through AI-powered technology. Meet our team and discover our story.",
  keywords:
    "about fluenta, AI English learning, language learning platform, educational technology, team, mission, company story",
  openGraph: {
    title: "About Us - Fluenta AI English Learning Platform",
    description:
      "Discover Fluenta's mission to revolutionize English learning with AI-powered personalized education for learners worldwide.",
    type: "website",
    images: [
      {
        url: "/og-images/og-about.png",
        width: 1200,
        height: 630,
        alt: "About Fluenta",
      },
    ],
  },
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      background:
        "Former Stanford Professor of Computational Linguistics with 15+ years in AI research",
      expertise: "AI, NLP, Educational Technology",
      image: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      background:
        "Ex-Google engineer specializing in machine learning and scalable systems",
      expertise: "ML Engineering, Cloud Architecture",
      image: "MR",
    },
    {
      name: "Dr. Priya Patel",
      role: "Head of Pedagogy",
      background:
        "Cambridge University PhD in Applied Linguistics and former IELTS examiner",
      expertise: "Language Assessment, Curriculum Design",
      image: "PP",
    },
    {
      name: "James Wilson",
      role: "Head of Product",
      background:
        "Former Duolingo product lead with expertise in gamified learning",
      expertise: "UX Design, Learning Analytics",
      image: "JW",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "Dr. Sarah Chen and Michael Rodriguez founded Fluenta with a vision to democratize language learning",
    },
    {
      year: "2021",
      title: "AI Development",
      description:
        "Developed proprietary AI algorithms for personalized language learning and real-time feedback",
    },
    {
      year: "2022",
      title: "Beta Launch",
      description:
        "Launched beta with 1,000 users, achieving 94% satisfaction rate and 85% completion rate",
    },
    {
      year: "2023",
      title: "Global Expansion",
      description:
        "Expanded to 50+ countries with partnerships with universities and corporations",
    },
    {
      year: "2024",
      title: "AI Innovation",
      description:
        "Launched advanced features including AI conversation partners and real-time pronunciation analysis",
    },
  ];

  const values = [
    {
      title: "Accessibility",
      description:
        "Quality education should be available to everyone, regardless of location or background",
      icon: "🌍",
    },
    {
      title: "Innovation",
      description:
        "We continuously push the boundaries of what's possible in language learning technology",
      icon: "🚀",
    },
    {
      title: "Personalization",
      description:
        "Every learner is unique, and our AI adapts to individual learning styles and goals",
      icon: "🎯",
    },
    {
      title: "Effectiveness",
      description:
        "We measure success by real learning outcomes and skill improvements, not just engagement",
      icon: "📈",
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
                href="/en/modules"
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
              <Link href="/about" className="text-sm font-medium text-primary">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm">Get Started</Button>
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
          <span>About Us</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🤖 AI-Powered</Badge>
            <Badge variant="outline">Global Impact</Badge>
            <Badge variant="outline">Educational Innovation</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Revolutionizing English Learning Through AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            At Fluenta, we believe that language barriers shouldn't limit human
            potential. Our mission is to make world-class English education
            accessible to everyone through the power of artificial intelligence.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <GradientCard className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To democratize English language learning by providing
                  personalized, AI-powered education that adapts to each
                  learner's unique needs, goals, and learning style. We strive
                  to break down language barriers and open doors to global
                  opportunities for millions of people worldwide.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🔮</span>
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A world where anyone, anywhere, can master English and unlock
                  their full potential. We envision a future where AI-powered
                  education makes high-quality language learning as accessible
                  as the internet itself, transforming lives and connecting
                  communities globally.
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Fluenta was born from a simple observation: traditional
                  language learning methods weren't keeping pace with
                  technology. Our founders, Dr. Sarah Chen and Michael
                  Rodriguez, met at Stanford while researching natural language
                  processing applications in education. They witnessed firsthand
                  how students struggled with one-size-fits-all language courses
                  that didn't adapt to individual learning patterns.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  After years of research and development, they created
                  Fluenta's core AI engine – a sophisticated system that
                  understands not just what students learn, but how they learn.
                  This technology analyzes pronunciation patterns, identifies
                  grammar weaknesses, tracks vocabulary retention, and adapts in
                  real-time to provide truly personalized feedback.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, Fluenta serves learners in over 50 countries, from
                  students preparing for international exams to professionals
                  advancing their careers. Our platform has helped thousands
                  achieve their English learning goals through technology that
                  feels more like having a personal tutor than using an app.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-accent hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{value.icon}</span>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Journey & Milestones
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {milestone.year}
                    </div>
                  </div>
                  <Card className="flex-grow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {milestone.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Leadership Team
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow h-full"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.image}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-primary font-medium">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    {member.background}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.split(", ").map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Global Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">50,000+</CardTitle>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Students actively improving their English skills with Fluenta
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">50+</CardTitle>
                <p className="text-sm text-muted-foreground">Countries</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Global reach across diverse cultures and languages
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">94%</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Satisfaction Rate
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Learners who rate their experience as excellent
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">85%</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Goal Achievement
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs">
                  Students who achieve their learning objectives within 6 months
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of the language learning revolution. Whether you're a
              learner, educator, or simply passionate about breaking down
              language barriers, there's a place for you at Fluenta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Learning Today
                </Button>
              </Link>
              <Link href="/en/contact">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
