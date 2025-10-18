"use client";

import React, { useEffect, useState } from "react";
import Switch from "./Switch";

export function ThemeToggle(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(false); // Always false

  useEffect(() => {
    // Force light mode always
    try {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } catch {
      // ignore
    }
  }, []);

  // Always return light mode toggle (disabled)
  return (
    <div className="flex items-center gap-2 opacity-50 pointer-events-none">
      <span className="text-sm text-gray-400">Dark</span>
      <Switch checked={false} onChange={() => {}} ariaLabel="Toggle dark mode (disabled)" />
    </div>
  );
}

export default ThemeToggle;
