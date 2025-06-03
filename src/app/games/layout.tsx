export const metadata = {
  title: "Language Learning Games - Fluenta",
  description: "Fun interactive games to learn English",
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Language Games</h1>
        <p className="text-muted-foreground">
          Improve your language skills through fun, interactive games
        </p>
      </div>
      {children}
    </div>
  );
}
