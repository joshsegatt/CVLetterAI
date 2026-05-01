"use client";

import { OnboardingFunnel } from "@/components/marketing/onboarding-funnel";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";

export default function OnboardingPage() {
  return (
    <main className="h-screen bg-[#fafafa] relative overflow-hidden flex flex-col">
      {/* Background Stylized Curved Element - mirroring the landing page aesthetics */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-emerald-500 overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/40 via-transparent to-transparent" />
        <svg 
          className="absolute bottom-0 left-0 w-full h-32 text-[#fafafa] fill-current" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none"
        >
          <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* Header / Logo */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
             <ChevronLeft className="h-5 w-5 text-white" />
          </Link>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all overflow-hidden p-1.5 shadow-sm">
               <img src="/favicon-32x32.png" alt="CVLetterAI" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">
              CVLetter<span className="text-emerald-300">AI</span>
            </span>
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">
           <span>Premium AI Documents</span>
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
           <span>Silicon Valley Standard</span>
        </div>
      </div>

      {/* Center Content - The Funnel & Lateral Panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Side: Context & Social Proof (Hidden on Mobile) */}
          <div className="hidden lg:block flex-1 space-y-8">
             <div className="space-y-6">
                <h2 className="text-white text-[38px] font-black leading-[1.1] tracking-tight">
                  Unlock your <br />
                  <span className="text-white/80">Executive</span> <br />
                  Potential.
                </h2>
                <p className="text-zinc-700 text-lg font-bold leading-relaxed max-w-sm">
                  Experience the science of high-conversion career documents.
                </p>
             </div>
             
             <div className="space-y-6">
                {[
                  { title: "Precision ATS Targeting", desc: "Sophisticated keyword mapping to clear every algorithmic hurdle." },
                  { title: "Architectural Design", desc: "Elite, minimalist templates that command attention and respect." },
                  { title: "Strategic AI Engine", desc: "Real-time optimization against global hiring benchmarks." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex gap-4"
                  >
                     <div className="h-9 w-9 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Check className="h-5 w-5 text-emerald-600" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-zinc-900 font-bold text-[13px] uppercase tracking-wider">{item.title}</h4>
                        <p className="text-zinc-500 text-sm font-medium leading-snug">{item.desc}</p>
                     </div>
                  </motion.div>
                ))}
             </div>

             <div className="pt-8 border-t border-white/10">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Trusted by Experts At</p>
                <div className="flex gap-8 opacity-40 grayscale contrast-125">
                   {/* Minimal Brand Logos / Names */}
                   <span className="text-white font-black text-sm tracking-tighter">GOOGLE</span>
                   <span className="text-white font-black text-sm tracking-tighter">META</span>
                   <span className="text-white font-black text-sm tracking-tighter">APPLE</span>
                   <span className="text-white font-black text-sm tracking-tighter">OPENAI</span>
                </div>
             </div>
          </div>

          {/* Right Side: The Onboarding Component */}
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto scrollbar-hide">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <OnboardingFunnel />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="relative z-10 w-full py-6 text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
           <div className="h-px w-12 bg-zinc-200" />
           <div className="h-2 w-2 rounded-full bg-emerald-500" />
           <div className="h-px w-12 bg-zinc-200" />
        </div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
          Empowering Experts &bull; &copy; 2026
        </p>
      </div>
    </main>
  );
}
