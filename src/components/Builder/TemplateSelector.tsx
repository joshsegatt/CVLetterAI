import React from 'react';
import Button from './ui/Button';

type TemplateItem = {
  id: string;
  title: string;
  description?: string;
};

const DEFAULT_TEMPLATES: TemplateItem[] = [
  { id: 'cv-classic', title: 'CV — Classic', description: 'A classic CV layout' },
  { id: 'letter-simple', title: 'Letter — Simple', description: 'A minimal cover letter' },
];

type Props = {
  templates?: TemplateItem[];
  onSelect?: (id: string) => void;
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
