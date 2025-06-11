import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";

export const metadata: Metadata = {
  title: "English Learning Blog | AI-Powered Tips & Strategies | Fluenta",
  description:
    "Discover expert tips, AI-powered strategies, and proven methods for learning English. From IELTS preparation to daily speaking practice, unlock your English potential with Fluenta.",
  keywords:
    "English learning blog, AI English tools, IELTS preparation, English speaking practice, language learning tips, English grammar, vocabulary building, English pronunciation, language learning AI",
  openGraph: {
    title: "English Learning Blog | AI-Powered Tips & Strategies | Fluenta",
    description:
      "Discover expert tips, AI-powered strategies, and proven methods for learning English. From IELTS preparation to daily speaking practice, unlock your English potential with Fluenta.",
    type: "website",
    images: [
      {
        url: "https://www.fluenta-ai.com/og-images/og-blog.png",
        width: 1200,
        height: 630,
        alt: "Fluenta English Learning Blog",
      },
    ],
  },
};

const blogPosts = [
  // New SEO-optimized blog posts (featured)
  {
    id: "english-pronunciation-practice-online",
    title:
      "English Pronunciation Practice Online: 10 Best Tools & Techniques 2025",
    excerpt:
      "Master English pronunciation with the best online tools and techniques. Discover AI-powered pronunciation coaches, free practice resources, and proven methods to improve your accent.",
    category: "Pronunciation",
    readTime: "15 min read",
    publishDate: "2024-12-20",
    featured: true,
    tags: ["Pronunciation", "Online Tools", "AI Coach", "Practice"],
  },
  {
    id: "ai-english-grammar-checker",
    title: "AI English Grammar Checker: Top 8 Tools Compared [2025 Review]",
    excerpt:
      "Discover the best AI English grammar checkers in 2025. Compare Grammarly, Fluenta, QuillBot, and more. Find the perfect grammar checking tool for error-free writing.",
    category: "Grammar",
    readTime: "12 min read",
    publishDate: "2024-12-22",
    featured: true,
    tags: ["Grammar", "AI Tools", "Writing", "Comparison"],
  },
  {
    id: "english-conversation-practice-app",
    title: "Best English Conversation Practice Apps 2025: Top 10 Reviewed",
    excerpt:
      "Transform your English speaking skills with these top conversation practice apps. From AI-powered tutors to real human conversations, find the perfect app to boost your confidence.",
    category: "Speaking",
    readTime: "14 min read",
    publishDate: "2024-12-25",
    featured: true,
    tags: ["Speaking", "Apps", "Conversation", "Practice"],
  },
  {
    id: "free-english-level-test",
    title: "Free English Level Test: Assess Your Skills Today [CEFR A1-C2]",
    excerpt:
      "Take our free English level test to discover your proficiency level. Comprehensive assessment covering reading, writing, listening, speaking, grammar, and vocabulary. Get instant results.",
    category: "Assessment",
    readTime: "8 min read",
    publishDate: "2024-12-28",
    featured: true,
    tags: ["Assessment", "CEFR", "Level Test", "Free"],
  },
  // Existing blog posts
  {
    id: "5-ai-tools-improve-english-2025",
    title: "5 AI Tools to Improve Your English in 2025",
    excerpt:
      "Discover the latest AI-powered tools that are revolutionizing English language learning. From personalized tutors to pronunciation coaches, these tools will accelerate your progress.",
    category: "AI Tools",
    readTime: "8 min read",
    publishDate: "2024-12-15",
    featured: false,
    tags: ["AI", "Technology", "Tools", "2025"],
  },
  {
    id: "ielts-preparation-ai-guide",
    title: "How to Prepare for IELTS Using AI: Complete Guide",
    excerpt:
      "Master IELTS with AI-powered preparation strategies. Learn how artificial intelligence can help you achieve your target band score faster and more efficiently.",
    category: "IELTS",
    readTime: "12 min read",
    publishDate: "2024-12-10",
    featured: false,
    tags: ["IELTS", "AI", "Test Preparation", "Band Score"],
  },
  {
    id: "daily-english-speaking-practice-beginners",
    title: "Daily English Speaking Practice for Beginners: Your 30-Day Plan",
    excerpt:
      "Transform your English speaking skills with this comprehensive 30-day practice plan. Perfect for beginners who want to build confidence and fluency.",
    category: "Speaking",
    readTime: "10 min read",
    publishDate: "2024-12-05",
    featured: false,
    tags: ["Speaking", "Beginners", "Practice", "30-Day Plan"],
  },
  {
    id: "ai-english-conversation-practice",
    title: "AI English Conversation Practice: The Future of Language Learning",
    excerpt:
      "Explore how AI conversation partners are changing the way we practice English. Get personalized feedback and improve your fluency 24/7.",
    category: "AI Tools",
    readTime: "7 min read",
    publishDate: "2024-12-01",
    featured: false,
    tags: ["AI", "Conversation", "Practice", "Fluency"],
  },
  {
    id: "english-grammar-mistakes-avoid",
    title: "10 Common English Grammar Mistakes and How to Avoid Them",
    excerpt:
      "Learn about the most common grammar mistakes English learners make and get practical tips to avoid them. Improve your writing and speaking accuracy.",
    category: "Grammar",
    readTime: "9 min read",
    publishDate: "2024-11-28",
    featured: false,
    tags: ["Grammar", "Mistakes", "Writing", "Accuracy"],
  },
  {
    id: "vocabulary-building-strategies-2025",
    title: "Advanced Vocabulary Building Strategies for 2025",
    excerpt:
      "Discover proven methods to expand your English vocabulary effectively. From spaced repetition to contextual learning, master these advanced techniques.",
    category: "Vocabulary",
    readTime: "11 min read",
    publishDate: "2024-11-25",
    featured: false,
    tags: ["Vocabulary", "Strategies", "Advanced", "Memory"],
  },
];

const categories = [
  "All",
  "AI Tools",
  "Pronunciation",
  "Grammar",
  "Speaking",
  "Assessment",
  "IELTS",
  "Vocabulary",
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
              <Link href="/blog" className="text-sm font-medium text-primary">
                Blog
              </Link>
              <Link
                href="/modules/speaking"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Modules
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/testimonials"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Success Stories
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master English with
            <span className="text-gradient"> AI-Powered</span> Learning
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover expert tips, proven strategies, and the latest AI tools to
            accelerate your English learning journey. From IELTS preparation to
            daily conversation practice, we've got you covered.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <CardTitle className="group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
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
                    <Link href={`/blog/${post.id}`}>
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
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <CardTitle className="group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
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
                    <Link href={`/blog/${post.id}`}>
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
        <section className="text-center mt-16 py-12 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your English Learning Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of learners who are already improving their English
            with Fluenta's AI-powered platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Learning Free
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Explore Features
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="font-bold text-xl">
                Fluenta
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Master English with AI-powered learning
              </p>
            </div>
            <div className="flex gap-6">
              <Link
                href="/blog"
                className="text-sm hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/pricing"
                className="text-sm hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
