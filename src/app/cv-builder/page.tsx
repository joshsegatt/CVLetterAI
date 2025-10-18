"use client";

import React, { useState } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import MinimalModernCVTemplate from "../../components/builder/cv-templates/MinimalModernCVTemplate";
import CleanProfessionalCVTemplate from "../../components/builder/cv-templates/CleanProfessionalCVTemplate";
import MinimalistEliteCVTemplate from "../../components/builder/cv-templates/MinimalistEliteCVTemplate";
import PDFDownloadButton from "../../components/shared/PDFDownloadButton";
import { sampleCVData } from "../../lib/sampleData";
import { CVTemplate } from "../../types/builder";

const templates: { id: CVTemplate; name: string; description: string }[] = [
  {
    id: 'modern',
    name: 'Minimal Modern',
    description: 'Clean, contemporary design with perfect spacing and refined typography'
  },
  {
    id: 'elegant',
    name: 'Clean Professional',
    description: 'Two-column layout with sidebar and professional color accents'
  },
  {
    id: 'executive',
    name: 'Minimalist Elite',
    description: 'Ultra-clean centered design for senior professionals and executives'
  }
];

export default function CVBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('modern');

  const renderTemplate = () => {
    const props = {
      data: sampleCVData,
      config: { template: selectedTemplate },
      preview: true
    };

    switch (selectedTemplate) {
      case 'elegant':
        return <CleanProfessionalCVTemplate {...props} />;
      case 'executive':
        return <MinimalistEliteCVTemplate {...props} />;
      default:
        return <MinimalModernCVTemplate {...props} />;
    }
  };

  return (
    <PublicLayout
      title="Create Your Professional CV"
      description="Choose a template and create your CV in minutes. First CV is free with signup!"
    >
      <div className="space-y-8">
        {/* Free Badge */}
        <div className="text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
            🎉 First CV Free - No Credit Card Required
          </span>
        </div>

        {/* Main Layout - Side by Side */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Side - Template Selection */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-white">Choose Your Template</h2>
            
            <div className="space-y-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`glass-panel border p-4 text-left transition-all hover:scale-105 w-full ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-2 text-base">{template.name}</h3>
                  <p className="text-sm text-neutral-300">{template.description}</p>
                  {selectedTemplate === template.id && (
                    <div className="mt-2 inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      ✓ Selected
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="glass-panel border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Ready to Build Your CV?
              </h3>
              <p className="text-neutral-300 mb-4 text-sm">
                This is just a preview! After signing up, you'll access our complete CV builder with:
              </p>
              <ul className="text-xs text-neutral-400 mb-4 space-y-1">
                <li>• Real-time editing and customization</li>
                <li>• Your personal information input</li>
                <li>• Multiple export formats (PDF, Word)</li>
                <li>• AI-powered content suggestions</li>
              </ul>
              <div className="space-y-3">
                <a
                  href="/sign-up"
                  className="w-full block text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  🚀 Create Account & Start Building
                </a>
                
                <a
                  href="/sign-in"
                  className="w-full block text-center border border-white/30 bg-white/5 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-sm"
                >
                  📝 Already have an account? Sign In
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xl font-semibold text-white">Live Preview</h2>
            
            <div className="glass-panel border-white/10 p-3">
              <div 
                id="cv-preview" 
                className="bg-white rounded-lg shadow-2xl mx-auto overflow-hidden"
                style={{ 
                  width: '100%', 
                  maxWidth: '380px',
                  aspectRatio: '210/297', // A4 proportion 
                  transform: 'scale(0.75)',
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
                targetId="cv-preview"
                filename={`${sampleCVData.personal.firstName}_${sampleCVData.personal.lastName}_CV.pdf`}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 text-sm font-semibold"
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
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-semibold text-white mb-2">Professional Templates</h3>
            <p className="text-sm text-neutral-300">Choose from multiple professionally designed templates</p>
          </div>
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-semibold text-white mb-2">Real-time Preview</h3>
            <p className="text-sm text-neutral-300">See your changes instantly as you type</p>
          </div>
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="font-semibold text-white mb-2">Export to PDF/Word</h3>
            <p className="text-sm text-neutral-300">Download in multiple formats for any application</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}