import React from "react";
import BuilderLayout from "../../../components/builder/BuilderLayout";
import LetterTemplateBrowser from "../../../components/builder/LetterTemplateBrowser";
import FormalLetter from "../../../components/builder/Letter-templates/FormalLetter";
import PoliteLetter from "../../../components/builder/Letter-templates/PoliteLetter";
import FirmLetter from "../../../components/builder/Letter-templates/FirmLetter";
import LegalNoticeLetter from "../../../components/builder/Letter-templates/LegalNoticeLetter";
import Switch from "../../../components/ui/Switch";

export default function Page() {
  return (
    <BuilderLayout
      title="Choose a letter template"
      description="Select a tone to start drafting. Templates include legal references and courtesy presets."
    >
      <LetterTemplateBrowser />
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
