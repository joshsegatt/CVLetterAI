export type TemplateId = 
  | "executive" 
  | "modern" 
  | "creative" 
  | "swiss" 
  | "titan" 
  | "academic" 
  | "brutalist" 
  | "minimal";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  styles: {
    fontFamily: string;
    primaryColor: string;
    accentColor: string;
    layout: "classic" | "modern" | "grid" | "sidebar" | "compact";
  };
}

export const TEMPLATES: Template[] = [
  {
    id: "executive",
    name: "The Executive",
    description: "A traditional, authoritative layout designed for senior roles.",
    thumbnail: "/templates/executive.png",
    styles: {
      fontFamily: "font-serif",
      primaryColor: "#18181b",
      accentColor: "#4f46e5",
      layout: "classic",
    },
  },
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean lines and generous whitespace for a contemporary look.",
    thumbnail: "/templates/modern.png",
    styles: {
      fontFamily: "font-sans",
      primaryColor: "#27272a",
      accentColor: "#0891b2",
      layout: "modern",
    },
  },
  {
    id: "creative",
    name: "Creative Pulse",
    description: "Bold typography and asymmetric layouts for standing out.",
    thumbnail: "/templates/creative.png",
    styles: {
      fontFamily: "font-sans",
      primaryColor: "#0f172a",
      accentColor: "#ec4899",
      layout: "grid",
    },
  },
  {
    id: "swiss",
    name: "The Swiss",
    description: "Ultra-precise grid system inspired by international typographic style.",
    thumbnail: "/templates/swiss.png",
    styles: {
      fontFamily: "font-sans",
      primaryColor: "#000000",
      accentColor: "#E63946",
      layout: "modern",
    },
  },
  {
    id: "titan",
    name: "The Titan",
    description: "A bold, powerful layout for high-impact leadership roles.",
    thumbnail: "/templates/titan.png",
    styles: {
      fontFamily: "font-sans",
      primaryColor: "#1A1A1A",
      accentColor: "#FFD700",
      layout: "classic",
    },
  },
  {
    id: "academic",
    name: "The Academic",
    description: "Classic serif typography with a focus on publication and research history.",
    thumbnail: "/templates/academic.png",
    styles: {
      fontFamily: "font-serif",
      primaryColor: "#2C3E50",
      accentColor: "#2980B9",
      layout: "classic",
    },
  },
  {
    id: "brutalist",
    name: "The Brutalist",
    description: "Raw, unpolished, and high-contrast for a daring professional statement.",
    thumbnail: "/templates/brutalist.png",
    styles: {
      fontFamily: "font-mono",
      primaryColor: "#000000",
      accentColor: "#00FF00",
      layout: "grid",
    },
  },
  {
    id: "minimal",
    name: "Pure Minimal",
    description: "The absolute minimum required to present your value efficiently.",
    thumbnail: "/templates/minimal.png",
    styles: {
      fontFamily: "font-sans",
      primaryColor: "#4A4A4A",
      accentColor: "#9B9B9B",
      layout: "compact",
    },
  },
];
