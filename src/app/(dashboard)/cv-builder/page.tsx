import React from "react";
import BuilderLayout from "../../../components/Builder/BuilderLayout";
import CvTemplateBrowser from "../../../components/Builder/CvTemplateBrowser";
import ModernCV from "../../../components/Builder/cv-templates/ModernCV";
import ElegantCV from "../../../components/Builder/cv-templates/ElegantCV";
import MinimalCV from "../../../components/Builder/cv-templates/MinimalCV";
import CreativeCV from "../../../components/Builder/cv-templates/CreativeCV";
import ExecutiveCV from "../../../components/Builder/cv-templates/ExecutiveCV";

export default function Page() {
  return (
    <BuilderLayout
      title="Choose a CV template"
      description="Pick a style to continue editing. You can adjust wording and layout on the next step."
    >
      <CvTemplateBrowser />
      <div className="mt-6 space-y-6">
        <h3 className="text-lg">Previews</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <ModernCV />
          <ElegantCV />
          <MinimalCV />
          <CreativeCV />
          <ExecutiveCV />
        </div>
      </div>
    </BuilderLayout>
  );
}
