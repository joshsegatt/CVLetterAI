"use client";

import React from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Check, Star, Zap, Shield, Users, Crown } from 'lucide-react';

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
  
  return (
    <PublicLayout
      title="Pricing Plans"
      description="Choose the perfect plan for your CV and cover letter needs"
    >
      <div className="section">
        <div className="container-lg">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`card relative ${
                  plan.popular 
                    ? 'border-purple-500 shadow-xl shadow-purple-500/10 scale-105' 
                    : ''
                } ${plan.popular ? '' : 'hover-lift'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="badge bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Crown className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="card-body">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-md`}>
                      {plan.id === 'free' && <Users className="h-8 w-8 text-white" />}
                      {plan.id === 'price_one_time' && <Zap className="h-8 w-8 text-white" />}
                      {plan.id === 'price_subscription' && <Shield className="h-8 w-8 text-white" />}
                    </div>
                    
                    <h3 className="text-title text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-body text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-body text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {plan.id === 'free' ? (
                      <button className="btn btn-secondary w-full">
                        {plan.cta}
                      </button>
                    ) : plan.id === 'price_subscription' ? (
                      <a
                        href="https://buy.stripe.com/cNicN47dw2qecJ5ewT4ow01"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn w-full bg-gradient-brand text-white hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                      >
                        {plan.cta}
                      </a>
                    ) : (
                      <a
                        href="https://buy.stripe.com/fZu00i69sc0O8sP1K74ow00"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                      >
                        {plan.cta}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-heading text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-title text-gray-900 mb-3">Is there a free trial?</h3>
                  <p className="text-body text-gray-600">Yes! You can create 1 CV per month completely free. No credit card required.</p>
                </div>
                
                <div>
                  <h3 className="text-title text-gray-900 mb-3">Can I cancel anytime?</h3>
                  <p className="text-body text-gray-600">Absolutely. Cancel your subscription anytime with no questions asked.</p>
                </div>
                
                <div>
                  <h3 className="text-title text-gray-900 mb-3">Do you offer refunds?</h3>
                  <p className="text-body text-gray-600">Yes, we offer 30-day money-back guarantee if you're not satisfied.</p>
                </div>
                
                <div>
                  <h3 className="text-title text-gray-900 mb-3">Is my data secure?</h3>
                  <p className="text-body text-gray-600">Yes, we use bank-level encryption and are fully GDPR compliant.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <h2 className="text-heading text-gray-900 mb-4">Ready to accelerate your career?</h2>
            <p className="text-body-lg text-gray-600 mb-8">Join thousands of professionals who've landed their dream jobs with our AI-powered tools.</p>
            
            <a
              href="https://buy.stripe.com/fZu00i69sc0O8sP1K74ow00"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Creating Professional CVs
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
