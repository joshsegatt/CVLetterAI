import React from "react";
import "./globals.css";
import { Providers } from "../components/providers/Providers";
import { I18nProvider } from "../lib/i18n/context";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: {
    default: 'CVLetterAI - Professional CV & Cover Letter Builder',
    template: '%s | CVLetterAI'
  },
  description: 'Create stunning professional CVs and cover letters with AI-powered assistance. Modern, secure, and ultra-fast.',
  keywords: ['CV builder', 'resume maker', 'cover letter', 'AI assistant', 'professional'],
  authors: [{ name: 'CVLetterAI Team' }],
  creator: 'CVLetterAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cvletterai.com',
    title: 'CVLetterAI - Professional CV & Cover Letter Builder',
    description: 'Create stunning professional CVs and cover letters with AI-powered assistance.',
    siteName: 'CVLetterAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVLetterAI - Professional CV & Cover Letter Builder',
    description: 'Create stunning professional CVs and cover letters with AI-powered assistance.',
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
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Critical CSS styles are already included in globals.css */}
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        {/* Ultra Modern Background with Mesh Gradient */}
        <div className="fixed inset-0 -z-10 bg-gradient-mesh" />
        
        {/* Loading State */}
        <div id="loading-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <p className="text-sm text-surface-300">Loading CVLetterAI...</p>
          </div>
        </div>
        
        <Providers>
          <I18nProvider>
            {/* Main App Container */}
            <div className="relative min-h-screen">
              {/* Gradient Orbs for Visual Enhancement */}
              <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl animate-float" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-luxury-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/5 blur-3xl animate-pulse-glow" />
              </div>
              
              {children}
            </div>
          </I18nProvider>
        </Providers>
        
        {/* Remove loading overlay after hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                  const loadingOverlay = document.getElementById('loading-overlay');
                  if (loadingOverlay) {
                    loadingOverlay.style.opacity = '0';
                    loadingOverlay.style.transition = 'opacity 0.3s ease-out';
                    setTimeout(() => loadingOverlay.remove(), 300);
                  }
                }, 500);
              });
            `
          }}
        />
      </body>
    </html>
  );
}
