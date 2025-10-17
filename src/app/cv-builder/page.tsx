"use client";

import React, { useState } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import ModernCVTemplate from "../../components/builder/cv-templates/ModernCVTemplate";
import { sampleCVData } from "../../lib/sampleData";
import { CVTemplate } from "../../types/builder";

const templates: { id: CVTemplate; name: string; description: string }[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and business roles'
  },
  {
    id: 'elegant',
    name: 'Elegant Classic',
    description: 'Sophisticated layout ideal for senior positions and consulting'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and focused design that highlights your experience'
  }
];

export default function CVBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('modern');

  return (
    <PublicLayout
      title="Create Your Professional CV"
      description="Choose a template and create your CV in minutes. First CV is free with signup!"
    >
      <div className="space-y-12">
        {/* Free Badge */}
        <div className="text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
            🎉 First CV Free - No Credit Card Required
          </span>
        </div>

        {/* Template Selection */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white text-center">Choose Your Template</h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`glass-panel border p-4 text-left transition-all hover:scale-105 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-sm text-neutral-300">{template.description}</p>
                {selectedTemplate === template.id && (
                  <div className="mt-2 inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    ✓ Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white text-center">Live Preview</h2>
          
          <div className="glass-panel border-white/10 p-6">
            <div className="transform scale-75 origin-top w-full overflow-hidden">
              <ModernCVTemplate 
                data={sampleCVData}
                config={{ template: selectedTemplate }}
                preview={true}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="glass-panel border-white/10 p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Ready to Create Your CV?
          </h3>
          <p className="text-neutral-300 mb-6">
            Start with our sample data and customize it with your information.
            Your first CV is completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              onClick={() => {
                // TODO: Start CV building process
                alert('CV Builder coming soon! This will open the full editor.');
              }}
            >
              Start Building CV
            </button>
            <a
              href="/sign-up"
              className="border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Sign Up for Free Account
            </a>
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