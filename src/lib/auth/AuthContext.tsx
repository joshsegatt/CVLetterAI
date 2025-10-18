'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  image?: string;
  plan: string;
  planExpiresAt?: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Update user state when session changes
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      const sessionUser = session.user as any;
      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
        username: sessionUser.username,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName,
        name: sessionUser.name,
        image: sessionUser.image,
        plan: sessionUser.plan || 'free',
        planExpiresAt: sessionUser.planExpiresAt,
        isEmailVerified: sessionUser.isEmailVerified || false,
        lastLoginAt: sessionUser.lastLoginAt,
        createdAt: sessionUser.createdAt,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [session, status]);

  const login = async (
    emailOrUsername: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update session with new user data
        await update();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (
    userData: RegisterData
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call our logout API to clear cookies
      await fetch('/api/auth/login', {
        method: 'DELETE',
      });

      // Clear user state
      setUser(null);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload even if API call fails
      window.location.href = '/';
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      await update();
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user has a specific plan
export function usePlan(): {
  plan: string;
  isPro: boolean;
  isEnterprise: boolean;
  isFree: boolean;
  isExpired: boolean;
} {
  const { user } = useAuth();
  
  const plan = user?.plan || 'free';
  const planExpiresAt = user?.planExpiresAt ? new Date(user.planExpiresAt) : null;
  const isExpired = planExpiresAt ? planExpiresAt < new Date() : false;

  return {
    plan,
    isPro: plan === 'pro' && !isExpired,
    isEnterprise: plan === 'enterprise' && !isExpired,
    isFree: plan === 'free' || isExpired,
    isExpired,
  };
}

// Hook for checking authentication status
export function useRequireAuth(): User {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign-in page if not authenticated
      const currentPath = window.location.pathname;
      window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
    }
  }, [user, loading]);

  if (loading) {
    throw new Error('Authentication is still loading');
  }

  if (!user) {
    throw new Error('User is not authenticated');
  }

  return user;
}