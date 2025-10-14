'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#0A0E1F] px-6 py-24">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-[0_25px_60px_-40px_rgba(56,189,248,0.55)] backdrop-blur-xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Create your CVLetterAI account</h1>
          <p className="text-sm text-slate-300">
            Register to save drafts and manage your compliance-ready documents.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-left text-xs font-medium text-slate-200">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </label>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Preparing access…' : 'Join the beta'}
          </Button>
        </form>
        <p className="text-xs text-slate-400">
          Already onboard?{' '}
          <Link href="/sign-in" className="text-sky-300 hover:text-sky-200">
            Sign in instead
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
