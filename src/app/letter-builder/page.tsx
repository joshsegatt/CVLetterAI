"use client";

import React, { useState } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import MinimalModernLetterTemplate from "../../components/builder/Letter-templates/MinimalModernLetterTemplate";
import CleanBusinessLetterTemplate from "../../components/builder/Letter-templates/CleanBusinessLetterTemplate";
import ElegantLetterTemplate from "../../components/builder/Letter-templates/ElegantLetterTemplate";
import PDFDownloadButton from "../../components/shared/PDFDownloadButton";
import { sampleLetterData } from "../../lib/sampleData";
import { LetterTemplate } from "../../types/builder";

const templates: { id: LetterTemplate; name: string; description: string }[] = [
  {
    id: 'formal',
    name: 'Minimal Modern',
    description: 'Clean, contemporary letter design with perfect typography and spacing'
  },
  {
    id: 'polite',
    name: 'Clean Business',
    description: 'Professional business letter with elegant header and structured layout'
  },
  {
    id: 'firm',
    name: 'Executive Elite',
    description: 'Premium letter template for high-level business correspondence'
  }
];

export default function LetterBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate>('formal');

  const renderTemplate = () => {
    const props = {
      data: sampleLetterData,
      config: { template: selectedTemplate, tone: 'formal' as const, letterhead: true },
      preview: true
    };

    switch (selectedTemplate) {
      case 'polite':
        return <CleanBusinessLetterTemplate {...props} />;
      case 'firm':
        return <ElegantLetterTemplate {...props} />;
      default:
        return <MinimalModernLetterTemplate {...props} />;
    }
  };

  return (
    <PublicLayout
      title="Create Professional Letters"
      description="Generate landlord letters, references, and notices with legal-compliant templates. First letter free!"
    >
      <div className="space-y-8">
        {/* Free Badge */}
        <div className="text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
            🏠 First Letter Free - Legal Templates Included
          </span>
        </div>

        {/* Main Layout - Side by Side */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Side - Template Selection */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-white">Choose Your Letter Template</h2>
            
            <div className="space-y-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`glass-panel border p-4 text-left transition-all hover:scale-105 w-full ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-2 text-base">{template.name}</h3>
                  <p className="text-sm text-neutral-300">{template.description}</p>
                  {selectedTemplate === template.id && (
                    <div className="mt-2 inline-block bg-purple-500 text-white px-2 py-1 rounded text-xs">
                      ✓ Selected
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="glass-panel border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Ready to Write Your Letter?
              </h3>
              <p className="text-neutral-300 mb-4 text-sm">
                This is just a preview! After signing up, you'll access our complete letter builder with:
              </p>
              <ul className="text-xs text-neutral-400 mb-4 space-y-1">
                <li>• Custom content editing and personalization</li>
                <li>• Legal-compliant templates library</li>
                <li>• AI-powered tone and wording suggestions</li>
                <li>• Professional letterhead options</li>
              </ul>
              <div className="space-y-3">
                <a
                  href="/sign-up"
                  className="w-full block text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  📝 Create Account & Start Writing
                </a>
                
                <a
                  href="/sign-in"
                  className="w-full block text-center border border-white/30 bg-white/5 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-sm"
                >
                  📄 Already have an account? Sign In
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xl font-semibold text-white">Live Preview</h2>
            
            <div className="glass-panel border-white/10 p-6">
              <div 
                id="letter-preview" 
                className="bg-white rounded-lg shadow-2xl mx-auto overflow-hidden"
                style={{ 
                  width: '100%', 
                  maxWidth: '600px',
                  aspectRatio: '210/297', // A4 proportion 
                  transform: 'scale(0.95)',
                  transformOrigin: 'top center'
                }}
              >
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  {renderTemplate()}
                </div>
              </div>
            </div>
            
            {/* Download PDF Button - Below Preview */}
            <div className="flex justify-center">
              <PDFDownloadButton
                targetId="letter-preview"
                filename={`${sampleLetterData.senderInfo.name.replace(' ', '_')}_Letter.pdf`}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  <span>Download PDF</span>
                </div>
              </PDFDownloadButton>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">⚖️</div>
            <h4 className="font-semibold text-white mb-2">Professional Templates</h4>
            <p className="text-sm text-neutral-300">Business-grade letter templates for all occasions</p>
          </div>
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">🎨</div>
            <h4 className="font-semibold text-white mb-2">Luxury Design</h4>
            <p className="text-sm text-neutral-300">Elegant typography and premium styling elements</p>
          </div>
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">📄</div>
            <h4 className="font-semibold text-white mb-2">Instant PDF Export</h4>
            <p className="text-sm text-neutral-300">High-quality PDF downloads with perfect formatting</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-panel border-white/10 p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Ready to Write Your Letter?
          </h3>
          <p className="text-neutral-300 mb-6">
            Choose a template above to start creating your professional letter. 
            Perfect for landlords, tenants, and property managers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => {
                alert('✨ Premium Letter Editor coming soon! This will open the full luxury editor with AI-powered content suggestions.');
              }}
            >
              📝 Start Writing Luxury Letter
            </button>
            
            <PDFDownloadButton
              targetId="letter-preview"
              filename={`${sampleLetterData.senderInfo.name.replace(' ', '_')}_Letter_Preview.pdf`}
              className="border-2 border-pink-500 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                <span>Download Preview PDF</span>
              </div>
            </PDFDownloadButton>
            
            <a
              href="/sign-up"
              className="border border-white/30 bg-white/5 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              📄 Create Free Account
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}