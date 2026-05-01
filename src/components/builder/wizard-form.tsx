"use client";
import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TemplateSwitcher } from "./template-switcher";
import { PhraseSuggestions } from "./phrase-suggestions";

interface Props {
  step: string;
}

export function WizardFormContent({ step }: Props) {
  const { 
    data, 
    focusedSection, 
    setFocusedSection,
    updatePersonalInfo, 
    updateExperience, 
    updateEducation, 
    updateSkills, 
    updateSummary, 
  } = useWizardStore();
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number | null>(null);

  useEffect(() => {
    if (focusedSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`field-${focusedSection}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
        setFocusedSection(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusedSection, step, setFocusedSection]);

  const handleMagicWrite = async (section: string) => {
    setIsStreaming(true);
    try {
      const response = await fetch("/api/ai/stream-content", {
        method: "POST",
        body: JSON.stringify({
          section,
          context: data,
          jobDescription: "Executive Role at Top Firm", 
        }),
      });
      if (!response.ok) throw new Error("Failed to stream");
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  const handlePhraseSelect = (idx: number, phrase: string) => {
    const newExp = [...data.experience];
    const currentDesc = newExp[idx].description || "";
    newExp[idx].description = currentDesc ? `${currentDesc}\n${phrase}` : phrase;
    updateExperience(newExp);
  };

  switch (step) {
    case "personal":
      return (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Personal Information</h2>
            <p className="text-zinc-500 font-medium">How should recruiters reach you?</p>
          </div>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar Upload Preview */}
            <div className="flex-shrink-0">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] block mb-4">Portrait</label>
              <div className="relative group/photo">
                <div className="h-32 w-32 rounded-[2.5rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover/photo:border-emerald-400 group-hover/photo:bg-emerald-50/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                  {data.personalInfo.photo ? (
                    <img src={data.personalInfo.photo} alt="Preview" className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="text-center p-4">
                      <Plus className="h-6 w-6 text-zinc-300 mx-auto mb-2 group-hover/photo:text-emerald-500 transition-colors" />
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-tight block">Executive<br/>Photo</span>
                    </div>
                  )}
                </div>
                <Input 
                  type="text"
                  value={data.personalInfo.photo || ""}
                  onChange={(e) => updatePersonalInfo({ photo: e.target.value })}
                  placeholder="Image URL..."
                  className="mt-4 h-10 text-[10px] rounded-xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-1 focus:ring-emerald-500 w-32 font-bold transition-all"
                />
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 w-full">
              <div className="space-y-3 col-span-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Full Name</label>
                <Input 
                  id="field-name"
                  value={data.personalInfo.name} 
                  onChange={(e) => updatePersonalInfo({ name: e.target.value })} 
                  placeholder="e.g. Thomas Henderson"
                  className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:border-emerald-600 focus:ring-emerald-600 font-black text-lg tracking-tight transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Email Address</label>
                <Input value={data.personalInfo.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} placeholder="e.g. john@example.com" className="h-12 rounded-xl border-zinc-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Phone Number</label>
                <Input value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} placeholder="e.g. +1 (555) 000-0000" className="h-12 rounded-xl border-zinc-200" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-zinc-700">Location</label>
                <Input value={data.personalInfo.location} onChange={(e) => updatePersonalInfo({ location: e.target.value })} placeholder="e.g. New York, NY" className="h-12 rounded-xl border-zinc-200" />
              </div>
            </div>
          </div>
        </div>
      );

    case "summary":
      return (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Professional Summary</h2>
              <p className="text-zinc-500 font-medium">Elevate your executive story with AI.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 font-bold rounded-xl h-10 px-4"
              onClick={() => handleMagicWrite("summary")}
              disabled={isStreaming}
            >
              <Sparkles className="h-4 w-4" />
              Magic Write
            </Button>
          </div>
          <Textarea 
            id="field-summary"
            value={data.summary} 
            onChange={(e) => updateSummary(e.target.value)} 
            placeholder="Briefly describe your career highlights and executive achievements..."
            className="min-h-[250px] rounded-2xl border-zinc-200 focus:border-indigo-600 p-6 leading-relaxed"
          />
        </div>
      );

    case "experience":
      return (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Experience</h2>
              <p className="text-zinc-500 font-medium">Your career trajectory and impact.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 font-bold h-10 px-4 rounded-xl" onClick={() => updateExperience([...data.experience, { title: "", company: "", startDate: "", endDate: "", description: "" }])}>
              <Plus className="h-4 w-4" /> Add Role
            </Button>
          </div>
          <div id="field-experience" className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="p-6 border rounded-[2rem] space-y-6 bg-zinc-50/30 group/item relative border-zinc-100">
                <div className="grid grid-cols-2 gap-4">
                  <Input value={exp.title} onChange={(e) => {
                    const newExp = [...data.experience];
                    newExp[i].title = e.target.value;
                    updateExperience(newExp);
                  }} placeholder="Job Title" className="h-12 rounded-xl" />
                  <Input value={exp.company} onChange={(e) => {
                    const newExp = [...data.experience];
                    newExp[i].company = e.target.value;
                    updateExperience(newExp);
                  }} placeholder="Company" className="h-12 rounded-xl" />
                </div>
                <div className="relative">
                  <Textarea 
                    value={exp.description} 
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[i].description = e.target.value;
                      updateExperience(newExp);
                    }} 
                    placeholder="Key responsibilities and quantitative achievements..." 
                    className="min-h-[140px] pr-12 rounded-2xl border-zinc-200"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute bottom-2 right-2 h-10 w-10 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl"
                    onClick={() => setActiveSuggestionIdx(i)}
                  >
                    <Lightbulb className="h-5 w-5" />
                  </Button>
                </div>
                
                <button 
                  onClick={() => updateExperience(data.experience.filter((_, idx) => idx !== i))}
                  className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity p-2 text-zinc-400 hover:text-red-500 bg-white rounded-full shadow-sm border border-zinc-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeSuggestionIdx !== null && (
              <PhraseSuggestions 
                role={data.experience[activeSuggestionIdx]?.title || "Professional"}
                onSelect={(phrase) => handlePhraseSelect(activeSuggestionIdx, phrase)}
                onClose={() => setActiveSuggestionIdx(null)}
              />
            )}
          </AnimatePresence>
        </div>
      );

    case "education":
      return (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Education</h2>
              <p className="text-zinc-500 font-medium">Academic background and certifications.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 font-bold h-10 px-4 rounded-xl" onClick={() => updateEducation([...data.education, { school: "", degree: "", year: "" }])}>
              <Plus className="h-4 w-4" /> Add Degree
            </Button>
          </div>
          <div id="field-education" className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="p-6 border rounded-[2rem] space-y-6 bg-zinc-50/30 border-zinc-100">
                <Input value={edu.school} onChange={(e) => {
                  const newEdu = [...data.education];
                  newEdu[i].school = e.target.value;
                  updateEducation(newEdu);
                }} placeholder="University Name" className="h-12 rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                  <Input value={edu.degree} onChange={(e) => {
                    const newEdu = [...data.education];
                    newEdu[i].degree = e.target.value;
                    updateEducation(newEdu);
                  }} placeholder="Degree (e.g. MBA)" className="h-12 rounded-xl" />
                  <Input value={edu.year} onChange={(e) => {
                    const newEdu = [...data.education];
                    newEdu[i].year = e.target.value;
                    updateEducation(newEdu);
                  }} placeholder="Year" className="h-12 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "skills":
      return (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Skills</h2>
              <p className="text-zinc-500 font-medium">Core competencies and tech stack.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-indigo-600 border-indigo-200 bg-indigo-50/50 font-bold h-10 px-4 rounded-xl"
              onClick={() => handleMagicWrite("skills")}
              disabled={isStreaming}
            >
              <Sparkles className="h-4 w-4" />
              Suggest Skills
            </Button>
          </div>
          <div id="field-skills" className="flex flex-wrap gap-3 mb-6">
            {data.skills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="gap-2 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-900 border-none font-bold">
                {skill}
                <button onClick={() => updateSkills(data.skills.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-3.5 w-3.5 text-zinc-400 hover:text-red-500" />
                </button>
              </Badge>
            ))}
          </div>
          <Input 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = e.currentTarget.value.trim();
                if (val && !data.skills.includes(val)) {
                  updateSkills([...data.skills, val]);
                  e.currentTarget.value = "";
                }
              }
            }}
            placeholder="Add a skill and press Enter..."
            className="h-14 rounded-2xl border-zinc-200"
          />
        </div>
      );

    case "template":
      return (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Choose Template</h2>
            <p className="text-zinc-500 font-medium">Select a visual style that matches your career goals.</p>
          </div>
          <TemplateSwitcher />
        </div>
      );

    case "review":
      return (
        <div className="space-y-8 text-center py-20">
          <div className="bg-emerald-50 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10 border border-emerald-100">
            <Sparkles className="h-12 w-12 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-zinc-900">Ready for Export!</h2>
            <p className="text-zinc-500 text-lg max-w-md mx-auto">
              Your high-fidelity career document has been meticulously crafted and audited for ATS optimization.
            </p>
          </div>
        </div>
      );

    default:
      return <div className="text-center py-20 text-zinc-500">Select a section to begin.</div>;
  }
}
