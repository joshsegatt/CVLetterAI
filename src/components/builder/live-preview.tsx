"use client";
import { useWizardStore } from "@/store/wizard-store";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEMPLATES } from "@/lib/templates/registry";

export function LivePreview() {
  const { data, audit, selectedTemplate, documentType, setStep, setFocusedSection } = useWizardStore();
  const { personalInfo, experience, education, skills, summary } = data;

  const template = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  const isModern = template.styles.layout === "modern";
  const isSidebar = template.styles.layout === "sidebar";
  const isGrid = template.styles.layout === "grid";
  const isCompact = template.styles.layout === "compact";

  const handleSectionClick = (step: any, sectionId: string) => {
    setStep(step);
    setFocusedSection(sectionId);
  };

  const sectionClasses = "relative group/section cursor-pointer transition-all duration-300 rounded-lg -m-2 p-2 hover:bg-zinc-50/50 hover:ring-1 hover:ring-zinc-200/50";

  if (documentType === "cover_letter") {
    return (
      <div className={cn(
        "w-full h-full p-8 overflow-y-auto relative transition-colors duration-500",
        template.id === "executive" ? "bg-zinc-100/80" : 
        template.id === "modern" ? "bg-white" : "bg-slate-50"
      )}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "max-w-[800px] mx-auto bg-white shadow-2xl min-h-[1056px] p-12 transition-all",
            template.styles.fontFamily,
            isModern ? "rounded-none border-t-8" : "rounded-sm",
          )}
          style={{ borderTopColor: template.styles.accentColor }}
        >
          {/* Header Same as CV */}
          <header 
            onClick={() => handleSectionClick("personal", "name")}
            className={cn(
              "mb-12 group/header cursor-pointer relative rounded-lg -m-2 p-2 hover:bg-zinc-50/50 hover:ring-1 hover:ring-zinc-200/50 transition-all",
              isModern ? "flex justify-between items-end border-b pb-6" : "text-left border-b pb-8"
            )}
          >
            <div>
              <h1 className="font-black text-4xl tracking-tight text-zinc-900 mb-2 uppercase">
                {personalInfo.name || "Your Name"}
              </h1>
              <div className="flex flex-wrap gap-4 text-zinc-500 text-sm">
                {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {personalInfo.email}</span>}
                {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {personalInfo.phone}</span>}
                {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {personalInfo.location}</span>}
              </div>
            </div>
          </header>

          <div className="space-y-6 max-w-[600px]">
            <div className="text-sm text-zinc-400 font-medium mb-8">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            
            <div className="space-y-1 mb-8">
              <div className="text-sm font-bold text-zinc-900">Hiring Manager</div>
              <div className="text-sm text-zinc-600">Company Name</div>
              <div className="text-sm text-zinc-600">Company Location</div>
            </div>

            <div 
              onClick={() => handleSectionClick("summary", "summary")}
              className={cn(sectionClasses, "min-h-[400px]")}
            >
              <p className="text-zinc-700 leading-relaxed text-sm whitespace-pre-wrap">
                {summary || "Your matching cover letter content will appear here..."}
              </p>
            </div>

            <div className="pt-12">
              <div className="text-sm text-zinc-600">Sincerely,</div>
              <div className="text-base font-bold text-zinc-900 mt-2">{personalInfo.name || "Your Name"}</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full h-full p-8 overflow-y-auto relative transition-colors duration-500",
      template.id === "executive" ? "bg-zinc-100/80" : 
      template.id === "modern" ? "bg-white" : "bg-slate-50"
    )}>
      {/* ATS Score Overlay */}
      {audit && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-12 right-12 z-20"
        >
          <div className="bg-white p-3 rounded-xl shadow-xl border flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-full border-4 flex items-center justify-center font-bold text-sm",
              audit.score > 80 ? "border-green-500 text-green-600" : 
              audit.score > 60 ? "border-amber-500 text-amber-600" : "border-red-500 text-red-600"
            )}>
              {audit.score}%
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">ATS Score</div>
              <div className="text-xs font-semibold text-zinc-600">{audit.passed ? "Optimized" : "Needs Work"}</div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        key={selectedTemplate}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "max-w-[800px] mx-auto bg-white shadow-2xl min-h-[1056px] p-12 transition-all",
          template.styles.fontFamily,
          isModern ? "rounded-none border-t-8" : "rounded-sm",
          template.id === "brutalist" && "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        )}
        style={{ borderTopColor: template.id !== "brutalist" ? template.styles.accentColor : "black" }}
      >
        {/* Dynamic Header */}
        <header 
          onClick={() => handleSectionClick("personal", "name")}
          className={cn(
            "mb-8 group/header cursor-pointer relative rounded-lg -m-2 p-2 hover:bg-zinc-50/50 hover:ring-1 hover:ring-zinc-200/50 transition-all",
            isModern ? "flex justify-between items-end border-b pb-6" : 
            isCompact ? "flex items-center gap-6 border-b pb-4" : "text-center border-b pb-8"
          )}
        >
          <div className={cn(isCompact && "flex-1")}>
            <h1 className={cn(
              "font-black tracking-tight text-zinc-900 mb-2 uppercase transition-colors group-hover/header:text-indigo-600",
              template.id === "titan" ? "text-5xl" : "text-4xl",
              template.id === "brutalist" && "bg-black text-white px-2 py-1 inline-block"
            )}>
              {personalInfo.name || "Your Name"}
            </h1>
            <div className={cn(
              "flex flex-wrap gap-4 text-zinc-500 text-sm",
              (isModern || isCompact) ? "justify-start" : "justify-center"
            )}>
              {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {personalInfo.location}</span>}
            </div>
          </div>
        </header>

        <div className={cn(
          "grid gap-8",
          (isModern || isSidebar) ? "grid-cols-[1fr_250px]" : 
          isGrid ? "grid-cols-2" : "grid-cols-1"
        )}>
          <div className="space-y-8">
            {/* Summary */}
            <section 
              onClick={() => handleSectionClick("summary", "summary")}
              className={sectionClasses}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 group-hover/section:text-indigo-600 transition-colors" style={{ color: template.styles.accentColor }}>Professional Summary</h2>
              <p className="text-zinc-700 leading-relaxed text-sm whitespace-pre-wrap">
                {summary || "Write a brief overview of your professional background and key achievements."}
              </p>
            </section>

            {/* Experience */}
            <section 
              onClick={() => handleSectionClick("experience", "experience")}
              className={sectionClasses}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 group-hover/section:text-indigo-600 transition-colors" style={{ color: template.styles.accentColor }}>Experience</h2>
              <div className="space-y-6">
                {experience.length > 0 ? experience.map((exp, i) => (
                  <div key={i} className={cn(template.id === "brutalist" && "border-2 border-black p-3")}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900">{exp.role || exp.title || "Job Title"}</h3>
                      <span className="text-xs text-zinc-400 font-medium">{exp.period || `${exp.startDate} - ${exp.endDate || "Present"}`}</span>
                    </div>
                    <div className="text-sm font-bold text-zinc-600 mb-2">{exp.company || "Company Name"}</div>
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                )) : (
                  <p className="text-sm text-zinc-400 italic">Add your work history...</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Secondary Sections */}
          <div className="space-y-8">
             {/* Skills */}
             <section 
              onClick={() => handleSectionClick("skills", "skills")}
              className={sectionClasses}
             >
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 group-hover/section:text-indigo-600 transition-colors" style={{ color: template.styles.accentColor }}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((skill, i) => (
                  <span key={i} className={cn(
                    "text-xs px-2 py-1 rounded font-medium border transition-all",
                    template.id === "brutalist" ? "bg-black text-white border-black" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                  )}>
                    {skill}
                  </span>
                )) : (
                  <p className="text-sm text-zinc-400 italic">Add your core skills...</p>
                )}
              </div>
            </section>

            {/* Education */}
            <section 
              onClick={() => handleSectionClick("education", "education")}
              className={sectionClasses}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 group-hover/section:text-indigo-600 transition-colors" style={{ color: template.styles.accentColor }}>Education</h2>
              <div className="space-y-4">
                {education.length > 0 ? education.map((edu, i) => (
                  <div key={i}>
                    <div className="text-sm font-bold text-zinc-900">{edu.degree || "Degree"}</div>
                    <div className="text-xs text-zinc-600">{edu.school || edu.institution || "Institution"}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">{edu.year || edu.period || "Year"}</div>
                  </div>
                )) : (
                  <p className="text-sm text-zinc-400 italic">Add your education...</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
