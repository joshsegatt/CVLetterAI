"use client";

import React from "react";

interface TemplateOption {
  id: string;
  name: string;
  thumbnail: string;
}

interface TemplateSelectorProps {
  options: TemplateOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function TemplateSelector({ options, selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className={`relative rounded-lg border-2 overflow-hidden transition 
            ${selected === option.id 
              ? "border-blue-500 ring-2 ring-blue-400" 
              : "border-neutral-700 hover:border-neutral-500"}`}
        >
          {/* Thumbnail */}
          <img
            src={option.thumbnail}
            alt={option.name}
            className="w-full h-32 object-cover"
          />

          {/* Nome do template */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm text-center py-1">
            {option.name}
          </div>
        </button>
      ))}
    </div>
  );
}
