'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const languages = [
  { code: 'en', label: 'English (UK)' },
  { code: 'pt', label: 'Português (Portugal)' },
  { code: 'es', label: 'Español (España)' },
  { code: 'pl', label: 'Polski' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ar', label: 'العربية (الإمارات)' }
];

export function SettingsShell() {
  const [language, setLanguage] = useState('en');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(false);

  return (
    <div className="space-y-6">
      <section className="glass-panel border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Billing & plan</h2>
        <p className="mt-2 text-sm text-neutral-300">
          Manage subscriptions and review invoices synced via Stripe Checkout.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-200">
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
            Pro £9.99/mo
          </span>
          <Button intent="ghost" size="sm">
            Update payment method
          </Button>
          <Button intent="secondary" size="sm">
            Download invoices
          </Button>
        </div>
      </section>

      <section className="glass-panel border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Localisation</h2>
        <p className="mt-2 text-sm text-neutral-300">
          Choose your default language. Auto-detect runs on first visit.
        </p>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
        >
          {languages.map((option) => (
            <option key={option.code} value={option.code} className="bg-surface-muted text-neutral-900">
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-neutral-400">
          Right-to-left layout activates automatically for Arabic.
        </p>
      </section>

      <section className="glass-panel border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Security</h2>
        <div className="mt-4 space-y-3 text-sm text-neutral-300">
          <label className="flex items-center justify-between">
            <span>MFA (paid tiers)</span>
            <input
              type="checkbox"
              checked={mfaEnabled}
              onChange={(event) => setMfaEnabled(event.target.checked)}
              className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-white/10 transition checked:bg-accent"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>IP anomaly alerts</span>
            <input
              type="checkbox"
              checked={anomalyAlerts}
              onChange={(event) => setAnomalyAlerts(event.target.checked)}
              className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-white/10 transition checked:bg-accent"
            />
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <Button intent="ghost" size="sm">
            Reset API keys
          </Button>
          <Button intent="ghost" size="sm">
            Review audit trail
          </Button>
        </div>
      </section>

      <section className="glass-panel border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">GDPR data</h2>
        <p className="mt-2 text-sm text-neutral-300">
          Export or erase user data with AES-256 encryption and full audit logging.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button intent="secondary" size="sm">
            Request export
          </Button>
          <Button intent="ghost" size="sm">
            Schedule deletion
          </Button>
        </div>
      </section>
    </div>
  );
}
