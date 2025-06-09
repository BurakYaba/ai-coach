import fs from "fs";
import path from "path";

// Pages that need static OG images
const pages = [
  {
    title: "Fluenta | Master English with AI-Powered Learning",
    description:
      "Complete English learning platform with AI-powered modules for reading, writing, listening, speaking, vocabulary, and grammar practice.",
    filename: "og-home.png",
  },
  {
    title: "English Learning Blog | AI-Powered Tips & Strategies",
    description:
      "Expert tips, proven strategies, and AI tools for learning English. From IELTS preparation to daily speaking practice.",
    filename: "og-blog.png",
  },
  {
    title: "English Reading Practice | AI-Powered Comprehension",
    description:
      "Improve reading comprehension with AI-generated content, interactive questions, and vocabulary in context.",
    filename: "og-reading.png",
  },
  {
    title: "English Writing Practice | AI Feedback & Analysis",
    description:
      "Enhance writing skills with guided prompts and detailed AI-powered feedback on grammar, vocabulary, and structure.",
    filename: "og-writing.png",
  },
  {
    title: "English Listening Practice | Interactive Audio Exercises",
    description:
      "Sharpen listening skills with diverse audio content, comprehension questions, and transcript support.",
    filename: "og-listening.png",
  },
  {
    title: "English Speaking Practice | AI Conversation Partner",
    description:
      "Practice speaking with AI conversation partners. Get real-time feedback on pronunciation, fluency, and grammar.",
    filename: "og-speaking.png",
  },
  {
    title: "English Vocabulary Builder | Spaced Repetition System",
    description:
      "Build vocabulary with personalized word banks, interactive flashcards, and AI-powered spaced repetition.",
    filename: "og-vocabulary.png",
  },
  {
    title: "English Grammar Practice | Personalized Lessons",
    description:
      "Master grammar with AI-powered lessons targeting your weak areas, daily challenges, and detailed explanations.",
    filename: "og-grammar.png",
  },
  {
    title: "Fluenta Pricing | Affordable AI English Learning",
    description:
      "Choose the perfect plan for your English learning journey. Monthly and annual options available.",
    filename: "og-pricing.png",
  },
];

async function generateOGImages() {
  console.log("🚀 Starting OG image generation...");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const outputDir = path.join(process.cwd(), "public", "og-images");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const page of pages) {
    try {
      console.log(`📸 Generating: ${page.filename}`);

      const url = new URL("/api/og", baseUrl);
      url.searchParams.set("title", page.title);
      url.searchParams.set("description", page.description);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(
          `Failed to generate ${page.filename}: ${response.statusText}`
        );
      }

      const buffer = await response.arrayBuffer();
      const filePath = path.join(outputDir, page.filename);

      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`✅ Generated: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error generating ${page.filename}:`, error.message);
    }
  }

  console.log("🎉 OG image generation complete!");

  // Generate HTML preview file
  generatePreviewHTML(pages);
}

function generatePreviewHTML(pages) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fluenta OG Images Preview</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #3b82f6; text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .card h3 { margin: 0 0 10px 0; color: #1e293b; font-size: 14px; }
        .card img { width: 100%; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; }
        .dimensions { color: #64748b; font-size: 12px; margin-top: 8px; }
    </style>
</head>
<body>
    <h1>Fluenta Open Graph Images</h1>
    <p style="text-align: center; color: #64748b;">Preview of generated OG images (1200x630px) for social media sharing</p>
    
    <div class="grid">
        ${pages
          .map(
            page => `
            <div class="card">
                <h3>${page.title}</h3>
                <img src="/og-images/${page.filename}" alt="${page.title}" />
                <div class="dimensions">1200×630px • ${page.filename}</div>
            </div>
        `
          )
          .join("")}
    </div>
    
    <div style="margin-top: 40px; padding: 20px; background: white; border-radius: 12px;">
        <h2>Usage in HTML</h2>
        <pre style="background: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto;"><code>&lt;meta property="og:image" content="https://fluenta.com/og-images/og-home.png" /&gt;
&lt;meta name="twitter:image" content="https://fluenta.com/og-images/og-home.png" /&gt;</code></pre>
    </div>
</body>
</html>`;

  const previewPath = path.join(process.cwd(), "public", "og-preview.html");
  fs.writeFileSync(previewPath, html);
  console.log(`📋 Preview file created: ${previewPath}`);
  console.log(`🌐 View at: http://localhost:3000/og-preview.html`);
}

// Run the generator
generateOGImages().catch(console.error);
