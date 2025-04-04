/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  // Add transpilePackages for Three.js
  transpilePackages: ['three', '@react-three/drei', '@react-three/fiber'],
  // The functions configuration is not valid in next.config.js
  // It should only be in vercel.json
};

module.exports = nextConfig; 