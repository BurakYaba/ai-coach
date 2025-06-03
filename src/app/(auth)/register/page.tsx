import { Metadata } from "next";
import Link from "next/link";

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

export const metadata: Metadata = {
  title: "Register - Fluenta",
  description: "Create your account",
};

export default function RegisterPage() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Choose your registration type and enter your details
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
