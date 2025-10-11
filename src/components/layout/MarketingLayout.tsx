import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const primaryLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cv-builder', label: 'CV Builder' },
  { href: '/letter-builder', label: 'Letter Builder' },
  { href: '/chat', label: 'Chat' },
  { href: '/settings', label: 'Settings' }
] as const;

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.45),transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.35),transparent_60%)]">
      <div className="absolute inset-0 -z-10 bg-gradient-mesh blur-3xl opacity-50" aria-hidden />
      <div className="mx-auto flex min-h-screen max-w-[120rem] flex-col px-4 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 py-8 md:flex-nowrap">
          <Link
            href="/"
            aria-label="CVLetterAI home"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-lg backdrop-blur-md transition"
          >
            <span
              className="bg-gradient-to-r from-[#60A5FA] via-[#38BDF8] to-[#C084FC] bg-[length:200%_200%] bg-clip-text text-xl font-bold tracking-[0.35em] text-transparent transition-[background-position] duration-500 ease-in-out group-hover:bg-right"
              style={{ textShadow: '0 0 10px rgba(56,189,248,0.4)' }}
            >
              CV
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-medium tracking-tight text-[#F8FAFC] transition-colors duration-500 ease-in-out group-hover:text-white">
                LetterAI
              </span>
              <span className="text-[0.55rem] font-semibold uppercase tracking-[0.4em] text-white/60">
                Precision Documents
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 text-sm font-medium text-neutral-200 md:flex"
          >
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            <Button asChild intent="secondary" size="sm">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
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

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 md:hidden">
        <Button asChild intent="secondary" size="lg">
          <Link href="/signin">Sign in</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
