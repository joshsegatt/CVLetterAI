import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import LetterTemplateBrowser from "../../components/builder/LetterTemplateBrowser";
import FormalLetter from "../../components/builder/Letter-templates/FormalLetter";
import PoliteLetter from "../../components/builder/Letter-templates/PoliteLetter";
import FirmLetter from "../../components/builder/Letter-templates/FirmLetter";
import LegalNoticeLetter from "../../components/builder/Letter-templates/LegalNoticeLetter";

export default function LetterBuilderPage() {
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

        <LetterTemplateBrowser />
        
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Select Letter Type</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormalLetter />
            <PoliteLetter />
            <FirmLetter />
            <LegalNoticeLetter />
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-3 text-center">
          <div className="glass-panel border-white/10 p-4">
            <h4 className="font-semibold text-white mb-2">Legal Compliance</h4>
            <p className="text-sm text-neutral-300">Templates reviewed by legal professionals</p>
          </div>
          <div className="glass-panel border-white/10 p-4">
            <h4 className="font-semibold text-white mb-2">Multiple Formats</h4>
            <p className="text-sm text-neutral-300">Formal, polite, firm, and legal notice styles</p>
          </div>
          <div className="glass-panel border-white/10 p-4">
            <h4 className="font-semibold text-white mb-2">Instant Download</h4>
            <p className="text-sm text-neutral-300">PDF and Word formats ready immediately</p>
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
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Writing Letter
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