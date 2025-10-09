import Link from 'next/link';
import { marketingNav } from '@/lib/navigation';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.45),transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.35),transparent_60%)]">
      <div className="absolute inset-0 -z-10 bg-gradient-mesh blur-3xl opacity-50" aria-hidden />
      <div className="mx-auto flex min-h-screen max-w-[120rem] flex-col px-4 sm:px-8">
        <header className="flex items-center justify-between py-8">
          <Logo withTagline />
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {marketingNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-neutral-300 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild intent="secondary" size="sm">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 py-10">
          <div className="flex flex-col gap-6 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} CVLetterAI Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/gdpr" className="transition hover:text-white">
                GDPR
              </Link>
            </div>
          </div>
        </footer>
      </div>
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button asChild size="lg">
          <Link href="/signup">Start free</Link>
        </Button>
      </div>
    </div>
  );
}
