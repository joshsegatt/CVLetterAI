import { Suspense } from 'react';
import { LetterBuilderShell } from '@/features/letter-builder/components/LetterBuilderShell';

export default function LetterBuilderPage() {
  return (
    <div className="space-y-8">
      <header className="glass-panel border border-white/10 p-6">
        <h1 className="text-2xl font-semibold text-white">Landlord letter generator</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Choose tone presets, customise content, and export compliance-ready landlord
          communications with audit trails.
        </p>
      </header>
      <Suspense fallback={<div className="glass-panel p-6">Loading letter builder…</div>}>
        <LetterBuilderShell />
      </Suspense>
    </div>
  );
}
