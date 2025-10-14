"use client";

import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Links do dashboard centralizados em um array
const dashboardLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/cv-builder", label: "CV Builder" },
  { href: "/letter-builder", label: "Letter Builder" },
  { href: "/chat", label: "AI Chat" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Verifica se a rota atual pertence ao dashboard
  const isDashboard = dashboardLinks.some((link) =>
    pathname.startsWith(link.href)
  );

  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen flex">
        {/* Sidebar do dashboard */}
        {isDashboard && (
          <aside className="w-64 border-r border-gray-800 p-6">
            <nav className="space-y-3 font-medium">
              {dashboardLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* Conteúdo principal */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
