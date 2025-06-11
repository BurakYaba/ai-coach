import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.fluenta-ai.com"; // Use correct www subdomain

  return [
    // Main pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // New SEO-optimized pages
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Auth pages
    {
      url: `${baseUrl}/register`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.4,
    },

    // Blog posts - existing
    {
      url: `${baseUrl}/blog/ai-english-tutor-vs-human-teacher`,
      lastModified: new Date("2024-12-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/improve-english-pronunciation-ai`,
      lastModified: new Date("2024-12-18"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/english-grammar-rules-common-mistakes`,
      lastModified: new Date("2024-12-19"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // New long-tail keyword blog posts
    {
      url: `${baseUrl}/blog/english-pronunciation-practice-online`,
      lastModified: new Date("2024-12-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ai-english-grammar-checker`,
      lastModified: new Date("2024-12-22"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/english-conversation-practice-app`,
      lastModified: new Date("2024-12-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/free-english-level-test`,
      lastModified: new Date("2024-12-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Regular blog posts
    {
      url: `${baseUrl}/blog/ai-english-conversation-practice`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/english-grammar-mistakes-avoid`,
      lastModified: new Date("2024-11-28"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/vocabulary-building-strategies-2025`,
      lastModified: new Date("2024-11-25"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Learning modules
    {
      url: `${baseUrl}/modules`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/modules/speaking-fluency`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/modules/pronunciation-trainer`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/modules/grammar-coach`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/modules/vocabulary-builder`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/modules/writing-assistant`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/modules/listening-comprehension`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // New speaking module landing page
    {
      url: `${baseUrl}/modules/speaking`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
