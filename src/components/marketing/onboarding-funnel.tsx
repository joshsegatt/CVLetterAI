"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  Target, 
  Briefcase, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Rocket,
  X,
  CheckCircle2,
  ShieldCheck,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    id: "role",
    title: "What is your target role?",
    subtitle: "We'll tailor your CV keywords for this specific position.",
    icon: Target,
  },
  {
    id: "experience",
    title: "Years of experience?",
    subtitle: "This helps us choose the right template strategy.",
    icon: Briefcase,
  },
  {
    id: "salary",
    title: "Target salary range?",
    subtitle: "We'll optimize your summary to justify this value.",
    icon: DollarSign,
  },
  {
    id: "analyzing",
    title: "Optimizing Strategy",
    subtitle: "Our AI is analyzing top market requirements...",
    icon: BrainCircuit,
  }
];

export function OnboardingFunnel({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    salary: "",
  });
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (currentStep === 3) {
      const interval = setInterval(() => {
        setAnalyzingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              router.push("/sign-up");
            }, 800);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentStep, router]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15),0_0_1px_rgba(0,0,0,0.1)] border border-zinc-100 overflow-hidden relative">
      {/* Window Top Bar (Stylized) */}
      <div className="h-14 border-b border-zinc-50 px-8 flex items-center justify-between bg-zinc-50/30 backdrop-blur-md">
        <div className="flex gap-2.5">
          <div className="h-3 w-3 rounded-full bg-zinc-200/60" />
          <div className="h-3 w-3 rounded-full bg-zinc-200/60" />
          <div className="h-3 w-3 rounded-full bg-zinc-200/60" />
        </div>
        
        {/* Progress Dots in Header */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === currentStep ? "bg-emerald-500 w-8" : i < currentStep ? "bg-emerald-500/20 w-4" : "bg-zinc-100 w-4"
              )}
            />
          ))}
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-8 sm:p-10 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Header Area */}
            <div className="space-y-5">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-sm">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                  {step.title}
                </h2>
                <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                  {step.subtitle}
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[140px]">
              {currentStep === 0 && (
                <div className="relative group">
                  <Input 
                    placeholder="e.g. Senior Product Manager" 
                    className="h-16 text-lg px-8 rounded-2xl border-zinc-200 focus:border-emerald-500 focus:ring-[10px] focus:ring-emerald-500/5 transition-all placeholder:text-zinc-300 font-bold"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    autoFocus
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center opacity-0 group-focus-within:opacity-100 transition-all scale-90 group-focus-within:scale-100">
                     <Sparkles className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              )}
              
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-5">
                  {["0-2 years", "3-5 years", "5-10 years", "10+ years"].map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => {
                        setFormData({ ...formData, experience: opt });
                        setTimeout(handleNext, 300);
                      }}
                      className={cn(
                        "h-16 rounded-2xl border-2 text-base font-black transition-all flex items-center justify-center gap-3 shadow-sm",
                        formData.experience === opt 
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20 translate-y-[-2px]" 
                          : "border-zinc-100 text-zinc-600 hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-50/50 hover:translate-y-[-2px]"
                      )}
                    >
                      {opt}
                      {formData.experience === opt && <CheckCircle2 className="h-5 w-5" />}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="relative">
                  <Input 
                    placeholder="e.g. $120,000 - $150,000" 
                    className="h-16 text-lg px-8 rounded-2xl border-zinc-200 focus:border-emerald-500 focus:ring-[10px] focus:ring-emerald-500/5 transition-all font-bold"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    autoFocus
                  />
                  <DollarSign className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-300" />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      <span>Optimizing for Hiring Managers</span>
                      <span className="text-emerald-600">{analyzingProgress}%</span>
                    </div>
                    <div className="h-4 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100 p-0.5">
                      <motion.div 
                        className="h-full bg-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analyzingProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { text: "Scanning Executive Benchmarks", done: analyzingProgress > 30 },
                      { text: "Optimizing Keywords for ATS", done: analyzingProgress > 60 },
                      { text: "Generating Premium Layouts", done: analyzingProgress > 90 }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500",
                          item.done ? "bg-emerald-50 border-emerald-100 text-zinc-900 shadow-sm" : "bg-white border-zinc-50 text-zinc-300"
                        )}
                      >
                        {item.done ? (
                          <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                             <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 border-2 border-zinc-100 border-t-emerald-500 rounded-full animate-spin" />
                        )}
                        <span className="text-sm font-black uppercase tracking-tight">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            {currentStep !== 1 && currentStep !== 3 && (
              <Button 
                size="xl"
                className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.25rem] gap-3 text-lg font-black shadow-2xl shadow-emerald-500/25 transition-all hover:translate-y-[-4px] active:translate-y-0"
                onClick={handleNext}
                disabled={currentStep === 0 && !formData.role}
              >
                Continue <ArrowRight className="h-5 w-5" />
              </Button>
            )}

            {currentStep === 3 && analyzingProgress === 100 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center text-emerald-600 font-black text-lg flex items-center justify-center gap-3"
               >
                 <Rocket className="h-6 w-6 animate-bounce" />
                 Ready to Elevate Your Career!
               </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trust Footer (Stylized) */}
      <div className="px-10 py-5 bg-zinc-50/50 backdrop-blur-sm border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-zinc-200 overflow-hidden shadow-lg">
                <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
              </div>
            ))}
          </div>
          <div className="space-y-0.5">
             <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
             </div>
             <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Trusted by 12k+ Candidates</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
          <div className="h-8 w-8 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
             <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          Secure Encryption
        </div>
      </div>
    </div>
  );
}
