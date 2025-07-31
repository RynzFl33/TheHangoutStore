/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'xdafgnvqjrnehwbcfjze.supabase.co',
      },
    ],
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.2:3000',
    // Add other origins if needed
  ],
};

module.exports = nextConfig;