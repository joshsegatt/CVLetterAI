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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 shadow-lg">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CV</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">CVLetterAI</span>
          </div>
        </div>
        
        <nav className="space-y-2">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium"
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
