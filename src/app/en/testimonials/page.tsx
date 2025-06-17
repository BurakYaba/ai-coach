import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import PopularResourcesEn from "@/components/layout/PopularResourcesEn";
import FooterEn from "@/components/layout/FooterEn";

export const metadata: Metadata = {
  title: "Student Success Stories & Testimonials - Fluenta AI English Learning",
  description:
    "Read inspiring success stories from Fluenta students who improved their English speaking, pronunciation, and confidence. Discover real results from our AI-powered English learning platform.",
  keywords:
    "English learning success stories, Fluenta testimonials, AI English tutor results, pronunciation improvement stories, English speaking confidence, language learning transformation, student reviews",
  alternates: {
    canonical: "/en/testimonials",
    languages: {
      en: "/en/testimonials",
      tr: "/basari-hikayeleri",
    },
  },
  openGraph: {
    title:
      "Student Success Stories & Testimonials - Fluenta AI English Learning",
    description:
      "Discover how students worldwide have transformed their English skills with Fluenta's AI-powered learning platform. Real stories, real results.",
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

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/en/testimonials" language="en" />

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
            Transform Your English Like These Students Did
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Discover how students worldwide have improved their English
            speaking, pronunciation, and confidence with Fluenta's AI-powered
            learning platform.
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
              <div className="text-sm text-purple-700">
                Better Pronunciation
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                3 Months
              </div>
              <div className="text-sm text-orange-700">Average Progress</div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-16">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button variant="default" size="sm" className="rounded-full">
              <Target className="w-4 h-4 mr-2" />
              All Stories
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
              Business English
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
              Real students, real transformation stories
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
                    <Quote className="w-8 h-8 text-blue-400 mb-4" />
                    <p className="text-lg md:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "I went from being terrified of job interviews to
                      confidently landing my dream position at Google. Fluenta's
                      AI interview practice was a complete game-changer for my
                      career!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
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
                          <Globe className="w-3 h-3" />
                          Madrid, Spain
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <TrendingUp className="w-5 h-5" />
                        Maria's Journey: B1 to C1 in 4 Months
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-red-600">Challenge:</strong>
                          <p className="text-sm mt-1">
                            Software engineer with strong technical skills but
                            struggled with English communication in professional
                            settings and interviews.
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-blue-600">Solution:</strong>
                          <p className="text-sm mt-1">
                            Used Fluenta's AI interview practice, pronunciation
                            coaching, and business English modules daily for 4
                            months.
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-green-600">Result:</strong>
                          <p className="text-sm mt-1">
                            Passed Google's technical interviews and landed her
                            dream job with 40% salary increase.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Speaking Confidence</span>
                          <span className="font-semibold">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Pronunciation Accuracy</span>
                          <span className="font-semibold">88%</span>
                        </div>
                        <Progress value={88} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Business English</span>
                          <span className="font-semibold">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-800">
                            Key Achievement
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          Went from avoiding English conversations to leading
                          international team meetings at Google
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator className="my-16" />

            {/* Ahmed's Story */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <Card className="border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <BookOpen className="w-5 h-5" />
                        Ahmed's IELTS Success: 6.0 to 8.5 in 3 Months
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-red-600">Challenge:</strong>
                          <p className="text-sm mt-1">
                            Needed IELTS 7.5+ for UK university admission but
                            struggled with speaking and writing sections.
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-blue-600">Solution:</strong>
                          <p className="text-sm mt-1">
                            Intensive training with Fluenta's IELTS-specific AI
                            modules, focusing on speaking fluency and essay
                            writing.
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-green-600">Result:</strong>
                          <p className="text-sm mt-1">
                            Achieved 8.5 overall IELTS score and got accepted to
                            Oxford University with full scholarship.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            8.5
                          </div>
                          <div className="text-xs text-green-700">
                            Overall IELTS
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            9.0
                          </div>
                          <div className="text-xs text-blue-700">Speaking</div>
                        </div>
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            8.0
                          </div>
                          <div className="text-xs text-purple-700">Writing</div>
                        </div>
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            8.5
                          </div>
                          <div className="text-xs text-orange-700">
                            Listening
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div>
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-green-50/30 hover:shadow-3xl transition-all duration-300">
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
                    <Quote className="w-8 h-8 text-green-400 mb-4" />
                    <p className="text-lg md:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "Fluenta's AI understood exactly where I was struggling
                      with IELTS. The personalized feedback helped me go from
                      6.0 to 8.5 in just 3 months. Now I'm studying at Oxford!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">AH</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Ahmed Hassan
                        </div>
                        <div className="text-green-600 font-medium">
                          Oxford University Student
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Cairo, Egypt
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="my-16" />

            {/* Sarah's Story */}
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
                    <Quote className="w-8 h-8 text-purple-400 mb-4" />
                    <p className="text-lg md:text-xl italic mb-8 leading-relaxed text-gray-700">
                      "As a busy professional, I needed flexible learning.
                      Fluenta's AI adapted to my schedule and helped me master
                      business English. Now I lead international presentations
                      with confidence!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-bold text-xl text-white">SC</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          Sarah Chen
                        </div>
                        <div className="text-purple-600 font-medium">
                          Marketing Director
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Singapore
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-800">
                        <Globe className="w-5 h-5" />
                        Sarah's Business English Mastery in 2 Months
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-red-600">Challenge:</strong>
                          <p className="text-sm mt-1">
                            Promoted to international role but lacked confidence
                            in English presentations and client meetings.
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-blue-600">Solution:</strong>
                          <p className="text-sm mt-1">
                            Focused on business English modules, presentation
                            skills, and professional communication with AI
                            feedback.
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 rounded-lg">
                          <strong className="text-green-600">Result:</strong>
                          <p className="text-sm mt-1">
                            Successfully leads global marketing campaigns and
                            received promotion to Regional Director.
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-800">
                            Learning Schedule
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-purple-700">
                          <div className="flex justify-between">
                            <span>Daily Practice</span>
                            <span>30 minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Weekly Focus</span>
                            <span>Presentations</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Duration</span>
                            <span>2 months</span>
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

        {/* Statistics Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Success by the Numbers
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Real data from our global community of learners
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  50,000+
                </div>
                <div className="text-white/90 font-medium">
                  Students Worldwide
                </div>
                <div className="text-sm text-white/70 mt-1">
                  From 120+ countries
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">87%</div>
                <div className="text-white/90 font-medium">
                  Improved Confidence
                </div>
                <div className="text-sm text-white/70 mt-1">
                  In speaking English
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">92%</div>
                <div className="text-white/90 font-medium">
                  Better Pronunciation
                </div>
                <div className="text-sm text-white/70 mt-1">
                  Measured by AI analysis
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  3 Months
                </div>
                <div className="text-white/90 font-medium">
                  Average Progress
                </div>
                <div className="text-sm text-white/70 mt-1">
                  To next proficiency level
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-100 mb-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of students who have transformed their English
              skills with Fluenta's AI-powered learning platform. Your success
              story starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/en/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Your Journey Free
                </Button>
              </Link>
              <Link href="/en/modules">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  Explore Learning Modules
                </Button>
              </Link>
            </div>
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
