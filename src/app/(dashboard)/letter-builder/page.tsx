"use client";

import { useState } from "react";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { TemplateSelector } from "@/components/builder/TemplateSelector";
import { FormalLetter } from "@/components/builder/letter-templates/FormalLetter";
import { PoliteLetter } from "@/components/builder/letter-templates/PoliteLetter";
import { FirmLetter } from "@/components/builder/letter-templates/FirmLetter";
import { LegalNoticeLetter } from "@/components/builder/letter-templates/LegalNoticeLetter";
import { Switch } from "@/components/ui/Switch";

const templates = {
  formal: FormalLetter,
  polite: PoliteLetter,
  firm: FirmLetter,
  legal: LegalNoticeLetter,
};

const templateOptions = [
  { id: "formal", name: "Formal", thumbnail: "/thumbs/letter-formal.png" },
  { id: "polite", name: "Polite", thumbnail: "/thumbs/letter-polite.png" },
  { id: "firm", name: "Firm", thumbnail: "/thumbs/letter-firm.png" },
  { id: "legal", name: "Legal Notice", thumbnail: "/thumbs/letter-legal.png" },
];

export default function LetterBuilderPage() {
  const [template, setTemplate] = useState<keyof typeof templates>("formal");
  const [referenceLaw, setReferenceLaw] = useState(false);

  const [data, setData] = useState({
    date: "14 October 2025",
    recipient: "Mr. Patel",
    address: "Flat 3, 91 Horsbeck Way, London, W1",
    body: "Notice regarding unpaid rent and steps aligned with the tenancy agreement section 13.",
    sender: "Josue",
  });

  const TemplateComponent = templates[template];

  return (
    <BuilderLayout
      form={
        <>
          <h1 className="text-2xl font-bold text-white">Letter Builder</h1>

          {/* Seleção de template */}
          <TemplateSelector
            options={templateOptions}
            selected={template}
            onSelect={setTemplate}
          />

          {/* Switch de legislação */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-neutral-300">
              Reference specific UK legislation
            </span>
            <Switch checked={referenceLaw} onCheckedChange={setReferenceLaw} />
          </div>

          {/* Inputs */}
          <div className="mt-6 space-y-2">
            <input
              type="text"
              placeholder="Recipient"
              value={data.recipient}
              onChange={(e) => setData({ ...data, recipient: e.target.value })}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
            />
            <input
              type="text"
              placeholder="Address"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
            />
            <textarea
              placeholder="Letter body"
              value={data.body}
              onChange={(e) => setData({ ...data, body: e.target.value })}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white h-32"
            />
          </div>
        </>
      }
      preview={<TemplateComponent data={data} />}
    />
  );
}
