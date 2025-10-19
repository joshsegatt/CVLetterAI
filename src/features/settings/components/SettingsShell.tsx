'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

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
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">Billing & plan</h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage subscriptions and review invoices synced via Stripe Checkout.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-purple-700 font-medium">
            Pro £9.99/mo
          </span>
          <Button intent="ghost" size="sm" className="border border-gray-300 text-gray-700 hover:bg-gray-100">
            Update payment method
          </Button>
          <Button intent="secondary" size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            Download invoices
          </Button>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose your default language. Auto-detect runs on first visit.
        </p>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        >
          {languages.map((option) => (
            <option key={option.code} value={option.code} className="bg-white text-gray-900">
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-500">
          Right-to-left layout activates automatically for Arabic.
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <label className="flex items-center justify-between">
            <span>MFA (paid tiers)</span>
            <input
              type="checkbox"
              checked={mfaEnabled}
              onChange={(event) => setMfaEnabled(event.target.checked)}
              className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-gray-200 transition checked:bg-purple-600 relative before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-4"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>IP anomaly alerts</span>
            <input
              type="checkbox"
              checked={anomalyAlerts}
              onChange={(event) => setAnomalyAlerts(event.target.checked)}
              className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-gray-200 transition checked:bg-purple-600 relative before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-4"
            />
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <Button intent="ghost" size="sm" className="border border-gray-300 text-gray-700 hover:bg-gray-100">
            Reset API keys
          </Button>
          <Button intent="ghost" size="sm" className="border border-gray-300 text-gray-700 hover:bg-gray-100">
            Review audit trail
          </Button>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">GDPR data</h2>
        <p className="mt-2 text-sm text-gray-600">
          Export or erase user data with AES-256 encryption and full audit logging.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button intent="secondary" size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            Request export
          </Button>
          <Button intent="ghost" size="sm" className="border border-gray-300 text-gray-700 hover:bg-gray-100">
            Schedule deletion
          </Button>
        </div>
      </section>
    </div>
  );
}
