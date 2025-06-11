import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service - Fluenta AI English Learning Platform",
  description:
    "Read Fluenta's Terms of Service to understand your rights and obligations when using our AI-powered English learning platform.",
  keywords:
    "fluenta terms of service, user agreement, terms and conditions, legal terms, service agreement",
};

export default function TermsOfServicePage() {
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
          <span>Terms of Service</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 15, 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Introduction and Acceptance</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Welcome to Fluenta. These Terms of Service ("Terms") govern your
                use of the Fluenta AI-powered English learning platform,
                including our website, mobile applications, and related services
                (collectively, the "Service") operated by Fluenta Inc.
                ("Fluenta", "we", "our", or "us").
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of these Terms, then
                you may not access the Service. These Terms apply to all
                visitors, users, and others who access or use the Service.
              </p>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card>
            <CardHeader>
              <CardTitle>Account Registration and Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Account Creation</h3>
              <p>
                To access certain features of our Service, you must register for
                an account by providing accurate and complete information. You
                agree to:
              </p>
              <ul>
                <li>
                  Provide true, accurate, current, and complete information
                </li>
                <li>Maintain and promptly update your account information</li>
                <li>Be responsible for all activities under your account</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3>Age Requirements</h3>
              <p>
                You must be at least 13 years old to use our Service. If you are
                between 13 and 18 years old, you must have parental consent.
                Users under 13 are not permitted to use the Service.
              </p>

              <h3>Account Termination</h3>
              <p>
                We reserve the right to terminate or suspend your account at any
                time, with or without notice, for conduct that we believe
                violates these Terms or is harmful to other users, us, or third
                parties.
              </p>
            </CardContent>
          </Card>

          {/* Use of Service */}
          <Card>
            <CardHeader>
              <CardTitle>Acceptable Use of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Permitted Use</h3>
              <p>
                You may use our Service for personal, educational purposes in
                accordance with these Terms. Our AI-powered learning tools are
                designed to help you improve your English language skills.
              </p>

              <h3>Prohibited Activities</h3>
              <p>
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Transmit any harmful, threatening, or offensive content</li>
                <li>Attempt to access unauthorized areas of the Service</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use automated systems to access the Service</li>
                <li>Share your account credentials with others</li>
                <li>Circumvent any security measures</li>
                <li>Upload viruses or malicious code</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </CardContent>
          </Card>

          {/* Subscription and Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription and Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Subscription Plans</h3>
              <p>
                Fluenta offers various subscription plans with different
                features and pricing. By subscribing, you agree to pay the
                applicable fees and taxes. Prices are subject to change with
                notice.
              </p>

              <h3>Payment and Billing</h3>
              <ul>
                <li>Subscription fees are billed in advance</li>
                <li>Payment is due at the beginning of each billing cycle</li>
                <li>We accept major credit cards and other payment methods</li>
                <li>
                  You authorize us to charge your payment method automatically
                </li>
                <li>Failed payments may result in service suspension</li>
              </ul>

              <h3>Cancellation and Refunds</h3>
              <ul>
                <li>You may cancel your subscription at any time</li>
                <li>
                  Cancellation takes effect at the end of the current billing
                  period
                </li>
                <li>
                  We offer a 14-day money-back guarantee for new subscriptions
                </li>
                <li>Refunds are processed to the original payment method</li>
                <li>No refunds for partial billing periods</li>
              </ul>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Our Content</h3>
              <p>
                The Service and its original content, features, and
                functionality are owned by Fluenta and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>

              <h3>Your Content</h3>
              <p>You retain ownership of content you create, including:</p>
              <ul>
                <li>Writing samples and exercises</li>
                <li>Audio recordings for pronunciation practice</li>
                <li>Profile information and preferences</li>
              </ul>
              <p>
                By using the Service, you grant us a license to use your content
                for providing and improving the Service, including AI analysis
                and personalized feedback.
              </p>

              <h3>License to Use</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license
                to access and use the Service for your personal educational use.
                This license does not permit commercial use or redistribution.
              </p>
            </CardContent>
          </Card>

          {/* AI and Learning Data */}
          <Card>
            <CardHeader>
              <CardTitle>AI Technology and Learning Data</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>AI-Powered Features</h3>
              <p>
                Our Service uses artificial intelligence to provide personalized
                learning experiences, including speech recognition, natural
                language processing, and adaptive learning algorithms.
              </p>

              <h3>Learning Data Usage</h3>
              <p>We use your learning data to:</p>
              <ul>
                <li>Provide personalized feedback and recommendations</li>
                <li>Track your progress and achievements</li>
                <li>Improve our AI algorithms and Service quality</li>
                <li>Generate anonymized analytics for research</li>
              </ul>

              <h3>Data Accuracy</h3>
              <p>
                While we strive for accuracy, AI-generated feedback and
                assessments are not perfect. You should use your judgment and
                consult with qualified instructors when needed.
              </p>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Your privacy is important to us. Our collection and use of
                personal information is governed by our Privacy Policy, which is
                incorporated into these Terms by reference. By using the
                Service, you consent to the collection and use of information as
                outlined in our Privacy Policy.
              </p>
              <p>Key privacy commitments include:</p>
              <ul>
                <li>We do not sell your personal information</li>
                <li>We use industry-standard security measures</li>
                <li>
                  You have rights to access, correct, and delete your data
                </li>
                <li>
                  We comply with applicable privacy laws (GDPR, CCPA, etc.)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimers and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Service Availability</h3>
              <p>
                We strive to provide uninterrupted service but cannot guarantee
                100% uptime. The Service may be temporarily unavailable due to
                maintenance, updates, or technical issues.
              </p>

              <h3>Educational Tool</h3>
              <p>
                Fluenta is an educational tool designed to supplement your
                English learning. It is not a replacement for formal education,
                certified instruction, or professional language assessment.
              </p>

              <h3>Disclaimer of Warranties</h3>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
                NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FLUENTA SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p>
                Our total liability to you for all claims arising from or
                relating to the Service shall not exceed the amount you paid us
                in the twelve (12) months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                You agree to defend, indemnify, and hold harmless Fluenta and
                its officers, directors, employees, and agents from and against
                any claims, damages, obligations, losses, liabilities, costs, or
                debt, and expenses (including but not limited to attorney's
                fees) arising from:
              </p>
              <ul>
                <li>Your use of and access to the Service</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right</li>
                <li>
                  Any claim that your content caused damage to a third party
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Termination by You</h3>
              <p>
                You may terminate your account at any time by contacting our
                support team or using the account deletion feature in your
                settings.
              </p>

              <h3>Termination by Us</h3>
              <p>
                We may terminate or suspend your access immediately, without
                prior notice, for any reason, including but not limited to
                breach of these Terms.
              </p>

              <h3>Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service will cease
                immediately. Your data will be handled according to our Privacy
                Policy and data retention policies.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <h3>Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of California, United States, without
                regard to conflict of law principles.
              </p>

              <h3>Dispute Resolution</h3>
              <p>
                Any disputes arising from these Terms or the Service shall be
                resolved through binding arbitration in accordance with the
                rules of the American Arbitration Association, except where
                prohibited by law.
              </p>

              <h3>Class Action Waiver</h3>
              <p>
                You agree that any arbitration or proceeding shall be limited to
                the dispute between us and you individually. You waive your
                right to participate in a class action lawsuit or class-wide
                arbitration.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We reserve the right to modify or replace these Terms at any
                time. If a revision is material, we will provide at least 30
                days' notice prior to any new terms taking effect.
              </p>
              <p>We will notify you of changes by:</p>
              <ul>
                <li>Posting the updated Terms on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a notice in the Service</li>
              </ul>
              <p>
                Your continued use of the Service after the effective date of
                the revised Terms constitutes acceptance of the changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                If you have any questions about these Terms of Service, please
                contact us:
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
                  <strong>Phone:</strong> +44 (0)7990 965247
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
          <Link href="/cookie-policy">
            <Button variant="outline">Cookie Policy</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
