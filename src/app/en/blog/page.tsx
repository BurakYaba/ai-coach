import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { MainNav } from "@/components/navigation/main-nav";
import PopularResourcesEn from "@/components/layout/PopularResourcesEn";
import FooterEn from "@/components/layout/FooterEn";

export const metadata: Metadata = {
  title: "English Learning Blog | AI-Powered Tips & Strategies | Fluenta",
  description:
    "Discover expert tips, AI-powered strategies, and proven methods for learning English. From IELTS preparation to daily speaking practice, unlock your English potential with Fluenta.",
  keywords:
    "English learning blog, AI English tools, IELTS preparation, English speaking practice, language learning tips, English grammar, vocabulary building, English pronunciation, language learning AI",
  alternates: {
    canonical: "/en/blog",
    languages: {
      en: "/en/blog",
      tr: "/blog",
    },
  },
  openGraph: {
    title: "English Learning Blog | AI-Powered Tips & Strategies | Fluenta",
    description:
      "Discover expert tips, AI-powered strategies, and proven methods for learning English. From IELTS preparation to daily speaking practice, unlock your English potential with Fluenta.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.fluenta-ai.com/og-images/og-blog-en.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Learning Blog",
      },
    ],
  },
};

// Tagline component matching the Turkish modules page
const Tagline = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-4 lg:mb-[1.5rem]">
    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50">
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {children}
      </span>
    </div>
  </div>
);

const blogPosts = [
  // Featured English SEO-optimized blog posts
  {
    id: "ai-powered-english-learning-2025",
    title: "AI-Powered English Learning in 2025: The Future of Education",
    excerpt:
      "Discover how artificial intelligence is revolutionizing English language learning. Personalized learning plans, real-time feedback, and adaptive AI tutors are changing the game.",
    category: "AI Technology",
    readTime: "8 min read",
    publishDate: "2024-12-30",
    featured: true,
    tags: ["AI", "Technology", "English Learning", "Future"],
  },
  {
    id: "english-pronunciation-practice-online",
    title:
      "English Pronunciation Practice Online: 10 Best Tools & Techniques 2025",
    excerpt:
      "Master English pronunciation with the best online tools and techniques. Discover AI-powered pronunciation coaches, free practice resources, and proven methods to improve your accent.",
    category: "Pronunciation",
    readTime: "15 min read",
    publishDate: "2024-12-29",
    featured: true,
    tags: ["Pronunciation", "Online Tools", "AI Coach", "Practice"],
  },
  {
    id: "complete-english-grammar-guide",
    title: "Complete English Grammar Guide: From Basics to Advanced",
    excerpt:
      "Master all aspects of English grammar with this comprehensive guide. From basic sentence structures to advanced grammar rules, includes practical examples and exercises.",
    category: "Grammar",
    readTime: "18 min read",
    publishDate: "2024-12-28",
    featured: true,
    tags: ["Grammar", "Basics", "Advanced", "Guide"],
  },
  {
    id: "business-english-career-guide",
    title: "Business English Career Guide: Advance Your Professional Skills",
    excerpt:
      "Learn essential business English skills to boost your career. From job interviews to presentations, master professional communication in English.",
    category: "Business English",
    readTime: "12 min read",
    publishDate: "2024-12-27",
    featured: false,
    tags: ["Business English", "Career", "Professional", "Communication"],
  },
  {
    id: "ielts-preparation-ai-guide",
    title: "IELTS Preparation Guide 2025: Achieve Your Target Band Score",
    excerpt:
      "Complete IELTS preparation guide with AI-powered study strategies. Learn proven techniques to achieve band 7+ scores in all four skills: reading, writing, listening, speaking.",
    category: "IELTS",
    readTime: "20 min read",
    publishDate: "2024-12-26",
    featured: false,
    tags: ["IELTS", "Test Preparation", "Band Score", "Strategy"],
  },
  {
    id: "daily-english-speaking-practice-beginners",
    title: "Daily English Speaking Practice for Beginners: Your 30-Day Plan",
    excerpt:
      "Transform your English speaking skills with this comprehensive 30-day practice plan. Perfect for beginners who want to build confidence and fluency with AI conversation partners.",
    category: "Speaking",
    readTime: "10 min read",
    publishDate: "2024-12-25",
    featured: false,
    tags: ["Speaking", "Beginners", "Practice", "30-Day Plan"],
  },
  {
    id: "vocabulary-building-strategies-2025",
    title: "Advanced Vocabulary Building Strategies for 2025",
    excerpt:
      "Discover proven methods to expand your English vocabulary effectively. From spaced repetition to contextual learning, master these advanced techniques with AI-powered tools.",
    category: "Vocabulary",
    readTime: "14 min read",
    publishDate: "2024-12-24",
    featured: false,
    tags: ["Vocabulary", "Strategies", "Advanced", "Memory"],
  },
  {
    id: "english-listening-skills-improvement",
    title: "8 Ways to Improve Your English Listening Skills",
    excerpt:
      "Master English listening comprehension with proven techniques. Learn to understand different accents, follow fast speech, and improve your listening skills effectively.",
    category: "Listening",
    readTime: "11 min read",
    publishDate: "2024-12-23",
    featured: false,
    tags: ["Listening", "Accents", "Comprehension", "Skills"],
  },
  {
    id: "ai-english-grammar-checker",
    title: "AI English Grammar Checker: Top 8 Tools Compared [2025 Review]",
    excerpt:
      "Discover the best AI English grammar checkers in 2025. Compare Grammarly, Fluenta, QuillBot, and more. Find the perfect grammar checking tool for error-free writing.",
    category: "Grammar",
    readTime: "12 min read",
    publishDate: "2024-12-22",
    featured: false,
    tags: ["Grammar", "AI Tools", "Writing", "Comparison"],
  },
  {
    id: "english-conversation-practice-app",
    title: "Best English Conversation Practice Apps 2025: Top 10 Reviewed",
    excerpt:
      "Transform your English speaking skills with these top conversation practice apps. From AI-powered tutors to real human conversations, find the perfect app to boost your confidence.",
    category: "Speaking",
    readTime: "14 min read",
    publishDate: "2024-12-21",
    featured: false,
    tags: ["Speaking", "Apps", "Conversation", "Practice"],
  },
];

const categories = [
  { name: "All", count: blogPosts.length, active: true },
  { name: "AI Technology", count: 2, active: false },
  { name: "Pronunciation", count: 1, active: false },
  { name: "Grammar", count: 2, active: false },
  { name: "Business English", count: 1, active: false },
  { name: "IELTS", count: 1, active: false },
  { name: "Speaking", count: 3, active: false },
];

export default function EnglishBlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav currentPath="/en/blog" language="en" />

      <main className="container mx-auto px-5 py-16 md:py-24 pt-24 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/en" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <span>Blog</span>
        </nav>

        {/* Header */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <Tagline>Expert Tips & AI-Powered Strategies</Tagline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            English Learning Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master English with AI-powered strategies, expert tips, and proven
            methods. From IELTS preparation to daily conversation practice, we
            provide valuable insights to accelerate your English learning
            journey.
          </p>
        </section>

        {/* Categories */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Blog Categories</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant={category.active ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Featured Articles
            </h2>
            <p className="text-muted-foreground">
              Our most popular and comprehensive guides
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map(post => (
              <GradientCard
                key={post.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors leading-tight">
                    <Link href={`/en/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.publishDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <Link href={`/en/blog/${post.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:text-primary"
                      >
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Recent Articles</h2>
            <p className="text-muted-foreground">
              Latest tips and strategies for English learners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <Card
                key={post.id}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors leading-tight">
                    <Link href={`/en/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.publishDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <Link href={`/en/blog/${post.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:text-primary"
                      >
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your English Learning Journey?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join thousands of learners who are already improving their English
              with Fluenta's AI-powered platform. Get personalized feedback,
              practice with AI tutors, and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/en/register">
                <Button size="lg" className="text-lg px-8">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/en/modules">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Explore Modules
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
