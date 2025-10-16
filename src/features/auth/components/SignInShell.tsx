'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export function SignInShell() {
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

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="text-sm text-neutral-300">
          Sign in with Google to access your saved drafts and AI co-pilot.
        </p>
      </header>
      <div className="flex flex-col gap-4">
        <Button type="button" className="w-full" disabled={isLoading} onClick={handleGoogleSignIn}>
          {isLoading ? 'Redirecting…' : 'Continue with Google'}
        </Button>
        {error ? <p className="text-xs text-rose-300 text-center">{error}</p> : null}
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
