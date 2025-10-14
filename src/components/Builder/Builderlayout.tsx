"use client";

import { ReactNode } from "react";
import { Download, Copy, Save } from "lucide-react";
import { Button } from "../../ui/Button"; // caminho relativo correto

interface BuilderLayoutProps {
  form: ReactNode;
  preview: ReactNode;
}

export function BuilderLayout({ form, preview }: BuilderLayoutProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 h-full">
      {/* Coluna esquerda: Formulário */}
      <div className="space-y-6">{form}</div>

      {/* Coluna direita: Preview */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 font-serif relative">
        {/* Barra de ações */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="icon" intent="ghost">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" intent="ghost">
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" intent="ghost">
            <Save className="h-4 w-4" />
          </Button>
        </div>

        {preview}
      </div>
    </div>
  );
}
