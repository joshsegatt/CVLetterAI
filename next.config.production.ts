import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  experimental: {
    serverActions: {}
  },
  eslint: {
    dirs: ['app', 'src'],
    ignoreDuringBuilds: false
  },
  typescript: {
    ignoreBuildErrors: false
  },
  webpack: (config) => {
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;