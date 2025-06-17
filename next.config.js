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
      // Additional Turkish redirects
      {
        source: '/tr/moduller',
        destination: '/moduller',
        permanent: true,
      },
      {
        source: '/tr/demo',
        destination: '/register',
        permanent: true,
      },
      {
        source: '/tr/geri-bildirim',
        destination: '/iletisim',
        permanent: true,
      },
      {
        source: '/tr/canlı-destek',
        destination: '/iletisim',
        permanent: true,
      },
      {
        source: '/tr/basin',
        destination: '/hakkimizda',
        permanent: true,
      },
      {
        source: '/tr/destek',
        destination: '/sss',
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
        destination: '/sss',
        permanent: true,
      },
      {
        source: '/tr/kurumsal',
        destination: '/hakkimizda',
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
        destination: '/en/success-stories',
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
        source: '/cookie-policy',
        destination: '/en/cookie-policy',
        permanent: true,
      },

      // English blog posts redirects
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

      // Module redirects
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
        source: '/modules/reading',
        destination: '/en/modules/reading',
        permanent: true,
      },
      {
        source: '/modules/grammar',
        destination: '/en/modules/grammar',
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
      },
      {
        source: '/modules/listening',
        destination: '/en/modules/listening',
        permanent: true,
      },
      // Legacy module names to new names
      {
        source: '/en/modules/reading-comprehension',
        destination: '/en/modules/reading',
        permanent: true,
      },
      {
        source: '/en/modules/writing-assistant',
        destination: '/en/modules/writing',
        permanent: true,
      },
      {
        source: '/en/modules/vocabulary-builder',
        destination: '/en/modules/vocabulary',
        permanent: true,
      },
      {
        source: '/en/modules/grammar-coach',
        destination: '/en/modules/grammar',
        permanent: true,
      },
      {
        source: '/en/modules/pronunciation-trainer',
        destination: '/en/modules/speaking',
        permanent: true,
      },
      // Testimonials to Success Stories redirect
      {
        source: '/en/testimonials',
        destination: '/en/success-stories',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 