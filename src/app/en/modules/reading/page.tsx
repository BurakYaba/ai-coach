import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "@/components/seo/StructuredData";

export default function ReadingModule() {
  const moduleSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "English Reading Practice",
    description:
      "AI-powered English reading comprehension practice with personalized texts and instant feedback",
    provider: {
      "@type": "Organization",
      name: "Fluenta",
      sameAs: "https://www.fluenta-ai.com",
    },
    courseCode: "ENG-READ-101",
    coursePrerequisites: "Basic English understanding",
    educationalLevel: "All levels",
    teaches: "English reading comprehension",
    learningResourceType: "Interactive exercises",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Add structured data for SEO */}
      <StructuredData type="Course" data={moduleSchema} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Master English Reading
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Improve your reading comprehension with AI-powered exercises,
                personalized texts, and instant feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="btn btn-primary px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start Reading Practice
                </Link>
                <Link
                  href="/en/modules"
                  className="btn btn-secondary px-8 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Explore All Modules
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src="/images/reading-practice.png"
                alt="AI Reading Practice"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Practice Reading with Fluenta?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Our Reading Practice Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Improve Your Reading Skills?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of learners who have improved their English reading
            comprehension with Fluenta.
          </p>
          <Link
            href="/register"
            className="btn btn-secondary px-8 py-3 rounded-full bg-background text-foreground hover:bg-background/90 inline-block"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Personalized Reading Materials",
    description:
      "AI-curated texts matched to your interests and proficiency level for engaging practice.",
    icon: "📚",
  },
  {
    title: "Instant Comprehension Feedback",
    description:
      "Get immediate feedback on your understanding with AI-powered comprehension checks.",
    icon: "✓",
  },
  {
    title: "Vocabulary Building",
    description:
      "Learn new words in context with interactive definitions and examples.",
    icon: "📖",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your improvement with detailed analytics and progress reports.",
    icon: "📊",
  },
  {
    title: "Diverse Reading Content",
    description:
      "Access a wide range of topics from news articles to literature excerpts.",
    icon: "📰",
  },
  {
    title: "Adaptive Learning",
    description:
      "Practice at your own pace with content that adapts to your progress.",
    icon: "🎯",
  },
];

const steps = [
  {
    title: "Choose Your Level",
    description:
      "Take a quick assessment to determine your current reading level.",
  },
  {
    title: "Select Topics",
    description: "Pick reading materials that match your interests and goals.",
  },
  {
    title: "Practice Reading",
    description:
      "Read texts with interactive features and comprehension exercises.",
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement and unlock new reading levels.",
  },
];
