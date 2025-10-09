import { Inter, JetBrains_Mono } from 'next/font/google';

/**
 * Font stack powered by next/font.
 * Satoshi is mapped to Inter for now until licensed asset is available.
 */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter'
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jetbrains'
});

export const satoshi = Inter({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-satoshi'
});

export const fontVariables = [
  inter.variable,
  satoshi.variable,
  jetBrainsMono.variable
].join(' ');
