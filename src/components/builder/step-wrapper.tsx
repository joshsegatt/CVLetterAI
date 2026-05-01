"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["personal", "experience", "education", "skills", "summary", "template", "review"];

export function StepWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const currentStep = params.step as string || "personal";
  
  const currentIdx = STEPS.indexOf(currentStep);
  
  const next = () => {
    if (currentIdx < STEPS.length - 1) {
      router.push(`/builder/${id}/${STEPS[currentIdx + 1]}`);
    }
  };

  const back = () => {
    if (currentIdx > 0) {
      router.push(`/builder/${id}/${STEPS[currentIdx - 1]}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto px-8 pt-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="pb-24"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-6 flex justify-between items-center z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <Button 
          variant="ghost" 
          onClick={back} 
          disabled={currentIdx === 0}
          className="text-zinc-500 font-bold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="flex items-center gap-2">
           {STEPS.map((_, i) => (
             <div 
               key={i} 
               className={`h-1 w-8 rounded-full transition-colors ${i <= currentIdx ? 'bg-indigo-600' : 'bg-zinc-100'}`} 
             />
           ))}
        </div>

        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-indigo-600/20" 
          onClick={next}
        >
          {currentIdx === STEPS.length - 1 ? "Finish" : "Next Step"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
