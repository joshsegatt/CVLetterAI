import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/cv-builder") || pathname.startsWith("/letter-builder") || pathname.startsWith("/chat") || pathname.startsWith("/settings");

  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen flex">
        {isDashboard && (
          <aside className="w-64 border-r border-gray-800 p-6">
            <nav className="space-y-3 font-medium">
              <Link href="/dashboard" className="block hover:text-blue-400">Overview</Link>
              <Link href="/cv-builder" className="block hover:text-blue-400">CV Builder</Link>
              <Link href="/letter-builder" className="block hover:text-blue-400">Letter Builder</Link>
              <Link href="/chat" className="block hover:text-blue-400">AI Chat</Link>
              <Link href="/settings" className="block hover:text-blue-400">Settings</Link>
            </nav>
          </aside>
        )}

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
