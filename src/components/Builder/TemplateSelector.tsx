import React from "react";
import Button from "../ui/Button";

export type TemplateSelectorOnSelect = (id: string) => void;

type TemplateItem = { id: string; title: string; description?: string };

const DEFAULT_TEMPLATES: TemplateItem[] = [
  { id: "modern", title: "Modern CV", description: "Modern CV layout" },
  { id: "elegant", title: "Elegant CV", description: "Elegant layout" },
  { id: "minimal", title: "Minimal CV", description: "Minimal layout" },
];

type Props = {
  templates?: TemplateItem[];
  onSelect?: TemplateSelectorOnSelect;
};

export default function TemplateSelector({ templates = DEFAULT_TEMPLATES, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {templates.map((t) => (
        <div key={t.id} className="border rounded p-3 flex flex-col">
          <div className="flex-1">
            <div className="font-medium">{t.title}</div>
            {t.description && <div className="text-sm text-gray-500">{t.description}</div>}
          </div>
          <div className="mt-3">
            <Button onClick={() => onSelect?.(t.id)}>Select</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
