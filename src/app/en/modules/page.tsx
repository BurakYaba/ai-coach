"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import PopularResourcesEn from "@/components/layout/PopularResourcesEn";
import FooterEn from "@/components/layout/FooterEn";

// Tagline component matching the landing page
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50">
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {children}
      </span>
    </div>
  </div>
);

export default function EnglishModulesPage() {
  const modules = [
    {
      id: "speaking",
      title: "Speaking Practice",
      description:
        "Master English conversation with AI-powered speaking practice and real-time pronunciation feedback.",
      icon: "🗣️",
      features: [
        "AI Conversation Partners",
        "Pronunciation Analysis",
        "Real-world Scenarios",
        "Progress Tracking",
      ],
      href: "/modules/speaking",
      popular: true,
    },
    {
      id: "pronunciation",
      title: "Pronunciation Trainer",
      description:
        "Perfect your English pronunciation with phoneme-level feedback and accent training.",
      icon: "🎯",
      features: [
        "Phoneme Analysis",
        "Accent Training",
        "Word Stress Practice",
        "IPA Learning",
      ],
      href: "/modules/pronunciation-trainer",
      popular: false,
    },
    {
      id: "grammar",
      title: "Grammar Coach",
      description:
        "Master English grammar rules with interactive lessons and AI-powered error correction.",
      icon: "📝",
      features: [
        "Interactive Lessons",
        "Error Analysis",
        "Grammar Rules",
        "Practice Exercises",
      ],
      href: "/modules/grammar-coach",
      popular: false,
    },
    {
      id: "vocabulary",
      title: "Vocabulary Builder",
      description:
        "Expand your English vocabulary with spaced repetition and contextual learning.",
      icon: "📚",
      features: [
        "Spaced Repetition",
        "Contextual Learning",
        "Word Families",
        "Progress Tracking",
      ],
      href: "/modules/vocabulary-builder",
      popular: false,
    },
    {
      id: "writing",
      title: "Writing",
      description:
        "Improve your writing skills with AI-powered feedback and guidance.",
      icon: "✍️",
      features: [
        "Writing Analysis",
        "Style Suggestions",
        "Grammar Checking",
        "Essay Structure",
      ],
      href: "/en/modules/writing",
      popular: false,
    },
    {
      id: "reading",
      title: "Reading Comprehension",
      description:
        "Enhance reading skills with interactive texts and comprehension exercises.",
      icon: "📖",
      features: [
        "Interactive Texts",
        "Comprehension Questions",
        "Vocabulary Learning",
        "Speed Reading",
      ],
      href: "/modules/reading-comprehension",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/en/modules" language="en" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/en" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <span>Learning Modules</span>
        </nav>

        {/* Header */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>Comprehensive Learning</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            English Learning Modules
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master all English skills with Fluenta's AI-powered modules. Each
            module offers a personalized learning experience tailored to your
            needs.
          </p>
        </section>

        {/* Modules Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Reading Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/reading_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/80 group-hover:from-blue-900/70 group-hover:via-blue-800/60 group-hover:to-blue-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
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
              <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                Reading Module
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed flex-grow">
                Improve your reading comprehension with AI-generated content
                tailored to your level and interests. Answer interactive
                questions, learn vocabulary in context, and track your progress.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-blue-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Personalized reading texts
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
                    className="h-4 w-4 mr-2 text-blue-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Comprehension questions and analysis
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
                    className="h-4 w-4 mr-2 text-blue-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Vocabulary learning in context
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/en/modules/reading">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Explore Module
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Writing Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-green-200/50 dark:border-green-700/50 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/writing_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-900/80 group-hover:from-green-900/70 group-hover:via-green-800/60 group-hover:to-green-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110">
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
              <h3 className="text-xl font-semibold text-white group-hover:text-green-200 transition-colors duration-300">
                Writing Module
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed flex-grow">
                Enhance your writing skills with guided topics and AI-powered
                feedback. Get detailed analysis on grammar, vocabulary usage,
                sentence structure, and more.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-green-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Diverse writing topics
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
                    className="h-4 w-4 mr-2 text-green-300"
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
                    className="h-4 w-4 mr-2 text-green-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Progress tracking
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/en/modules/writing">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Explore Module
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Listening Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/listening_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-800/70 to-purple-900/80 group-hover:from-purple-900/70 group-hover:via-purple-800/60 group-hover:to-purple-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
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
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
                Listening Module
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed flex-grow">
                Sharpen your listening skills with our audio content library.
                Listen to conversations, answer questions, and practice
                understanding native speakers.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-purple-300"
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
                    className="h-4 w-4 mr-2 text-purple-300"
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
                    className="h-4 w-4 mr-2 text-purple-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Transcript support
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/en/modules/listening">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Explore Module
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Speaking Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-red-200/50 dark:border-red-700/50 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/speaking_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-800/70 to-red-900/80 group-hover:from-red-900/70 group-hover:via-red-800/60 group-hover:to-red-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-110">
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
              <h3 className="text-xl font-semibold text-white group-hover:text-red-200 transition-colors duration-300">
                Speaking Module
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed flex-grow">
                Practice real-time conversations with AI speaking partners.
                Develop pronunciation, fluency, and confidence. Practice in
                various scenarios to perfect your speaking skills.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-red-300"
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
                    className="h-4 w-4 mr-2 text-red-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Pronunciation feedback
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
                    className="h-4 w-4 mr-2 text-red-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Various speaking scenarios
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/en/modules/speaking">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Explore Module
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Vocabulary Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/vocabulary_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/80 via-yellow-800/70 to-yellow-900/80 group-hover:from-yellow-900/70 group-hover:via-yellow-800/60 group-hover:to-yellow-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300 group-hover:scale-110">
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
              <h3 className="text-xl font-semibold text-white group-hover:text-yellow-200 transition-colors duration-300">
                Vocabulary Module
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed flex-grow">
                Systematically expand your vocabulary with personalized word
                banks and spaced repetition system. Learn in context and
                transfer to long-term memory.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-yellow-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Personalized word bank
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
                    className="h-4 w-4 mr-2 text-yellow-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Spaced repetition system
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
                    className="h-4 w-4 mr-2 text-yellow-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Interactive flashcards
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/en/modules/vocabulary">
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    Explore Module
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Grammar Module */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              backgroundImage: "url('/grammar_1200.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-800/70 to-indigo-900/80 group-hover:from-indigo-900/70 group-hover:via-indigo-800/60 group-hover:to-indigo-900/70 transition-all duration-300"></div>
            <div className="p-6 space-y-4 relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
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
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300">
                Grammar Module
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed flex-grow">
                Master English grammar with structured lessons and personalized
                practice. Analyze your mistakes and strengthen your weaknesses.
              </p>
              <ul className="text-sm space-y-2 text-gray-100">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-indigo-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Structured grammar lessons
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
                    className="h-4 w-4 mr-2 text-indigo-300"
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
                    className="h-4 w-4 mr-2 text-indigo-300"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Personalized practice
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/en/modules/grammar">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Explore Module
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <GradientCard>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get Access to All Modules
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Access all of Fluenta's modules and accelerate your English
                learning journey. AI-powered personalized experience awaits you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/en#pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3 w-full sm:w-auto"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </GradientCard>
        </section>

        {/* Popular Resources */}
        <PopularResourcesEn />
      </main>

      {/* Footer */}
      <FooterEn />
    </div>
  );
}
