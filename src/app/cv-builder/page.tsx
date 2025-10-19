"use client";

import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import EnhancedCVBuilder from "../../components/builder/EnhancedCVBuilder";
import { Sparkles, Award, Zap, FileText } from "lucide-react";

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
              Professional CV Builder - LinkedIn Level Quality
            </span>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-display text-gray-900 mb-4">
              Build your professional CV in
              <span className="text-gradient block">5 simple steps</span>
            </h2>
            <p className="text-body-lg text-gray-600">
              Build ATS-optimized CVs with our intelligent design system. Real-time preview, 
              premium templates, and professional guidance every step of the way.
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
                Why choose our CV Builder?
              </h2>
              <p className="text-body text-gray-600">
                Professional tools designed for career success
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
                <span>✓ ATS-optimized</span>
                <span>•</span>
                <span>✓ Professional templates</span>
                <span>•</span>
                <span>✓ Real-time preview</span>
                <span>•</span>
                <span>✓ Instant download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}