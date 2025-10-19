/**
 * Plan Access Middleware
 * Protects routes based on user plan features
 */

import { NextRequest, NextResponse } from 'next/server';
import { userPlanManager, PlanUtils } from '../auth/userPlans';

export interface ProtectedRoute {
  path: string;
  requiresPro?: boolean;
  requiresEnterprise?: boolean;
  feature?: string;
}

const PROTECTED_ROUTES: ProtectedRoute[] = [
  // CV Builder - Pro features
  {
    path: '/cv-builder',
    requiresPro: true,
    feature: 'aiOptimization'
  },
  
  // Letter Builder - Pro features
  {
    path: '/letter-builder',
    requiresPro: true,
    feature: 'aiOptimization'
  },
  
  // Chat AI - Free with limitations, Pro for unlimited
  {
    path: '/chat',
    requiresPro: false, // Allow free access
    feature: 'basicChat'
  },
  
  // Dashboard - Enterprise features for teams
  {
    path: '/dashboard/teams',
    requiresEnterprise: true,
    feature: 'teamManagement'
  },
  
  // API Access - Enterprise only
  {
    path: '/api/v1',
    requiresEnterprise: true,
    feature: 'apiAccess'
  },
  
  // Analytics - Enterprise only
  {
    path: '/dashboard/analytics',
    requiresEnterprise: true,
    feature: 'analytics'
  }
];

export function checkPlanAccess(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  
  // Get user email from session (you might need to adapt this based on your auth system)
  const userEmail = getUserEmailFromRequest(request);
  
  if (!userEmail) {
    // No user logged in, redirect to sign-in for protected routes
    const protectedRoute = PROTECTED_ROUTES.find(route => pathname.startsWith(route.path));
    if (protectedRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return null;
  }
  
  // Check if route requires specific plan access
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route.path)) {
      const hasAccess = checkRouteAccess(userEmail, route);
      
      if (!hasAccess) {
        // Redirect to pricing page with upgrade message
        const upgradeUrl = new URL('/pricing', request.url);
        upgradeUrl.searchParams.set('upgrade', route.requiresEnterprise ? 'enterprise' : 'pro');
        upgradeUrl.searchParams.set('feature', route.feature || 'access');
        return NextResponse.redirect(upgradeUrl);
      }
    }
  }
  
  return null;
}

function checkRouteAccess(userEmail: string, route: ProtectedRoute): boolean {
  if (route.requiresEnterprise) {
    return PlanUtils.hasEnterpriseAccess(userEmail);
  }
  
  if (route.requiresPro) {
    return PlanUtils.hasProAccess(userEmail);
  }
  
  if (route.feature) {
    return userPlanManager.hasFeatureAccess(userEmail, route.feature as any);
  }
  
  return true;
}

function getUserEmailFromRequest(request: NextRequest): string | null {
  // Try to get from cookie/session
  const authCookie = request.cookies.get('auth-token');
  if (authCookie) {
    try {
      // Decode JWT or session token to get user email
      // This is a simplified example - implement according to your auth system
      const decoded = JSON.parse(atob(authCookie.value));
      return decoded.email;
    } catch {
      return null;
    }
  }
  
  // Fallback: get from query param for testing
  return request.nextUrl.searchParams.get('user');
}

/**
 * API middleware for checking plan access
 */
export async function checkApiAccess(request: NextRequest, feature: string): Promise<NextResponse | null> {
  const userEmail = getUserEmailFromRequest(request);
  
  if (!userEmail) {
    return NextResponse.json(
      { error: 'Authentication required' }, 
      { status: 401 }
    );
  }
  
  const hasAccess = userPlanManager.hasFeatureAccess(userEmail, feature as any);
  
  if (!hasAccess) {
    const userPlan = userPlanManager.getUserPlan(userEmail);
    return NextResponse.json(
      { 
        error: 'Plan upgrade required',
        currentPlan: userPlan.planType,
        requiredFeature: feature,
        upgradeUrl: '/pricing'
      }, 
      { status: 403 }
    );
  }
  
  return null;
}

/**
 * Component-level access checker
 */
export const AccessChecker = {
  canUseFeature: (userEmail: string, feature: keyof import('../auth/userPlans').PlanFeatures) => {
    return userPlanManager.hasFeatureAccess(userEmail, feature);
  },
  
  getUpgradeMessage: (userEmail: string, feature: string) => {
    const plan = userPlanManager.getUserPlan(userEmail);
    
    if (plan.planType === 'free') {
      return {
        title: 'Upgrade to Pro Required',
        message: `This feature requires a Pro plan. Upgrade now for just £5.99 one-time payment.`,
        upgradeUrl: '/pricing?highlight=pro'
      };
    }
    
    if (plan.planType === 'pro') {
      return {
        title: 'Enterprise Feature',
        message: `This feature is available in our Enterprise plan for £9.99/month.`,
        upgradeUrl: '/pricing?highlight=enterprise'
      };
    }
    
    return null;
  },
  
  getUsageInfo: (userEmail: string) => {
    const plan = userPlanManager.getUserPlan(userEmail);
    const limits = userPlanManager.getUsageLimits(userEmail);
    
    return {
      planType: plan.planType,
      cvLimit: limits.cvLimit,
      letterLimit: limits.letterLimit,
      features: plan.features
    };
  }
};
