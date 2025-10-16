"use client";

import { useMemo, useState } from "react";
import TemplateSelector, { type TemplateItem } from "./TemplateSelector";

interface CvTemplateBrowserProps {
  templates?: TemplateItem[] | null;
  initialSelection?: string | null;
}

export default function CvTemplateBrowser({ templates, initialSelection }: CvTemplateBrowserProps) {
  const safeTemplates = useMemo<TemplateItem[] | undefined>(() => {
    if (!Array.isArray(templates) || templates.length === 0) {
      return undefined;
    }
    return templates.filter(
      (template): template is TemplateItem =>
        Boolean(template) && typeof template.id === "string" && typeof template.title === "string",
    );
  }, [templates]);

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    initialSelection && typeof initialSelection === "string" ? initialSelection : null,
  );

  return (
    <div className="space-y-3">
      <TemplateSelector
        templates={safeTemplates}
        onSelect={(id) => {
          if (typeof id === "string" && id.trim().length > 0) {
            setSelectedTemplate(id);
            return;
          }
          setSelectedTemplate(null);
        }}
      />
      <p className="text-sm text-slate-600 dark:text-slate-300" data-selected-template={selectedTemplate ?? ""}>
        {selectedTemplate ? `Selected template: ${selectedTemplate}` : "Select a template to load its preview."}
      </p>
    </div>
  );
}
