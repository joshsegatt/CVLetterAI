"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, Rocket, Target, Star, ChevronRight, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. SUBTLE BACKGROUND ACCENTS (LIGHT ELITE) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 blur-[100px] rounded-full opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-emerald-50 blur-[100px] rounded-full opacity-60" />
        {/* Very subtle pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center py-12 pb-24">
        
        {/* 2. COMPACT HEADER */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-zinc-900 leading-tight">
              Invest in your <span className="text-emerald-600">Future.</span>
            </h1>
            <p className="max-w-xl mx-auto text-zinc-500 text-sm font-medium opacity-80">
              Elite AI features designed for high-stakes career progression. 
              Simple, transparent, and results-oriented.
            </p>
          </motion.div>
        </div>

        {/* 3. THE PRICING MATRIX (2-COLUMN FOR PRO/EXECUTIVE) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto relative">
          
          {/* PRO CARD (THE HERO - LIGHT) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group h-full"
          >
            {/* Soft Shadow Glow */}
            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full bg-white border-2 border-indigo-600 rounded-[2rem] p-8 flex flex-col shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
                Most Popular
              </div>
              
              <div className="mb-6 pt-2">
                <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 border border-indigo-100">
                  <Target className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tight">Professional</h3>
                <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider mt-1">The Strategist</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-900">$1.95</span>
                  <span className="text-zinc-500 font-bold text-xs uppercase">/ 14-day trial</span>
                </div>
                <p className="text-[10px] text-indigo-600 mt-2 font-black italic tracking-widest uppercase">Then $18.95 monthly</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Unlimited Documents",
                  "50 Elite AI Credits / mo",
                  "Deep ATS Analysis",
                  "Premium DOCX Export"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-black text-zinc-800">
                    <Check className="h-4 w-4 text-indigo-500" /> {item}
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100">
                <Link href="/sign-up?plan=pro">Claim Trial <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </motion.div>

          {/* EXECUTIVE CARD (HIGH CONTRAST BLACK) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group h-full"
          >
            <div className="h-full bg-black text-white border border-zinc-800 rounded-[2rem] p-8 flex flex-col transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <div className="mb-6">
                <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/30">
                  <Crown className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white !text-white brightness-200">Executive</h3>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mt-1">Unlimited Access</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$49.95</span>
                  <span className="text-zinc-400 font-bold text-xs uppercase">/ year</span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-2 font-black italic tracking-widest uppercase">Save $177 Yearly</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Everything in Pro",
                  "Unlimited AI Credits",
                  "LinkedIn Optimizer",
                  "Success Manager"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-bold text-zinc-100">
                    <Star className="h-3.5 w-3.5 text-emerald-400" /> {item}
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10">
                <Link href="/sign-up?plan=executive">Go Executive</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* 4. DISCRETE TRUST FOOTER (COMPACT) */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-10 opacity-60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-zinc-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">256-Bit SSL Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-zinc-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Stripe Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}


