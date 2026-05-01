import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cvletterai.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CVLetterAI | AI Executive Career Intelligence",
    template: "%s | CVLetterAI",
  },
  description:
    "The world's most advanced AI engine for high-fidelity resumes, cover letters, and LinkedIn profiles. ATS-optimized and calibrated for top-tier headhunters.",
  keywords: ["CVLetterAI", "AI resume", "executive career", "career intelligence", "ATS optimization", "AI cover letter"],
  authors: [{ name: "CVLetterAI Team" }],
  creator: "CVLetterAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "CVLetterAI",
    title: "CVLetterAI | AI Executive Career Intelligence",
    description: "Replicate top-tier headhunter reasoning with our advanced AI career engine.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CVLetterAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVLetterAI | AI Career Intelligence",
    description: "The next generation of career document automation.",
    images: ["/og-image.png"],
    creator: "@cvletterai",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
      >
        <body className="min-h-full bg-white text-zinc-900 overflow-x-hidden">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
