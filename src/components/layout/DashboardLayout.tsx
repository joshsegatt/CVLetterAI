import Link from 'next/link';
import { DashboardNav } from '@/components/navigation/DashboardNav';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-surface-muted text-neutral-100 md:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 bg-surface-muted/70 px-6 py-8 md:flex md:flex-col md:gap-8">
        <Logo />
        <DashboardNav />
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
          <p className="font-semibold text-white">Need docs?</p>
          <p className="mt-2">
            Explore our tenant, landlord, and hiring templates to customise your flows.
          </p>
          <Button asChild intent="ghost" size="sm" className="mt-4">
            <Link href="/docs">View docs</Link>
          </Button>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-surface-highlight/70 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-accent/40 bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              Live
            </div>
            <p className="text-sm text-neutral-400">eu-west · TLS 1.3 · GDPR compliant</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild intent="secondary" size="sm">
              <Link href="/settings">Account</Link>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-8 bg-surface-muted px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
