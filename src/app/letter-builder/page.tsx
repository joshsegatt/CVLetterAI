"use client";

import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import InteractiveLetterBuilder from "@/components/builder/InteractiveLetterBuilder";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { Badge } from "@/components/ui/Badge";
import { sampleLetterData } from "@/lib/sampleData";
import { Edit3, FileText, Eye, Download, Sparkles, Zap, Shield } from "lucide-react";

export default function LetterBuilderPage() {
  return (
    <PublicLayout
      title=""
      description=""
    >
      <div className="min-h-screen bg-white -mt-8">
        {/* Premium Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
          <div className="relative container-lg text-center">
            <Badge className="mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Professional Letter Builder
            </Badge>
            
            <h2 className="text-display font-bold text-gray-900 mb-6 leading-tight">
              Create <span className="text-gradient bg-gradient-to-r from-purple-600 to-blue-600">Professional Letters</span>
              <br />in Minutes
            </h2>
            
            <p className="text-heading text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Build elegant, professional letters with our guided editor. 
              Choose from premium templates and get real-time preview.
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <FeatureCard
                icon={Edit3}
                title="Smart Editor"
                description="Guided interface that helps you craft the perfect letter"
              />
              <FeatureCard
                icon={Eye}
                title="Live Preview"
                description="See your letter as you write with real-time formatting"
              />
              <FeatureCard
                icon={Download}
                title="PDF Export"
                description="Download professional PDF ready for printing or sending"
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Professional Templates</span>
              </div>
            </div>
          </div>
        </section>

        {/* Letter Builder Component */}
        <section>
          <InteractiveLetterBuilder initialData={sampleLetterData} />
        </section>
      </div>
    </PublicLayout>
  );
}