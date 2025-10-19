"use client";

import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import InteractiveLetterBuilder from "../../components/builder/InteractiveLetterBuilder";
import { sampleLetterData } from "../../lib/sampleData";

export default function LetterBuilderPage() {
  return (
    <PublicLayout
      title="Create Your Professional Letter"
      description="Build your perfect letter with our interactive editor. Choose templates, customize content, and download in minutes!"
    >
      <div className="space-y-8">
        {/* Badge */}
        <div className="text-center">
          <span className="inline-block bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
            📄 Editor Profissional - Primeira Carta Grátis
          </span>
        </div>

        {/* Interactive Builder */}
        <InteractiveLetterBuilder initialData={sampleLetterData} />

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <div className="glass-panel border-white/10 p-6 text-center">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="font-semibold text-white mb-2">Templates Profissionais</h3>
            <p className="text-sm text-neutral-300">
              Formatos modernos para correspondência comercial e formal
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
            <div className="text-3xl mb-4">🏢</div>
            <h3 className="font-semibold text-white mb-2">Padrão Corporativo</h3>
            <p className="text-sm text-neutral-300">
              Cartas com formatação profissional aceita em empresas
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}