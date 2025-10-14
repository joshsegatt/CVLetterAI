"use client";

import { useState } from "react";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { ModernCV } from "@/components/builder/cv-templates/ModernCV";
import { ElegantCV } from "@/components/builder/cv-templates/ElegantCV";
import { Button } from "@/components/ui/Button";

const templates = {
  modern: ModernCV,
  elegant: ElegantCV,
};

export default function CVBuilderPage() {
  const [template, setTemplate] = useState<keyof typeof templates>("modern");
  const [data, setData] = useState({
    name: "John Doe",
    title: "Software Engineer",
    experience: ["Company A - 2019-2021", "Company B - 2021-2023"],
  });

  const TemplateComponent = templates[template];

  return (
    <BuilderLayout
      form={
        <>
          <h1 className="text-2xl font-bold text-white">CV Builder</h1>

          {/* Escolha de template */}
          <div className="flex gap-2">
            <Button
              size="sm"
              intent={template === "modern" ? "primary" : "secondary"}
              onClick={() => setTemplate("modern")}
            >
              Modern
            </Button>
            <Button
              size="sm"
              intent={template === "elegant" ? "primary" : "secondary"}
              onClick={() => setTemplate("elegant")}
            >
              Elegant
            </Button>
          </div>

          {/* Inputs simples */}
          <div className="mt-4 space-y-2">
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
          </div>
        </>
      }
      preview={<TemplateComponent data={data} />}
    />
  );
}
