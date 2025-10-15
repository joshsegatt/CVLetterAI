"use client";

import React, { useEffect, useState } from "react";
import Switch from "./Switch";

export function ThemeToggle(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      if (stored === "dark" || stored === "light") {
        setIsDark(stored === "dark");
      } else if (typeof window !== "undefined" && window.matchMedia) {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      } else {
        setIsDark(false);
      }
    } catch {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    if (isDark === null) return;
    try {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch {
      // ignore
    }
  }, [isDark]);

  if (isDark === null) {
    return <div aria-hidden style={{ width: 40, height: 24, borderRadius: 999 }} />;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">Dark</span>
      <Switch checked={isDark} onChange={(v) => setIsDark(Boolean(v))} ariaLabel="Toggle dark mode" />
    </div>
  );
}

export default ThemeToggle;
