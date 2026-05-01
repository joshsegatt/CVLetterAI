"use client";
import { useEffect, useState } from "react";
import { LivePreview } from "@/components/builder/live-preview";
import { PricingModal } from "@/components/builder/pricing-modal";
import { useWizardStore } from "@/store/wizard-store";
import { Navbar } from "@/components/layout/navbar";
import type { Document } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Save, Share2, FileText, LayoutTemplate, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportActions } from "./export-actions";
import { AtsSidebar } from "@/components/builder/ats-sidebar";
import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  document: Document;
  model: string;
  autoGenerate: boolean;
  isPro?: boolean;
  children: React.ReactNode;
}

export function BuilderClient({ document, model, autoGenerate, isPro = false, children }: Props) {
  const router = useRouter();
  const { 
    data, 
    selectedTemplate, 
    isAuditSidebarOpen,
    setAuditSidebarOpen,
    setDocumentType,
    updateSummary, 
    updateExperience, 
    updateEducation, 
    updateSkills, 
    updatePersonalInfo 
  } = useWizardStore();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isGeneratingMatching, setIsGeneratingMatching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isDemo = document.id === "demo";

  // Auto-save logic
  useEffect(() => {
    if (isDemo) return; // Don't auto-save in demo mode
    
    const timer = setTimeout(async () => {
      if (!document?.id) return;
      
      setIsSaving(true);
      try {
        await fetch(`/api/documents/${document.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: JSON.stringify(data),
            title: document.title, // Keep existing title or update if needed
          }),
        });
      } catch (err) {
        console.error("Autosave failed", err);
      } finally {
        setIsSaving(false);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [data, document?.id, document.title, isDemo]);

  // Initialize store with document data
  useEffect(() => {
    if (document) {
      setDocumentType(document.type as any);
      
      if (document.content) {
        try {
          const parsed = JSON.parse(document.content);
          if (parsed.summary) updateSummary(parsed.summary);
          if (parsed.experience) updateExperience(parsed.experience);
          if (parsed.education) updateEducation(parsed.education);
          if (parsed.skills) updateSkills(parsed.skills);
        } catch (e) {
          updateSummary(document.content);
        }
      }
      
      updatePersonalInfo({
        name: document.title.split("'s")[0] || "",
      });
    }
  }, [document, updateSummary, updateExperience, updateEducation, updateSkills, updatePersonalInfo, setDocumentType]);

  const handleCreateMatchingLetter = async () => {
    setIsGeneratingMatching(true);
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${data.personalInfo.name || "My"}'s Matching Cover Letter`,
          type: "cover_letter",
          content: JSON.stringify({
            summary: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Position Name] role at [Company Name]...",
            templateId: selectedTemplate
          })
        }),
      });

      if (!response.ok) throw new Error("Failed to create matching letter");

      const { document: newDoc } = await response.json();
      toast.success("Matching Cover Letter created!");
      router.push(`/builder/${newDoc.id}`);
    } catch (err) {
      toast.error("Error creating matching letter");
    } finally {
      setIsGeneratingMatching(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {isDemo && (
        <div className="bg-emerald-600 text-white px-6 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Demo Mode: Start building your CV. Sign in to save and download.</span>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-emerald-500 h-7 text-[10px] border border-white/20"
            onClick={() => router.push("/sign-up")}
          >
            Sign up to save
          </Button>
        </div>
      )}
      {/* Top Bar */}
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 p-1.5 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-900 leading-none mb-1">
              {document.title}
            </h1>
            <Badge variant="outline" className="text-[10px] h-4 py-0 font-medium bg-zinc-50">
              {document.type.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {document.type === "resume" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCreateMatchingLetter}
              disabled={isGeneratingMatching}
              className="gap-2 text-zinc-600 hover:text-indigo-600 hover:border-indigo-200"
            >
              {isGeneratingMatching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LayoutTemplate className="h-4 w-4" />
              )}
              Matching Cover Letter
            </Button>
          )}
          
          <div className="w-px h-6 bg-zinc-200 mx-2" />

          <Button 
            variant={isAuditSidebarOpen ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setAuditSidebarOpen(!isAuditSidebarOpen)} 
            className={cn(
              "gap-2",
              isAuditSidebarOpen ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "text-zinc-600"
            )}
          >
            <BrainCircuit className="h-4 w-4" /> ATS Audit
          </Button>
          <div className="w-px h-6 bg-zinc-200 mx-2" />
          <Button variant="outline" size="sm" onClick={() => setIsPricingOpen(true)} className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
            <Sparkles className="h-4 w-4" /> Upgrade
          </Button>
          <div className="w-px h-6 bg-zinc-200 mx-2" />
          <div className="flex items-center gap-2 px-3">
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Saving...</span>
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Saved</span>
              </>
            )}
          </div>
          <div className="w-px h-6 bg-zinc-200 mx-2" />
          <Button variant="ghost" size="sm" className="gap-2 text-zinc-600">
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-zinc-600">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <div className="w-px h-6 bg-zinc-200 mx-2" />
          <ExportActions 
            data={data} 
            templateId={selectedTemplate} 
            documentType={document.type}
            isPro={isPro}
            onUpgrade={() => setIsPricingOpen(true)}
          />
        </div>
      </header>

      {/* Main Content: Side-by-Side */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left: Wizard Form Content */}
        <div className={cn(
          "h-full shrink-0 transition-all duration-300 overflow-hidden",
          isAuditSidebarOpen ? "w-[35%]" : "w-[40%]"
        )}>
          {children}
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 h-full bg-zinc-50 border-l relative">
          <LivePreview />
        </div>

        {/* Far Right: ATS Sidebar */}
        <AtsSidebar />
      </main>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
}
