"use client";
import { motion } from "framer-motion";
import { CreditCard, Zap, Check, ExternalLink, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Billing & Subscription</h1>
        <p className="text-zinc-500">Manage your plan, payment methods, and invoices.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-2 border-indigo-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-600" />
                Current Plan
              </CardTitle>
              <Badge className="bg-indigo-600 text-white border-none">Free Starter</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h4 className="text-2xl font-bold text-zinc-900">$0.00 <span className="text-sm font-normal text-zinc-400">/ forever</span></h4>
                  <p className="text-sm text-zinc-500 mt-1">Perfect for trying out our AI document engine.</p>
                </div>
                <Button className="bg-zinc-900 hover:bg-indigo-600">Upgrade to Pro</Button>
             </div>

             <div className="mt-8 pt-8 border-t border-zinc-100 grid grid-cols-2 gap-4">
                {[
                  "5 Document Credits",
                  "ATS Basic Scan",
                  "Standard Templates",
                  "Markdown Export"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    {item}
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-zinc-400" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-xs text-zinc-500 italic">No payment method on file.</p>
             <Button variant="outline" className="w-full text-xs">Add Card</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-zinc-400" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 border-2 border-dashed border-zinc-100 rounded-2xl">
             <Calendar className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
             <p className="text-sm text-zinc-400">No transactions found yet.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center pt-8">
         <p className="text-xs text-zinc-400 flex items-center gap-2">
            Secure billing powered by <span className="font-bold text-zinc-600">Stripe</span>
            <ExternalLink className="h-3 w-3" />
         </p>
      </div>
    </div>
  );
}
