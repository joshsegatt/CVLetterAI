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
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black text-zinc-900 tracking-tighter">
              CVLetter<span className="text-emerald-500">AI</span>
            </span>
          </Link>

          {/* Desktop nav - Hidden as requested to move items to the right */}
          <div className="hidden md:block flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link 
                href="/contact" 
                className="hidden sm:block text-sm font-bold text-zinc-900 hover:text-black transition-all px-4 py-2"
              >
                Contact Us
              </Link>

              {!isSignedIn ? (
                <div className="cursor-pointer">
                  <SignInButton mode="modal">
                    <Button className="bg-zinc-950 hover:bg-black text-white font-bold rounded-xl px-6 h-10 shadow-md transition-all active:scale-95">
                      Log In
                    </Button>
                  </SignInButton>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-9 w-9 rounded-xl shadow-sm",
                        userButtonTrigger: "rounded-xl border border-zinc-200 p-0.5 hover:bg-zinc-50 transition-all"
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
            className="md:hidden border-t border-zinc-200/60 py-3 space-y-1 px-2 bg-white/80 backdrop-blur-md"
          >
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-base font-bold text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
              Contact Us
            </Link>
            {isSignedIn ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-base font-bold text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
                Dashboard
              </Link>
            ) : (
              <div className="cursor-pointer">
                <SignInButton mode="modal">
                  <button onClick={() => setMobileOpen(false)} className="w-full text-left block px-3 py-3 text-base font-bold text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
                    Log In
                  </button>
                </SignInButton>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
