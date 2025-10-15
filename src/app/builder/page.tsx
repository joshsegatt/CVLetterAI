import React from 'react';
import BuilderLayout from '../../components/BuilderLayout';
import TemplateSelector from '../../components/TemplateSelector';
// Templates: exact casing & folders
import CvClassic from '../../components/templates/cv-templates/CvClassic';
import LetterSimple from '../../components/templates/Letter-templates/LetterSimple';

export default function Page() {
  return (
    <BuilderLayout>
      <h2 className="text-2xl mb-4">Choose a template</h2>
      <TemplateSelector onSelect={(id) => console.log('selected', id)} />
      <div className="mt-6 space-y-6">
        <h3 className="text-lg">Previews</h3>
        <div>
          <p className="text-sm text-gray-500">CV preview</p>
          <CvClassic />
        </div>
        <div>
          <p className="text-sm text-gray-500">Letter preview</p>
          <LetterSimple />
        </div>
      </div>
    </BuilderLayout>
  );
}
