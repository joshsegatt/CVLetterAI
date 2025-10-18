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
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // FORÇA cores personalizadas imediatamente
                document.documentElement.style.background = 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), transparent), linear-gradient(180deg, #0a0a0a, #1a1a2e, #16213e)';
                document.documentElement.style.backgroundColor = '#0a0a0a';
                document.documentElement.style.color = '#ffffff';
                document.body.style.background = 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), transparent), linear-gradient(180deg, #0a0a0a, #1a1a2e, #16213e)';
                document.body.style.backgroundColor = '#0a0a0a';
                document.body.style.color = '#ffffff';
                // Remove classes problem\u00e1ticas
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('dark');
                document.documentElement.removeAttribute('data-theme');
                document.body.removeAttribute('data-theme');
              })();
            `,
          }}
        />
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
