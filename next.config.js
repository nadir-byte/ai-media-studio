/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'clerk.com'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  // Force clean builds - disable persistent caching
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
}

module.exports = nextConfig
