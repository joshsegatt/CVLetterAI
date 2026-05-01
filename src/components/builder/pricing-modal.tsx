"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Rocket, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan, interval }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Professional",
      id: "pro",
      price: interval === "monthly" ? "$19" : "$149",
      period: interval === "monthly" ? "/mo" : "/yr",
      description: "For active career transitions.",
      icon: Zap,
      features: [
        "25 ATS-Optimized CVs/mo",
        "Unlimited High-Fidelity PDF Exports",
        "Smart AI Content Suggestions",
        "Multi-Industry Template Access",
        "Cloud Document Backup",
      ],
      color: "bg-zinc-900",
    },
    {
      name: "CVLetterAI Elite",
      id: "executive",
      price: interval === "monthly" ? "$49" : "$399",
      period: interval === "monthly" ? "/mo" : "/yr",
      description: "Elite tools for senior leadership.",
      icon: Sparkles,
      features: [
        "Everything in Professional",
        "Unlimited AI Generation & Rewrites",
        "Priority Multi-Agent Processing",
        "Executive-Grade Templates (Titan, etc)",
        "Direct Human-Level AI Coaching",
        "Exclusive LinkedIn Optimization",
      ],
      color: "bg-emerald-600",
      featured: true,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] rounded-[2.5rem]">
        <div className="flex flex-col md:flex-row min-h-[550px]">
          {/* Left: Info - Executive Aura */}
          <div className="bg-zinc-900 p-10 md:w-[38%] flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Light Effect */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[50%] bg-emerald-500/20 blur-[100px] rounded-full rotate-12" />
            </div>

            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl w-fit border border-white/10 shadow-xl mb-10">
                <Sparkles className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-6 leading-tight tracking-tighter">
                Unlock Your <br/>Executive Potential.
              </h2>
              <div className="space-y-6">
                {[
                  "Used by leaders at Google, Goldman Sachs & McKinsey.",
                  "Validated against 1,000+ ATS algorithms.",
                  "98% higher interview rate reported."
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <p className="text-zinc-400 text-sm font-medium leading-tight">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10 pt-12">
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="flex -space-x-3">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="h-8 w-8 rounded-full border-2 border-zinc-900 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=exec${i}`} alt="user" className="h-full w-full object-cover grayscale" />
                     </div>
                   ))}
                 </div>
                 <div className="flex-1">
                   <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1 italic">Verified Results</div>
                   <div className="text-[9px] text-zinc-500 font-bold leading-tight">Join 12,000+ top professionals today.</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right: Plans */}
          <div className="flex-1 p-10 bg-white relative">
            <div className="flex justify-center mb-10">
              <div className="bg-zinc-50 p-1.5 rounded-2xl flex gap-1 border border-zinc-100 shadow-sm">
                <button 
                  onClick={() => setInterval("monthly")}
                  className={cn(
                    "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300", 
                    interval === "monthly" ? "bg-white shadow-xl text-zinc-900 border border-zinc-100" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setInterval("annual")}
                  className={cn(
                    "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative overflow-hidden", 
                    interval === "annual" ? "bg-zinc-900 text-white shadow-xl" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  Annual 
                  <span className="ml-2 text-[8px] text-emerald-400">-30%</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {plans.map((plan) => (
                <div key={plan.id} className={cn(
                  "p-8 rounded-[2.5rem] border flex flex-col justify-between transition-all duration-500 relative group/plan",
                  plan.featured ? "border-emerald-500/30 bg-emerald-50/10 shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)]" : "border-zinc-100 hover:border-zinc-200"
                )}>
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg z-10">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className={cn("p-3 rounded-2xl shadow-lg", plan.color)}>
                        <plan.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end">
                          <span className="text-xs font-bold text-zinc-400 mr-1">$</span>
                          <span className="text-4xl font-black text-zinc-900 tracking-tighter">{plan.price.replace('$', '')}</span>
                        </div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">{plan.period}</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-zinc-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium mb-8 leading-relaxed">{plan.description}</p>
                    
                    <ul className="space-y-4 mb-10">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-[11px] text-zinc-600 font-bold leading-tight">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className={cn(
                      "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300", 
                      plan.featured ? "bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20" : "bg-zinc-900 hover:bg-black"
                    )}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading !== null}
                  >
                    {loading === plan.id ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : `Elevate with ${plan.name.split(' ')[0]}`}
                  </Button>
                </div>
              ))}
            </div>
            
            <p className="text-center mt-10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-50">
               Secure Payment via Stripe • Cancel Anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
