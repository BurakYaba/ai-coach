import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.fluenta-ai.com"; // Use correct www subdomain

  return [
    // Turkish Main pages (now at root level)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/fiyatlandirma`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sss`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/basari-hikayeleri`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // English Main pages (now at /en/)
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/pricing`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/faq`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/testimonials`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Auth pages (these might be at root level for both languages)
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

    // Turkish Blog Posts (now at root level)
    {
      url: `${baseUrl}/blog/ai-ile-ingilizce-ogrenme`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ingilizce-telaffuz-gelistirme`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ingilizce-gramer-rehberi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/is-ingilizcesi-rehberi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ielts-hazirlik-rehberi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/gunluk-ingilizce-konusma-pratigi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // English Blog posts (now at /en/blog/)
    {
      url: `${baseUrl}/en/blog/ai-english-tutor-vs-human-teacher`,
      lastModified: new Date("2024-12-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/improve-english-pronunciation-ai`,
      lastModified: new Date("2024-12-18"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/english-grammar-rules-common-mistakes`,
      lastModified: new Date("2024-12-19"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/english-pronunciation-practice-online`,
      lastModified: new Date("2024-12-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog/ai-english-grammar-checker`,
      lastModified: new Date("2024-12-22"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog/english-conversation-practice-app`,
      lastModified: new Date("2024-12-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog/free-english-level-test`,
      lastModified: new Date("2024-12-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog/ai-english-conversation-practice`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/english-grammar-mistakes-avoid`,
      lastModified: new Date("2024-11-28"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/vocabulary-building-strategies-2025`,
      lastModified: new Date("2024-11-25"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/5-ai-tools-improve-english-2025`,
      lastModified: new Date("2024-11-25"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Turkish Learning modules (now at root level)
    {
      url: `${baseUrl}/moduller`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // English Learning modules (now at /en/modules/)
    {
      url: `${baseUrl}/en/modules`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/modules/speaking-fluency`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/modules/pronunciation-trainer`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/modules/grammar-coach`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/modules/vocabulary-builder`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/modules/writing-assistant`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/modules/listening-comprehension`,
      lastModified: new Date("2024-12-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/modules/speaking`,
      lastModified: new Date("2024-12-29"),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Turkish Legal/Policy pages (now at root level)
    {
      url: `${baseUrl}/kullanim-kosullari`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cerez-politikasi`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // English Legal/Policy pages (now at /en/)
    {
      url: `${baseUrl}/en/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
