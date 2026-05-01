"use client";
import { useState, useMemo } from "react";
import { useWizardStore } from "@/store/wizard-store";
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Zap, 
  TrendingUp,
  BrainCircuit,
  MessageSquarePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export function AtsSidebar() {
  const { 
    data, 
    isAuditSidebarOpen, 
    setAuditSidebarOpen, 
    updateTargetJobDescription 
  } = useWizardStore();
  
  const [activeTab, setActiveTab] = useState<"analysis" | "keywords">("analysis");

  // Logic to calculate keyword match
  const analysis = useMemo(() => {
    const jd = data.targetJobDescription.toLowerCase();
    if (!jd) return null;

    const commonKeywords = [
      "leadership", "management", "strategy", "project", "analysis", 
      "communication", "technical", "development", "marketing", "sales",
      "financial", "operation", "innovation", "product", "team", "customer",
      "stakeholder", "implementation", "process", "optimization", "growth"
    ];

    const jdKeywords = commonKeywords.filter(kw => jd.includes(kw));
    const resumeText = JSON.stringify(data).toLowerCase();
    
    const matched = jdKeywords.filter(kw => resumeText.includes(kw));
    const missing = jdKeywords.filter(kw => !resumeText.includes(kw));
    
    const score = jdKeywords.length > 0 
      ? Math.round((matched.length / jdKeywords.length) * 100) 
      : 0;

    return { score, matched, missing, total: jdKeywords.length };
  }, [data]);

  if (!isAuditSidebarOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-indigo-600" />
          <h2 className="font-bold text-zinc-900">ATS Optimizer</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setAuditSidebarOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Job Description Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-3 w-3" /> Target Job Description
            </label>
            <Textarea 
              placeholder="Paste the job description here to optimize your CV..."
              className="min-h-[120px] text-xs resize-none focus-visible:ring-indigo-500"
              value={data.targetJobDescription}
              onChange={(e) => updateTargetJobDescription(e.target.value)}
            />
          </div>

          {!data.targetJobDescription ? (
            <div className="py-12 text-center space-y-3 px-4">
              <div className="bg-zinc-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Paste a job description to see how well your profile matches the requirements.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Section */}
              <div className="p-4 rounded-xl bg-zinc-900 text-white space-y-3 shadow-lg">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-zinc-400">Match Score</span>
                  <span className={cn(
                    "text-2xl font-bold font-mono",
                    analysis?.score && analysis.score > 70 ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {analysis?.score}%
                  </span>
                </div>
                <Progress value={analysis?.score} className="h-1.5 bg-zinc-800" />
                <p className="text-[10px] text-zinc-400">
                  {analysis && analysis.score > 70 
                    ? "Great match! Your profile is highly relevant for this role." 
                    : "Room for improvement. Try incorporating missing keywords."}
                </p>
              </div>

              {/* Keywords Section */}
              <div className="space-y-4">
                <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg">
                  <button 
                    onClick={() => setActiveTab("analysis")}
                    className={cn(
                      "flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all",
                      activeTab === "analysis" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                    )}
                  >
                    Analysis
                  </button>
                  <button 
                    onClick={() => setActiveTab("keywords")}
                    className={cn(
                      "flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all",
                      activeTab === "keywords" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                    )}
                  >
                    Keywords
                  </button>
                </div>

                {activeTab === "analysis" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-zinc-900 flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Matched Strengths
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis?.matched.map(kw => (
                          <Badge key={kw} variant="secondary" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-100">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-zinc-900 flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-amber-500" /> Missing Opportunities
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis?.missing.map(kw => (
                          <Badge key={kw} variant="secondary" className="text-[9px] bg-amber-50 text-amber-700 border-amber-100">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 space-y-2">
                      <p className="text-[10px] text-zinc-500">
                        Ask AI to rewrite a section using these keywords to improve your score.
                      </p>
                      <Button variant="outline" size="sm" className="w-full h-8 text-[10px] gap-2">
                        <Zap className="h-3 w-3 text-indigo-600" /> Smart Rewrite
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-zinc-50/80">
        <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-xs h-10 gap-2">
          <MessageSquarePlus className="h-4 w-4" /> AI Consultant
        </Button>
      </div>
    </div>
  );
}
