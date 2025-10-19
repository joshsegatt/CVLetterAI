"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 border-b border-gray-200">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Equilibrado */}
          <Link 
            href="/" 
            className="group flex items-center gap-2 hover:opacity-80 transition-all duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-200 group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-subsection text-gray-900">CVLetterAI</span>
          </Link>

          {/* Navegação Equilibrada - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/cv-builder" 
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 text-body rounded-lg hover:bg-gray-100"
            >
              CV Builder
            </Link>
            
            <Link 
              href="/letter-builder" 
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 text-body rounded-lg hover:bg-gray-100"
            >
              Cover Letters
            </Link>

            <Link 
              href="/cv-analysis" 
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 text-body rounded-lg hover:bg-gray-100"
            >
              CV Analysis
            </Link>

            <Link 
              href="/chat" 
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 text-body rounded-lg hover:bg-gray-100"
            >
              AI Chat
            </Link>
            
            <Link 
              href="/pricing" 
              className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 text-body rounded-lg hover:bg-gray-100"
            >
              Pricing
            </Link>
          </nav>

          {/* Botões Equilibrados - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/sign-in"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 font-medium bg-white"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Ultra Modern Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1 left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-3' : ''}`} />
              <span className={`absolute top-3 left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute top-5 left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-3' : ''}`} />
            </div>
          </button>
        </div>

        {/* Simple Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white rounded-b-lg">
            <nav className="space-y-2">
              <Link 
                href="/cv-builder" 
                className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CV Builder
              </Link>
              
              <Link 
                href="/letter-builder" 
                className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cover Letters
              </Link>

              <Link 
                href="/cv-analysis" 
                className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CV Analysis
              </Link>
              
              <Link 
                href="/chat" 
                className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Chat
              </Link>
              
              <Link 
                href="/pricing" 
                className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 mt-4">
                <Link 
                  href="/sign-in"
                  className="px-4 py-3 text-center bg-white border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="px-4 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}