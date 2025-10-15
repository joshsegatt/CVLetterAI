"use client";

import React, { useEffect, useState } from "react";
import Switch from "./Switch";

/**
 * ThemeToggle
 * - cliente (usa estado / localStorage / DOM)
 * - aplica a classe "dark" no <html> quando o tema for "dark"
 * - guarda preferência em localStorage key 'theme' ('light' | 'dark')
 */

type Theme = "light" | "dark";

export default function ThemeToggle(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // ler preferência no mount
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
    } catch (e) {
      // fallback
      setIsDark(false);
    }
  }, []);

  // aplicar tema quando isDark muda
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
    } catch (e) {
      // ignore localStorage/DOM issues in SSR envs
    }
  }, [isDark]);

  // estado ainda inicializando
  if (isDark === null) {
    return (
      <div aria-hidden>
        {/* placeholder while determining theme */}
        <div style={{ width: 40, height: 24, borderRadius: 999 }} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">Dark</span>
      <Switch checked={isDark} onChange={(v) => setIsDark(Boolean(v))} />
    </div>
  );
}
