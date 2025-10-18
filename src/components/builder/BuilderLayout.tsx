import React from "react";

interface BuilderLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Shared layout wrapper for CV/letter builders.
 * Provides consistent max-width + spacing so previews line up.
 */
export default function BuilderLayout({ title, description, children }: BuilderLayoutProps) {
  const showHeader = Boolean(title ?? description);

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      {showHeader && (
        <header className="space-y-1">
          {title && <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground text-sm sm:text-base">{description}</p>}
        </header>
      )}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

export { BuilderLayout };
