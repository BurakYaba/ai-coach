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
      // Turkish pages: /tr/* -> /* (root level)
      {
        source: '/tr',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tr/blog',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tr/blog/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/tr/hakkimizda',
        destination: '/hakkimizda',
        permanent: true,
      },
      {
        source: '/tr/fiyatlandirma',
        destination: '/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/tr/iletisim',
        destination: '/iletisim',
        permanent: true,
      },
      {
        source: '/tr/sss',
        destination: '/sss',
        permanent: true,
      },
      {
        source: '/tr/basari-hikayeleri',
        destination: '/basari-hikayeleri',
        permanent: true,
      },
      {
        source: '/tr/kullanim-kosullari',
        destination: '/kullanim-kosullari',
        permanent: true,
      },
      {
        source: '/tr/gizlilik-politikasi',
        destination: '/gizlilik-politikasi',
        permanent: true,
      },
      {
        source: '/tr/cerez-politikasi',
        destination: '/cerez-politikasi',
        permanent: true,
      },
      // Additional Turkish redirects from crawler errors
      {
        source: '/tr/moduller',
        destination: '/moduller',
        permanent: true,
      },
      {
        source: '/tr/kariyer',
        destination: '/en/careers', // Turkish careers redirect to English careers
        permanent: true,
      },
      {
        source: '/tr/demo',
        destination: '/register', // Demo redirects to registration
        permanent: true,
      },
      {
        source: '/tr/geri-bildirim',
        destination: '/iletisim', // Feedback redirects to contact
        permanent: true,
      },
      {
        source: '/tr/canlı-destek',
        destination: '/iletisim', // Live support redirects to contact
        permanent: true,
      },
      {
        source: '/tr/basin',
        destination: '/hakkimizda', // Press redirects to about page
        permanent: true,
      },
      {
        source: '/tr/destek',
        destination: '/sss', // Support redirects to FAQ
        permanent: true,
      },
      {
        source: '/tr/rehberler',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tr/ozellikler',
        destination: '/moduller',
        permanent: true,
      },
      {
        source: '/tr/iade',
        destination: '/sss', // Refund policy redirects to FAQ
        permanent: true,
      },
      {
        source: '/tr/kurumsal',
        destination: '/hakkimizda', // Corporate redirects to about
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
        source: '/testimonials',
        destination: '/en/testimonials',
        permanent: true,
      },
      {
        source: '/careers',
        destination: '/en/careers',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/en/terms',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/en/cookie-policy',
        permanent: true,
      },
      // Additional English redirects from crawler errors
      {
        source: '/kariyer',
        destination: '/en/careers', // Turkish careers page at root redirects to English
        permanent: true,
      },
      {
        source: '/en/success-stories',
        destination: '/en/testimonials', // Success stories redirect to testimonials
        permanent: true,
      },

      // English blog posts: /blog/* -> /en/blog/* (but only for English posts)
      {
        source: '/blog/ai-english-tutor-vs-human-teacher',
        destination: '/en/blog/ai-english-tutor-vs-human-teacher',
        permanent: true,
      },
      {
        source: '/blog/improve-english-pronunciation-ai',
        destination: '/en/blog/improve-english-pronunciation-ai',
        permanent: true,
      },
      {
        source: '/blog/english-grammar-rules-common-mistakes',
        destination: '/en/blog/english-grammar-rules-common-mistakes',
        permanent: true,
      },
      {
        source: '/blog/english-pronunciation-practice-online',
        destination: '/en/blog/english-pronunciation-practice-online',
        permanent: true,
      },
      {
        source: '/blog/ai-english-grammar-checker',
        destination: '/en/blog/ai-english-grammar-checker',
        permanent: true,
      },
      {
        source: '/blog/english-conversation-practice-app',
        destination: '/en/blog/english-conversation-practice-app',
        permanent: true,
      },
      {
        source: '/blog/free-english-level-test',
        destination: '/en/blog/free-english-level-test',
        permanent: true,
      },
      {
        source: '/blog/ai-english-conversation-practice',
        destination: '/en/blog/ai-english-conversation-practice',
        permanent: true,
      },
      {
        source: '/blog/english-grammar-mistakes-avoid',
        destination: '/en/blog/english-grammar-mistakes-avoid',
        permanent: true,
      },
      {
        source: '/blog/vocabulary-building-strategies-2025',
        destination: '/en/blog/vocabulary-building-strategies-2025',
        permanent: true,
      },
      {
        source: '/blog/5-ai-tools-improve-english-2025',
        destination: '/en/blog/5-ai-tools-improve-english-2025',
        permanent: true,
      },
      {
        source: '/blog/ai-powered-english-learning-2025',
        destination: '/en/blog/ai-powered-english-learning-2025',
        permanent: true,
      },
      {
        source: '/blog/ai-ile-ingilizce-ogrenme',
        destination: '/tr/blog/ai-ile-ingilizce-ogrenme',
        permanent: true,
      },

      // English modules: /modules/* -> /en/modules/*
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
        source: '/modules/speaking-fluency',
        destination: '/en/modules/speaking-fluency',
        permanent: true,
      },
      {
        source: '/modules/pronunciation-trainer',
        destination: '/en/modules/pronunciation-trainer',
        permanent: true,
      },
      {
        source: '/modules/grammar-coach',
        destination: '/en/modules/grammar-coach',
        permanent: true,
      },
      {
        source: '/modules/vocabulary-builder',
        destination: '/en/modules/vocabulary-builder',
        permanent: true,
      },
      {
        source: '/modules/writing-assistant',
        destination: '/en/modules/writing-assistant',
        permanent: true,
      },
      {
        source: '/modules/listening-comprehension',
        destination: '/en/modules/listening-comprehension',
        permanent: true,
      },
      // Additional module redirects from crawler errors
      {
        source: '/en/modules/reading',
        destination: '/en/modules/reading-comprehension', // Reading redirects to reading-comprehension
        permanent: true,
      },
      // Turkish blog posts redirects
      {
        source: '/tr/blog/gunluk-ingilizce-konusma-pratigi',
        destination: '/blog/gunluk-ingilizce-konusma-pratigi',
        permanent: true,
      },
      {
        source: '/tr/blog/ingilizce-gramer-rehberi',
        destination: '/blog/ingilizce-gramer-rehberi',
        permanent: true,
      },
      // English blog post redirect
      {
        source: '/blog/english-conversation-practice-app',
        destination: '/en/blog/english-conversation-practice-app',
        permanent: true,
      },
      // Turkish pages redirects
      {
        source: '/blog/ai-english-grammar-checker',
        destination: '/en/blog/ai-english-grammar-checker',
        permanent: true,
      },
      {
        source: '/tr',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tr/hakkimizda',
        destination: '/hakkimizda',
        permanent: true,
      },
      {
        source: '/tr/moduller',
        destination: '/moduller',
        permanent: true,
      },
      {
        source: '/tr/destek',
        destination: '/destek',
        permanent: true,
      },
      {
        source: '/tr/kariyer',
        destination: '/en/careers',
        permanent: true,
      },
      // English page redirects
      {
        source: '/modules/reading',
        destination: '/en/modules/reading',
        permanent: true,
      },
      {
        source: '/success-stories',
        destination: '/en/success-stories',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/en/terms',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/en/cookie-policy',
        permanent: true,
      },
      {
        source: '/modules',
        destination: '/en/modules',
        permanent: true,
      },
      {
        source: '/blog/free-english-level-test',
        destination: '/en/blog/free-english-level-test',
        permanent: true,
      },
      {
        source: '/modules/speaking',
        destination: '/en/modules/speaking',
        permanent: true,
      },
      {
        source: '/blog/english-grammar-mistakes-avoid',
        destination: '/en/blog/english-grammar-mistakes-avoid',
        permanent: true,
      },
    ];
  },
  // The functions configuration is not valid in next.config.js
  // It should only be in vercel.json
};

module.exports = nextConfig; 