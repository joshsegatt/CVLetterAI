'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Github, Mail, Chrome } from 'lucide-react';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleProviderSignIn = async (providerId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(providerId, {
        callbackUrl: '/dashboard',
        redirect: true
      });
    } catch (err) {
      setError(`Unable to sign in with ${providerId}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

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
        setError('Invalid credentials. Please try again.');
      } else if (result?.ok) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return <Chrome className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      case 'credentials':
        return 'Email';
      default:
        return providerId;
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#0A0E1F] px-6 py-24">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Sign in to CVLetterAI</h1>
          <p className="text-sm text-slate-300">
            Choose your preferred sign-in method below.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {!showEmailForm ? (
          <div className="space-y-3">
            {/* OAuth Providers */}
            {providers && Object.values(providers).map((provider: any) => {
              if (provider.id === 'credentials') return null;
              
              return (
                <Button
                  key={provider.id}
                  type="button"
                  size="lg"
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  disabled={isLoading}
                  onClick={() => handleProviderSignIn(provider.id)}
                >
                  <div className="flex items-center gap-3">
                    {getProviderIcon(provider.id)}
                    Continue with {getProviderName(provider.id)}
                  </div>
                </Button>
              );
            })}

            {/* Email/Password Option */}
            <Button
              type="button"
              size="lg"
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white"
              disabled={isLoading}
              onClick={() => setShowEmailForm(true)}
            >
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                Continue with Email
              </div>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              onClick={() => setShowEmailForm(false)}
            >
              ← Back to other options
            </Button>
          </form>
        )}

        <p className="text-xs text-slate-400 text-center">
          Need an account?{' '}
          <Link href="/sign-up" className="text-sky-300 hover:text-sky-200">
            Create one here
          </Link>
          .
        </p>
        
        <p className="text-xs text-slate-500 text-center">
          New accounts are automatically created when you sign in.
        </p>
      </div>
    </div>
  );
}
