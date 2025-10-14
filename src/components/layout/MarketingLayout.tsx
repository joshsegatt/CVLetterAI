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
      {/* 🔝 Header fixo e premium */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo animado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              aria-label="CVLetterAI home"
              className="group inline-flex items-center gap-2"
            >
              <span className="text-xl font-bold tracking-widest text-white group-hover:text-indigo-300 transition">
                CVLetterAI
              </span>
            </Link>
          </motion.div>

          {/* Menu desktop */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-200">
            {primaryLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Ações */}
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
          Crie documentos <span className="text-indigo-400">profissionais</span>{" "}
          com impacto imediato
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg text-neutral-200 max-w-2xl"
        >
          Uma plataforma inteligente para gerar CVs e Cartas de Apresentação
          com design premium e precisão.
        </motion.p>

        {/* Botões interativos */}
        <motion.div
          className="mt-8 flex gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <Button asChild size="lg">
              <Link href="/sign-up">Começar Agora</Link>
            </Button>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <Button asChild intent="secondary" size="lg">
              <Link href="/pricing">Ver Planos</Link>
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* 🔹 Footer */}
      <footer className="mt-20 border-t border-white/10 py-10 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} CVLetterAI Ltd. Todos os direitos reservados.
      </footer>
    </div>
  );
}
