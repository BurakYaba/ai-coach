interface StructuredDataProps {
  type:
    | "Article"
    | "BlogPosting"
    | "WebSite"
    | "Organization"
    | "Course"
    | "EducationalOrganization";
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Reusable structured data configurations
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Fluenta",
  url: "https://fluenta.com",
  logo: "https://fluenta.com/logo.png",
  description:
    "AI-powered English language learning platform with personalized tutoring",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@fluenta.com",
  },
  sameAs: [
    "https://facebook.com/fluenta",
    "https://twitter.com/fluenta",
    "https://linkedin.com/company/fluenta",
  ],
  offers: {
    "@type": "Offer",
    category: "Language Learning",
    priceRange: "$14.99-$149.99",
    priceCurrency: "USD",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Fluenta",
  url: "https://fluenta.com",
  description: "Master English with AI-powered learning",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fluenta.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export function generateArticleSchema(
  title: string,
  description: string,
  publishDate: string,
  modifiedDate: string,
  slug: string,
  readTime: string,
  category: string,
  tags: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: `https://fluenta.com/api/og?title=${encodeURIComponent(title)}`,
    author: {
      "@type": "Organization",
      name: "Fluenta",
      url: "https://fluenta.com",
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "Fluenta",
      logo: {
        "@type": "ImageObject",
        url: "https://fluenta.com/logo.png",
      },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://fluenta.com/blog/${slug}`,
    },
    url: `https://fluenta.com/blog/${slug}`,
    articleSection: category,
    keywords: tags,
    wordCount: "2000+",
    timeRequired: readTime,
    inLanguage: "en-US",
    about: {
      "@type": "Thing",
      name: "English Language Learning",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  };
}

export function generateCourseSchema(
  name: string,
  description: string,
  provider: string = "Fluenta"
) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: name,
    description: description,
    provider: {
      "@type": "EducationalOrganization",
      name: provider,
      url: "https://fluenta.com",
    },
    courseMode: "online",
    educationalLevel: "beginner, intermediate, advanced",
    teaches: "English Language",
    inLanguage: "en-US",
    availableLanguage: "en-US",
    coursePrerequisites: "None",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT30M",
      instructor: {
        "@type": "Organization",
        name: "Fluenta AI",
      },
    },
  };
}
