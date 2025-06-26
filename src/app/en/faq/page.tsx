"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronRight,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
} from "lucide-react";
import { MainNav } from "@/components/navigation/main-nav";
import PopularResourcesEn from "@/components/layout/PopularResourcesEn";
import FooterEn from "@/components/layout/FooterEn";

export default function EnglishFAQPage() {
  const faqCategories = [
    {
      title: "General Questions",
      icon: "❓",
      id: "general-questions",
      faqs: [
        {
          question: "What is Fluenta and how does it work?",
          answer:
            "Fluenta is an AI-powered English learning platform that provides personalized tutoring, conversation practice, pronunciation coaching, and grammar checking. Our advanced AI adapts to your learning style and pace, analyzes your weaknesses, and creates custom lesson plans. It offers 6 comprehensive modules: speaking, listening, reading, writing, grammar, and vocabulary.",
        },
        {
          question: "What levels of students is it suitable for?",
          answer:
            "Fluenta is suitable for all levels from beginner (A1) to advanced (C2). The platform starts with a level assessment and provides appropriate content, automatically adjusting difficulty as you progress.",
        },
        {
          question: "How is it different from other English learning apps?",
          answer:
            "Fluenta's key difference is its use of real AI technology. It doesn't just provide pre-made content but adapts specifically to each student. It offers a unique experience with real-time pronunciation analysis, personalized feedback, and a continuously learning AI system.",
        },
        {
          question: "How quickly can I see results?",
          answer:
            "Most of our students notice significant improvements within the first 2 weeks. With regular use (30 minutes daily), advancing one level in 3 months is possible. Of course, this depends on your starting level and study consistency.",
        },
      ],
    },
    {
      title: "Pricing and Subscription",
      icon: "💰",
      id: "pricing",
      faqs: [
        {
          question: "What are your pricing plans?",
          answer:
            "We have 3 different plans: Free ($0/month - limited features), Premium ($14.99/month - all features), Pro ($24.99/month - 1:1 coaching + advanced features). All paid plans start with a 14-day free trial.",
        },
        {
          question: "How does the free trial work?",
          answer:
            "You can use all Premium plan features free for 14 days. No credit card required. No automatic billing after trial ends - you need to manually purchase a subscription.",
        },
        {
          question: "Can I cancel anytime?",
          answer:
            "Yes, you can cancel your subscription anytime. After cancellation, your access continues until the end of the current period. You can cancel from account settings or by contacting our support team.",
        },
        {
          question: "Do you have a money-back guarantee?",
          answer:
            "Yes, we offer an unconditional money-back guarantee within the first 30 days if you're not satisfied. You can start a refund request by emailing support@fluenta-ai.com.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "You can pay with credit card, debit card, PayPal, and Apple Pay. All payments are processed securely with SSL encryption. Wire transfer/bank transfer options are available for corporate customers.",
        },
      ],
    },
    {
      title: "Platform Usage",
      icon: "💻",
      id: "platform-usage",
      faqs: [
        {
          question: "What devices can I use it on?",
          answer:
            "Fluenta can be used on web browsers (Chrome, Safari, Firefox, Edge) and mobile apps (iOS, Android). You can access from all your devices with the same account and continue where you left off.",
        },
        {
          question: "Can I use it without internet connection?",
          answer:
            "Some content can be used offline in the mobile app. However, AI features (speech analysis, real-time feedback) require internet connection.",
        },
        {
          question: "How much should I study daily?",
          answer:
            "We recommend minimum 15-20 minutes daily. For best results, 30-45 minutes daily is ideal. The platform tracks your study time and sets appropriate goals for you.",
        },
        {
          question: "How can I track my progress?",
          answer:
            "You can see your daily, weekly, and monthly progress in the detailed dashboard. Charts show your strengths and areas that need more work.",
        },
      ],
    },
    {
      title: "AI Features",
      icon: "🤖",
      id: "ai-features",
      faqs: [
        {
          question: "How does the AI teacher work?",
          answer:
            "Your AI teacher continuously analyzes your performance, learns your learning patterns, and creates personalized lesson plans. It learns from your mistakes and prepares special exercises to prevent repeating similar errors.",
        },
        {
          question: "How accurate is pronunciation analysis?",
          answer:
            "Our pronunciation analysis has 95%+ accuracy rate. Our speech recognition technology compares with native speaker pronunciation and provides detailed feedback.",
        },
        {
          question: "Can I practice real conversations with AI?",
          answer:
            "Yes, you can chat in real-time with your AI conversation partner. You can practice different scenarios (job interviews, shopping, travel) and get instant corrections.",
        },
        {
          question: "Does it automatically correct my grammar mistakes?",
          answer:
            "Yes, in the writing module, your AI assistant detects and corrects your grammar mistakes in real-time. It doesn't just correct but also explains why it was wrong.",
        },
      ],
    },
    {
      title: "Technical Support",
      icon: "🔧",
      id: "technical-support",
      faqs: [
        {
          question: "What should I do when I experience technical issues?",
          answer:
            "First, we recommend refreshing the page and trying a different browser. If the issue persists, you can use live support (in-platform) or email technical@fluenta-ai.com.",
        },
        {
          question: "Voice recording feature isn't working, what should I do?",
          answer:
            "Check your browser's microphone access permission. In Chrome, click the microphone icon in the address bar to grant permission. If the issue continues, try a different browser.",
        },
        {
          question: "Where can I download the mobile app?",
          answer:
            "You can download by searching 'Fluenta' on App Store for iOS and Google Play Store for Android. Direct download links with QR codes are also available on our website.",
        },
        {
          question: "I can't log into my account, what should I do?",
          answer:
            "If you forgot your password, use the 'Forgot Password' link. Make sure you enter your email address correctly. If the issue persists, contact our support team.",
        },
      ],
    },
    {
      title: "Progress and Success",
      icon: "🏆",
      id: "progress-success",
      faqs: [
        {
          question: "How can I measure my progress?",
          answer:
            "The platform has detailed analytics and progress reports. You can track your daily, weekly, and monthly performance and see your strengths and weaknesses.",
        },
        {
          question: "Can I learn Business English?",
          answer:
            "Yes, our platform includes Business English content. You can develop English skills for professional use like email writing, presentations, meeting management, and negotiations.",
        },
        {
          question: "Can I be matched with real people for speaking practice?",
          answer:
            "Currently, you can only practice with AI conversation partners. A feature for matching with real conversation partners may be added in the future.",
        },
        {
          question: "How can I track my achievements?",
          answer:
            "The dashboard contains detailed statistics, achievement badges, and progress charts. Weekly and monthly reports are sent via email.",
        },
      ],
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/en/faq" language="en" />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/en" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <span>Frequently Asked Questions</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">❓ FAQ</Badge>
            <Badge variant="outline">Quick Answers</Badge>
            <Badge variant="outline">Support</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Find answers to everything you're curious about regarding Fluenta's
            AI-powered English learning platform. If you can't find what you're
            looking for, contact our support team.
          </p>
        </section>

        {/* Quick Links */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Topic Navigation</h2>
            <p className="text-muted-foreground">
              Quickly access the topic you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {faqCategories.map((category, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => scrollToSection(category.id)}
              >
                <CardContent className="pt-4">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="text-sm font-medium">{category.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} id={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-semibold">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Resources */}
        <PopularResourcesEn />
      </main>

      {/* Footer */}
      <FooterEn />
    </div>
  );
}
