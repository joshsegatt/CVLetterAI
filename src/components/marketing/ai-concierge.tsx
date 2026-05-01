"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  Rocket, 
  LogIn, 
  Zap,
  ShieldCheck,
  Building2,
  BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; href: string; icon: any }[];
}

export function AIConcierge() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to CVLetterAI. I am your Neural Concierge. How can I assist your career progression today?",
      actions: [
        { label: "Start Building", href: "/onboarding", icon: Rocket },
        { label: "Access My Studio", href: "/sign-in", icon: LogIn },
        { label: "Elite Pricing", href: "/pricing", icon: Zap }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI logic
    setTimeout(() => {
      let response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: ""
      };

      const query = input.toLowerCase();

      if (query.includes("onboarding") || query.includes("start") || query.includes("create") || query.includes("build") || query.includes("how")) {
        response.content = "To begin your executive transformation, I recommend entering our high-fidelity builder. It will guide you through the strategic architecture of your new document.";
        response.actions = [{ label: "Launch Builder", href: "/onboarding", icon: Rocket }];
      } else if (query.includes("login") || query.includes("sign in") || query.includes("account") || query.includes("access")) {
        response.content = "Certainly. You can access your existing portfolio in the CVLetterAI login area.";
        response.actions = [{ label: "Sign In Now", href: "/sign-in", icon: LogIn }];
      } else if (query.includes("price") || query.includes("cost") || query.includes("premium") || query.includes("free")) {
        response.content = "CVLetterAI offers ROI-focused plans tailored for high-level progression. You can view our global competitive tiers here.";
        response.actions = [{ label: "View Pricing", href: "/pricing", icon: Zap }];
      } else {
        response.content = "I understand. Our studio is engineered to deliver authoritative, ATS-optimized documents that command attention from top-tier recruiters. Would you like to see our elite templates or start the onboarding?";
        response.actions = [
          { label: "Show Templates", href: "/#templates-section", icon: Building2 },
          { label: "Start Onboarding", href: "/onboarding", icon: Rocket }
        ];
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-6 w-[400px] h-[600px] bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden flex flex-col dark"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-emerald-500/10 to-transparent border-b border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                   <BrainCircuit className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight italic">
                    <span className="text-white">Neural</span>{" "}
                    <span className="text-emerald-500 not-italic">Concierge</span>
                  </h3>
                  <div className="flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Session</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4 text-zinc-500" />
              </button>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6" ref={scrollRef}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col gap-2.5",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-lg",
                      msg.role === "user" 
                        ? "bg-emerald-500 text-zinc-950 font-bold" 
                        : "bg-zinc-900 text-zinc-100 border border-zinc-800/50"
                    )}>
                      {msg.content}
                    </div>

                    {msg.actions && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.actions.map((action, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 rounded-xl border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-[10px] uppercase tracking-wider transition-all"
                            onClick={() => {
                              if (action.href.startsWith("#")) {
                                setIsOpen(false);
                                document.querySelector(action.href)?.scrollIntoView({ behavior: 'smooth' });
                              } else {
                                router.push(action.href);
                              }
                            }}
                          >
                            <action.icon className="h-3 w-3 mr-2" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-2xl w-14 border border-zinc-800">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce" />
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 bg-zinc-900/50 border-t border-zinc-800/50">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="How can we advance your career?"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl h-12 pl-5 pr-12 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-2 h-8 w-8 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 hover:bg-emerald-400 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-4 text-[9px] text-center text-zinc-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck className="h-2.5 w-2.5" />
                Enterprise Encrypted
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative h-16 w-16 flex items-center justify-center bg-zinc-900 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] border border-zinc-800 overflow-hidden cursor-pointer"
      >
        {/* Pulsing Neon Effect */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          animate={{
            boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.4)", "0 0 0px rgba(16,185,129,0)"],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
        />
        
        <BrainCircuit className="h-7 w-7 text-emerald-400 relative z-10" />
        
        {/* Border Beam Animation */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
           <motion.div
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0,transparent_25%,#10b981_50%,transparent_75%,transparent_100%)] opacity-40"
           />
        </div>
      </motion.button>
    </div>
  );
}
