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
      "w-full h-full p-8 overflow-y-auto relative transition-all duration-500",
      template.id === "executive" ? "bg-zinc-100/80" : 
      template.id === "modern" ? "bg-white" : "bg-slate-50"
    )}>
      {/* Premium Studio Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* ATS Score Overlay */}
      {audit && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-12 right-12 z-20"
        >
          <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-full border-4 flex items-center justify-center font-black text-sm shadow-inner",
              audit.score > 80 ? "border-emerald-500 text-emerald-600" : 
              audit.score > 60 ? "border-amber-500 text-amber-600" : "border-red-500 text-red-600"
            )}>
              {audit.score}%
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">ATS Fidelity</div>
              <div className="text-xs font-bold text-zinc-600">{audit.passed ? "Verified Premium" : "Needs Review"}</div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        key={selectedTemplate}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "max-w-[800px] mx-auto bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] min-h-[1056px] transition-all relative overflow-hidden",
          template.styles.fontFamily,
          template.id === "brutalist" && "border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]",
          !isSidebar && "p-14"
        )}
      >
        {/* SIDEBAR LAYOUT (Executive Premium) */}
        {isSidebar ? (
          <div className="flex min-h-[1056px]">
            {/* Sidebar Column */}
            <div 
              className="w-[280px] p-12 text-white flex flex-col gap-10 relative overflow-hidden"
              style={{ backgroundColor: template.styles.accentColor }}
            >
              {/* Decorative background for sidebar */}
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-[150%] h-[50%] bg-white blur-[100px] rounded-full rotate-45" />
              </div>

              {/* Avatar Section */}
              <div className="relative group/avatar cursor-pointer" onClick={() => handleSectionClick("personal", "photo")}>
                <div className="w-24 h-24 rounded-3xl bg-white/20 p-1 backdrop-blur-sm border border-white/30 overflow-hidden shadow-2xl relative z-10">
                  <img 
                    src={personalInfo.photo || `https://i.pravatar.cc/150?u=${personalInfo.email || 'exec'}`} 
                    alt={personalInfo.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-full border-4 border-emerald-500 z-20 flex items-center justify-center shadow-lg" style={{ borderColor: template.styles.accentColor }}>
                  <Globe className="h-3 w-3 text-zinc-900" />
                </div>
              </div>
              
              <div className="space-y-8 relative z-10">
                <section onClick={() => handleSectionClick("personal", "name")} className="space-y-4 cursor-pointer">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Contact Network</h3>
                  <div className="space-y-4">
                    {personalInfo.email && (
                      <div className="flex items-start gap-4">
                        <div className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                           <Mail className="h-3 w-3 opacity-90" />
                        </div>
                        <span className="text-[11px] leading-tight break-all font-medium opacity-90">{personalInfo.email}</span>
                      </div>
                    )}
                    {personalInfo.phone && (
                      <div className="flex items-start gap-4">
                        <div className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                           <Phone className="h-3 w-3 opacity-90" />
                        </div>
                        <span className="text-[11px] font-medium opacity-90">{personalInfo.phone}</span>
                      </div>
                    )}
                    {personalInfo.location && (
                      <div className="flex items-start gap-4">
                        <div className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                           <MapPin className="h-3 w-3 opacity-90" />
                        </div>
                        <span className="text-[11px] font-medium opacity-90">{personalInfo.location}</span>
                      </div>
                    )}
                  </div>
                </section>

                <section onClick={() => handleSectionClick("skills", "skills")} className="space-y-6 pt-4 cursor-pointer">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Core Expertise</h3>
                  <div className="space-y-5">
                    {skills.length > 0 ? skills.map((skill, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                          <span>{skill}</span>
                          <span className="opacity-60">{90 - (i * 5)}%</span>
                        </div>
                        <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${90 - (i * 5)}%` }}
                             transition={{ duration: 1, delay: 0.5 }}
                             className="h-full bg-white/60 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
                           />
                        </div>
                      </div>
                    )) : <p className="text-[10px] opacity-40 italic">Mapping your high-level skills...</p>}
                  </div>
                </section>

                <div className="mt-auto pt-10">
                   <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Status</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Executive Ready</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="flex-1 p-14 bg-white relative">
               {/* Name Header */}
               <header 
                onClick={() => handleSectionClick("personal", "name")}
                className="mb-14 group/header cursor-pointer relative"
               >
                 <div className="absolute -left-14 top-0 w-1 h-full opacity-10" style={{ backgroundColor: template.styles.accentColor }} />
                 <h1 className="text-5xl font-black tracking-tighter text-zinc-900 mb-3 uppercase leading-none">
                    {personalInfo.name || "Executive Name"}
                 </h1>
                 <div className="flex items-center gap-4">
                   <div className="h-[2px] w-12 bg-zinc-900" />
                   <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Strategic Business Leader</p>
                 </div>
               </header>

               <div className="space-y-12">
                 {/* Summary Section */}
                 <section onClick={() => handleSectionClick("summary", "summary")} className={sectionClasses}>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-4 w-4 rounded-full bg-zinc-900/5 flex items-center justify-center">
                         <div className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                       </div>
                       <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Professional Narrative</h2>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                      {summary || "Architecting the future through strategic leadership and data-driven results..."}
                    </p>
                 </section>

                 {/* Experience Section */}
                 <section onClick={() => handleSectionClick("experience", "experience")} className={sectionClasses}>
                    <div className="flex items-center gap-3 mb-10">
                       <div className="h-4 w-4 rounded-full bg-zinc-900/5 flex items-center justify-center">
                         <div className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                       </div>
                       <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Career Trajectory</h2>
                    </div>
                    <div className="space-y-12">
                       {experience.length > 0 ? experience.map((exp, i) => (
                         <div key={i} className="relative pl-8 border-l border-zinc-100">
                           <div 
                             className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full border-2 border-white shadow-sm" 
                             style={{ backgroundColor: template.styles.accentColor }}
                           />
                           <div className="flex justify-between items-baseline mb-2">
                             <h3 className="font-black text-zinc-900 text-base tracking-tight leading-none">{exp.role || exp.title || "Elite Position"}</h3>
                             <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-md">{exp.period || `${exp.startDate} - ${exp.endDate || "Present"}`}</span>
                           </div>
                           <div className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: template.styles.accentColor }}>
                             {exp.company || "Fortune 500 Co."}
                             <div className="h-1 w-1 rounded-full bg-current opacity-30" />
                             <span className="opacity-60">High Performance Mode</span>
                           </div>
                           <p className="text-[12px] text-zinc-600 leading-relaxed whitespace-pre-wrap font-medium">{exp.description}</p>
                         </div>
                       )) : (
                         <div className="space-y-4 opacity-10">
                           <div className="h-4 bg-zinc-100 rounded w-3/4" />
                           <div className="h-4 bg-zinc-100 rounded w-1/2" />
                         </div>
                       )}
                    </div>
                 </section>

                 {/* Education Section */}
                 <section onClick={() => handleSectionClick("education", "education")} className={sectionClasses}>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="h-4 w-4 rounded-full bg-zinc-900/5 flex items-center justify-center">
                         <div className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                       </div>
                       <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Academic Foundation</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       {education.length > 0 ? education.map((edu, i) => (
                         <div key={i} className="group/edu">
                           <h4 className="text-[11px] font-black text-zinc-900 uppercase mb-1">{edu.degree || "Advanced Degree"}</h4>
                           <p className="text-[10px] text-zinc-500 font-bold group-hover/edu:text-zinc-900 transition-colors">{edu.school || edu.institution || "Top Tier University"}</p>
                         </div>
                       )) : <p className="text-[10px] text-zinc-300 italic">Adding educational credentials...</p>}
                    </div>
                 </section>
               </div>

               {/* Quality Seal */}
               <div className="absolute bottom-10 right-14 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="flex flex-col items-end">
                    <div className="text-[8px] font-black uppercase tracking-[0.5em] mb-2">Authenticated By</div>
                    <div className="h-8 w-24 bg-zinc-900 rounded-sm flex items-center justify-center text-white text-[9px] font-black tracking-widest italic">CVLETTERAI</div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          /* CLASSIC & MODERN LAYOUTS (Titan, Swiss, etc) - Enhanced */
          <>
            <header 
              onClick={() => handleSectionClick("personal", "name")}
              className={cn(
                "mb-14 group/header cursor-pointer relative rounded-2xl -m-4 p-4 hover:bg-zinc-50/80 transition-all duration-500",
                isModern ? "flex justify-between items-center border-b pb-10" : 
                isCompact ? "flex items-center gap-12 border-b pb-8" : "text-center border-b-4 border-zinc-900 pb-12"
              )}
            >
              {/* Profile Image for non-sidebar layouts */}
              {!isSidebar && (
                <div className={cn(
                  "flex items-center gap-8",
                  (isModern || isCompact) ? "flex-row" : "flex-col mb-8"
                )}>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                    <img 
                      src={personalInfo.photo || `https://i.pravatar.cc/150?u=${personalInfo.email || 'exec'}`} 
                      alt={personalInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={cn(isCompact && "flex-1", !isModern && !isCompact && "text-center")}>
                    {template.id === "titan" && (
                      <div className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-4">Elite Professional Protocol</div>
                    )}
                    <h1 className={cn(
                      "font-black tracking-tighter text-zinc-900 mb-2 uppercase leading-none",
                      template.id === "titan" ? "text-7xl" : "text-5xl",
                      template.id === "brutalist" && "bg-black text-white px-6 py-4 inline-block transform -rotate-1"
                    )}>
                      {personalInfo.name || "Full Name"}
                    </h1>
                    <div className={cn(
                      "flex flex-wrap gap-8 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mt-6",
                      (isModern || isCompact) ? "justify-start" : "justify-center"
                    )}>
                      {personalInfo.email && <span className="flex items-center gap-2 hover:text-zinc-900 transition-colors"><Mail className="h-3.5 w-3.5" /> {personalInfo.email}</span>}
                      {personalInfo.phone && <span className="flex items-center gap-2 hover:text-zinc-900 transition-colors"><Phone className="h-3.5 w-3.5" /> {personalInfo.phone}</span>}
                      {personalInfo.location && <span className="flex items-center gap-2 hover:text-zinc-900 transition-colors"><MapPin className="h-3.5 w-3.5" /> {personalInfo.location}</span>}
                    </div>
                  </div>
                </div>
              )}
            </header>

            <div className={cn(
              "grid gap-16",
              isGrid ? "grid-cols-2" : "grid-cols-1",
              template.id === "swiss" && "divide-y-2 divide-zinc-50"
            )}>
              {/* Summary */}
              <section 
                onClick={() => handleSectionClick("summary", "summary")}
                className={cn(sectionClasses, template.id === "swiss" && "py-10")}
              >
                <div className="flex items-center gap-6 mb-6">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900">Mission Statement</h2>
                   <div className="flex-1 h-[2px] bg-zinc-900/5" />
                </div>
                <p className="text-zinc-600 leading-relaxed text-base font-medium">
                  {summary || "Strategic visionary with a track record of driving monumental growth and innovation..."}
                </p>
              </section>

              {/* Work Experience */}
              <section 
                onClick={() => handleSectionClick("experience", "experience")}
                className={cn(sectionClasses, template.id === "swiss" && "py-10")}
              >
                <div className="flex items-center gap-6 mb-10">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900">Proven Results</h2>
                   <div className="flex-1 h-[2px] bg-zinc-900/5" />
                </div>
                <div className="space-y-14">
                  {experience.length > 0 ? experience.map((exp, i) => (
                    <div key={i} className={cn(
                      "group/exp relative transition-all duration-500",
                      template.id === "brutalist" && "border-8 border-black p-10 bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    )}>
                      <div className="flex justify-between items-baseline mb-4">
                        <h3 className="font-black text-zinc-900 text-2xl tracking-tighter leading-none group-hover/exp:text-emerald-600 transition-colors">{exp.role || exp.title || "Global Leader"}</h3>
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest bg-zinc-100 px-3 py-1.5 rounded-full">{exp.period || `${exp.startDate} - ${exp.endDate || "Present"}`}</span>
                      </div>
                      <div className="text-[12px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3" style={{ color: template.styles.accentColor }}>
                        {exp.company || "Major Enterprise"}
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="opacity-50">Impact Factor: High</span>
                      </div>
                      <p className="text-base text-zinc-600 leading-relaxed whitespace-pre-wrap font-medium">{exp.description}</p>
                    </div>
                  )) : (
                    <div className="py-10 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                       <p className="text-zinc-300 font-black uppercase tracking-widest text-xs">Awaiting Professional Input</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Skills & Education Grid */}
              <div className="grid grid-cols-2 gap-16">
                 <section onClick={() => handleSectionClick("skills", "skills")} className={sectionClasses}>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900 mb-8">Competency Matrix</h2>
                    <div className="flex flex-wrap gap-3">
                      {skills.length > 0 ? skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow-lg">
                          {skill}
                        </span>
                      )) : <p className="text-[10px] text-zinc-300 italic">Analyzing skills...</p>}
                    </div>
                 </section>

                 <section onClick={() => handleSectionClick("education", "education")} className={sectionClasses}>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900 mb-8">Credentials</h2>
                    <div className="space-y-6">
                       {education.length > 0 ? education.map((edu, i) => (
                         <div key={i} className="border-l-4 border-zinc-900 pl-6 group/edu">
                            <h4 className="text-[12px] font-black text-zinc-900 uppercase mb-1 tracking-tight">{edu.degree || "Academic Excellence"}</h4>
                            <p className="text-[11px] text-zinc-400 font-black group-hover/edu:text-zinc-900 transition-colors">{edu.school || edu.institution || "Ivy League Partner"}</p>
                         </div>
                       )) : <p className="text-[10px] text-zinc-300 italic">Listing credentials...</p>}
                    </div>
                 </section>
              </div>
            </div>

            {/* Professional Footer Badge */}
            <div className="mt-24 pt-12 border-t-2 border-zinc-50 flex justify-between items-center opacity-30 grayscale mix-blend-multiply">
               <div className="flex gap-6 items-center">
                  <div className="h-10 w-10 rounded-2xl bg-zinc-100 rotate-12" />
                  <div className="h-10 w-10 rounded-2xl bg-zinc-100 -rotate-12" />
               </div>
               <div className="text-right">
                 <div className="text-[8px] font-black uppercase tracking-[0.6em] mb-1">CVLetterAI Output</div>
                 <span className="text-[10px] font-black tracking-[0.2em]">CVLETTERAI PLATFORM V2.0</span>
               </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
