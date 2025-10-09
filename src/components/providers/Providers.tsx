'use client';

import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={null}>{children}</Suspense>
    </ThemeProvider>
  );
}
