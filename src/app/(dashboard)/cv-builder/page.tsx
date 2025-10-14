"use client";

import { useState } from "react";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { TemplateSelector } from "@/components/builder/TemplateSelector";

// Import dos templates de CV
import { ModernCV } from "@/components/builder/cv-templates/ModernCV";
import { ElegantCV } from "@/components/builder/cv-templates/ElegantCV";
import { MinimalCV } from "@/components/builder/cv-templates/MinimalCV";
import { CreativeCV } from "@/components/builder/cv-templates/CreativeCV";
import { ExecutiveCV } from "@/components/builder/cv-templates/ExecutiveCV";

// Tipagem dos dados do CV
interface CVData {
  name: string;
  title: string;
  experience: string[];
}

// Registro de templates
const templates = {
  modern: ModernCV,
  elegant: ElegantCV,
  minimal: MinimalCV,
  creative: CreativeCV,
  executive: ExecutiveCV,
};

// Opções de templates (com thumbs)
const templateOptions = [
  { id: "modern", name: "Modern", thumbnail: "/thumbs/cv-modern.png" },
  { id: "elegant", name: "Elegant", thumbnail: "/thumbs/cv-elegant.png" },
  { id: "minimal", name: "Minimal", thumbnail: "/thumbs/cv-minimal.png" },
  { id: "creative", name: "Creative", thumbnail: "/thumbs/cv-creative.png" },
  { id: "executive", name: "Executive", thumbnail: "/thumbs/cv-executive.png" },
];

export default function CVBuilderPage() {
  const [template, setTemplate] = useState<keyof typeof templates>("modern");
  const [data, setData] = useState<CVData>({
    name: "John Doe",
    title: "Software Engineer",
    experience: ["Company A — 2019-2021", "Company B — 2021-2023"],
  });

  const TemplateComponent = templates[template];

  return (
    <BuilderLayout
      form={
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white">CV Builder</h1>

          {/* Seleção de template */}
          <TemplateSelector
            options={templateOptions}
            selected={template}
            onSelect={setTemplate}
          />

          {/* Inputs */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
            />
            <input
              type="text"
              placeholder="Title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
            />
            <textarea
              placeholder="Experience (one per line)"
              value={data.experience.join("\n")}
              onChange={(e) =>
                setData({ ...data, experience: e.target.value.split("\n") })
              }
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white h-32"
            />
          </div>
        </div>
      }
      preview={<TemplateComponent data={data} />}
    />
  );
}
