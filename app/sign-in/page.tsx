'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#0A0E1F] px-6 py-24">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-[0_25px_60px_-40px_rgba(56,189,248,0.55)] backdrop-blur-xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Sign in to CVLetterAI</h1>
          <p className="text-sm text-slate-300">
            Use your Google account to access saved documents and premium workflows.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          {isLoading ? 'Redirecting…' : 'Continue with Google'}
        </Button>
        {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        <p className="text-xs text-slate-400">
          Need an account?{' '}
          <Link href="/sign-up" className="text-sky-300 hover:text-sky-200">
            Create one here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
