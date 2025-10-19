'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Mail, Send, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    setServerError('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setServerError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
                <p className="text-gray-600">
                  We've sent a password reset link to<br />
                  <span className="font-medium text-gray-900">{getValues('email')}</span>
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  The email may take a few minutes to arrive. Be sure to check your spam folder if you don't see it in your inbox.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/sign-in">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">
                    Return to sign in
                  </Button>
                </Link>
                
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setServerError('');
                  }}
                  className="w-full text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Try a different email address
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/sign-in" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to sign in</span>
            </Link>
            
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
            <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
          </div>

          {/* Error message */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Sending reset link...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  Send reset link
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Protected by enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}