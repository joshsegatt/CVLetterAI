'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Github, Mail, Chrome, Eye, EyeOff, Lock, User, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [providers, setProviders] = useState<any>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'oauth'>('email');
  
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true,
    },
  });

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();

    // Check URL parameters for email and message
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const messageParam = urlParams.get('message');
    
    if (emailParam) {
      setValue('emailOrUsername', emailParam);
    }
    
    if (messageParam) {
      setSuccessMessage(decodeURIComponent(messageParam));
    }
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      console.log('🔐 Attempting login with NextAuth...');
      
      // Use NextAuth signIn with credentials provider
      const result = await signIn('credentials', {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
        redirect: false, // Handle redirect manually
        callbackUrl: '/overview',
      });
      
      console.log('📊 Login result:', result);
      
      if (result?.error) {
        console.error('❌ Login error:', result.error);
        setServerError('Invalid email/username or password. Please check your credentials and try again.');
      } else if (result?.ok) {
        console.log('✅ Login successful! Redirecting...');
        setSuccessMessage('Login successful! Redirecting to your dashboard...');
        
        // Add a small delay to show success message
        setTimeout(() => {
          const redirectParam = new URLSearchParams(window.location.search).get('redirect');
          const redirectUrl = redirectParam || '/overview';
          console.log('🚀 Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
        }, 1000);
      } else {
        console.error('❌ Unexpected login result:', result);
        setServerError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSignIn = async (providerId: string) => {
    try {
      setIsLoading(true);
      setServerError('');
      
      const result = await signIn(providerId, { 
        callbackUrl: '/overview',
        redirect: false
      });
      
      if (result?.error) {
        setServerError(`Unable to sign in with ${providerId}. Please try again.`);
      }
    } catch (error) {
      console.error('Provider sign-in error:', error);
      setServerError(`Unable to sign in with ${providerId}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return <Chrome className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      default:
        return providerId;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-300">Sign in to your CVLetterAI account</p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-200 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{serverError}</p>
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginMethod === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Email / Username
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('oauth')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginMethod === 'oauth'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Social Login
            </button>
          </div>

          {loginMethod === 'email' ? (
            /* Email/Username Login Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email/Username Field */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...register('emailOrUsername')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email or username"
                  />
                </div>
                {errors.emailOrUsername && (
                  <p className="text-red-400 text-xs mt-1">{errors.emailOrUsername.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded bg-white/5"
                  />
                  <span className="ml-2 text-sm text-slate-300">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          ) : (
            /* OAuth Providers */
            <div className="space-y-4">
              {providers && Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials') return null;
                
                return (
                  <Button
                    key={provider.id}
                    onClick={() => handleProviderSignIn(provider.id)}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    {getProviderIcon(provider.id)}
                    <span>Continue with {getProviderName(provider.id)}</span>
                  </Button>
                );
              })}

              {(!providers || Object.keys(providers).length <= 1) && (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">
                    Social login providers are not configured yet.
                    <br />
                    Please use email/username login instead.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium">
                Create one here
              </Link>
            </p>
            
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500">
                Protected by enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}