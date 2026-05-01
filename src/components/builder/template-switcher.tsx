"use client";
import { TEMPLATES } from "@/lib/templates/registry";
import { useWizardStore } from "@/store/wizard-store";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export function TemplateSwitcher() {
  const { selectedTemplate, setTemplate } = useWizardStore();

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => setTemplate(template.id)}
          className={cn(
            "group relative flex flex-col text-left rounded-xl border-2 transition-all overflow-hidden",
            selectedTemplate === template.id 
              ? "border-indigo-600 ring-2 ring-indigo-100" 
              : "border-zinc-200 hover:border-zinc-300"
          )}
        >
          {/* Mock Thumbnail / Preview */}
          <div className={cn(
            "aspect-[3/4] w-full bg-zinc-100 p-2 flex flex-col gap-1",
            template.id === "executive" ? "bg-zinc-900" : 
            template.id === "modern" ? "bg-white border-b" : "bg-zinc-50"
          )}>
             <div className={cn("h-1 w-1/2 rounded-full", template.id === "executive" ? "bg-white/20" : "bg-zinc-200")} />
             <div className={cn("h-1 w-full rounded-full", template.id === "executive" ? "bg-white/10" : "bg-zinc-100")} />
             <div className={cn("h-1 w-2/3 rounded-full", template.id === "executive" ? "bg-white/10" : "bg-zinc-100")} />
          </div>
          
          <div className="p-3 bg-white">
            <h3 className="text-xs font-bold text-zinc-900">{template.name}</h3>
            <p className="text-[10px] text-zinc-500 truncate">{template.description}</p>
          </div>

          {selectedTemplate === template.id && (
            <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg">
              <Check className="h-3 w-3" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
