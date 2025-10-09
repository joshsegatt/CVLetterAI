import Link from 'next/link';

interface LogoProps {
  withTagline?: boolean;
}

export function Logo({ withTagline = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="flex items-center gap-1 text-lg font-bold">
        <span className="rounded-full bg-white/10 px-2 py-1 text-[0.75rem] uppercase tracking-wide text-neutral-200">
          CV
        </span>
        <span className="gradient-text text-xl font-semibold tracking-tight">
          LetterAI
        </span>
      </Link>
      {withTagline ? (
        <span className="hidden text-xs font-medium text-neutral-400 sm:inline">
          Built for UK Professionals
        </span>
      ) : null}
    </div>
  );
}
