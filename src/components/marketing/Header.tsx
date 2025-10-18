"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { LanguageSelector } from "../shared/LanguageSelector";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Ultra Modern Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3 hover:opacity-80 transition-all duration-200"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand transition-all duration-200 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CVLetterAI</span>
          </Link>

          {/* Ultra Modern Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/cv-builder" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
            >
              CV Builder
            </Link>
            
            <Link 
              href="/letter-builder" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
            >
              Cover Letters
            </Link>

            <Link 
              href="/cv-analysis" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
            >
              CV Analysis
            </Link>

            <Link 
              href="/chat" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
            >
              AI Chat
            </Link>
            
            <Link 
              href="/pricing" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
            >
              Pricing
            </Link>
          </nav>

          {/* Ultra Modern Auth Buttons & Language Selector - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSelector compact className="mr-2" />
            <Button 
              asChild 
              variant="ghost" 
              className="text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20"
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
          <div className="lg:hidden border-t border-white/10 py-4">
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
                <LanguageSelector className="mb-3" />
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