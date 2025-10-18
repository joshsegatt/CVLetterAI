"use client";

import React from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { CheckoutButton } from '../../components/payments/CheckoutButton';
import { Check, Star, Zap, Shield, Users, Crown } from 'lucide-react';
import { useI18n } from '../../lib/i18n/context';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '£0',
    period: 'forever',
    description: 'Get started with basic CV creation',
    features: [
      '1 CV creation per month',
      'Basic templates',
      'PDF export',
      'Email support'
    ],
    limitations: [
      'Limited templates',
      'No AI optimization',
      'Basic support'
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'from-gray-600 to-gray-700'
  },
  {
    id: 'price_one_time',
    name: 'Pro',
    price: '£5.99',
    period: 'one-time',
    description: 'Perfect for job seekers who need professional results',
    features: [
      '🚀 Unlimited CV & Cover Letters',
      '🤖 Super AI Chat Assistant',
      '✨ AI Content Optimization',
      '🎨 Premium Templates (20+)',
      '📊 ATS Optimization',
      '📋 PDF Analysis & Feedback',
      '🌍 Multi-language Support',
      '⚡ Priority Support',
      '📱 Mobile & Desktop Access',
      '🔐 Secure Cloud Storage',
      '💾 Export to Multiple Formats'
    ],
    limitations: [],
    cta: 'Unlock Pro Features',
    popular: true,
    color: 'from-purple-600 to-blue-600'
  },
  {
    id: 'price_subscription',
    name: 'Enterprise',
    price: '£12.99',
    period: 'per month',
    description: 'For teams and organizations with advanced needs',
    features: [
      '👑 Everything in Pro',
      '👥 Team Management Dashboard',
      '🏢 Custom Company Templates',
      '🔌 API Access & Integration',
      '📈 Advanced Analytics & Reports',
      '🎯 White-label Option',
      '📞 Dedicated Account Manager',
      '🛡️ GDPR & SOC2 Compliance',
      '🌐 Custom Domain Support',
      '⚙️ Advanced Admin Controls',
      '📊 Bulk CV Processing',
      '🔄 SSO Integration',
      '💼 HR Integration Tools',
      '📋 Custom Workflow Automation'
    ],
    limitations: [],
    cta: 'Get Enterprise Access',
    popular: false,
    color: 'from-amber-600 to-orange-600'
  }
];

export default function PricingPage() {
  const { translate } = useI18n();
  
  return (
    <PublicLayout
      title="Pricing Plans"
      description="Choose the perfect plan for your CV and cover letter needs"
    >
      <div className="flex justify-center">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Pricing Plans</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              {translate('pricing.title')} <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Perfect Plan</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {translate('pricing.subtitle')}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative glass-panel border-white/10 rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20 scale-105' 
                    : 'hover:border-white/20'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    {plan.id === 'free' && <Users className="h-8 w-8 text-white" />}
                    {plan.id === 'price_one_time' && <Zap className="h-8 w-8 text-white" />}
                    {plan.id === 'price_subscription' && <Shield className="h-8 w-8 text-white" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  {plan.id === 'free' ? (
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-lg font-semibold transition-colors">
                      {plan.cta}
                    </button>
                  ) : plan.id === 'price_subscription' ? (
                    <CheckoutButton
                      planId={plan.id as 'price_subscription'}
                      label={plan.cta}
                      intent="primary"
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border-0"
                    />
                  ) : (
                    <CheckoutButton
                      planId={plan.id as 'price_one_time'}
                      label={plan.cta}
                      intent="primary"
                      className="w-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="glass-panel border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Is there a free trial?</h3>
                <p className="text-gray-300">Yes! You can create 1 CV per month completely free. No credit card required.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Can I cancel anytime?</h3>
                <p className="text-gray-300">Absolutely. Cancel your subscription anytime with no questions asked.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Do you offer refunds?</h3>
                <p className="text-gray-300">Yes, we offer 30-day money-back guarantee if you're not satisfied.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Is my data secure?</h3>
                <p className="text-gray-300">Yes, we use bank-level encryption and are fully GDPR compliant.</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to accelerate your career?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of professionals who've landed their dream jobs with our AI-powered tools.</p>
            
            <CheckoutButton
              planId="price_one_time"
              label="Start Creating Professional CVs"
              intent="primary"
              className="text-lg px-8 py-4"
            />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
