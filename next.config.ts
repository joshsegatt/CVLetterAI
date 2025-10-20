import type { NextConfig } from 'next';

const securityHeaders = [
  // Content Security Policy - Nível Bancário
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'none'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' blob: data: https://*.stripe.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://accounts.google.com https://oauth2.googleapis.com http://192.168.0.163:1234 ws://localhost:* wss://localhost:*",
      "frame-ancestors 'none'",
      "frame-src 'self' https://*.stripe.com https://accounts.google.com",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "media-src 'none'",
      "child-src 'none'",
      "worker-src 'self'",
      "manifest-src 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  },
  // Strict Transport Security - HTTPS obrigatório
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  // Referrer Policy - Privacidade máxima
  {
    key: 'Referrer-Policy',
    value: 'no-referrer'
  },
  // X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // X-Frame-Options - Anti-clickjacking
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // XSS Protection
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Permissions Policy - Restritiva
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self "https://checkout.stripe.com")',
      'usb=()',
      'bluetooth=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'picture-in-picture=()'
    ].join(', ')
  },
  // Cross-Origin Policies
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp'
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin'
  },
  // Cache Control para dados sensíveis
  {
    key: 'Cache-Control',
    value: 'no-store, no-cache, must-revalidate, private'
  },
  // Server Information Hiding
  {
    key: 'Server',
    value: ''
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  experimental: {
    serverActions: {}
  },
  typescript: {
    ignoreBuildErrors: false
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
