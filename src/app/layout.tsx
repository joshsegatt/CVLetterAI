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

export const metadata: Metadata = {
  title: {
    default: "CVlettersAI — AI Career Documents",
    template: "%s | CVlettersAI",
  },
  description:
    "AI-powered resumes, cover letters, and LinkedIn profiles crafted for senior executives and ambitious professionals.",
  keywords: ["AI resume", "executive resume", "cover letter AI", "LinkedIn optimization"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CVlettersAI",
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
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-white text-zinc-900">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
