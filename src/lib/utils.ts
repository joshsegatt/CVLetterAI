// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária para combinar classes do Tailwind de forma segura.
 * - Usa clsx para condicional
 * - Usa tailwind-merge para evitar conflitos (ex: "p-2 p-4" → mantém só "p-4")
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
