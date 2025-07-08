import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Quote,
  TrendingUp,
  Award,
  Users,
  Clock,
  Globe,
  BookOpen,
  MessageSquare,
  Target,
  ChevronRight,
  Star,
} from "lucide-react";

import FooterEn from "@/components/layout/FooterEn";

export const metadata: Metadata = {
  title: "Success Stories | Fluenta AI",
  description:
    "Read inspiring success stories from Fluenta students. Discover real results from our AI-powered English learning platform.",
  keywords:
    "English learning success stories, Fluenta reviews, AI English tutor results, pronunciation improvement stories, English speaking confidence, language learning transformation",
  alternates: {
    canonical: "/en/success-stories",
    languages: {
      en: "/en/success-stories",
      tr: "/basari-hikayeleri",
    },
  },
  openGraph: {
    title: "Student Success Stories and Reviews - Fluenta AI English Learning",
    description:
      "Discover how students worldwide transformed their English skills with Fluenta's AI-powered learning platform. Real stories, real results.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-images/og-testimonials-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta Student Success Stories",
      },
    ],
  },
};

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/en/success-stories" language="en" />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/en" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Success Stories</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0"
            >
              <Star className="w-4 h-4 mr-1" />
              Success Stories
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Real Results
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-0"
            >
              <Users className="w-4 h-4 mr-1" />
              50K+ Students
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Transform Your English Like These Students
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Discover how students worldwide improved their English speaking,
            pronunciation, and confidence with Fluenta's AI-powered learning
            platform.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">50K+</div>
              <div className="text-sm text-blue-700">Happy Students</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">87%</div>
              <div className="text-sm text-green-700">Confidence Boost</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
              <div className="text-sm text-purple-700">Pronunciation</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                3 Mo
              </div>
              <div className="text-sm text-orange-700">Avg. Progress</div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-16">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button variant="default" size="sm" className="rounded-full">
              <Target className="w-4 h-4 mr-2" />
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Speaking
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-green-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              IELTS/TOEFL
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-purple-50"
            >
              <Globe className="w-4 h-4 mr-2" />
              Business
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-orange-50"
            >
              <Award className="w-4 h-4 mr-2" />
              Pronunciation
            </Button>
          </div>
        </section>

        {/* Featured Success Stories */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover real transformation stories from real students
            </p>
          </div>

          <div className="space-y-20">
            {/* Maria's Story - Enhanced */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/30 hover:shadow-3xl transition-all duration-300">
                  <CardContent className="p-8 lg:p-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        5.0/5.0
                      </span>
                    </div>

                    <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-60" />
                    <blockquote className="text-lg lg:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "From being afraid of job interviews to confidently
                      applying for my dream job at Google. Fluenta's AI
                      interview practice was a game-changer!"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">MR</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Maria Rodriguez
                        </div>
                        <div className="text-blue-600 font-medium">
                          Software Engineer at Google
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Madrid, Spain
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      Maria's Journey
                    </h3>
                    <div className="text-blue-100 mb-4">
                      B1 to C1 in 4 Months
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-sm font-bold">
                              1
                            </span>
                          </div>
                          <div>
                            <strong className="text-red-600">Challenge:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Strong technical skills as a software engineer but
                              struggled with English communication in
                              professional settings.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-sm font-bold">
                              2
                            </span>
                          </div>
                          <div>
                            <strong className="text-blue-600">Solution:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Daily practice with Fluenta's AI speaking partner,
                              business English module, and interview
                              simulations.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 text-sm font-bold">
                              3
                            </span>
                          </div>
                          <div>
                            <strong className="text-green-600">Result:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Advanced from B1 to C1 in 4 months and secured a
                              software engineer position at Google.
                            </p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-green-800">
                              English Level Progress
                            </span>
                            <span className="text-sm text-green-600 font-bold">
                              +85%
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-green-700">
                              <span>B1 (Start)</span>
                              <span>C1 (Current)</span>
                            </div>
                            <Progress value={85} className="h-2 bg-green-100" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Ahmed's Story - Enhanced */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6" />
                      Ahmed's Story
                    </h3>
                    <div className="text-emerald-100 mb-4">
                      IELTS 6.0 to 8.5
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <strong className="text-blue-600">Goal:</strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Needed IELTS 8.0+ for medical specialization in
                            Canada.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <strong className="text-orange-600">
                              Starting Point:
                            </strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            IELTS 6.0 with particular challenges in speaking and
                            listening sections.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            <strong className="text-purple-600">
                              Strategy:
                            </strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Fluenta's IELTS preparation module, daily speaking
                            practice, and pronunciation trainer.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-green-600" />
                            <strong className="text-green-600">
                              Achievement:
                            </strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Achieved IELTS 8.5 in 6 months and got accepted for
                            medical specialization in Canada.
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                          <div className="text-sm font-medium text-blue-800 mb-3">
                            IELTS Score Progress:
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Speaking:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-600">
                                  5.5
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Listening:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-600">
                                  6.0
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Reading:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-orange-600">
                                  6.5
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Writing:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-600">
                                  6.0
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <span className="text-sm font-bold text-green-600">
                                  8.0
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="order-2">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50/30 hover:shadow-3xl transition-all duration-300">
                  <CardContent className="p-8 lg:p-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        5.0/5.0
                      </span>
                    </div>

                    <Quote className="w-8 h-8 text-emerald-500 mb-4 opacity-60" />
                    <blockquote className="text-lg lg:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "Thanks to Fluenta, I not only improved my IELTS score but
                      gained real confidence in speaking English. Now I'm
                      working as a doctor in Canada!"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">AH</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Dr. Ahmed Hassan
                        </div>
                        <div className="text-emerald-600 font-medium">
                          Medical Specialist
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Toronto, Canada
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Yuki's Story - Enhanced */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50/30 hover:shadow-3xl transition-all duration-300">
                  <CardContent className="p-8 lg:p-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        5.0/5.0
                      </span>
                    </div>

                    <Quote className="w-8 h-8 text-purple-500 mb-4 opacity-60" />
                    <blockquote className="text-lg lg:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "Fluenta's pronunciation training transformed my English
                      speaking. My colleagues now understand me perfectly, and
                      I've been promoted to team lead!"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">YT</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Yuki Tanaka
                        </div>
                        <div className="text-purple-600 font-medium">
                          UX Team Lead at Sony
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Tokyo, Japan
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-6 h-6" />
                      Yuki's Journey
                    </h3>
                    <div className="text-purple-100 mb-4">
                      From Struggling to Leading
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-sm font-bold">
                              1
                            </span>
                          </div>
                          <div>
                            <strong className="text-red-600">Challenge:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Excellent UX designer but pronunciation issues
                              limited career growth and team communication.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-sm font-bold">
                              2
                            </span>
                          </div>
                          <div>
                            <strong className="text-blue-600">Solution:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Intensive pronunciation training with AI feedback,
                              business communication practice, and presentation
                              skills.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 text-sm font-bold">
                              3
                            </span>
                          </div>
                          <div>
                            <strong className="text-green-600">Result:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              Achieved natural pronunciation, improved team
                              communication, and earned promotion to UX Team
                              Lead.
                            </p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-purple-800">
                              Key Improvements
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Pronunciation Accuracy</span>
                                <span className="text-purple-600 font-bold">
                                  95%
                                </span>
                              </div>
                              <Progress
                                value={95}
                                className="h-2 bg-purple-100"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Meeting Confidence</span>
                                <span className="text-purple-600 font-bold">
                                  90%
                                </span>
                              </div>
                              <Progress
                                value={90}
                                className="h-2 bg-purple-100"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Team Communication</span>
                                <span className="text-purple-600 font-bold">
                                  92%
                                </span>
                              </div>
                              <Progress
                                value={92}
                                className="h-2 bg-purple-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Start Your Success Story Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who have transformed their English
                skills with Fluenta's AI-powered learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/en/modules">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Explore Modules
                  </Button>
                </Link>
              </div>
            </CardContent>
          </GradientCard>
        </section>
      </main>

      {/* Footer */}
      <FooterEn />
    </div>
  );
}
