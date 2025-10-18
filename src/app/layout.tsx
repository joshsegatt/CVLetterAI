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
      <body 
        className="min-h-screen font-sans antialiased overflow-x-hidden bg-slate-900" 
        style={{
          background: 'radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
          backgroundColor: '#0a0a0a'
        }}
      >
        <Providers>
          <I18nProvider>
            {/* Main App Container with backup background */}
            <div 
              className="relative min-h-screen bg-slate-900"
              style={{
                background: 'radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
                backgroundColor: '#0a0a0a'
              }}
            >
              {children}
            </div>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
