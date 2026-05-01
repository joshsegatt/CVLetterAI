import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
          {/* Brand & Rights */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-base tracking-tight text-white italic">cvletter<span className="text-emerald-500 not-italic">ai</span></span>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest text-center md:text-left">
              © 2026 CVLetterAI. <br className="block md:hidden" /> All rights reserved.
            </p>
          </div>
          
          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href="/pricing" className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-tight cursor-pointer">Pricing</Link>
            <Link href="/privacy" className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-tight cursor-pointer">Privacy</Link>
            <Link href="/terms" className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-tight cursor-pointer">Terms</Link>
            <Link href="/contact" className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-tight cursor-pointer">Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
