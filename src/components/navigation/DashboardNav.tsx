'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardNav } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="flex flex-col gap-1">
      {dashboardNav.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white/10 text-white shadow-glow'
                : 'text-neutral-300 hover:bg-white/5 hover:text-white'
            )}
          >
            <span>{item.label}</span>
            {isActive ? (
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
