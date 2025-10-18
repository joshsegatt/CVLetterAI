"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.08] force-transparent-bg">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Equilibrado */}
          <Link 
            href="/" 
            className="group flex items-center gap-2 hover:opacity-80 transition-all duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand transition-all duration-200 group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-subsection text-white">CVLetterAI</span>
          </Link>

          {/* Navegação Equilibrada - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/cv-builder" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 text-body rounded-lg hover:bg-white/5"
            >
              CV Builder
            </Link>
            
            <Link 
              href="/letter-builder" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 text-body rounded-lg hover:bg-white/5"
            >
              Cover Letters
            </Link>

            <Link 
              href="/cv-analysis" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 text-body rounded-lg hover:bg-white/5"
            >
              CV Analysis
            </Link>

            <Link 
              href="/chat" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 text-body rounded-lg hover:bg-white/5"
            >
              AI Chat
            </Link>
            
            <Link 
              href="/pricing" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 text-body rounded-lg hover:bg-white/5"
            >
              Pricing
            </Link>
          </nav>

          {/* Botões Equilibrados - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              asChild 
              variant="ghost" 
              className="text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 text-caption px-4 py-2"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button 
              asChild 
              className="bg-gradient-brand hover:shadow-glow transition-all duration-300 hover:scale-105 relative overflow-hidden group"
            >
              <Link href="/sign-up">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-luxury opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
          </div>

          {/* Ultra Modern Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-3' : ''}`} />
              <span className={`absolute top-3 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute top-5 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-3' : ''}`} />
            </div>
          </button>
        </div>

        {/* Simple Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 backdrop-blur-md rounded-b-lg">
            <nav className="space-y-2">
              <Link 
                href="/cv-builder" 
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CV Builder
              </Link>
              
              <Link 
                href="/letter-builder" 
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cover Letters
              </Link>

              <Link 
                href="/cv-analysis" 
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CV Analysis
              </Link>
              
              <Link 
                href="/chat" 
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Chat
              </Link>
              
              <Link 
                href="/pricing" 
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-4">
                <Button 
                  asChild 
                  variant="ghost" 
                  className="justify-center border border-white/20"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button 
                  asChild 
                  className="bg-gradient-brand"
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}