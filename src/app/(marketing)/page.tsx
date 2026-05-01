"use client";

import Link from "next/link";
import Image from "next/image";
import mockupImg from "../../../public/executive_mockup.png"; // Placeholder for the mockup
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Zap, 
  Layout, 
  ShieldCheck,
  Building2,
  Download,
  Sparkles,
  MousePointer2,
  Users,
  Search,
  MessageSquare,
  ChevronRight,
  Rocket,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="bg-white selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden antialiased">
      
      {/* 1. HERO SECTION (THE HOOK) */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* Diagonal Stylized Curved Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1440 800" 
            preserveAspectRatio="none"
          >
            <path 
              fill="#ecfdf5" 
              fillOpacity="1" 
              d="M0,800 L1440,800 L1440,150 C1100,450 600,150 0,550 Z"
            ></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                
                <h1 className="text-4xl md:text-[48px] font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
                  Beat the ATS. <br />Land the Interview. <br />
                  <span className="text-emerald-500">In 30 Seconds.</span>
                </h1>
                
                <p className="text-base text-zinc-600 leading-relaxed font-medium max-w-lg">
                  Stop wasting hours on generic templates that recruiters ignore. Our AI-powered Resume Builder identifies job-specific keywords to ensure you score 95%+ on any ATS scanner.
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="xl" 
                  className="h-14 px-10 rounded-xl bg-zinc-900 hover:bg-black text-white text-base font-bold shadow-xl transition-all" 
                  onClick={() => router.push("/onboarding")}
                >
                  Create My AI CV
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="xl" 
                  className="h-14 px-10 rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-base font-bold transition-all"
                  onClick={() => router.push("/onboarding")}
                >
                  View Examples
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-100 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Trusted by 12,000+ candidates</p>
              </div>
            </div>

            {/* SENIOR LEVEL HERO MOCKUP: THE ELITE EXPERIENCE */}
            <div className="relative group">
              {/* Background Glows */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-blue-500/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              
              {/* Main Browser Window */}
              <motion.div 
                initial={{ opacity: 0, x: 20, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 bg-white rounded-[2.5rem] border border-zinc-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                {/* Browser Toolbar */}
                <div className="h-12 bg-zinc-50/80 backdrop-blur-sm border-b border-zinc-100 flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-zinc-200" />
                    <div className="h-3 w-3 rounded-full bg-zinc-200" />
                    <div className="h-3 w-3 rounded-full bg-zinc-200" />
                  </div>
                  <div className="bg-white border border-zinc-200 px-4 py-1 rounded-full text-[10px] text-zinc-400 font-bold tracking-tight">
                    cvletter.ai/editor/document_01
                  </div>
                  <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Editor Content Preview (Compact & Refined) */}
                <div className="p-6 bg-zinc-50/30 flex gap-5">
                  {/* Left Column: CV Preview (Streamlined) */}
                  <div className="flex-1 bg-white rounded-xl shadow-xl border border-zinc-100 p-6 space-y-5 relative overflow-hidden">
                    {/* Scanning Beam Effect */}
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent z-10 pointer-events-none"
                    />

                    <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-12 w-12 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 shadow-sm shrink-0"
                      >
                        <img src="https://i.pravatar.cc/150?u=alex" alt="User" className="h-full w-full object-cover" />
                      </motion.div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-black text-zinc-900 leading-tight">Alexander Bennett</h3>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Senior Cloud Architect</p>
                        <div className="h-1 w-16 bg-zinc-100 rounded-full mt-1" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <h4 className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Summary</h4>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="text-[9px] text-zinc-500 leading-relaxed font-medium"
                        >
                          Cloud Architect with 10+ years experience in AWS & Scalability.
                        </motion.p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Experience</h4>
                        
                        {/* THE AI OPTIMIZATION SHOWCASE (Compact) */}
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.5 }}
                          className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 relative group/line"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[8px] font-black text-emerald-700 uppercase">AI ATS Optimization</span>
                          </div>
                          <p className="text-[10px] text-zinc-900 font-bold leading-tight">
                            "Spearheaded legacy migration to serverless, cutting costs by 40%."
                          </p>
                        </motion.div>

                        <div className="space-y-1.5 opacity-30">
                           <div className="h-1.5 w-full bg-zinc-100 rounded-full" />
                           <div className="h-1.5 w-2/3 bg-zinc-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Insights Panel (Compact) */}
                  <div className="w-44 space-y-3 hidden lg:block">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                      className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm space-y-3"
                    >
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-zinc-400 uppercase">ATS Score</span>
                          <Sparkles className="h-3 w-3 text-emerald-500" />
                       </div>
                       <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-black">
                             <span className="text-emerald-600">98% Perfect</span>
                          </div>
                          <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: "98%" }}
                               transition={{ duration: 2, delay: 1.5 }}
                               className="h-full bg-emerald-500"
                             />
                          </div>
                       </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 }}
                      className="p-4 bg-zinc-900 rounded-xl shadow-xl text-white space-y-2 relative"
                    >
                       <p className="text-[9px] font-bold leading-tight">Find more keywords?</p>
                       <button className="w-full py-1.5 bg-emerald-500 text-zinc-900 rounded-lg text-[9px] font-black transition-all">
                          OPTIMIZE
                       </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING WIDGET: ATS SCORE CIRCLE */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -left-12 top-1/4 z-20 bg-white p-4 rounded-3xl shadow-2xl border border-zinc-100 flex flex-col items-center gap-2"
              >
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="h-full w-full rotate-[-90deg]">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-zinc-50" />
                    <motion.circle 
                      cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" 
                      className="text-emerald-500"
                      strokeDasharray="175.9"
                      initial={{ strokeDashoffset: 175.9 }}
                      animate={{ strokeDashoffset: 175.9 * 0.15 }} // 85% score
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-zinc-900">85</span>
                </div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center">ATS <br/> Score</span>
              </motion.div>

              {/* FLOATING WIDGET: AI SUGGESTION BOX */}
              <motion.div 
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -right-8 -bottom-4 z-20 bg-zinc-900 p-5 rounded-[2rem] shadow-2xl border border-zinc-800 max-w-[240px] space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Live Suggestion</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Change <span className="text-red-400 font-bold strike">"Worked on"</span> to <span className="text-white font-bold underline decoration-emerald-500 decoration-2">"Spearheaded"</span> to increase leadership score by +12%.
                </p>
                <div className="flex justify-end pt-1">
                   <div className="h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <ChevronRight className="h-3 w-3 text-white" />
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / TRUST BAR */}
      <section className="py-12 border-y border-zinc-50 bg-zinc-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-10">
            Our users have landed roles at industry leaders:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            {[
              { name: "Google", color: "text-blue-500/80 hover:text-blue-500" },
              { name: "Amazon", color: "text-[#FF9900]/80 hover:text-[#FF9900]" },
              { name: "Meta", color: "text-[#0668E1]/80 hover:text-[#0668E1]" },
              { name: "Tesla", color: "text-[#E81828]/80 hover:text-[#E81828]" },
              { name: "Deloitte", color: "text-[#86BC25]/80 hover:text-[#86BC25]" },
              { name: "GoldmanSachs", color: "text-[#003764]/80 hover:text-[#003764]" }
            ].map(brand => (
              <span 
                key={brand.name} 
                className={cn(
                  "text-xl font-black tracking-tighter transition-all duration-300 cursor-default grayscale-[0.5] hover:grayscale-0",
                  brand.color,
                  "hover:scale-110"
                )}
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI EDITOR SHOWCASE (CARD & MOCKUP) */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[400px] flex items-center justify-center">
               <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
               
               {/* THE MOCKUP CONTAINER */}
               <div className="relative w-full max-w-lg aspect-[1.4/1] bg-white rounded-[2rem] border border-zinc-200/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden p-8 flex flex-col gap-6">
                  
                  {/* Background Resume (Realistic Executive Structure) */}
                  <div className="absolute inset-0 p-8 opacity-60 blur-[1px] select-none pointer-events-none">
                     <div className="space-y-4">
                        <div className="flex items-start gap-4 border-b border-zinc-100 pb-5">
                           {/* Blurred Profile Photo */}
                           <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 opacity-40">
                              <img src="https://i.pravatar.cc/100?u=mock" alt="Profile" className="h-full w-full object-cover blur-[1px]" />
                           </div>
                           <div className="space-y-2 flex-1">
                              <div className="h-4 w-32 bg-zinc-100 rounded" />
                              <div className="flex gap-2 pt-1">
                                 <div className="h-1.5 w-12 bg-zinc-50 rounded" />
                                 <div className="h-1.5 w-16 bg-zinc-50 rounded" />
                                 <div className="h-1.5 w-10 bg-zinc-50 rounded opacity-50" />
                              </div>
                           </div>
                        </div>
                        
                        <div className="space-y-4 pt-2">
                           <div className="h-3 w-40 bg-zinc-100 rounded font-black text-[10px] flex items-center px-2 uppercase tracking-widest">Work Experience</div>
                           <div className="space-y-2">
                              <div className="h-2 w-full bg-zinc-50 rounded" />
                              <div className="h-2 w-full bg-zinc-50 rounded" />
                              <div className="h-2 w-3/4 bg-zinc-50 rounded opacity-50" />
                           </div>
                        </div>

                        <div className="space-y-3 pt-2">
                           <div className="h-3 w-24 bg-zinc-100 rounded font-black text-[10px] flex items-center px-2 uppercase tracking-widest">Skills</div>
                           <div className="flex gap-2">
                              <div className="h-4 w-16 bg-zinc-50 rounded-md" />
                              <div className="h-4 w-20 bg-zinc-50 rounded-md" />
                              <div className="h-4 w-12 bg-zinc-50 rounded-md opacity-50" />
                           </div>
                           <div className="flex gap-2">
                              <div className="h-4 w-14 bg-zinc-50 rounded-md" />
                              <div className="h-4 w-18 bg-zinc-50 rounded-md opacity-50" />
                           </div>
                        </div>

                        <div className="space-y-2 pt-2 opacity-30">
                           <div className="h-3 w-28 bg-zinc-100 rounded font-black text-[10px] flex items-center px-2 uppercase tracking-widest">Education</div>
                           <div className="h-2 w-40 bg-zinc-50 rounded" />
                        </div>
                     </div>
                  </div>

                  {/* Highlighted Interaction Area */}
                  <div className="relative z-10 mt-20 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-lg inline-block self-start">
                     <p className="text-[12px] text-zinc-900 font-bold italic opacity-60 line-through decoration-emerald-500/50">"Managed a team of 15 people daily."</p>
                     
                     {/* Mouse Cursor Overlay */}
                     <motion.div 
                        initial={{ x: 20, y: 20, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="absolute -right-2 -bottom-2 z-30"
                     >
                        <MousePointer2 className="h-5 w-5 text-zinc-900 fill-zinc-900 drop-shadow-md" />
                     </motion.div>
                  </div>

                  {/* AI CONTEXTUAL OVERLAY (Floating Tooltip) */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20, scale: 0.9 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                     className="absolute top-[64%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-20 w-[280px] bg-[#121212] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-zinc-800 p-5 space-y-4"
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                              <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                           </div>
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Suggestion</span>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[7px] font-black tracking-widest uppercase">ATS OPTIMIZED</Badge>
                     </div>

                     <div className="space-y-2">
                        <p className="text-[12px] text-white font-bold leading-relaxed">
                           "Spearheaded a cross-functional team of 15, <span className="text-emerald-400">increasing throughput by 22%</span>."
                        </p>
                     </div>

                     <div className="pt-2">
                        <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                           Apply
                           <Check className="h-3.5 w-3.5" />
                        </button>
                     </div>
                  </motion.div>
               </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-zinc-900 leading-tight">
                Smart AI Resume Builder: <br />
                <span className="text-emerald-500">Your Career, Articulated.</span>
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed font-medium">
                Most CVs are discarded because of weak action verbs. Our AI Resume Builder analyzes your role and suggests high-impact, recruiter-validated phrasing that highlights your achievements, not just your duties.
              </p>
              <ul className="space-y-4 pt-4">
                {["One-click phrasing optimization", "Industry-specific action verbs", "Real-time achievement extraction"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COVER LETTER AI (CARD & MOCKUP) */}
      <section className="py-20 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-zinc-900 leading-tight">
                The End of <br />
                <span className="text-emerald-500">Generic Cover Letters.</span>
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed font-medium">
                Generate a context-aware Cover Letter for every application. Our generator reads the job description to match your tone and skills perfectly to the company culture and specific role requirements.
              </p>
              <Button 
                onClick={() => router.push("/onboarding")}
                className="bg-zinc-900 hover:bg-black text-white px-8 h-14 rounded-xl font-bold"
              >
                Start Writing Now
              </Button>
            </div>
            <div className="relative h-[400px] flex items-center justify-center">
               <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
               
               {/* THE COVER LETTER MOCKUP CONTAINER */}
               <div className="relative w-full max-w-lg aspect-[1.4/1] bg-white rounded-[2rem] border border-zinc-200/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden p-8 flex flex-col gap-6">
                  
                  {/* Background Document (Traditional Letter - Real Structure) */}
                  <div className="absolute inset-0 p-10 opacity-80 blur-none select-none pointer-events-none flex flex-col gap-5">
                     <div className="space-y-1">
                        <div className="h-1.5 w-24 bg-zinc-100 rounded" />
                        <div className="h-1.5 w-32 bg-zinc-50 rounded" />
                        <p className="text-[9px] text-zinc-300 font-bold">April 24, 2024</p>
                     </div>
                     
                     <div className="space-y-1">
                        <p className="text-[9px] text-zinc-400 font-bold">To: Hiring Manager</p>
                        <div className="h-1.5 w-40 bg-zinc-50 rounded" />
                     </div>

                     <div className="space-y-4 pt-2">
                        <div className="h-3 w-40 bg-zinc-200 rounded font-black text-[10px] flex items-center px-2">TRADITIONAL FORMAT</div>
                        
                        <div className="space-y-3">
                           <p className="text-[10px] text-zinc-400 font-medium leading-relaxed max-w-[280px]">
                              Dear Hiring Manager, <br />
                              I am writing to formally apply for the position advertised on your company website. With over five years of experience in administrative support and team coordination, I have developed a strong foundation in managing daily operations and ensuring organizational efficiency.
                           </p>
                           
                           <p className="text-[10px] text-zinc-400 font-medium leading-relaxed max-w-[260px] opacity-60">
                              Throughout my career, I have consistently demonstrated a commitment to excellence and a proactive approach to problem-solving. I am confident that my background and skills would be a valuable asset to your team, and I am eager to bring my expertise to your esteemed organization.
                           </p>

                           <p className="text-[10px] text-zinc-400 font-medium leading-relaxed max-w-[240px] opacity-40">
                              I have enclosed my resume for your review and would appreciate the opportunity to discuss my qualifications in an interview. Thank you for considering my application.
                           </p>
                        </div>

                        <div className="pt-4 opacity-40 space-y-2">
                           <p className="text-[10px] text-zinc-400 font-bold">Sincerely,</p>
                           <div className="h-3 w-28 bg-zinc-100 rounded opacity-50" />
                           <p className="text-[9px] text-zinc-300">John Candidate</p>
                        </div>
                     </div>
                  </div>

                  {/* AI ENHANCED OVERLAY (Right Side Focus) */}
                  <motion.div 
                     initial={{ opacity: 0, x: 40 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                     className="absolute top-1/2 right-6 -translate-y-1/2 z-20 w-[300px] bg-zinc-900 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-zinc-800 p-6 space-y-5"
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                              <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                           </div>
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">cvletterai Enhanced</span>
                        </div>
                        <Badge className="bg-emerald-400 text-zinc-900 border-none text-[7px] font-black tracking-widest uppercase">Context Matched</Badge>
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                           <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">Job Ad Intelligence</span>
                        </div>
                        <p className="text-[13px] text-white font-bold leading-relaxed">
                           "As an avid user of your new analytics feature, I scaled my previous team's retention by <span className="text-emerald-400">30%</span> through context-aware growth strategies."
                        </p>
                     </div>

                     <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-zinc-500">Matching Culture: High</span>
                        <div className="flex gap-1">
                           {[1, 2, 3].map(i => (
                              <div key={i} className="h-1 w-3 bg-emerald-500 rounded-full" />
                           ))}
                        </div>
                     </div>
                  </motion.div>

                  {/* Subtle Connecting Line or Sparkle */}
                  <motion.div 
                     animate={{ opacity: [0.2, 0.5, 0.2] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="absolute left-[35%] top-[45%] h-12 w-12 rounded-full bg-emerald-500/10 blur-xl"
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ATS-FRIENDLY GUARANTEE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-6 tracking-tight">
              100% ATS Optimization. <span className="text-emerald-500">Guaranteed.</span>
            </h2>
            <p className="text-base text-zinc-600 leading-relaxed font-medium">
              We don't use "broken" graphic elements or complex columns that confuse scanners. Our templates are built on the 'Swiss Standard'—clean, machine-readable, and human-loved.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              { title: "Machine Readable", desc: "Pure text-based structure that Workday, Taleo, and Greenhouse love.", icon: Search },
              { title: "Keyword Injection", desc: "Automatically inject missing skills based on the Job Description.", icon: Zap },
              { title: "Standard Layouts", desc: "No tables or images that trip up older ATS systems.", icon: Layout }
            ].map((item, index) => (
              <div 
                key={index} 
                className={cn(
                  "group relative p-10 rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-4",
                  index === 1 
                    ? "bg-[#0a0a0b] ring-1 ring-white/[0.08] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]" 
                    : "bg-white ring-1 ring-zinc-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.01),0_20px_40px_-12px_rgba(0,0,0,0.02)]"
                )}
              >
                {/* Visual Polish */}
                {index === 1 && (
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
                )}

                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.4
                  }}
                  className="flex items-center justify-start mb-10"
                >
                  <item.icon className={cn(
                    "h-9 w-9 transition-transform duration-500 group-hover:scale-110",
                    index === 1 
                      ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.7)]" 
                      : "text-zinc-900 drop-shadow-[0_5px_15px_rgba(0,0,0,0.05)]"
                  )} />
                </motion.div>

                <div className="space-y-4">
                  <h3 className={cn(
                    "text-2xl font-black tracking-tight",
                    index === 1 ? "!text-white" : "text-zinc-900"
                  )}>
                    {item.title}
                  </h3>
                  <p className={cn(
                    "text-[15px] leading-relaxed font-semibold transition-colors duration-500",
                    index === 1 ? "!text-zinc-300" : "text-zinc-500"
                  )}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPARISON TABLE (US VS COMPETITORS) */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Why choose cvletterai</h2>
            <p className="text-base text-zinc-600 font-medium">Built for the modern UK job market.</p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-[0_30px_80px_-15px_rgba(0,0,0,0.05)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0b] text-white">
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Feature</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/[0.03] relative">
                    <div className="absolute top-0 left-0 w-full h-px bg-emerald-500/30" />
                    cvletterai
                  </th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Traditional</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {[
                  { f: "AI Strategic Logic", our: true, their: false },
                  { f: "99% ATS Accuracy", our: true, their: false },
                  { f: "Job-Specific Tailoring", our: true, their: "Partial" },
                  { f: "Executive Templates", our: true, their: true },
                  { f: "Build Time", our: "30 Seconds", their: "15+ Minutes" }
                ].map((row, i) => (
                  <tr key={i} className="group border-b border-zinc-100 last:border-none transition-colors hover:bg-zinc-50/50">
                    <td className="p-8 text-zinc-900 font-bold tracking-tight">{row.f}</td>
                    <td className="p-8 bg-emerald-500/[0.015] relative">
                      {row.our === true ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-black">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="h-3 w-3" strokeWidth={4} />
                          </div>
                          <span>Included</span>
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-black tracking-tight">{row.our}</span>
                      )}
                    </td>
                    <td className="p-8">
                      {row.their === true ? (
                        <div className="flex items-center gap-2 text-zinc-400 font-bold">
                          <Check className="h-4 w-4" />
                          <span>Yes</span>
                        </div>
                      ) : row.their === false ? (
                        <div className="flex items-center gap-2 text-zinc-300 font-medium">
                          <X className="h-4 w-4" />
                          <span>No</span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 font-medium">{row.their}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. PREMIUM FOOTER */}
      <footer className="py-12 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-zinc-950 rounded-lg flex items-center justify-center text-white text-[11px] font-black shadow-lg">C</div>
                <span className="font-bold text-lg tracking-tight text-zinc-950">cvletter<span className="text-emerald-500">ai</span></span>
              </div>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                The strategic AI companion for executive-tier career progression. Engineered in the UK for the global market.
              </p>
              <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-widest">
                © 2026 cvletterai. All rights reserved.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-10">
              <div className="space-y-4">
                <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.25em]">Product</p>
                <ul className="space-y-3">
                  <li><Link href="/builder/demo" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Resume Builder</Link></li>
                  <li><Link href="/templates" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Premium Templates</Link></li>
                  <li><Link href="/pricing" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Pricing Plans</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.25em]">Company</p>
                <ul className="space-y-3">
                  <li><Link href="/privacy" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Terms of Service</Link></li>
                  <li><Link href="/cookies" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Cookie Policy</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.25em]">Support</p>
                <ul className="space-y-3">
                  <li><Link href="/contact" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Contact Us</Link></li>
                  <li><Link href="/faq" className="text-[14px] text-zinc-500 hover:text-emerald-600 transition-colors duration-300">Help Center</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
