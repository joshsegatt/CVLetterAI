'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireEmailVerified?: boolean;
  requiredPlan?: 'free' | 'pro' | 'enterprise';
  redirectIfAuthenticated?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const {
    redirectTo = '/sign-in',
    requireEmailVerified = false,
    requiredPlan,
    redirectIfAuthenticated = false
  } = options;

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    // Redirect if authenticated and redirectIfAuthenticated is true
    if (redirectIfAuthenticated && session) {
      router.push('/overview');
      return;
    }

    // Redirect if not authenticated and authentication is required
    if (!redirectIfAuthenticated && !session) {
      const currentPath = window.location.pathname;
      const redirectUrl = currentPath !== '/' ? `${redirectTo}?redirect=${encodeURIComponent(currentPath)}` : redirectTo;
      router.push(redirectUrl);
      return;
    }

    // Check email verification requirement
    if (session && requireEmailVerified && !(session.user as any)?.isEmailVerified) {
      router.push('/verify-email');
      return;
    }

    // Check plan requirement
    if (session && requiredPlan) {
      const userPlan = (session.user as any)?.plan || 'free';
      const planHierarchy: Record<string, number> = { free: 0, pro: 1, enterprise: 2 };
      
      if (planHierarchy[userPlan] < planHierarchy[requiredPlan]) {
        router.push('/pricing');
        return;
      }
    }
  }, [session, status, router, redirectTo, requireEmailVerified, requiredPlan, redirectIfAuthenticated]);

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    session
  };
}

// Hook for protecting pages that require authentication
export function useRequireAuth(options?: Omit<UseAuthGuardOptions, 'redirectIfAuthenticated'>) {
  return useAuthGuard({ ...options, redirectIfAuthenticated: false });
}

// Hook for redirecting authenticated users (useful for login/register pages)
export function useRedirectIfAuthenticated(redirectTo: string = '/overview') {
  return useAuthGuard({ redirectTo, redirectIfAuthenticated: true });
}
