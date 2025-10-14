"use client";

import { cn } from "@/lib/utils"; // se você tiver util de classNames
import { Button } from "@/components/ui/Button";

interface TemplateOption {
  id: string;
  name: string;
  thumbnail: string; // caminho da imagem miniatura
}

export function TemplateSelector({
  options,
  selected,
  onSelect,
}: {
  options: TemplateOption[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "rounded-lg border p-2 flex flex-col items-center hover:border-indigo-400 transition",
            selected === opt.id
              ? "border-indigo-500 ring-2 ring-indigo-400"
              : "border-neutral-700"
          )}
        >
          <img
            src={opt.thumbnail}
            alt={opt.name}
            className="w-full h-32 object-cover rounded-md mb-2"
          />
          <span className="text-sm text-white">{opt.name}</span>
        </button>
      ))}
    </div>
  );
}
