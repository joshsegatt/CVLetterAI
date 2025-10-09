import { Suspense } from 'react';
import { SettingsShell } from '@/features/settings/components/SettingsShell';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="glass-panel border border-white/10 p-6">
        <h1 className="text-2xl font-semibold text-white">Account & privacy settings</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Manage subscriptions, export GDPR data, configure MFA, and tailor language
          preferences across your workspace.
        </p>
      </header>
      <Suspense fallback={<div className="glass-panel p-6">Loading preferences…</div>}>
        <SettingsShell />
      </Suspense>
    </div>
  );
}
