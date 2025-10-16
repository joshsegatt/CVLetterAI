'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardNav } from '../../lib/navigation';
import { cn } from '../../lib/utils';

interface DashboardNavProps {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function DashboardNav({ orientation = 'vertical', className }: DashboardNavProps) {
  const pathname = usePathname();
  const isHorizontal = orientation === 'horizontal';

  return (
    <nav
      aria-label="Dashboard navigation"
      className={cn(
        isHorizontal
          ? 'flex items-center justify-center gap-6 overflow-x-auto rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-300 backdrop-blur-md md:text-sm'
          : 'flex flex-col gap-1',
        className
      )}
    >
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
              isHorizontal
                ? 'flex items-center gap-2 rounded-full px-3 py-1.5 transition'
                : 'flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              isHorizontal
                ? isActive
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                : isActive
                  ? 'bg-white/10 text-white shadow-glow'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white'
            )}
          >
            <span>{item.label}</span>
            {!isHorizontal && isActive ? (
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
