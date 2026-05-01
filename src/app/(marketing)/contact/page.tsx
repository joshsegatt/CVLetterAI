"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, Mail, MessageSquare, User, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-[56px] font-extrabold text-zinc-900 leading-[1.1] tracking-tight mb-8">
              Let's talk about your <span className="text-emerald-500">career</span>.
            </h1>
            <p className="text-xl text-zinc-600 mb-12 leading-relaxed max-w-lg">
              Have a question about our executive plans or need help with your documents? 
              Our elite support team is here to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all duration-300">
                  <Mail className="h-5 w-5 text-zinc-400 group-hover:text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Email us</p>
                  <p className="text-lg font-bold text-zinc-900">segattlabs@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all duration-300">
                  <MessageSquare className="h-5 w-5 text-zinc-400 group-hover:text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Response time</p>
                  <p className="text-lg font-bold text-zinc-900">Under 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/70 p-8 sm:p-12 rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 ml-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium resize-none"
                />
              </div>

              <Button
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-zinc-950 hover:bg-black text-white font-bold text-lg flex items-center justify-center gap-2 group transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
