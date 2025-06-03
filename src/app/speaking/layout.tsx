import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speaking Practice - Fluenta",
  description: "Practice speaking with AI-powered conversation partners",
};

export default function SpeakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
