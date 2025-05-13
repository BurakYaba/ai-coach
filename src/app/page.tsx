import Link from "next/link";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  GradientCard,
  GradientCardSimple,
} from "@/components/ui/gradient-card";

// SEO metadata for the landing page
export const metadata: Metadata = {
  title: "AI Language Coach | Master English with Personalized Learning",
  description:
    "Improve your English with AI-powered reading, writing, listening, speaking, vocabulary, and grammar practice. Get personalized feedback and track your progress.",
  keywords:
    "language learning, English learning app, AI language tutor, English practice, vocabulary builder, grammar lessons, speaking practice",
};

// Custom components based on Brainwave design
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 text-sm font-light tracking-widest uppercase text-center">
    {children}
  </div>
);

// Animated background element
const BackgroundGradient = () => (
  <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-0 left-1/2 w-[80rem] h-[80rem] -translate-x-1/2 -translate-y-1/2 opacity-30">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-transparent to-secondary blur-3xl animate-gradient-xy" />
    </div>
    <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] opacity-20">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-secondary to-transparent blur-3xl animate-pulse-glow" />
    </div>
    <div
      className="hidden lg:block absolute bottom-1/3 left-10 w-24 h-24 rounded-full bg-primary bg-opacity-30 blur-xl animate-float"
      style={{ animationDelay: "0s" }}
    />
    <div
      className="hidden lg:block absolute top-1/3 right-10 w-20 h-20 rounded-full bg-accent bg-opacity-30 blur-xl animate-float"
      style={{ animationDelay: "1s" }}
    />
    <div
      className="hidden lg:block absolute top-2/3 right-1/4 w-16 h-16 rounded-full bg-secondary bg-opacity-30 blur-xl animate-float"
      style={{ animationDelay: "2s" }}
    />
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Global background effect */}
      <BackgroundGradient />

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background bg-opacity-95">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">AI Language Coach</div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#modules"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Learning Modules
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="transition-colors hover:text-primary"
              >
                Login
              </Button>
            </Link>
            <GradientButton href="/register">Get Started</GradientButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-[7rem] -mt-[4rem] relative" id="hero">
        <div className="container relative mx-auto px-5 pb-16 pt-20 md:pb-24 md:pt-24 lg:pb-32 lg:pt-36">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-16 lg:mb-[6rem]">
            <Tagline>Complete English Learning Platform</Tagline>
            <h1
              className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] text-center mb-6 animate-float"
              style={{ animationDuration: "6s" }}
            >
              Master English with Your
              <span className="text-gradient"> AI Language Coach</span>
            </h1>
            <p className="max-w-[42rem] mx-auto leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-center mb-8">
              The all-in-one platform for learning English through interactive
              reading, writing, listening, speaking, vocabulary, and grammar
              modules. Get personalized AI feedback on all your language skills.
            </p>
            <div className="flex gap-4 justify-center">
              <GradientButton
                href="/register"
                size="lg"
                className="animate-pulse-glow"
                style={{ animationDuration: "4s" }}
              >
                Start Learning Now
              </GradientButton>
              <GradientButton href="#modules" variant="outline" size="lg">
                Explore Modules
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Modules Section */}
      <section
        id="modules"
        className="container mx-auto px-5 py-16 md:py-24 space-y-16 relative"
      >
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Tagline>Comprehensive Learning</Tagline>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Language Skills Development
          </h2>
          <p className="text-muted-foreground">
            Our platform offers interactive modules for all aspects of language
            learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Reading Module */}
          <GradientCard className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-1">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Reading Module</h3>
              <p className="text-sm text-muted-foreground">
                Improve your reading comprehension with AI-generated content
                tailored to your level and interests. Answer interactive
                questions, learn vocabulary in context, and track your progress.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Personalized reading passages
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Comprehension questions
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Vocabulary in context
                </li>
              </ul>
            </div>
          </GradientCard>

          {/* Writing Module */}
          <GradientCard className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-1">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Writing Module</h3>
              <p className="text-sm text-muted-foreground">
                Enhance your writing skills with guided prompts and AI-powered
                feedback. Get detailed analysis on grammar, vocabulary usage,
                sentence structure, and more.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Diverse writing prompts
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Detailed writing analysis
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Progress tracking
                </li>
              </ul>
            </div>
          </GradientCard>

          {/* Listening Module */}
          <GradientCard className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-1">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Listening Module</h3>
              <p className="text-sm text-muted-foreground">
                Sharpen your listening skills with a library of audio content.
                Listen to conversations, answer questions, and practice
                understanding native speakers.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Diverse audio content
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Interactive exercises
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Transcript support
                </li>
              </ul>
            </div>
          </GradientCard>

          {/* Speaking Module */}
          <GradientCard className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-1">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Speaking Module</h3>
              <p className="text-sm text-muted-foreground">
                Practice speaking English with AI conversation partners. Get
                feedback on pronunciation, fluency, grammar, and vocabulary in
                real-time.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Real-time conversations
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Detailed pronunciation feedback
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Various conversation scenarios
                </li>
              </ul>
            </div>
          </GradientCard>

          {/* Vocabulary Module */}
          <GradientCard className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-1">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 13V5"></path>
                  <path d="M5 13h14"></path>
                  <path d="M15 3h6v4h-6z"></path>
                  <path d="M5 7a2 2 0 0 1 2-2h6"></path>
                  <path d="M9 17v4"></path>
                  <path d="M6 21h6"></path>
                  <path d="M14 17v4"></path>
                  <path d="M15 21h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Vocabulary Module</h3>
              <p className="text-sm text-muted-foreground">
                Build your vocabulary with a personalized word bank, spaced
                repetition review system, and interactive flashcards to track
                your mastery level.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Spaced repetition learning
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Interactive flashcards
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Mastery tracking
                </li>
              </ul>
            </div>
          </GradientCard>

          {/* Grammar Module */}
          <GradientCard className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-1">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  <line x1="12" y1="6" x2="16" y2="6"></line>
                  <line x1="12" y1="10" x2="16" y2="10"></line>
                  <line x1="12" y1="14" x2="16" y2="14"></line>
                  <line x1="8" y1="6" x2="8" y2="6"></line>
                  <line x1="8" y1="10" x2="8" y2="10"></line>
                  <line x1="8" y1="14" x2="8" y2="14"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Grammar Module</h3>
              <p className="text-sm text-muted-foreground">
                Master English grammar with personalized lessons targeting your
                weak areas. Take daily challenges and get detailed explanations
                for grammar rules.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Personalized grammar lessons
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Daily grammar challenges
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Error pattern recognition
                </li>
              </ul>
            </div>
          </GradientCard>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-5 py-16 md:py-24 space-y-16 relative"
      >
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Tagline>Key Features</Tagline>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A Complete Language Learning Experience
          </h2>
          <p className="text-muted-foreground">
            Our platform offers powerful tools to enhance your language learning
            journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <GradientCardSimple
            variant="default"
            borderOpacity="low"
            className="group flex flex-col items-center text-center space-y-4 bg-card hover:shadow-xl hover:shadow-primary hover:shadow-opacity-5 transition-all duration-300 backdrop-blur-card hover:scale-105 hover:-translate-y-1"
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-10 group-hover:bg-opacity-30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M21.17 8H12V2.83c2.44.4 4.77 1.69 6.6 3.67 1.77 1.91 2.57 4 2.57 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              AI-Powered Learning
            </h3>
            <p className="text-muted-foreground">
              Our advanced AI engine personalizes content, analyzes your
              performance, and adapts lessons to your learning style and
              progress.
            </p>
          </GradientCardSimple>

          <GradientCardSimple
            variant="accent"
            borderOpacity="low"
            className="group flex flex-col items-center text-center space-y-4 bg-card hover:shadow-xl hover:shadow-primary hover:shadow-opacity-5 transition-all duration-300 backdrop-blur-card hover:scale-105 hover:-translate-y-1"
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-10 group-hover:bg-opacity-30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              Comprehensive Feedback
            </h3>
            <p className="text-muted-foreground">
              Get detailed, actionable feedback on your writing, speaking, and
              grammar with suggestions for improvement and progress tracking.
            </p>
          </GradientCardSimple>

          <GradientCardSimple
            variant="secondary"
            borderOpacity="low"
            className="group flex flex-col items-center text-center space-y-4 bg-card hover:shadow-xl hover:shadow-primary hover:shadow-opacity-5 transition-all duration-300 backdrop-blur-card hover:scale-105 hover:-translate-y-1"
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-10 group-hover:bg-opacity-30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-secondary group-hover:scale-110 transition-transform duration-300"
              >
                <path d="m7 11 2-2-2-2"></path>
                <path d="M11 13h4"></path>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              Interactive Practice
            </h3>
            <p className="text-muted-foreground">
              Engage with interactive exercises, conversations, and language
              games that make learning enjoyable while reinforcing key concepts.
            </p>
          </GradientCardSimple>

          <GradientCardSimple
            variant="default"
            borderOpacity="low"
            className="group flex flex-col items-center text-center space-y-4 bg-card hover:shadow-xl hover:shadow-primary hover:shadow-opacity-5 transition-all duration-300 backdrop-blur-card hover:scale-105 hover:-translate-y-1"
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-10 group-hover:bg-opacity-30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              Gamification & Rewards
            </h3>
            <p className="text-muted-foreground">
              Stay motivated with points, badges, streaks, and level progression
              that make learning English addictive and fun.
            </p>
          </GradientCardSimple>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -z-10 pointer-events-none inset-0 opacity-20">
          <div
            className="absolute top-0 right-1/4 w-72 h-72 bg-accent bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary bg-opacity-20 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="relative py-16 md:py-24 overflow-hidden"
      >
        <div className="container mx-auto px-5 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <Tagline>User Testimonials</Tagline>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground">
              Join thousands of satisfied learners who have transformed their
              language skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GradientCardSimple
              variant="default"
              borderOpacity="low"
              className="relative group hover:shadow-glow transition-all duration-500 backdrop-blur-card"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
              <div className="space-y-4">
                <p className="italic text-muted-foreground">
                  "The combination of reading, writing, listening and speaking
                  modules has transformed my English learning journey. The
                  personalized feedback on my speaking and writing is incredibly
                  detailed and helpful."
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-foreground border-opacity-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent bg-opacity-30 flex items-center justify-center">
                    <span className="text-sm font-semibold">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah J.</h4>
                    <p className="text-sm text-muted-foreground">
                      Business Professional
                    </p>
                  </div>
                </div>
              </div>
            </GradientCardSimple>

            <GradientCardSimple
              variant="accent"
              borderOpacity="low"
              className="relative group hover:shadow-glow transition-all duration-500 backdrop-blur-card"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                2
              </div>
              <div className="space-y-4">
                <p className="italic text-muted-foreground">
                  "The vocabulary and grammar modules work together beautifully.
                  I love how the app tracks words I struggle with and creates
                  customized grammar lessons based on my common mistakes. The
                  progress tracking keeps me motivated."
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-foreground border-opacity-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent bg-opacity-30 flex items-center justify-center">
                    <span className="text-sm font-semibold">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael T.</h4>
                    <p className="text-sm text-muted-foreground">
                      University Student
                    </p>
                  </div>
                </div>
              </div>
            </GradientCardSimple>

            <GradientCardSimple
              variant="secondary"
              borderOpacity="low"
              className="relative group hover:shadow-glow transition-all duration-500 backdrop-blur-card"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                3
              </div>
              <div className="space-y-4">
                <p className="italic text-muted-foreground">
                  "As a language teacher, I'm impressed by the comprehensive
                  approach. The interactive games make learning fun, and the
                  spaced repetition system in the vocabulary section ensures my
                  students retain what they learn. The speaking module's
                  feedback is remarkable."
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-foreground border-opacity-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent bg-opacity-30 flex items-center justify-center">
                    <span className="text-sm font-semibold">E</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Elena K.</h4>
                    <p className="text-sm text-muted-foreground">
                      Language Teacher
                    </p>
                  </div>
                </div>
              </div>
            </GradientCardSimple>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -z-10 pointer-events-none inset-0 opacity-20">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent bg-opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary bg-opacity-20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-foreground border-opacity-5 bg-background bg-opacity-30 backdrop-blur-sm relative">
        <div className="container mx-auto px-5 py-16 md:py-24 space-y-8 text-center relative z-10">
          <Tagline>Start Your Journey</Tagline>
          <h2
            className="text-3xl md:text-4xl font-bold animate-float"
            style={{ animationDuration: "5s" }}
          >
            Master All English Skills in One Platform
          </h2>
          <p className="text-muted-foreground max-w-[42rem] mx-auto">
            Join thousands of learners improving their reading, writing,
            listening, speaking, vocabulary, and grammar with our comprehensive
            AI-powered language coach.
          </p>
          <div className="flex justify-center">
            <GradientButton
              href="/register"
              size="lg"
              className="animate-pulse-glow"
              style={{ animationDuration: "3s" }}
            >
              Start Learning Now
            </GradientButton>
          </div>

          {/* Decorative background elements */}
          <div className="absolute -z-10 pointer-events-none inset-0 opacity-20">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-10 rounded-full blur-3xl animate-pulse-glow"
              style={{ animationDuration: "10s" }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground border-opacity-5 py-12 relative">
        <div className="container mx-auto px-5 grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Language Coach</h3>
            <p className="text-sm text-muted-foreground">
              Your all-in-one AI-powered platform for mastering English through
              reading, writing, listening, speaking, vocabulary, and grammar.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-5 mt-8 pt-8 border-t border-foreground border-opacity-5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Language Coach. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Learning",
    description:
      "Our advanced AI engine personalizes content, analyzes your performance, and adapts lessons to your learning style and progress.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300"
      >
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M21.17 8H12V2.83c2.44.4 4.77 1.69 6.6 3.67 1.77 1.91 2.57 4 2.57 4z" />
      </svg>
    ),
  },
  {
    title: "Comprehensive Feedback",
    description:
      "Get detailed, actionable feedback on your writing, speaking, and grammar with suggestions for improvement.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-300"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
  {
    title: "Interactive Practice",
    description:
      "Engage with interactive exercises, conversations, and language games that make learning enjoyable.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-secondary group-hover:scale-110 transition-transform duration-300"
      >
        <path d="m7 11 2-2-2-2"></path>
        <path d="M11 13h4"></path>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      </svg>
    ),
  },
  {
    title: "Gamification & Rewards",
    description:
      "Stay motivated with points, badges, streaks, and level progression that make learning English addictive and fun.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="m15 9-6 6"></path>
        <path d="m9 9 6 6"></path>
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Sarah J.",
    title: "Business Professional",
    text: "The combination of reading, writing, listening and speaking modules has transformed my English learning journey. The personalized feedback on my speaking and writing is incredibly detailed and helpful.",
  },
  {
    name: "Michael T.",
    title: "University Student",
    text: "The vocabulary and grammar modules work together beautifully. I love how the app tracks words I struggle with and creates customized grammar lessons based on my common mistakes. The progress tracking keeps me motivated.",
  },
  {
    name: "Elena K.",
    title: "Language Teacher",
    text: "As a language teacher, I'm impressed by the comprehensive approach. The interactive games make learning fun, and the spaced repetition system in the vocabulary section ensures my students retain what they learn. The speaking module's feedback is remarkable.",
  },
];
