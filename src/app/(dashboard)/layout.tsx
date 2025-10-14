import type { ReactNode } from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <aside className="w-64 border-r border-gray-800 p-6">
        <nav className="space-y-3 font-medium">
          <Link href="/dashboard" className="block hover:text-blue-400">Overview</Link>
          <Link href="/cv-builder" className="block hover:text-blue-400">CV Builder</Link>
          <Link href="/letter-builder" className="block hover:text-blue-400">Letter Builder</Link>
          <Link href="/chat" className="block hover:text-blue-400">AI Chat</Link>
          <Link href="/settings" className="block hover:text-blue-400">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
