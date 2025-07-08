import Link from "next/link";
import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { IndividualRegisterForm } from "@/components/auth/individual-register-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  searchParams: { plan?: string };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const plan = searchParams.plan;

  if (plan === "monthly") {
    return {
      title: "Sign Up for Monthly Plan - Fluenta AI English Learning",
      description:
        "Join Fluenta with our flexible monthly plan. Access AI-powered English learning with personalized speaking, writing, grammar, and vocabulary practice. Cancel anytime.",
      alternates: {
        canonical: "/register?plan=monthly",
      },
    };
  } else if (plan === "annual") {
    return {
      title: "Sign Up for Annual Plan - Fluenta AI English Learning",
      description:
        "Save with Fluenta's annual plan! Get full access to AI-powered English learning with personalized speaking, writing, grammar, and vocabulary practice at the best value.",
      alternates: {
        canonical: "/register?plan=annual",
      },
    };
  }

  return {
    title: "Create Free Fluenta Account - AI English Learning",
    description:
      "Join Fluenta's AI-powered English learning platform. Sign up for free to access personalized speaking, writing, grammar, and vocabulary practice with instant feedback and adaptive learning technology.",
    alternates: {
      canonical: "/register",
    },
  };
}

export default function RegisterPage({ searchParams }: Props) {
  const plan = searchParams.plan;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="sr-only">
          {plan === "monthly"
            ? "Sign Up for Monthly Plan - Fluenta AI English Learning"
            : plan === "annual"
              ? "Sign Up for Annual Plan - Fluenta AI English Learning"
              : "Create Your Fluenta Account - AI English Learning Platform"}
        </h1>
        <h2 className="text-3xl font-bold text-white mb-3">
          {plan === "monthly" ? (
            <>
              Join{" "}
              <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Monthly Plan
              </span>
            </>
          ) : plan === "annual" ? (
            <>
              Join{" "}
              <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Annual Plan
              </span>
            </>
          ) : (
            <>
              Join{" "}
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Fluenta
              </span>
            </>
          )}
        </h2>
        <p className="text-white/80 text-lg">
          {plan
            ? `Complete your ${plan} plan registration and start learning`
            : "Start your AI-powered English learning journey today"}
        </p>
      </div>

      {/* Registration Form */}
      <div className="mb-8">
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
            <TabsTrigger
              value="individual"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
            >
              Individual
            </TabsTrigger>
            <TabsTrigger
              value="school"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
            >
              School Student
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="mt-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Individual Registration
              </h3>
              <p className="text-white/70">
                Sign up as an individual learner with paid subscription plans
              </p>
            </div>
            <IndividualRegisterForm />
          </TabsContent>

          <TabsContent value="school" className="mt-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                School Student Registration
              </h3>
              <p className="text-white/70">
                Sign up with your school registration code provided by your
                institution
              </p>
            </div>
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <div className="text-white/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
