'use client';

import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        }>
          {children}
        </Suspense>
      </AuthProvider>
    </SessionProvider>
  );
}
