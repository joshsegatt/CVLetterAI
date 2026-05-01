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
      name: "Pro",
      id: "pro",
      price: interval === "monthly" ? "$19" : "$149",
      period: interval === "monthly" ? "/mo" : "/yr",
      description: "Perfect for active job seekers.",
      icon: Zap,
      features: [
        "25 ATS-Optimized CVs/mo",
        "50 AI Rewrites & Suggestions",
        "High-Fidelity PDF Exports",
        "Cover Letter Multi-Agent",
      ],
      color: "bg-zinc-900",
    },
    {
      name: "Executive",
      id: "executive",
      price: interval === "monthly" ? "$49" : "$399",
      period: interval === "monthly" ? "/mo" : "/yr",
      description: "For high-stakes senior roles.",
      icon: Rocket,
      features: [
        "Unlimited Everything",
        "Direct Support from Agents",
        "Custom Executive Templates",
        "Deep Job-Market Insights",
        "Priority AI Processing",
      ],
      color: "bg-indigo-600",
      featured: true,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Left: Info */}
          <div className="bg-zinc-50 p-8 md:w-[35%] flex flex-col justify-between">
            <div>
              <div className="bg-white p-2 rounded-lg w-fit shadow-sm mb-6">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Go Unlimited.</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Join 10,000+ professionals using CVlettersAI to land interviews at Google, Meta, and Netflix.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-green-500" />
                 <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Verified by Recruiters</span>
              </div>
            </div>
          </div>

          {/* Right: Plans */}
          <div className="flex-1 p-8 bg-white">
            <div className="flex justify-center mb-8">
              <div className="bg-zinc-100 p-1 rounded-full flex gap-1">
                <button 
                  onClick={() => setInterval("monthly")}
                  className={cn("px-4 py-1 text-xs font-bold rounded-full transition-all", interval === "monthly" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500")}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setInterval("annual")}
                  className={cn("px-4 py-1 text-xs font-bold rounded-full transition-all", interval === "annual" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500")}
                >
                  Annual (Save 30%)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className={cn(
                  "p-6 rounded-2xl border-2 flex flex-col justify-between transition-all",
                  plan.featured ? "border-indigo-600 shadow-xl ring-1 ring-indigo-100" : "border-zinc-100"
                )}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-2 rounded-lg", plan.color)}>
                        <plan.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-zinc-900">{plan.price}</div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">{plan.period}</div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-zinc-500 mb-6">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                          <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className={cn("w-full font-bold", plan.featured ? "bg-indigo-600 hover:bg-indigo-700" : "bg-zinc-900")}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading !== null}
                  >
                    {loading === plan.id ? "Processing..." : `Get ${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
