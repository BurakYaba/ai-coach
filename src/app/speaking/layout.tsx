import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speaking Practice - AI Language Coach',
  description:
    'Practice your speaking skills with AI-powered conversation partner',
};

export default function SpeakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
