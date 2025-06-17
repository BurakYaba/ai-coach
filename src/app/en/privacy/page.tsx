import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy - Fluenta AI English Learning Platform",
  description:
    "Learn how Fluenta protects your privacy and handles your personal data. Read our comprehensive privacy policy for transparency on data collection and usage.",
  keywords:
    "fluenta privacy policy, data protection, personal information, GDPR compliance, privacy rights, data security",
  alternates: {
    canonical: "/en/privacy",
    languages: {
      en: "/en/privacy",
      tr: "/gizlilik-politikasi",
    },
  },
};

export default function PrivacyPolicyPage() {
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <span>Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 15, 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Fluenta ("we", "our", or "us") is committed to protecting your
                privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our AI-powered English
                learning platform, including our website, mobile applications,
                and related services (collectively, the "Service").
              </p>
              <p>
                By using our Service, you agree to the collection and use of
                information in accordance with this Privacy Policy. If you do
                not agree with our policies and practices, your choice is not to
                use our Service.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Personal Information</h3>
              <p>
                We collect personal information that you voluntarily provide to
                us when you:
              </p>
              <ul>
                <li>Register for an account</li>
                <li>Use our learning modules</li>
                <li>Contact our support team</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in surveys or feedback</li>
              </ul>

              <p>This information may include:</p>
              <ul>
                <li>Name and email address</li>
                <li>Profile picture and bio (optional)</li>
                <li>Learning goals and preferences</li>
                <li>Payment and billing information</li>
                <li>Communication records with support</li>
              </ul>

              <h3>Learning Data</h3>
              <p>To provide personalized learning experiences, we collect:</p>
              <ul>
                <li>
                  Audio recordings of your speech for pronunciation analysis
                </li>
                <li>Writing samples for grammar and style feedback</li>
                <li>Learning progress and performance metrics</li>
                <li>Time spent on different activities</li>
                <li>Quiz and exercise responses</li>
                <li>Areas of difficulty and improvement</li>
              </ul>

              <h3>Technical Information</h3>
              <p>
                We automatically collect certain technical information,
                including:
              </p>
              <ul>
                <li>Device information (type, operating system, browser)</li>
                <li>IP address and general location</li>
                <li>Usage patterns and feature interactions</li>
                <li>Error logs and performance data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We use the information we collect for the following purposes:
              </p>

              <h3>Service Provision</h3>
              <ul>
                <li>Provide and maintain our learning platform</li>
                <li>Personalize your learning experience</li>
                <li>Generate AI-powered feedback and recommendations</li>
                <li>Track your progress and achievements</li>
                <li>Process payments and manage subscriptions</li>
              </ul>

              <h3>Communication</h3>
              <ul>
                <li>Send you service-related notifications</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Notify you of updates and new features</li>
              </ul>

              <h3>Improvement and Analytics</h3>
              <ul>
                <li>Analyze usage patterns to improve our Service</li>
                <li>Conduct research and development</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>How We Share Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                limited circumstances:
              </p>

              <h3>Service Providers</h3>
              <p>
                We may share your information with third-party service providers
                who assist us in operating our platform, including:
              </p>
              <ul>
                <li>Cloud hosting and data storage providers</li>
                <li>Payment processing companies</li>
                <li>Analytics and monitoring services</li>
                <li>Customer support platforms</li>
                <li>Email and communication services</li>
              </ul>

              <h3>Legal Requirements</h3>
              <p>
                We may disclose your information if required by law or in good
                faith belief that such action is necessary to:
              </p>
              <ul>
                <li>Comply with legal obligations or court orders</li>
                <li>Protect and defend our rights or property</li>
                <li>Prevent or investigate fraud or security issues</li>
                <li>Protect the safety of users or the public</li>
              </ul>

              <h3>Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, your
                information may be transferred as part of the business
                transaction, subject to appropriate safeguards.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We implement industry-standard security measures to protect your
                personal information:
              </p>
              <ul>
                <li>
                  <strong>Encryption:</strong> All data is encrypted in transit
                  and at rest using AES-256 encryption
                </li>
                <li>
                  <strong>Access Controls:</strong> Strict access controls and
                  authentication for our systems
                </li>
                <li>
                  <strong>Regular Audits:</strong> Security assessments and
                  vulnerability testing
                </li>
                <li>
                  <strong>Staff Training:</strong> Regular privacy and security
                  training for our team
                </li>
                <li>
                  <strong>Incident Response:</strong> Procedures for handling
                  security incidents
                </li>
              </ul>
              <p>
                While we strive to protect your information, no method of
                transmission over the internet or electronic storage is 100%
                secure. We cannot guarantee absolute security but are committed
                to protecting your data using reasonable measures.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>

              <h3>Access and Portability</h3>
              <ul>
                <li>Request access to your personal information</li>
                <li>Obtain a copy of your data in a portable format</li>
                <li>Request information about how we use your data</li>
              </ul>

              <h3>Correction and Deletion</h3>
              <ul>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your information</li>
              </ul>

              <h3>Control and Consent</h3>
              <ul>
                <li>Withdraw consent for marketing communications</li>
                <li>Opt-out of certain data processing activities</li>
                <li>Restrict processing of your information</li>
              </ul>

              <p>
                To exercise these rights, please contact us at
                privacy@fluenta.ai. We will respond to your request within 30
                days and may require verification of your identity.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                Privacy Policy:
              </p>
              <ul>
                <li>
                  <strong>Account Information:</strong> Retained while your
                  account is active and for 3 years after closure
                </li>
                <li>
                  <strong>Learning Data:</strong> Retained to maintain your
                  progress and for service improvement
                </li>
                <li>
                  <strong>Payment Information:</strong> Retained as required by
                  financial regulations (typically 7 years)
                </li>
                <li>
                  <strong>Communication Records:</strong> Retained for 3 years
                  for support and legal purposes
                </li>
                <li>
                  <strong>Analytics Data:</strong> Aggregated and anonymized
                  data may be retained indefinitely
                </li>
              </ul>
              <p>
                You may request deletion of your data at any time, subject to
                legal requirements and legitimate business needs.
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We use cookies and similar technologies to enhance your
                experience:
              </p>

              <h3>Types of Cookies</h3>
              <ul>
                <li>
                  <strong>Essential Cookies:</strong> Required for basic
                  functionality and security
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how
                  you use our Service
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences
                  and settings
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used for targeted
                  advertising (with your consent)
                </li>
              </ul>

              <p>
                You can control cookies through your browser settings. However,
                disabling certain cookies may limit your ability to use some
                features of our Service.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Your information may be transferred to and processed in
                countries other than your own. We ensure adequate protection
                through:
              </p>
              <ul>
                <li>
                  Standard Contractual Clauses approved by relevant authorities
                </li>
                <li>Adequacy decisions by regulatory bodies</li>
                <li>Other appropriate safeguards as required by law</li>
              </ul>
              <p>
                By using our Service, you consent to the transfer of your
                information to our facilities and service providers around the
                world.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Our Service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately.
              </p>
              <p>
                For users between 13 and 18 years of age, we may require
                parental consent in certain jurisdictions before collecting or
                processing personal information.
              </p>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any material changes by:
              </p>
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice in our Service</li>
              </ul>
              <p>
                Your continued use of our Service after the effective date of
                the updated Privacy Policy constitutes acceptance of the
                changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us:
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
                <p>
                  <strong>Data Protection Officer:</strong> dpo@fluenta-ai.com
                </p>
              </div>

              <p>
                We are committed to resolving any privacy concerns you may have
                and will respond to your inquiries promptly.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center gap-4 mt-12 pt-8 border-t">
          <Link href="/terms">
            <Button variant="outline">Terms of Service</Button>
          </Link>
          <Link href="/cookie-policy">
            <Button variant="outline">Cookie Policy</Button>
          </Link>
          <Link href="/en/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
