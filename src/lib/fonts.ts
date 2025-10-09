import localFont from 'next/font/local';

/**
 * Font stack powered by next/font.
 * Satoshi is mapped to Inter for now until licensed asset is available.
 */
export const inter = localFont({
  src: [
    {
      path: './fonts/Inter-Variable.ttf',
      weight: '400 900',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-inter'
});

export const jetBrainsMono = localFont({
  src: [
    {
      path: './fonts/JetBrainsMono-Variable.ttf',
      weight: '400 800',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-jetbrains'
});

export const satoshi = localFont({
  src: [
    {
      path: './fonts/Inter-Variable.ttf',
      weight: '500 700',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-satoshi'
});

export const fontVariables = [
  inter.variable,
  satoshi.variable,
  jetBrainsMono.variable
].join(' ');
