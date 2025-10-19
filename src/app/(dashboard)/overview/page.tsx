'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/marketing/Header';
import { Button } from '@/components/ui/Button';
import { useAuth, usePlan } from '@/lib/auth/AuthContext';
import { 
  FileText, 
  FileSignature, 
  BarChart3, 
  Clock, 
  Settings, 
  Download,
  Crown,
  Shield,
  CheckCircle,
  Zap,
  User,
  CreditCard,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const { user, logout } = useAuth();
  const { plan, isPro, isEnterprise, isFree } = usePlan();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  const getPlanColor = () => {
    if (isEnterprise) return 'from-amber-500 to-orange-500';
    if (isPro) return 'from-blue-500 to-purple-500';
    return 'from-gray-500 to-gray-600';
  };

  const getPlanName = () => {
    if (isEnterprise) return 'Enterprise';
    if (isPro) return 'Pro';
    return 'Free';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header with mobile menu */}
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.firstName || user.name}!
              </h1>
              <p className="text-gray-600">
                Ready to create professional CVs and cover letters with AI assistance.
              </p>
            </div>
            
            {/* Plan Badge */}
            <div className={`bg-gradient-to-r ${getPlanColor()} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg`}>
              {isEnterprise && <Crown className="h-5 w-5 text-white" />}
              {isPro && <Zap className="h-5 w-5 text-white" />}
              {isFree && <Shield className="h-5 w-5 text-white" />}
              <span className="text-white font-semibold">{getPlanName()} Plan</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">3</span>
            </div>
            <p className="text-gray-600 text-sm">CVs Created</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FileSignature className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">5</span>
            </div>
            <p className="text-gray-600 text-sm">Cover Letters</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Download className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">12</span>
            </div>
            <p className="text-gray-600 text-sm">Downloads</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">Today</span>
            </div>
            <p className="text-gray-600 text-sm">Last Active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              asChild 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 h-auto flex-col space-y-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link href="/cv-builder">
                <FileText className="h-8 w-8" />
                <span className="font-semibold">Create CV</span>
                <span className="text-xs opacity-80">Professional resume builder</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 h-auto flex-col space-y-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link href="/letter-builder">
                <FileSignature className="h-8 w-8" />
                <span className="font-semibold">Write Letter</span>
                <span className="text-xs opacity-80">Cover letter generator</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 h-auto flex-col space-y-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link href="/chat">
                <BarChart3 className="h-8 w-8" />
                <span className="font-semibold">AI Chat</span>
                <span className="text-xs opacity-80">Career assistant</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-6 h-auto flex-col space-y-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link href="/settings">
                <Settings className="h-8 w-8" />
                <span className="font-semibold">Settings</span>
                <span className="text-xs opacity-80">Account & preferences</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Account Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Information */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor()} flex items-center justify-center`}>
                {isEnterprise && <Crown className="h-6 w-6 text-white" />}
                {isPro && <Zap className="h-6 w-6 text-white" />}
                {isFree && <Shield className="h-6 w-6 text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{getPlanName()} Plan</h3>
                <p className="text-slate-300 text-sm">
                  {isFree && "Basic features with limited usage"}
                  {isPro && "Full access to all features"}
                  {isEnterprise && "Advanced features for teams"}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">CV & Cover Letter Builder</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">AI Chat Assistant</span>
              </div>
              {(isPro || isEnterprise) && (
                <>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Unlimited Documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Premium Templates</span>
                  </div>
                </>
              )}
            </div>
            
            {isFree && (
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/pricing">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Link>
              </Button>
            )}
          </div>

          {/* Account Settings */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Profile</p>
                    <p className="text-slate-400 text-sm">Update your personal information</p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/settings">Edit</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Billing</p>
                    <p className="text-slate-400 text-sm">Manage your subscription</p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/pricing">Manage</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Downloads</p>
                    <p className="text-slate-400 text-sm">Access your created documents</p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/settings">View</Link>
                </Button>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Created "Marketing Manager CV"</p>
                <p className="text-slate-400 text-sm">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <FileSignature className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Generated cover letter for Tech role</p>
                <p className="text-slate-400 text-sm">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Downloaded CV as PDF</p>
                <p className="text-slate-400 text-sm">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}