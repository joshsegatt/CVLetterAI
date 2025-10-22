"use client";

import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import EnhancedCVBuilder from "../../components/builder/EnhancedCVBuilder";
import SimpleCheckoutButton from "../../components/payments/SimpleCheckoutButton";
import { Badge } from "../../components/ui/Badge";
import { Edit3, FileText, Eye, Download, Sparkles, Zap, Shield, Save, Award } from "lucide-react";

export default function CVBuilderPage() {
  return (
    <PublicLayout
      title=""
      description=""
    >
      <div className="space-y-12 -mt-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Auto-Save Enabled • No Login Required
            </span>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-display text-gray-900 mb-4">
              Build your professional CV in
              <span className="text-gradient block">5 simple steps</span>
            </h2>
            <p className="text-body-lg text-gray-600">
              Create professional CVs instantly with auto-save to your browser. 
              No account required - just start building and your progress is automatically saved.
            </p>
          </div>
        </div>

        {/* Enhanced Builder */}
        <EnhancedCVBuilder />

        {/* Features Grid */}
        <div className="section bg-gradient-subtle">
          <div className="container-md">
            <div className="text-center space-subsection">
              <h2 className="text-heading text-gray-900 mb-4">
                Free CV Builder with Premium Upgrades
              </h2>
              <p className="text-body text-gray-600">
                Start for free, upgrade for £5.99 to unlock downloads and AI features
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="card interactive">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-title text-gray-900 mb-3">LinkedIn-Level Templates</h3>
                  <p className="text-body text-gray-600">
                    Professional designs crafted by recruitment experts with 18 color schemes
                  </p>
                </div>
              </div>
              
              <div className="card interactive">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-title text-gray-900 mb-3">Real-Time Preview</h3>
                  <p className="text-body text-gray-600">
                    See your changes instantly with live template switching and customization
                  </p>
                </div>
              </div>
              
              <div className="card interactive">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-title text-gray-900 mb-3">Premium PDF Export</h3>
                  <p className="text-body text-gray-600">
                    High-quality professional output ready for corporate recruiters
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-6 text-small text-gray-500">
                <span>✓ Auto-save enabled</span>
                <span>•</span>
                <span>✓ No login required</span>
                <span>•</span>
                <span>✓ £5.99 unlocks all features</span>
                <span>•</span>
                <span>✓ One-time payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
        <div className="section bg-gray-50">
          <div className="container-md text-center">
            <h2 className="text-heading text-gray-900 mb-4">
              Ready to Download Your Professional CV?
            </h2>
            <p className="text-body text-gray-600 mb-8">
              Unlock PDF downloads, AI chat assistant, and premium features with our one-time payment.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <div className="text-3xl font-bold text-blue-600 mb-2">£5.99</div>
              <div className="text-sm text-gray-500 mb-6">One-time payment • No subscription • Lifetime access</div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">PDF Downloads</span>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">AI Chat Assistant</span>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Premium Templates</span>
                </div>
              </div>
              
              <SimpleCheckoutButton className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Unlock All Features - £5.99
              </SimpleCheckoutButton>
              
              <p className="text-xs text-gray-500 mt-4">
                🔒 Secure payment via Stripe • ✅ Instant access • 🚫 No recurring charges
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}