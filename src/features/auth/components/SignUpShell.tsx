'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export function SignUpShell() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!email || !password || !confirmPassword) {
        throw new Error('Please complete all required fields.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push('/dashboard');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to sign up. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Create your account</h1>
        <p className="text-sm text-neutral-300">
          Save drafts, sync exports, and collaborate with your team.
        </p>
      </header>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm text-neutral-200">
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-200">
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="Create a secure password"
            className="rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-200">
          <span>Confirm password</span>
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            className="rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="text-center text-xs text-neutral-400">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
