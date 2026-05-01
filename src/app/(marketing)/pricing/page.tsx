"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "Starter",
    icon: Sparkles,
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Try CVlettersAI risk-free.",
    features: [
      "5 AI document credits",
      "All 5 document types",
      "ATS optimization",
      "Markdown export",
    ],
    cta: "Start free",
    href: "/sign-in",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    monthlyPrice: 29,
    annualPrice: 19,
    description: "For the focused job seeker.",
    features: [
      "50 AI document credits / mo",
      "All 5 document types",
      "Priority AI generation",
      "PDF + DOCX export",
      "Version history",
      "ATS score checker",
    ],
    cta: "Start Pro",
    href: "/sign-in?plan=pro",
    highlight: true,
  },
  {
    id: "executive",
    name: "Executive",
    icon: Crown,
    monthlyPrice: 79,
    annualPrice: 59,
    description: "For C-suite and senior leaders.",
    features: [
      "Unlimited document credits",
      "All 5 document types",
      "Fastest AI model (Claude Opus)",
      "PDF + DOCX export",
      "Version history",
      "ATS score checker",
      "Priority support",
      "Custom tone profiles",
    ],
    cta: "Start Executive",
    href: "/sign-in?plan=executive",
    highlight: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="secondary" className="mb-4">Simple pricing</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
              Invest in your next chapter
            </h1>
            <p className="mt-4 text-xl text-zinc-500 max-w-xl mx-auto">
              One-time subscription. Cancel anytime. Start free with no credit card.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 p-1"
          >
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !annual ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                annual ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Annual
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                -35%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                className={cn(
                  "relative h-full",
                  plan.highlight && "border-indigo-400 ring-2 ring-indigo-100 scale-[1.02]"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      Most popular
                    </span>
                  </div>
                )}

                <CardContent className="p-6 space-y-6">
                  {/* Plan header */}
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      plan.highlight ? "bg-indigo-600" : "bg-zinc-100"
                    )}>
                      <plan.icon className={cn("h-4 w-4", plan.highlight ? "text-white" : "text-zinc-600")} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">{plan.name}</h3>
                      <p className="text-xs text-zinc-500">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-zinc-900">
                        ${annual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="mb-1 text-zinc-400 text-sm">/mo</span>
                      )}
                    </div>
                    {annual && plan.annualPrice > 0 && (
                      <p className="text-xs text-zinc-400 mt-1">Billed annually</p>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    asChild
                    size="lg"
                    variant={plan.highlight ? "default" : "outline"}
                    className="w-full"
                  >
                    <Link href={plan.href} className="flex items-center justify-center gap-2">
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-zinc-600">
                        <Check className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <p className="text-sm text-zinc-500">
            Questions?{" "}
            <a href="mailto:hello@cvletters.ai" className="text-indigo-600 hover:underline">
              Contact us
            </a>{" "}
            — we respond within 2 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
