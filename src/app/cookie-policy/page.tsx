import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cookie Policy - Fluenta AI English Learning Platform",
  description:
    "Learn about how Fluenta uses cookies and tracking technologies to improve your learning experience. Understand your choices and controls.",
  keywords:
    "fluenta cookie policy, cookies, tracking technologies, web storage, privacy controls",
};

export default function CookiePolicyPage() {
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <span>Cookie Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 15, 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Cookies are small text files that are stored on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and analyzing how you
                use our platform.
              </p>
              <p>
                This Cookie Policy explains how Fluenta uses cookies and similar
                tracking technologies on our AI-powered English learning
                platform.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for our website to function
                properly:
              </p>
              <ul>
                <li>
                  Authentication cookies: Keep you logged in to your account
                </li>
                <li>
                  Security cookies: Protect against fraud and unauthorized
                  access
                </li>
                <li>Session cookies: Maintain your session as you navigate</li>
              </ul>

              <h3>Performance and Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our
                platform:
              </p>
              <ul>
                <li>
                  Google Analytics: Website traffic and user behavior analysis
                </li>
                <li>
                  Performance monitoring: Page load times and technical
                  performance
                </li>
                <li>Error tracking: Identify and fix technical issues</li>
              </ul>

              <h3>Functional Cookies</h3>
              <p>
                These cookies enhance your experience by remembering your
                choices:
              </p>
              <ul>
                <li>
                  Language preferences: Remember your chosen interface language
                </li>
                <li>
                  Learning settings: Save your personalized learning preferences
                </li>
                <li>
                  UI preferences: Remember your layout and display choices
                </li>
              </ul>

              <h3>Marketing Cookies (with consent)</h3>
              <p>These cookies are used to deliver relevant advertisements:</p>
              <ul>
                <li>
                  Advertising cookies: Show you relevant ads based on your
                  interests
                </li>
                <li>Social media cookies: Enable social sharing features</li>
                <li>Retargeting cookies: Show you our ads on other websites</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Choices */}
          <Card>
            <CardHeader>
              <CardTitle>Your Cookie Choices and Controls</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Cookie Consent</h3>
              <p>
                When you first visit our website, you can choose to accept or
                reject non-essential cookies through our cookie banner.
              </p>

              <h3>Browser Controls</h3>
              <p>You can control cookies through your browser settings:</p>
              <ul>
                <li>Block cookies: Prevent all or specific types of cookies</li>
                <li>
                  Delete cookies: Remove existing cookies from your device
                </li>
                <li>Private browsing: Use incognito/private mode</li>
              </ul>

              <h3>Impact of Disabling Cookies</h3>
              <p>Disabling certain cookies may affect your experience:</p>
              <ul>
                <li>
                  Essential cookies: You may not be able to log in or use key
                  features
                </li>
                <li>
                  Functional cookies: Your preferences won't be remembered
                </li>
                <li>
                  Analytics cookies: We can't improve our service as effectively
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>We use third-party services that may set their own cookies:</p>
              <ul>
                <li>
                  Google Analytics: Website analytics and user behavior tracking
                </li>
                <li>Stripe: Secure payment processing</li>
                <li>Intercom: Customer support chat functionality</li>
                <li>Social media platforms: Social sharing and advertising</li>
              </ul>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We may update this Cookie Policy from time to time. We will
                notify you of any material changes by posting the updated policy
                on our website and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                If you have questions about our use of cookies, please contact
                us:
              </p>

              <div className="bg-muted p-4 rounded-lg mt-4">
                <p>
                  <strong>Email:</strong> info@fluenta-ai.com
                </p>
                <p>
                  <strong>Address:</strong> Fluenta Inc.
                  <br />
                  Flat 15 Station Road Barham Court Cuffley
                  <br />
                  Hertfordshire, EN6 4HY
                  <br />
                  United Kingdom
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center gap-4 mt-12 pt-8 border-t">
          <Link href="/privacy">
            <Button variant="outline">Privacy Policy</Button>
          </Link>
          <Link href="/terms">
            <Button variant="outline">Terms of Service</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
