'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export function SignInShell() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true
      });

      if (result?.error) {
        setError('Unable to sign in with Google. Please try again.');
      }
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Unexpected error during Google sign-in.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        window.location.href = '/dashboard';
      }
    } catch (signInError) {
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Redirect to chat without authentication for testing
    window.location.href = '/chat';
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="text-sm text-neutral-300">
          Sign in to access your saved drafts and AI co-pilot.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {!showEmailForm ? (
          <>
            {/* Google Sign In */}
            <Button 
              type="button" 
              className="w-full bg-white text-gray-900 hover:bg-gray-100" 
              disabled={isLoading} 
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-xs text-neutral-400">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Email/Password Option */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10" 
              onClick={() => setShowEmailForm(true)}
            >
              Sign in with Email
            </Button>

            {/* Guest Access */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10" 
              onClick={handleGuestAccess}
            >
              🚀 Try AI Chat (Guest Mode)
            </Button>
          </>
        ) : (
          <>
            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Back to options */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10" 
              onClick={() => setShowEmailForm(false)}
            >
              ← Back to options
            </Button>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-xs text-red-300 text-center">{error}</p>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-neutral-400">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-accent hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
