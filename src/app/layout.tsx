import React from "react";
import "./globals.css";
import { Providers } from "../components/providers/Providers";
import { I18nProvider } from "../lib/i18n/context";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cvletterai.vercel.app'),
  title: {
    default: 'CVLetterAI - Professional CV & Cover Letter Builder',
    template: '%s | CVLetterAI'
  },
  description: 'Create stunning professional CVs and cover letters with AI-powered assistance. Modern, secure, and ultra-fast.',
  keywords: ['CV builder', 'resume maker', 'cover letter', 'AI assistant', 'professional'],
  authors: [{ name: 'CVLetterAI Team' }],
  creator: 'CVLetterAI',
  publisher: 'CVLetterAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cvletterai.com',
    title: 'CVLetterAI - Professional CV & Cover Letter Builder',
    description: 'Create stunning professional CVs and cover letters with AI-powered assistance.',
    siteName: 'CVLetterAI',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'CVLetterAI - Professional CV & Cover Letter Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVLetterAI - Professional CV & Cover Letter Builder',
    description: 'Create stunning professional CVs and cover letters with AI-powered assistance.',
    images: ['/og/default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden text-white">
        <Providers>
          <I18nProvider>
            <div className="relative min-h-screen bg-gradient-main">
              {children}
            </div>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}