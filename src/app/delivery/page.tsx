"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Rocket, ArrowRight, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DeliveryPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (sessionId) {
      // In a real app, we would verify the session with the backend
      setTimeout(() => setStatus("success"), 1500);
    }
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-zinc-500 font-medium">Verifying your upgrade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
      >
        <div className="bg-indigo-600 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Rocket className="absolute -bottom-10 -right-10 h-64 w-64 rotate-12" />
          </div>
          
          <div className="bg-white/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-2">Welcome to Executive!</h1>
          <p className="text-indigo-100 text-lg">Your account has been upgraded and your documents are ready.</p>
        </div>

        <div className="p-12 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
             <div className="p-6 rounded-2xl border-2 border-zinc-100 hover:border-indigo-100 transition-all group">
                <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                  <Download className="h-4 w-4 text-indigo-600" />
                  Instant Download
                </h3>
                <p className="text-xs text-zinc-500 mb-4">Get your high-fidelity PDF and start applying immediately.</p>
                <Button className="w-full bg-zinc-900 group-hover:bg-indigo-600 transition-colors">Download Now</Button>
             </div>
             <div className="p-6 rounded-2xl border-2 border-zinc-100 hover:border-indigo-100 transition-all group">
                <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-indigo-600" />
                  Public Link
                </h3>
                <p className="text-xs text-zinc-500 mb-4">Share a hosted, interactive version of your resume with recruiters.</p>
                <Button variant="outline" className="w-full">Copy Link</Button>
             </div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
             <h4 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-indigo-600" />
                What's Next?
             </h4>
             <ul className="space-y-4">
                {[
                  "Optimize your LinkedIn profile with our AI hooks.",
                  "Set up auto-alerts for new Executive roles.",
                  "Book a mock interview with an AI Career Coach."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                    <div className="h-6 w-6 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </div>
                    {text}
                  </li>
                ))}
             </ul>
          </div>

          <div className="text-center pt-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-zinc-500 hover:text-zinc-900 gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
