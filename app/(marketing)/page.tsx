import { ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';
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

const features = [
  {
    title: 'ATS-optimised CV builder',
    description:
      'Guided, multilingual workflow with compliance guardrails to match UK hiring standards and tenancy requirements.',
    icon: Sparkles
  },
  {
    title: 'Landlord letters with legal tone',
    description:
      'Generate tailored letters for references, notices, and tenancy updates — reviewable by legal templates.',
    icon: ShieldCheck
  },
  {
    title: 'AI advisory copilot',
    description:
      'Ask nuanced questions about jobs or tenancy obligations and receive referenced, trackable responses.',
    icon: Users
  }
];

const plans: Plan[] = [
  {
    name: 'Free',
    price: '£0',
    description: 'One CV, letter, and chat session to experience the workflow.',
    highlights: ['Single export per feature', 'Generative suggestions', 'Email support'],
    cta: { type: 'link', label: 'Start free', href: '/signup' }
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

const testimonials = [
  {
    quote:
      'My CV went from generic to landing interviews within a week. The AI coach highlighted UK strengths I had overlooked.',
    author: 'Anika Sharma',
    role: 'Product Manager, London'
  },
  {
    quote:
      'Drafted a compliant Section 21 notice in minutes. Having tone presets prevented common landlord mistakes.',
    author: 'James Connor',
    role: 'Property Manager, Manchester'
  }
];

interface MarketingPageProps {
  searchParams?: {
    purchase?: string;
  };
}

export default function MarketingPage({ searchParams }: MarketingPageProps) {
  const purchaseState = searchParams?.purchase ?? '';
  const banner =
    purchaseState === 'success'
      ? {
          tone: 'success',
          message: 'Payment confirmed. Your upgraded features are now active.'
        }
      : purchaseState === 'cancelled'
        ? {
            tone: 'warning',
            message: 'Checkout cancelled. You can resume your purchase at any time.'
          }
        : null;

  return (
    <div className="space-y-28 pb-24">
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
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-glass-panel px-8 py-20 shadow-card lg:px-20">
        <div className="absolute -left-12 top-12 h-48 w-48 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-wide text-neutral-300">
            Multilingual · GDPR aligned · Stripe secured
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            AI-crafted CVs & landlord letters tailored for UK compliance.
          </h1>
          <p className="mt-6 text-lg text-neutral-300 sm:text-xl">
            CVLetterAI combines trusted templates, multilingual exports, and an advisory
            copilot to keep your employment and tenancy documents audit-ready.
          </p>
          <div className="mt-10 h-6" />
        </div>
      </section>

      <section id="features" className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass-panel flex h-full flex-col gap-4 border-white/10 p-6"
          >
            <feature.icon className="h-8 w-8 text-accent" aria-hidden />
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-neutral-300">{feature.description}</p>
          </div>
        ))}
      </section>

      <section id="pricing" className="space-y-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-white">Flexible plans</h2>
          <p className="mt-3 text-neutral-300">
            Align pricing with your hiring or tenancy workload. Switch or cancel any time,
            VAT ready for UK & EU customers.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-panel flex h-full flex-col justify-between gap-6 p-6 ${
                plan.featured ? 'border-white/30 ring-2 ring-accent/60' : ''
              }`}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-neutral-400">
                    {plan.name}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">{plan.price}</p>
                </div>
                <p className="text-sm leading-relaxed text-neutral-300">
                  {plan.description}
                </p>
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
        </div>
      </section>

      <section id="testimonials" className="space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-white">Trusted outcomes</h2>
          <p className="mt-3 text-neutral-300">
            From global talent to local property managers, CVLetterAI supports faster
            approvals with consistent documentation.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.author}
              className="glass-panel border-white/10 p-6 text-neutral-200"
            >
              <p className="text-lg leading-relaxed text-white">“{testimonial.quote}”</p>
              <footer className="mt-5 text-sm">
                <span className="font-semibold text-white">{testimonial.author}</span>{' '}
                <span className="text-neutral-400">— {testimonial.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section
        id="security"
        className="glass-panel flex flex-col gap-6 border border-white/10 p-8 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="text-2xl font-semibold text-white">Security-first SaaS</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            Neon Postgres row-level security, Stripe verified payments, and full audit trails
            ensure GDPR & ISO-aligned operations. Export or delete your data at any time.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/security">View compliance dossier</Link>
        </Button>
      </section>
    </div>
  );
}
