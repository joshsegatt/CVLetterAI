"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Loader2, FileCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DOC_TYPES = [
  { id: "resume",           label: "Resume",          description: "ATS-optimized executive resume",     icon: FileText,      color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { id: "cover_letter",     label: "Cover Letter",    description: "Compelling, personalized letter",    icon: FileCheck,     color: "bg-violet-50 border-violet-200 text-violet-700" },
  { id: "linkedin_summary", label: "LinkedIn Profile", description: "Algorithm-optimized summary",       icon: FileText,  color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: "executive_bio",    label: "Executive Bio",   description: "Board-ready biography",              icon: FileText,   color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { id: "other",            label: "Interview Prep",  description: "STAR-method Q&A preparation",       icon: MessageSquare, color: "bg-amber-50 border-amber-200 text-amber-700" },
];

const TONES = [
  { id: "executive",    label: "Executive",     desc: "Commanding & visionary" },
  { id: "professional", label: "Professional",  desc: "Polished & results-driven" },
  { id: "confident",    label: "Confident",     desc: "Authentic & accomplished" },
];

const MODELS = [
  { id: "gpt-4o-mini",       label: "GPT-4o Mini",     desc: "Fast · Standard quality",   badge: "Free" },
  { id: "gpt-4o",            label: "GPT-4o",          desc: "Balanced · High quality",   badge: "Pro" },
  { id: "claude-sonnet-4-5", label: "Claude Sonnet",   desc: "Best · Executive-grade",    badge: "Executive" },
];

export default function NewDocumentPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    type: "resume",
    title: "",
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    tone: "professional",
    yearsOfExperience: "10",
    model: "gpt-4o-mini",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreate = async () => {
    if (!form.title || !form.jobTitle || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          jobTitle: form.jobTitle,
          companyName: form.companyName,
          jobDescription: form.jobDescription,
          tone: form.tone,
          yearsOfExperience: parseInt(form.yearsOfExperience, 10),
        }),
      });

      if (!res.ok) throw new Error("Failed to create document");
      const { document } = await res.json();
      router.push(`/builder/${document.id}?model=${form.model}&autoGenerate=true`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-zinc-900">New document</h1>
        <p className="text-zinc-500 text-sm mt-1">Fill in the details and let AI craft your document.</p>
      </motion.div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Doc type */}
          <div>
            <label className="text-sm font-medium text-zinc-700 mb-3 block">Document type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DOC_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setForm((f) => ({ ...f, type: t.id }))}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all hover:shadow-sm",
                    form.type === t.id ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100" : "border-zinc-200 bg-white"
                  )}
                >
                  <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border", t.color)}>
                    <t.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{t.label}</p>
                    <p className="text-xs text-zinc-400">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Document title</label>
            <Input placeholder="e.g. Senior VP Engineering — Google Application" value={form.title} onChange={set("title")} />
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => setStep(2)}
            disabled={!form.title || !form.type}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Job title</label>
              <Input placeholder="e.g. VP of Engineering" value={form.jobTitle} onChange={set("jobTitle")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Company</label>
              <Input placeholder="e.g. Google" value={form.companyName} onChange={set("companyName")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Job description</label>
            <Textarea
              placeholder="Paste the full job description here for best results..."
              rows={6}
              value={form.jobDescription}
              onChange={set("jobDescription")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Years of experience</label>
              <Input type="number" min="0" max="50" value={form.yearsOfExperience} onChange={set("yearsOfExperience")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Tone</label>
              <div className="space-y-1.5">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setForm((f) => ({ ...f, tone: t.id }))}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all",
                      form.tone === t.id ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    )}
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className="text-[10px] text-zinc-400">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Model */}
          <div>
            <label className="text-sm font-medium text-zinc-700 mb-2 block">AI model</label>
            <div className="space-y-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setForm((f) => ({ ...f, model: m.id }))}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg border px-3.5 py-2.5 transition-all",
                    form.model === m.id ? "border-indigo-400 bg-indigo-50 ring-1 ring-indigo-100" : "border-zinc-200 bg-white hover:bg-zinc-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-2 w-2 rounded-full", form.model === m.id ? "bg-indigo-600" : "bg-zinc-300")} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-zinc-900">{m.label}</p>
                      <p className="text-xs text-zinc-400">{m.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5">{m.badge}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button size="lg" className="flex-2 flex-grow" onClick={handleCreate} disabled={!form.jobTitle || loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Generate document
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
