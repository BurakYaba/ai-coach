import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fluenta.com"; // Replace with your actual domain

  // Blog posts with detailed metadata
  const blogPosts = [
    {
      slug: "5-ai-tools-improve-english-2025",
      lastModified: "2024-12-15",
      priority: 0.8,
    },
    {
      slug: "ielts-preparation-ai-guide",
      lastModified: "2024-12-10",
      priority: 0.8,
    },
    {
      slug: "daily-english-speaking-practice-beginners",
      lastModified: "2024-12-05",
      priority: 0.8,
    },
  ];

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Learning modules (public marketing pages)
  const learningModules = [
    "reading",
    "writing",
    "listening",
    "speaking",
    "vocabulary",
    "grammar",
  ].map(module => ({
    url: `${baseUrl}/modules/${module}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Blog post URLs
  const blogUrls = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified),
    changeFrequency: "weekly" as const,
    priority: post.priority,
  }));

  // Authentication pages (public)
  const authPages = [
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  return [...mainPages, ...blogUrls, ...learningModules, ...authPages];
}
