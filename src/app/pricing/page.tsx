import Link from 'next/link';
import { CheckoutButton } from '../../components/payments/CheckoutButton';
import { Button } from '../../components/ui/Button';

const plans = [
  {
    id: 'price_one_time' as const,
    title: 'One-Time Access',
    price: '£5.99',
    description: '48 hours of unlimited CV and letter generation for urgent needs.',
    highlights: [
      'Unlimited CV drafts for 48h',
      'Multiple landlord letter formats',
      'Priority response times'
    ]
  },
  {
    id: 'price_subscription' as const,
    title: 'Pro Subscription',
    price: '£9.99',
    description: 'Unlimited workflows with live AI guidance and admin controls.',
    highlights: ['Unlimited CV + letters', 'AI advisory chat', 'Multi-language exports']
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1F] px-6 py-20 text-slate-100 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-200/80">
            Pricing
          </span>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Choose the plan that matches your workload
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            Switch or cancel anytime. Designed for UK professionals who need compliant CVs and
            tenant documentation on demand.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-[0_30px_60px_-40px_rgba(56,189,248,0.45)] backdrop-blur-xl"
            >
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">{plan.title}</h2>
                  <p className="text-3xl font-bold text-sky-200">{plan.price}</p>
                </div>
                <p className="text-sm text-slate-300">{plan.description}</p>
                <ul className="space-y-2 text-sm text-slate-200">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <CheckoutButton
                  planId={plan.id}
                  label={plan.id === 'price_one_time' ? 'Unlock 48h pass' : 'Subscribe now'}
                  intent={plan.id === 'price_subscription' ? 'primary' : 'secondary'}
                />
              </div>
            </div>
          ))}
        </div>

        <footer className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#111c3c] via-[#14214a] to-[#0f1632] px-10 py-12 text-center shadow-[0_30px_60px_-42px_rgba(59,130,246,0.55)]">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Need enterprise features or compliance reviews?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Our team can tailor AI workflows to match your HR or property processes. Contact us for
            bespoke onboarding, managed compliance, and API integrations.
          </p>
          <Button asChild intent="ghost" size="lg" className="mt-6">
            <Link href="/contact">Talk to sales</Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}
