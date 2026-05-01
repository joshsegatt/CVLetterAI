"use client";
import { useState, useMemo } from "react";
import { getPhrasesByRole } from "@/lib/data/phrases";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  role: string;
  onSelect: (phrase: string) => void;
  onClose: () => void;
}

export function PhraseSuggestions({ role, onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPhrases, setAiPhrases] = useState<string[]>([]);
  
  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-phrases", {
        method: "POST",
        body: JSON.stringify({ role })
      });
      
      if (response.ok) {
        const result = await response.json();
        setAiPhrases(result.phrases);
      }
    } catch (error) {
      console.error("AI generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const phrases = useMemo(() => {
    const basePhrases = [...getPhrasesByRole(role), ...aiPhrases];
    if (!search) return basePhrases;
    return basePhrases.filter(p => p.toLowerCase().includes(search.toLowerCase()));
  }, [role, search, aiPhrases]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-0 right-0 w-[300px] h-full bg-white border-l shadow-2xl z-30 flex flex-col"
    >
      <div className="p-4 border-b flex items-center justify-between bg-zinc-50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-bold">Executive Phrases</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3 border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search phrases..." 
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleAiGenerate}
          disabled={isGenerating}
          className="w-full h-8 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
        >
          {isGenerating ? (
            <div className="h-3 w-3 animate-spin border-2 border-white/20 border-t-white rounded-full" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {isGenerating ? "Generating..." : "Generate with AI Magic"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {phrases.map((phrase, i) => (
          <button
            key={i}
            onClick={() => onSelect(phrase)}
            className="w-full text-left p-3 rounded-lg border border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group relative"
          >
            <p className="text-xs text-zinc-600 leading-relaxed pr-6">{phrase}</p>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-3 w-3 text-indigo-600" />
            </div>
          </button>
        ))}
        {phrases.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xs text-zinc-400">No phrases found for this role.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-50 border-t">
        <p className="text-[10px] text-zinc-400 leading-tight">
          Pro Tip: Use these high-impact phrases to highlight measurable results and leadership.
        </p>
      </div>
    </motion.div>
  );
}
