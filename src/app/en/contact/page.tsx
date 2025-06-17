import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "Contact Us - Fluenta AI English Learning Platform",
  description:
    "Get in touch with Fluenta's support team. Contact us for questions about our AI-powered English learning platform, partnerships, or technical support.",
  keywords:
    "contact fluenta, customer support, AI English learning help, partnership inquiries, technical support, contact form",
  openGraph: {
    title: "Contact Us - Fluenta AI English Learning Platform",
    description:
      "Reach out to Fluenta for support, partnerships, or questions about our AI-powered English learning platform.",
    type: "website",
    images: [
      {
        url: "/og-images/og-contact.png",
        width: 1200,
        height: 630,
        alt: "Contact Fluenta",
      },
    ],
  },
};

export default function ContactPage() {
  const contactOptions = [
    {
      title: "General Support",
      description:
        "Questions about your account, billing, or general inquiries",
      icon: "💬",
      email: "support@fluenta.ai",
      response: "24 hours",
    },
    {
      title: "Technical Support",
      description:
        "Technical issues, bug reports, or app functionality problems",
      icon: "🔧",
      email: "tech@fluenta.ai",
      response: "12 hours",
    },
    {
      title: "Business Inquiries",
      description:
        "Partnerships, enterprise solutions, or business collaborations",
      icon: "🤝",
      email: "business@fluenta.ai",
      response: "48 hours",
    },
    {
      title: "Media & Press",
      description: "Press inquiries, interviews, or media kit requests",
      icon: "📰",
      email: "press@fluenta.ai",
      response: "48 hours",
    },
  ];

  const officeLocations = [
    {
      city: "San Francisco",
      country: "United States",
      address: "123 Innovation Drive, Suite 400",
      zipCode: "CA 94105",
      phone: "+1 (555) 123-4567",
      type: "Headquarters",
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "45 Tech Hub Lane",
      zipCode: "EC2A 4DP",
      phone: "+44 20 7946 0958",
      type: "European Office",
    },
    {
      city: "Singapore",
      country: "Singapore",
      address: "88 Marina Bay Circle, Level 15",
      zipCode: "018956",
      phone: "+65 6789 1234",
      type: "Asia-Pacific Office",
    },
  ];

  const faqItems = [
    {
      question: "How quickly will I see improvement in my English?",
      answer:
        "Most learners see noticeable improvements within 2-4 weeks of consistent practice. Our AI adapts to your learning pace and provides personalized feedback to accelerate your progress.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription anytime from your account settings. There are no cancellation fees, and you'll continue to have access until the end of your billing period.",
    },
    {
      question: "Do you offer enterprise or bulk pricing?",
      answer:
        "Yes! We offer special pricing for schools, universities, and corporations. Contact our business team for customized enterprise solutions and volume discounts.",
    },
    {
      question: "Is my personal data secure with Fluenta?",
      answer:
        "Absolutely. We use enterprise-grade encryption and follow strict data protection protocols. Your learning data is never shared with third parties without your explicit consent.",
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
                href="/modules"
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
              <Link
                href="/about"
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
          <span>Contact Us</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">📞 Support</Badge>
            <Badge variant="outline">24/7 Available</Badge>
            <Badge variant="outline">Global Team</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            We're Here to Help
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Have questions about Fluenta? Need technical support? Looking for
            partnership opportunities? Our global team is ready to assist you on
            your English learning journey.
          </p>
        </section>

        {/* Contact Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose How You'd Like to Reach Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {contactOptions.map((option, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-primary hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    {option.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {option.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium">Email:</span>
                      <a
                        href={`mailto:${option.email}`}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {option.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium">
                        Response Time:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Within {option.response}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Send Us a Message
          </h2>
          <GradientCard className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as
                possible
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Support</option>
                    <option value="technical">Technical Support</option>
                    <option value="business">Business Inquiry</option>
                    <option value="media">Media & Press</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="consent" className="rounded" />
                  <label
                    htmlFor="consent"
                    className="text-sm text-muted-foreground"
                  >
                    I agree to Fluenta's{" "}
                    <Link
                      href="/en/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and consent to receiving communications about my inquiry.
                  </label>
                </div>

                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </GradientCard>
        </section>

        {/* Office Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Global Offices
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {office.city}, {office.country}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {office.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong className="text-primary text-sm">Address:</strong>
                    <p className="text-sm text-muted-foreground">
                      {office.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {office.city}, {office.zipCode}
                    </p>
                  </div>
                  <div>
                    <strong className="text-primary text-sm">Phone:</strong>
                    <p className="text-sm text-muted-foreground">
                      {office.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Hours */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Support Hours & Response Times
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🕐</span>
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday:</span>
                  <span className="text-muted-foreground">
                    9:00 AM - 6:00 PM PST
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span className="text-muted-foreground">
                    10:00 AM - 4:00 PM PST
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    Emergency technical issues are monitored 24/7
                  </p>
                </div>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Critical Issues:</span>
                  <span className="text-green-600 font-medium">2-4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Technical Support:</span>
                  <span className="text-blue-600 font-medium">12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">General Inquiries:</span>
                  <span className="text-orange-600 font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Business/Press:</span>
                  <span className="text-purple-600 font-medium">48 hours</span>
                </div>
              </CardContent>
            </GradientCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't wait to begin your English learning journey. Join thousands
              of learners who are already improving their skills with Fluenta's
              AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
