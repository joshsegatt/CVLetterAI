"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cv-builder", label: "CV Builder" },
  { href: "/letter-builder", label: "Letter Builder" },
  { href: "/chat", label: "Chat" },
  { href: "/settings", label: "Settings" },
] as const;

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.45),transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.35),transparent_60%)]">
      {/* 🔝 Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="text-xl font-bold tracking-widest text-white hover:text-indigo-300 transition">
              CVLetterAI
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-200">
            {primaryLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button asChild intent="secondary" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 🔹 Hero Section */}
      <main className="pt-28 flex flex-col items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-white leading-tight"
        >
          Build <span className="text-indigo-400">Resumes</span> and{" "}
          <span className="text-indigo-400">Cover Letters</span> that stand out
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg text-neutral-200 max-w-2xl"
        >
          CVLetterAI helps you create professional documents with premium design
          and instant impact — powered by AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-8 flex gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <Button asChild size="lg">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <Button asChild intent="secondary" size="lg">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* 🔹 Features Section */}
      <section className="mt-24 px-6 max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          Why choose <span className="text-indigo-400">CVLetterAI</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-neutral-300 max-w-2xl mx-auto"
        >
          A modern platform that combines artificial intelligence with premium
          design to accelerate your career journey.
        </motion.p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "⚡ Instant Generation",
              desc: "Create resumes and cover letters in seconds with cutting-edge AI.",
            },
            {
              title: "🎨 Premium Design",
              desc: "Modern, responsive layouts crafted to impress recruiters.",
            },
            {
              title: "🔒 Secure & Compliant",
              desc: "Your data is protected with encryption and GDPR standards.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-md"
            >
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-neutral-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔹 Final CTA */}
      <section className="mt-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/80 to-sky-500/80 p-12 shadow-xl backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold text-white">
            Ready to level up your career?
          </h2>
          <p className="mt-4 text-neutral-200">
            Join thousands of professionals already creating standout documents
            with CVLetterAI.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/sign-up">Start Free</Link>
            </Button>
            <Button asChild intent="secondary" size="lg">
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 🔹 Footer */}
      <footer className="mt-20 border-t border-white/10 py-10 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} CVLetterAI Ltd. All rights reserved. ·{" "}
        <Link href="/terms" className="hover:text-white transition">Terms</Link> ·{" "}
        <Link href="/privacy" className="hover:text-white transition">Privacy</Link> ·{" "}
        <Link href="/gdpr" className="hover:text-white transition">GDPR</Link>
      </footer>
    </div>
  );
}
