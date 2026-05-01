"use client";
import { motion } from "framer-motion";
import { CreditCard, Zap, Check, ExternalLink, Calendar, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";

export default function BillingPage() {
  const { user } = useUser();
  
  const handleUpgrade = async (planId: string) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to initiate checkout:", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Executive Billing</h1>
          <p className="text-zinc-500 text-lg">Elevate your career with elite AI-powered tools.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.publicMetadata?.creditsRemaining as number || 5}
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Available Credits</p>
            <p className="text-sm font-bold text-zinc-900">Document Scans & AI Magic</p>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <Card className="relative opacity-60 hover:opacity-100 transition-opacity">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Starter</CardTitle>
            <CardDescription>Experience the basics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-black">$0 <span className="text-sm font-normal text-zinc-400 italic">/ forever</span></div>
            <ul className="space-y-3">
              {["5 AI Credits", "Basic Templates", "PDF Export"].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                  <Check className="h-4 w-4 text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </CardContent>
        </Card>

        {/* Pro Plan (Trial Focus) */}
        <Card className="relative border-2 border-indigo-600 shadow-2xl shadow-indigo-100 transform scale-105 z-10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Best for Growth
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Professional <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            </CardTitle>
            <CardDescription>Full AI power for active seekers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-4xl font-black text-indigo-600">$1.95</div>
              <p className="text-xs text-zinc-500 mt-1 font-bold italic">14-day full access trial</p>
              <p className="text-xs text-zinc-400">Then $18.95 / month</p>
            </div>
            <ul className="space-y-3">
              {[
                "Unlimited Documents",
                "Gemini 3 Flash Write",
                "Deep ATS Analysis",
                "DOCX & PDF Export",
                "50 Monthly Credits"
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                  <Check className="h-4 w-4 text-indigo-500 font-bold" /> {item}
                </li>
              ))}
            </ul>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 h-12 text-lg font-bold"
              onClick={() => handleUpgrade("pro_monthly")}
            >
              Start Trial Now
            </Button>
          </CardContent>
        </Card>

        {/* Executive Plan */}
        <Card className="relative border-2 border-zinc-900 shadow-xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Elite Value
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Executive <Trophy className="h-4 w-4 text-zinc-900" />
            </CardTitle>
            <CardDescription>For top-tier leaders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-4xl font-black text-zinc-900">$49.95</div>
              <p className="text-xs text-zinc-500 mt-1 font-bold italic">Billed annually</p>
              <p className="text-xs text-emerald-600 font-bold">Save $177/year</p>
            </div>
            <ul className="space-y-3">
              {[
                "Everything in Pro",
                "Unlimited AI Credits",
                "Executive Templates",
                "Priority AI Processing",
                "LinkedIn Optimization"
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                  <Check className="h-4 w-4 text-zinc-900" /> {item}
                </li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              className="w-full border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white h-12 text-lg font-bold"
              onClick={() => handleUpgrade("executive_annual")}
            >
              Get Yearly Access
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trust & History */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Secure Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-zinc-500">
               Your transactions are protected with bank-grade 256-bit SSL encryption. We use Stripe for all billing operations to ensure your data never touches our servers.
             </p>
             <div className="flex items-center gap-4 grayscale opacity-50">
                <CreditCard className="h-8 w-8" />
                <span className="text-xl font-black tracking-tighter italic">Stripe</span>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 border-2 border-dashed border-zinc-100 rounded-2xl">
               <p className="text-sm text-zinc-400">No recent transactions found.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
         <p className="text-xs text-zinc-400 flex items-center justify-center gap-2">
            Cancel anytime within the trial period for zero charge. <Sparkles className="h-3 w-3" />
         </p>
      </div>
    </div>
  );
}
