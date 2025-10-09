import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function BuilderHero() {
  return (
    <section className="glass-panel border border-white/10 bg-gradient-to-br from-brand/15 via-surface-highlight/40 to-accent/10 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold text-white">CV Builder wizard</h1>
          <p className="text-sm text-neutral-300">
            Guided steps, real-time preview, and export-ready templates built to pass UK
            applicant tracking systems.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild intent="secondary" size="sm">
            <Link href="/docs/cv-templates">View template gallery</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/support/onboarding">
              Onboarding guide <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
