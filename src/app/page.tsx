import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  GradientCard,
  GradientCardSimple,
} from "@/components/ui/gradient-card";

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
            <Link
              href="/games"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Games
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
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
            <Tagline>AI-Powered Language Learning</Tagline>
            <h1
              className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] text-center mb-6 animate-float"
              style={{ animationDuration: "6s" }}
            >
              Master English with Your
              <span className="text-gradient"> AI Language Coach</span>
            </h1>
            <p className="max-w-[42rem] mx-auto leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-center mb-8">
              Experience personalized language learning powered by artificial
              intelligence. Practice reading, writing, and speaking with instant
              feedback and adaptive lessons.
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
              <GradientButton href="#features" variant="outline" size="lg">
                Learn More
              </GradientButton>
            </div>
          </div>
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
            Why Choose AI Language Coach?
          </h2>
          <p className="text-muted-foreground">
            Our platform offers powerful tools to enhance your language learning
            journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <GradientCardSimple
              key={index}
              variant={
                index % 3 === 0
                  ? "default"
                  : index % 3 === 1
                    ? "accent"
                    : "secondary"
              }
              borderOpacity="low"
              className="group flex flex-col items-center text-center space-y-4 bg-card hover:shadow-xl hover:shadow-primary hover:shadow-opacity-5 transition-all duration-300 backdrop-blur-card hover:scale-105 hover:-translate-y-1"
            >
              <div className="p-4 rounded-full bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-10 group-hover:bg-opacity-30 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </GradientCardSimple>
          ))}
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
            {testimonials.map((testimonial, index) => (
              <GradientCardSimple
                key={index}
                variant={
                  index % 3 === 0
                    ? "default"
                    : index % 3 === 1
                      ? "accent"
                      : "secondary"
                }
                borderOpacity="low"
                className="relative group hover:shadow-glow transition-all duration-500 backdrop-blur-card"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                  {index + 1}
                </div>
                <div className="space-y-4">
                  <p className="italic text-muted-foreground">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-foreground border-opacity-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent bg-opacity-30 flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </GradientCardSimple>
            ))}
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
            Ready to Improve Your English?
          </h2>
          <p className="text-muted-foreground max-w-[42rem] mx-auto">
            Join thousands of learners who are improving their English skills
            every day with AI Language Coach.
          </p>
          <div className="flex justify-center gap-4">
            <GradientButton
              href="/register"
              size="lg"
              className="animate-pulse-glow"
              style={{ animationDuration: "3s" }}
            >
              Create Free Account
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
        <div className="container mx-auto px-5 grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Language Coach</h3>
            <p className="text-sm text-muted-foreground">
              Your personal AI-powered language learning assistant.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
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
    title: "Personalized Learning",
    description:
      "AI-powered lessons that adapt to your level, goals, and learning style.",
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
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Engaging Listening Practice",
    description:
      "Immersive listening exercises with natural conversations between named characters with distinct voices.",
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
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    title: "Instant Feedback",
    description:
      "Get real-time corrections and suggestions to improve your language skills.",
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
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Practice Anytime",
    description:
      "Access your personalized lessons and practice sessions 24/7 from any device.",
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
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Sarah J.",
    title: "English Student",
    text: "AI Language Coach transformed my learning experience. The personalized feedback helped me improve my pronunciation faster than any traditional method.",
  },
  {
    name: "Michael T.",
    title: "Business Professional",
    text: "I needed to improve my English for work quickly. The AI-powered practice sessions were exactly what I needed, available whenever I had time to practice.",
  },
  {
    name: "Elena K.",
    title: "University Student",
    text: "The listening exercises are incredible - the conversations feel natural and have helped me understand native speakers much better than before.",
  },
];
