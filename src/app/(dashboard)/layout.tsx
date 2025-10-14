import type { ReactNode } from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Centralizamos os links em um array para evitar repetição
const dashboardLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/cv-builder", label: "CV Builder" },
  { href: "/letter-builder", label: "Letter Builder" },
  { href: "/chat", label: "AI Chat" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-6">
        <nav className="space-y-3 font-medium">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded px-2 py-1 hover:text-blue-400 hover:bg-gray-800/40 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
