import type { Metadata, Viewport } from 'next';
import { fontVariables, inter, jetBrainsMono, satoshi } from '@/lib/fonts';
import { Providers } from '@/components/providers/Providers';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cvletterai.com'),
  title: {
    default: 'CVLetterAI | AI-crafted CVs and UK landlord letters',
    template: '%s | CVLetterAI'
  },
  description:
    'CVLetterAI helps UK professionals produce ATS-ready CVs, compliant landlord letters, and actionable guidance through an AI copilot.',
  keywords: [
    'AI CV builder',
    'UK landlord letter generator',
    'ATS optimised resume',
    'tenancy reference letter',
    'career AI assistant'
  ],
  openGraph: {
    title: 'CVLetterAI — Built for UK Professionals',
    description:
      'Create tailored CVs, cover letters, and landlord communications with multilingual AI workflows and compliance guardrails.',
    url: 'https://cvletterai.com',
    siteName: 'CVLetterAI',
    images: [
      {
        url: '/og/cvletterai-og.png',
        width: 1200,
        height: 630,
        alt: 'CVLetterAI marketing preview'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@cvletterai',
    title: 'CVLetterAI',
    description:
      'AI-powered CVs, landlord letters, and compliance workflows for UK professionals.',
    images: ['/og/cvletterai-og.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [{ url: '/apple-touch-icon.png' }]
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-GB': '/en',
      'pt-PT': '/pt',
      'es-ES': '/es',
      'pl-PL': '/pl',
      'fr-FR': '/fr',
      'hi-IN': '/hi',
      'ar-AE': '/ar'
    }
  }
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  colorScheme: 'dark light'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${satoshi.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${fontVariables} antialiased bg-surface-muted`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
