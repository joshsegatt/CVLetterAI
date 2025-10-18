'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowRight, Eye, EyeOff, User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const { register: registerUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');
  
  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setServerError('');
    
    try {
      const result = await registerUser(data);
      
      if (result.success) {
        setIsSuccess(true);
        
        // Auto redirect after 2 seconds
        setTimeout(() => {
          window.location.href = `/sign-in?email=${encodeURIComponent(data.email)}&message=Account created successfully! Please sign in to continue.`;
        }, 2500);
      } else {
        setServerError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const generateUsername = () => {
    const firstName = watch('firstName');
    const lastName = watch('lastName');
    
    if (firstName && lastName) {
      const suggestion = (firstName + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
      setValue('username', suggestion);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Welcome to CVLetterAI!</h1>
                <p className="text-green-200">
                  Your account has been created successfully
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
                <span className="text-sm ml-2">Redirecting to sign in...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-300">Join thousands of professionals using CVLetterAI</p>
          </div>

          {/* Error message */}
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-200 text-sm">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...register('firstName')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...register('lastName')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Username <span className="text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">@</div>
                <input
                  {...register('username')}
                  type="text"
                  className="w-full pl-8 pr-20 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="johndoe"
                />
                <button
                  type="button"
                  onClick={generateUsername}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300 px-2 py-1"
                >
                  Generate
                </button>
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
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
                  placeholder="••••••••"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= level * 2
                            ? level <= 2
                              ? 'bg-red-400'
                              : level === 3
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Create account
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in here
              </Link>
            </p>
            
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
