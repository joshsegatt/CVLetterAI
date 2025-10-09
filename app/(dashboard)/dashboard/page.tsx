import Link from 'next/link';
import { CheckoutButton } from '@/components/payments/CheckoutButton';
import { Button } from '@/components/ui/Button';

const quickActions = [
  {
    title: 'Create ATS CV',
    description: 'Launch guided CV builder tailored to the UK market.',
    href: '/cv-builder'
  },
  {
    title: 'Draft landlord letter',
    description: 'Generate Section 8 / 21, references, and formal notices.',
    href: '/letter-builder'
  },
  {
    title: 'Open AI advisor',
    description: 'Chat with our AI for job or tenancy guidance.',
    href: '/chat'
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="glass-panel border border-white/10 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
            <p className="text-sm text-neutral-300">
              Track your documentation pipeline and keep every export compliant.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/cv-builder">Create new CV</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {quickActions.map((action) => (
          <div key={action.title} className="glass-panel border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white">{action.title}</h3>
            <p className="mt-2 text-sm text-neutral-300">{action.description}</p>
            <Button asChild intent="secondary" size="sm" className="mt-4">
              <Link href={action.href}>Open</Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="glass-panel border border-white/10 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Usage analytics</h2>
            <p className="text-sm text-neutral-400">
              Coming soon – view conversion funnels, export counts, and AI interaction
              logs to optimise your team’s performance.
            </p>
          </div>
          <CheckoutButton
            planId="price_subscription"
            label="Upgrade to Pro"
            intent="primary"
            size="sm"
          />
        </div>
      </section>
    </div>
  );
}
