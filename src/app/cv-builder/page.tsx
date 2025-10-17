import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import CvTemplateBrowser from "../../components/builder/CvTemplateBrowser";
import ModernCV from "../../components/builder/cv-templates/ModernCV";
import ElegantCV from "../../components/builder/cv-templates/ElegantCV";
import MinimalCV from "../../components/builder/cv-templates/MinimalCV";
import CreativeCV from "../../components/builder/cv-templates/CreativeCV";
import ExecutiveCV from "../../components/builder/cv-templates/ExecutiveCV";

export default function CVBuilderPage() {
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

        <CvTemplateBrowser />
        
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Choose Your Template</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ModernCV />
            <ElegantCV />
            <MinimalCV />
            <CreativeCV />
            <ExecutiveCV />
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-panel border-white/10 p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Ready to Create Your CV?
          </h3>
          <p className="text-neutral-300 mb-6">
            Select a template above to start building your professional CV. 
            Your first creation is completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Building CV
            </button>
            <a
              href="/sign-up"
              className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Sign Up for Free Account
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}