'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ChatShell = dynamic(() => import('@/features/chat/components/ChatShell'), {
  ssr: false,
  loading: () => <div className="glass-panel p-6">Initialising AI advisor…</div>
});

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <header className="glass-panel border border-white/10 p-6">
        <h1 className="text-2xl font-semibold text-white">AI advisory chat</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Ask for guidance on CV structuring, interview prep, or tenancy obligations.
          Every response is traced and stored securely within eu-west regions.
        </p>
      </header>
      <Suspense fallback={<div className="glass-panel p-6">Connecting to the edge…</div>}>
        <ChatShell />
      </Suspense>
    </div>
  );
}
