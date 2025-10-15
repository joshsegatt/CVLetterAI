import React from "react";
import ThemeToggle from "../ui/ThemeToggle";

interface MarketingLayoutProps {
  children?: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="border-b bg-white/60 dark:bg-slate-800/60 backdrop-blur p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-lg font-semibold">CVLetterAI</div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">{children}</main>
      <footer className="text-center p-6 text-sm text-gray-500">© {new Date().getFullYear()} CVLetterAI</footer>
    </div>
  );
}

export default MarketingLayout;
