import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Careers - Join Fluenta's AI English Learning Revolution",
  description:
    "Join Fluenta's mission to revolutionize language learning. Explore career opportunities in AI, education technology, and more at our global offices.",
  keywords:
    "fluenta careers, AI jobs, edtech careers, language learning jobs, remote work, artificial intelligence careers, educational technology jobs",
  openGraph: {
    title: "Careers - Join Fluenta's AI English Learning Revolution",
    description:
      "Build the future of language learning with Fluenta. Explore exciting career opportunities in AI, education, and technology.",
    type: "website",
    images: [
      {
        url: "/og-images/og-careers.png",
        width: 1200,
        height: 630,
        alt: "Careers at Fluenta",
      },
    ],
  },
  alternates: {
    canonical: "/en/careers",
  },
};

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description:
        "Lead development of our AI-powered language learning algorithms and natural language processing systems.",
      requirements: [
        "PhD/MS in Computer Science, AI, or related field",
        "5+ years in machine learning and NLP",
        "Experience with TensorFlow, PyTorch",
        "Background in educational technology preferred",
      ],
      skills: ["Python", "Machine Learning", "NLP", "TensorFlow"],
    },
    {
      title: "Product Manager - Learning Experience",
      department: "Product",
      location: "San Francisco, CA / London, UK",
      type: "Full-time",
      description:
        "Drive product strategy for our learning modules and user experience optimization.",
      requirements: [
        "5+ years in product management",
        "Experience with educational products",
        "Data-driven decision making",
        "Strong UX/UI understanding",
      ],
      skills: ["Product Strategy", "UX Design", "Analytics", "A/B Testing"],
    },
    {
      title: "Applied Linguist",
      department: "Content",
      location: "Remote",
      type: "Full-time",
      description:
        "Design curriculum and content strategies based on second language acquisition research.",
      requirements: [
        "PhD in Applied Linguistics or TESOL",
        "Research experience in SLA",
        "Curriculum development background",
        "Experience with digital learning platforms",
      ],
      skills: ["Linguistics", "Curriculum Design", "Research", "Pedagogy"],
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description:
        "Manage cloud infrastructure and deployment pipelines for our global platform.",
      requirements: [
        "3+ years in DevOps/Infrastructure",
        "Experience with AWS, Kubernetes",
        "CI/CD pipeline management",
        "Security-first mindset",
      ],
      skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description:
        "Create intuitive and engaging user experiences for language learners worldwide.",
      requirements: [
        "3+ years in UX/UI design",
        "Portfolio of mobile and web designs",
        "Experience with design systems",
        "Understanding of learning psychology",
      ],
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    },
    {
      title: "Data Scientist",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      description:
        "Analyze learning patterns and optimize AI algorithms for personalized education.",
      requirements: [
        "MS/PhD in Data Science or Statistics",
        "Experience with learning analytics",
        "Strong Python/R programming",
        "Statistical modeling expertise",
      ],
      skills: ["Python", "R", "Statistics", "Machine Learning"],
    },
  ];

  const benefits = [
    {
      category: "Health & Wellness",
      icon: "🏥",
      items: [
        "Comprehensive medical, dental, and vision insurance",
        "Mental health support and counseling services",
        "Wellness stipend for gym memberships and fitness",
        "Annual health checkups and preventive care",
      ],
    },
    {
      category: "Work-Life Balance",
      icon: "⚖️",
      items: [
        "Flexible working hours and remote work options",
        "Unlimited PTO policy with minimum 3 weeks encouraged",
        "Sabbatical program for long-term employees",
        "Family-friendly policies including parental leave",
      ],
    },
    {
      category: "Professional Growth",
      icon: "📈",
      items: [
        "$3,000 annual learning and development budget",
        "Conference attendance and speaking opportunities",
        "Internal mentorship and career coaching",
        "Cross-team project participation encouraged",
      ],
    },
    {
      category: "Financial Benefits",
      icon: "💰",
      items: [
        "Competitive salary with equity participation",
        "401(k) with company matching up to 6%",
        "Performance bonuses and profit sharing",
        "Commuter benefits and home office stipend",
      ],
    },
  ];

  const cultureValues = [
    {
      title: "Innovation First",
      description:
        "We encourage experimentation and aren't afraid to challenge conventional wisdom in education.",
      icon: "💡",
    },
    {
      title: "Global Mindset",
      description:
        "Our diverse team brings perspectives from around the world to create inclusive learning experiences.",
      icon: "🌍",
    },
    {
      title: "Learner-Centric",
      description:
        "Every decision we make is guided by what's best for our learners and their success.",
      icon: "🎯",
    },
    {
      title: "Continuous Growth",
      description:
        "We invest in our team's development because growing people build growing companies.",
      icon: "🌱",
    },
  ];

  const offices = [
    {
      city: "San Francisco",
      country: "United States",
      employees: "120+",
      description:
        "Our headquarters featuring open workspaces, collaboration areas, and stunning bay views.",
      amenities: [
        "Free meals",
        "Rooftop terrace",
        "Game room",
        "Meditation space",
      ],
    },
    {
      city: "London",
      country: "United Kingdom",
      employees: "45+",
      description:
        "European hub in the heart of Tech City with modern facilities and vibrant culture.",
      amenities: [
        "Flexible seating",
        "Coffee bar",
        "Bike storage",
        "Library corner",
      ],
    },
    {
      city: "Singapore",
      country: "Singapore",
      employees: "30+",
      description:
        "Asia-Pacific headquarters with innovative workspace design and tropical garden views.",
      amenities: [
        "Standing desks",
        "Wellness room",
        "Cultural library",
        "Outdoor space",
      ],
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
                href="/en/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/en/about"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
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
          <span>Careers</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">🚀 Join Our Mission</Badge>
            <Badge variant="outline">Global Team</Badge>
            <Badge variant="outline">Remote Friendly</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build the Future of Language Learning
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join Fluenta's mission to democratize English education worldwide.
            Work with cutting-edge AI technology, passionate educators, and a
            global team committed to breaking down language barriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              View Open Positions
            </Button>
            <Link href="/en/about">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Learn About Our Mission
              </Button>
            </Link>
          </div>
        </section>

        {/* Culture & Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Culture & Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {cultureValues.map((value, index) => (
              <GradientCard key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{value.icon}</span>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Current Open Positions
          </h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-primary hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {position.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{position.department}</Badge>
                        <Badge variant="outline">{position.location}</Badge>
                        <Badge variant="outline">{position.type}</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {position.description}
                      </p>
                    </div>
                    <Button size="sm">Apply Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">
                        Requirements:
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {position.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">
                        Key Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {position.skills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Benefits & Perks
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{benefit.icon}</span>
                    {benefit.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Office Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Global Offices
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {office.city}, {office.country}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {office.employees} employees
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {office.description}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary text-sm">
                      Office Amenities:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {office.amenities.map((amenity, i) => (
                        <div key={i} className="text-xs text-muted-foreground">
                          • {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Hiring Process
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <CardTitle className="text-lg">Application Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our team reviews your application and portfolio within 5
                    business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <CardTitle className="text-lg">Initial Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    30-minute video call with the hiring manager to discuss your
                    background.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <CardTitle className="text-lg">
                    Technical Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Role-specific skills evaluation and problem-solving session.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    4
                  </div>
                  <CardTitle className="text-lg">Final Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Meet the team and leadership for culture fit and final
                    evaluation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Diversity Statement */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <GradientCard>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Diversity, Equity & Inclusion
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  At Fluenta, we believe that diverse perspectives make our
                  products better and our team stronger. We're committed to
                  building an inclusive workplace where everyone can thrive,
                  regardless of background, identity, or experience. We actively
                  seek candidates from underrepresented groups and provide equal
                  opportunities for all.
                </p>
                <p className="text-muted-foreground">
                  We are an equal opportunity employer and welcome applications
                  from all qualified candidates, regardless of race, gender,
                  age, religion, sexual orientation, or any other protected
                  characteristic.
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Team?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't see a perfect match? We're always interested in meeting
              talented individuals who are passionate about education and
              technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                View All Positions
              </Button>
              <Link href="/en/contact">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Send Us Your Resume
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
