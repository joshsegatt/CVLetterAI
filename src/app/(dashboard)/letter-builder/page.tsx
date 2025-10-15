import React from "react";
import BuilderLayout from "@/components/builder/BuilderLayout";
import TemplateSelector from "@/components/builder/TemplateSelector";
import FormalLetter from "@/components/builder/Letter-templates/FormalLetter";
import PoliteLetter from "@/components/builder/Letter-templates/PoliteLetter";
import FirmLetter from "@/components/builder/Letter-templates/FirmLetter";
import LegalNoticeLetter from "@/components/builder/Letter-templates/LegalNoticeLetter";
import Switch from "@/components/ui/Switch";

export default function Page() {
  return (
    <BuilderLayout>
      <h2 className="text-2xl mb-4">Choose a letter template</h2>
      <TemplateSelector onSelect={(id: string) => console.log("selected", id)} />
      <div className="mt-6 space-y-6">
        <h3 className="text-lg">Previews</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormalLetter />
          <PoliteLetter />
          <FirmLetter />
          <LegalNoticeLetter />
        </div>
        <div className="mt-6">
          <span className="mr-3">Example Switch:</span>
          <Switch checked={false} />
        </div>
      </div>
    </BuilderLayout>
  );
}
