import Link from "next/link";
import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { IndividualRegisterForm } from "@/components/auth/individual-register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <h1 className="sr-only">
          {plan === "monthly"
            ? "Sign Up for Monthly Plan - Fluenta AI English Learning"
            : plan === "annual"
              ? "Sign Up for Annual Plan - Fluenta AI English Learning"
              : "Create Your Fluenta Account - AI English Learning Platform"}
        </h1>
        <CardTitle className="text-2xl text-center">
          {plan === "monthly"
            ? "Join Fluenta Monthly Plan"
            : plan === "annual"
              ? "Join Fluenta Annual Plan"
              : "Join Fluenta - Start Your AI English Learning Journey"}
        </CardTitle>
        <CardDescription className="text-center">
          {plan
            ? `Complete your ${plan} plan registration and start learning`
            : "Choose your registration type and enter your details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="school">School Student</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Individual Registration</h3>
              <p className="text-sm text-muted-foreground">
                Sign up as an individual learner with paid subscription plans
              </p>
            </div>
            <IndividualRegisterForm />
          </TabsContent>

          <TabsContent value="school" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                School Student Registration
              </h3>
              <p className="text-sm text-muted-foreground">
                Sign up with your school registration code provided by your
                institution
              </p>
            </div>
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
