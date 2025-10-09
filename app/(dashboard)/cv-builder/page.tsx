import { Suspense } from 'react';
import { BuilderHero } from '@/features/cv-builder/components/BuilderHero';
import { CvBuilderShell } from '@/features/cv-builder/components/CvBuilderShell';

export default function CvBuilderPage() {
  return (
    <div className="space-y-8">
      <BuilderHero />
      <Suspense fallback={<div className="glass-panel p-6">Loading builder…</div>}>
        <CvBuilderShell />
      </Suspense>
    </div>
  );
}
