"use client";
import Link from "next/link";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full glass border-b border-zinc-200/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-xl font-black text-zinc-900 tracking-tighter">
              CVLetters<span className="text-emerald-500">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/contact" className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {!isLoaded ? (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-100" />
            ) : !isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 rounded-md hover:bg-zinc-100 font-medium">
                    Log In
                  </button>
                </SignInButton>
                <Link href="/onboarding">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg px-4">
                    Start Free
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors font-medium"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-9 w-9 rounded-xl",
                      userButtonTrigger: "rounded-xl border border-zinc-200 p-0.5"
                    }
                  }}
                />
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-200/60 py-3 space-y-1 px-2"
          >
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-md transition-colors">Contact Us</Link>
            {isSignedIn ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-md transition-colors">Dashboard</Link>
            ) : (
              <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">Log In</Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
