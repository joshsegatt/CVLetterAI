'use client';

import { useEffect, useRef } from 'react';
import { Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useChatAssistant } from '@/features/chat/hooks/useChatAssistant';

function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'max-w-3xl rounded-3xl px-6 py-4 text-sm shadow-lg shadow-black/20',
        isUser ? 'ml-auto bg-accent text-black' : 'bg-white/5 text-neutral-100'
      )}
    >
      <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
    </motion.div>
  );
}

export default function ChatShell() {
  const { messages, input, setInput, isLoading, streamAssistantReply, startVoiceCapture } =
    useChatAssistant();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <div className="glass-panel grid min-h-[480px] grid-rows-[1fr_auto] border border-white/10">
      <div ref={listRef} className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-neutral-300">
            Ask about CV optimisation, interview prep, or tenancy compliance. Streaming
            responses appear here with citations when available.
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} role={message.role} content={message.content} />
          ))
        )}
      </div>
      <form
        className="flex flex-col gap-3 border-t border-white/10 bg-surface-highlight/70 px-4 py-4 backdrop-blur"
        onSubmit={async (event) => {
          event.preventDefault();
          await streamAssistantReply();
        }}
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask: “Draft a landlord reference letter in French” or “How do I position a gap year?”"
          rows={3}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            intent="ghost"
            size="sm"
            onClick={startVoiceCapture}
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" /> Start voice input
          </Button>
          <Button type="submit" disabled={isLoading || input.trim().length === 0}>
            {isLoading ? 'Streaming…' : 'Send'} <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
