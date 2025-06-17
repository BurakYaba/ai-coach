/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  async redirects() {
    return [
      // Turkish redirects
      {
        source: '/gizlilik',
        destination: '/gizlilik-politikasi',
        permanent: true,
      },
      // English pages: /* -> /en/* (move to /en/)
      {
        source: '/about',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/en/pricing',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/en/faq',
        permanent: true,
      },
      {
        source: '/success-stories',
        destination: '/en/success-stories',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/en/terms',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/en/privacy-policy',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/en/cookie-policy',
        permanent: true,
      },

      // English blog posts redirects
      {
        source: '/blog/ai-powered-english-learning-2025',
        destination: '/en/blog/ai-powered-english-learning-2025',
        permanent: true,
      },
      {
        source: '/blog/english-pronunciation-practice-online',
        destination: '/en/blog/english-pronunciation-practice-online',
        permanent: true,
      },
      {
        source: '/blog/complete-english-grammar-guide',
        destination: '/en/blog/complete-english-grammar-guide',
        permanent: true,
      },
      {
        source: '/blog/business-english-career-guide',
        destination: '/en/blog/business-english-career-guide',
        permanent: true,
      },
      {
        source: '/blog/ielts-preparation-ai-guide',
        destination: '/en/blog/ielts-preparation-ai-guide',
        permanent: true,
      },
      {
        source: '/blog/daily-english-speaking-practice-beginners',
        destination: '/en/blog/daily-english-speaking-practice-beginners',
        permanent: true,
      },
      {
        source: '/blog/vocabulary-building-strategies-2025',
        destination: '/en/blog/vocabulary-building-strategies-2025',
        permanent: true,
      },
      {
        source: '/blog/english-listening-skills-improvement',
        destination: '/en/blog/english-listening-skills-improvement',
        permanent: true,
      },
      {
        source: '/blog/english-grammar-mistakes-avoid',
        destination: '/en/blog/english-grammar-mistakes-avoid',
        permanent: true,
      },
      {
        source: '/blog/free-english-level-test',
        destination: '/en/blog/free-english-level-test',
        permanent: true,
      },

      // English module redirects
      {
        source: '/modules',
        destination: '/en/modules',
        permanent: true,
      },
      {
        source: '/modules/speaking',
        destination: '/en/modules/speaking',
        permanent: true,
      },
      {
        source: '/modules/grammar',
        destination: '/en/modules/grammar',
        permanent: true,
      },
      {
        source: '/modules/reading',
        destination: '/en/modules/reading',
        permanent: true,
      },
      {
        source: '/modules/listening',
        destination: '/en/modules/listening',
        permanent: true,
      },
      {
        source: '/modules/vocabulary',
        destination: '/en/modules/vocabulary',
        permanent: true,
      },
      {
        source: '/modules/writing',
        destination: '/en/modules/writing',
        permanent: true,
      }
    ];
  },
};

module.exports = nextConfig; 