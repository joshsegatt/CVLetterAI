"use client";

import { useState } from 'react';

export default function TestAIPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testAI = async () => {
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message || 'Como escrever um CV profissional?'
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Ler stream
      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        setResponse(result);
      }

    } catch (error) {
      setResponse(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 to-surface-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel border-white/10 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">🤖 Teste AI Local</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Mensagem para AI:</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Como escrever um CV profissional?"
                className="w-full p-4 rounded-lg bg-surface-800/50 border border-white/10 text-white"
              />
            </div>

            <button
              onClick={testAI}
              disabled={loading}
              className="bg-gradient-brand text-white px-8 py-4 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? '🔄 Processando...' : '🚀 Testar AI Local'}
            </button>

            {response && (
              <div className="bg-surface-800/30 border border-white/10 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">📄 Resposta da AI:</h3>
                <pre className="text-surface-300 whitespace-pre-wrap text-sm">
                  {response}
                </pre>
              </div>
            )}

            <div className="text-surface-400 text-sm">
              <p>✅ Esta AI funciona 100% local - sem Ollama, sem LM Studio!</p>
              <p>🎯 Especializada em CV e Letters para o mercado UK</p>
              <p>⚡ Respostas instantâneas baseadas em templates e regras</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}