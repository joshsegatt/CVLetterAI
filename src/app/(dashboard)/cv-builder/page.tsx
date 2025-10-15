import React from "react";
import BuilderLayout from "../../../components/builder/BuilderLayout";
import TemplateSelector from "../../../components/builder/TemplateSelector";
import ModernCV from "../../../components/builder/cv-templates/ModernCV";
import ElegantCV from "../../../components/builder/cv-templates/ElegantCV";
import MinimalCV from "../../../components/builder/cv-templates/MinimalCV";
import CreativeCV from "../../../components/builder/cv-templates/CreativeCV";
import ExecutiveCV from "../../../components/builder/cv-templates/ExecutiveCV";

export default function Page() {
  return (
    <BuilderLayout>
      <h2 className="text-2xl mb-4">Choose a CV template</h2>
      <TemplateSelector onSelect={(id: string) => console.log("selected", id)} />
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
