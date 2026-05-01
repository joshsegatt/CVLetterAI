"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const TEMPLATES = [
  {
    id: "executive",
    name: "The Boardroom",
    category: "Executive",
    description: "Minimalist, high-contrast design optimized for C-suite and Senior Leadership positions.",
    features: ["Classic Typography", "Strategic Layout", "Maximum Readability"],
    color: "bg-zinc-900",
  },
  {
    id: "modern",
    name: "Silicon Valley",
    category: "Professional",
    description: "Sleek, tech-forward aesthetic perfect for high-growth startups and tech giants.",
    features: ["Clean Accents", "San-Serif Clarity", "Balanced White Space"],
    color: "bg-indigo-600",
  },
  {
    id: "creative",
    name: "The Visionary",
    category: "Creative",
    description: "Dynamic and expressive layout for marketing, design, and innovative industries.",
    features: ["Bold Geometry", "Personality Driven", "Attention Grabbing"],
    color: "bg-violet-600",
  },
  {
    id: "swiss",
    name: "The Swiss",
    category: "Design",
    description: "Ultra-precise grid system inspired by international typographic style. For those who value precision.",
    features: ["Precision Grid", "Clean Hierarchy", "Swiss Sans Typography"],
    color: "bg-red-600",
  },
  {
    id: "titan",
    name: "The Titan",
    category: "Leadership",
    description: "A bold, powerful layout for high-impact leadership roles that demand attention.",
    features: ["Bold Headers", "Strong Contrast", "Authority Driven"],
    color: "bg-zinc-800",
  },
  {
    id: "academic",
    name: "The Academic",
    category: "Education",
    description: "Classic serif typography with a focus on publication and research history for senior scholars.",
    features: ["Serif Sophistication", "Extended Sections", "Classic Layout"],
    color: "bg-slate-700",
  },
  {
    id: "brutalist",
    name: "The Brutalist",
    category: "Edge",
    description: "Raw, unpolished, and high-contrast for a daring professional statement in avant-garde industries.",
    features: ["Mono Typography", "Box Borders", "Experimental Feel"],
    color: "bg-emerald-800",
  },
  {
    id: "minimal",
    name: "Pure Minimal",
    category: "Minimalist",
    description: "The absolute minimum required to present your value efficiently. Zero noise, 100% impact.",
    features: ["Zero Clutter", "Focused Content", "Elegant Spacing"],
    color: "bg-zinc-500",
  },
];

export default function TemplatesPage() {
  return (
    <div className="py-24 bg-zinc-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">Premium Selection</Badge>
            <h1 className="text-5xl font-black text-zinc-900 tracking-tight mb-6">
              Executive Template <span className="text-indigo-600">Gallery</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
              Every template is ATS-guaranteed and architected by career strategy experts. 
              Choose the aesthetic that matches your ambition.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden border-2 border-transparent hover:border-indigo-200 transition-all shadow-lg hover:shadow-xl bg-white rounded-3xl h-full flex flex-col">
                <div className={`h-64 relative overflow-hidden flex items-center justify-center ${tpl.color}`}>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                  <div className="bg-white/90 w-48 h-64 rounded-t-lg shadow-2xl transform rotate-3 translate-y-8 group-hover:rotate-0 group-hover:translate-y-4 transition-all duration-500 border border-zinc-100 p-4">
                    <div className="h-2 w-12 bg-zinc-200 rounded mb-4" />
                    <div className="h-4 w-32 bg-zinc-100 rounded mb-2" />
                    <div className="space-y-1">
                        <div className="h-1 w-full bg-zinc-50 rounded" />
                        <div className="h-1 w-full bg-zinc-50 rounded" />
                        <div className="h-1 w-3/4 bg-zinc-50 rounded" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 border-zinc-200">
                      {tpl.category}
                    </Badge>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">{tpl.name}</h3>
                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed flex-1">
                    {tpl.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {tpl.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                         <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                         {f}
                      </div>
                    ))}
                  </div>

                  <Button asChild className="w-full bg-zinc-900 hover:bg-indigo-600 rounded-xl transition-colors group">
                    <Link href={`/builder/demo?template=${tpl.id}`} className="flex items-center justify-center gap-2">
                      Use this template
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-indigo-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <Sparkles className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">Can't decide?</h2>
            <p className="text-indigo-100 mb-8 max-w-lg mx-auto text-lg">
                Our AI can automatically switch your content between any template instantly. Start building and decide later.
            </p>
            <Button asChild size="xl" className="bg-white text-indigo-700 hover:bg-indigo-50 border-white">
                <Link href="/builder/demo">Let AI Choose for Me</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
