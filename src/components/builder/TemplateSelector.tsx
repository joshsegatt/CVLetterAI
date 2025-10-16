"use client";

import { Button } from "../ui/Button";

export type TemplateSelectorOnSelect = (id: string) => void;

export interface TemplateItem {
  id: string;
  title: string;
  description?: string;
}

const DEFAULT_TEMPLATES: TemplateItem[] = [
  { id: "modern", title: "Modern CV", description: "Modern CV layout" },
  { id: "elegant", title: "Elegant CV", description: "Elegant layout" },
  { id: "minimal", title: "Minimal CV", description: "Minimal layout" },
  { id: "creative", title: "Creative CV", description: "Creative layout" },
  { id: "executive", title: "Executive CV", description: "Executive layout" },
];

interface TemplateSelectorProps {
  templates?: TemplateItem[];
  onSelect?: TemplateSelectorOnSelect;
}

export default function TemplateSelector({ templates = DEFAULT_TEMPLATES, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {templates.map((template) => (
        <article
          key={template.id}
          className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <header className="space-y-1">
            <h3 className="text-base font-semibold">{template.title}</h3>
            {template.description ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{template.description}</p>
            ) : null}
          </header>
          <Button
            size="sm"
            intent="primary"
            onClick={() => onSelect?.(template.id)}
          >
            Select
          </Button>
        </article>
      ))}
    </div>
  );
}
