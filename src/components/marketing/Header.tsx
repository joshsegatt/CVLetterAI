"use client";

import Link from "next/link";
import { Sparkles, Menu, X, ChevronDown, Zap, FileText, PenTool, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { LanguageSelector } from "../shared/LanguageSelector";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 150); // Small delay to prevent flickering
  };

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
            {/* Products Dropdown - Enhanced Functionality */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="flex items-center gap-1.5 px-4 py-2.5 text-white/90 hover:text-white transition-all duration-200 font-medium rounded-lg hover:bg-white/8 active:scale-95"
              >
                <span className="text-sm font-semibold">Products</span>
                <ChevronDown className={`h-4 w-4 transition-all duration-200 ${isProductsOpen ? 'rotate-180 text-primary-400' : ''}`} />
              </button>
              
              {isProductsOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 bg-surface-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-6">
                    <div className="grid gap-2">
                      <Link 
                        href="/cv-builder" 
                        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-primary-600/10 transition-all duration-300 cursor-pointer"
                        onClick={() => setIsProductsOpen(false)}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-base group-hover:text-primary-300 transition-colors">CV Builder</h3>
                          <p className="text-sm text-surface-400 mt-1 group-hover:text-surface-300 transition-colors">Create stunning professional resumes with AI</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-surface-400 rotate-[-90deg] group-hover:text-primary-400 transition-colors" />
                      </Link>
                      
                      <Link 
                        href="/letter-builder" 
                        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-luxury-500/10 hover:to-luxury-600/10 transition-all duration-300 cursor-pointer"
                        onClick={() => setIsProductsOpen(false)}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-500 to-luxury-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-luxury-500/25 transition-all duration-300">
                          <PenTool className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-base group-hover:text-luxury-300 transition-colors">Cover Letters</h3>
                          <p className="text-sm text-surface-400 mt-1 group-hover:text-surface-300 transition-colors">Craft compelling personalized letters instantly</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-surface-400 rotate-[-90deg] group-hover:text-luxury-400 transition-colors" />
                      </Link>
                    </div>
                    
                    {/* CTA Footer */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Link 
                        href="/sign-up"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-brand hover:shadow-lg hover:shadow-primary-500/25 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => setIsProductsOpen(false)}
                      >
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm">Start Creating Free</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/chat" 
              className="px-3 py-2 text-white/90 hover:text-white transition-all duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
            >
              AI Chat
            </Link>
            
            <Link 
              href="#pricing" 
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
                href="/chat" 
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Chat
              </Link>
              
              <Link 
                href="#pricing" 
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