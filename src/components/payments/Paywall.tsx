/**
 * Simple Paywall Component for AI Chat Features
 * Shows when user needs to pay £5.99 to access chat
 */

import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PaywallProps {
  onPaymentClick: () => void;
  isLoading?: boolean;
}

export function Paywall({ onPaymentClick, isLoading = false }: PaywallProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* Título */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Unlock AI-Powered Features
        </h3>

        {/* Descrição */}
        <p className="text-gray-600 mb-6">
          Get access to our AI chat assistant that helps you create professional CVs and cover letters. 
          One-time payment unlocks all features forever.
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">AI Chat Assistant for CV improvement</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">Cover Letter AI Generator</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">Professional PDF Downloads</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">Unlimited saves and exports</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-2">£5.99</div>
          <div className="text-sm text-gray-500 mb-4">One-time payment • No subscription</div>
          
          <button
            onClick={onPaymentClick}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Unlock All Features'
            )}
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 text-xs text-gray-500">
          <p>🔒 Secure payment powered by Stripe</p>
          <p>✅ No recurring charges • Instant access</p>
        </div>
      </div>
    </div>
  );
}

export default Paywall;