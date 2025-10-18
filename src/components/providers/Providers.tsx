'use client';

import { Suspense } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Suspense fallback={null}>{children}</Suspense>
  );
}
