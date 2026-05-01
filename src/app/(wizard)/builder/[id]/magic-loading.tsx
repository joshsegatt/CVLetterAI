"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PHASES = [
  { text: "Analyzing job requirements...",         duration: 3500 },
  { text: "Extracting key competencies...",         duration: 3000 },
  { text: "Mapping your executive profile...",      duration: 3000 },
  { text: "Applying STAR methodology...",           duration: 3500 },
  { text: "Crafting your narrative arc...",         duration: 3000 },
  { text: "Optimizing for ATS systems...",          duration: 2500 },
  { text: "Polishing executive tone...",            duration: 2500 },
  { text: "Running quality checks...",              duration: 2000 },
  { text: "Almost ready — finalizing...",           duration: 99999 },
];

interface Props {
  isVisible: boolean;
  progress: number;
}

export function MagicLoadingState({ isVisible, progress }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setPhaseIndex(0);
      setElapsed(0);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    let accumulated = 0;

    const advance = (idx: number) => {
      if (idx >= PHASES.length - 1) return;
      const dur = PHASES[idx].duration;
      timeout = setTimeout(() => {
        accumulated += dur;
        setElapsed(accumulated);
        setPhaseIndex(idx + 1);
        advance(idx + 1);
      }, dur);
    };

    advance(0);
    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
        >
          <div className="w-full max-w-md px-8 space-y-10 text-center">
            {/* Animated logo */}
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-float-lg"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>

            {/* Phase text */}
            <div className="h-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-xl font-medium text-zinc-800 tracking-tight"
                >
                  {PHASES[phaseIndex].text}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-1.5" />
              <p className="text-sm text-zinc-400">
                Generating your document · {progress}% complete
              </p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-indigo-300"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
