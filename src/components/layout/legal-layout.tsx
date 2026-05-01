"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <nav className="border-b border-zinc-100 py-6">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-4 w-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
            <span className="text-sm font-bold text-zinc-950">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-zinc-950 rounded flex items-center justify-center text-white text-[10px] font-black">C</div>
            <span className="font-bold text-sm tracking-tight text-zinc-950">cvletter<span className="text-emerald-500">ai</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-16">
          <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Legal Document</p>
          <h1 className="text-5xl font-black text-zinc-950 tracking-tight mb-4">{title}</h1>
          <p className="text-sm text-zinc-400 font-medium italic">Last Updated: {lastUpdated}</p>
        </header>

        <div className="prose prose-zinc max-w-none 
          prose-headings:text-zinc-950 prose-headings:font-black prose-headings:tracking-tight
          prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:text-lg
          prose-li:text-zinc-600 prose-li:text-lg
          prose-strong:text-zinc-950 prose-strong:font-bold
        ">
          {children}
        </div>

        <footer className="mt-24 pt-12 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-400 font-medium mb-8">
            Have questions about our {title.toLowerCase()}?
          </p>
          <Button asChild className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-full px-8 py-6 h-auto font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </footer>
      </main>
    </div>
  );
}
