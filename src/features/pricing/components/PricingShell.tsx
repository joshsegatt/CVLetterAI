'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CheckoutButton } from '@/components/payments/CheckoutButton';
import { Button } from '@/components/ui/Button';
import type { PricingPlanId } from '@/services/payments/stripe';

interface LinkCTA {
  type: 'link';
  label: string;
  href: string;
}

interface CheckoutCTA {
  type: 'checkout';
  label: string;
  planId: PricingPlanId;
}

type PlanCTA = LinkCTA | CheckoutCTA;

interface Plan {
  name: string;
  price: string;
  description: string;
  highlights: string[];
  featured?: boolean;
  cta: PlanCTA;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '£0',
    description: 'One CV, letter, and chat session to experience the workflow.',
    highlights: ['Single export per feature', 'Generative suggestions', 'Email support'],
    cta: { type: 'link', label: 'Start free', href: '/sign-up' }
  },
  {
    name: 'Pro',
    price: '£5.99',
    description: '48 hours of unlimited CV and letter generation for urgent needs.',
    highlights: [
      'Unlimited CV drafts for 48h',
      'Multiple landlord letter formats',
      'Priority response times'
    ],
    featured: true,
    cta: { type: 'checkout', label: 'Unlock 48h pass', planId: 'price_one_time' }
  },
  {
    name: 'Enterprise',
    price: '£9.99',
    description: 'Unlimited workflows with live AI guidance and admin controls.',
    highlights: ['Unlimited CV + letters', 'AI advisory chat', 'Multi-language exports'],
    cta: { type: 'checkout', label: 'Subscribe now', planId: 'price_subscription' }
  }
];

interface PricingShellProps {
  banner?: {
    tone: 'success' | 'warning';
    message: string;
  } | null;
}

export function PricingShell({ banner }: PricingShellProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
      {banner ? (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-2xl border px-4 py-3 text-sm ${
            banner.tone === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-200'
          }`}
        >
          {banner.message}
        </div>
      ) : null}
      <header className="space-y-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-wide text-neutral-300">
          Multilingual · GDPR aligned · Stripe secured
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Choose the plan that matches your documentation workload.
        </h1>
        <p className="text-lg text-neutral-300">
          Upgrade instantly with Stripe Checkout. Cancel or switch plans whenever you need.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-panel flex h-full flex-col justify-between gap-6 p-6 ${
              plan.featured ? 'border-white/30 ring-2 ring-accent/60' : ''
            }`}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-neutral-400">{plan.name}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{plan.price}</p>
              </div>
              <p className="text-sm leading-relaxed text-neutral-300">{plan.description}</p>
              <ul className="space-y-2 text-sm text-neutral-200">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {plan.cta.type === 'checkout' ? (
              <CheckoutButton
                planId={plan.cta.planId}
                label={plan.cta.label}
                intent={plan.featured ? 'primary' : 'secondary'}
              />
            ) : (
              <Button asChild intent={plan.featured ? 'primary' : 'secondary'}>
                <Link href={plan.cta.href}>{plan.cta.label}</Link>
              </Button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
