"use client";

import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import InteractiveCVBuilder from "../../components/builder/InteractiveCVBuilder";
import { sampleCVData } from "../../lib/sampleData";

export default function CVBuilderPage() {
  return (
    <PublicLayout
      title="Create Your Professional CV"
      description="Build your perfect CV with our interactive editor. Choose templates, customize content, and download in minutes!"
    >
      <div className="space-y-8">
        {/* Badge */}
        <div className="text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
            🎉 Construtor Profissional - Primeiro CV Grátis
          </span>
        </div>

        {/* Interactive Builder */}
        <InteractiveCVBuilder initialData={sampleCVData} />

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-semibold text-white mb-2">Templates Profissionais</h3>
            <p className="text-sm text-neutral-300">
              Designs modernos criados por especialistas em recrutamento
            </p>
          </div>
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-semibold text-white mb-2">Editor em Tempo Real</h3>
            <p className="text-sm text-neutral-300">
              Veja suas mudanças instantaneamente enquanto edita
            </p>
          </div>
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="font-semibold text-white mb-2">Download PDF Premium</h3>
            <p className="text-sm text-neutral-300">
              Qualidade profissional pronta para envio aos recrutadores
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}