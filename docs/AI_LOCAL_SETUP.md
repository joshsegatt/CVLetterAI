# 🤖 Guia de AI Local para CVLetterAI

## 🎯 **Opções Disponíveis (em ordem de recomendação)**

### **1. Ollama - RECOMENDADO ⭐**

**Vantagens:**
- ✅ Muito fácil de instalar
- ✅ Consome menos recursos que LM Studio
- ✅ Interface CLI simples
- ✅ Modelos otimizados
- ✅ Funciona offline 100%

**Instalação:**

```bash
# 1. Instalar Ollama
# Windows: Baixe em https://ollama.ai
# Linux/Mac: curl -fsSL https://ollama.ai/install.sh | sh

# 2. Baixar modelo (escolha um)
ollama pull llama3.2:3b          # Rápido, 2GB
ollama pull llama3.1:8b          # Melhor qualidade, 4.7GB  
ollama pull codellama:7b         # Especializado em código
ollama pull mistral:7b           # Alternativa ao Llama

# 3. Iniciar servidor
ollama serve

# 4. Testar (opcional)
ollama run llama3.2:3b "Hello, world!"
```

**Configuração no CVLetterAI:**
```env
# .env.local
OPENAI_BASE_URL=http://localhost:11434
AI_PROVIDER=ollama
AI_MODEL=llama3.2:3b
```

---

### **2. Transformers.js - Browser AI 🌐**

**Vantagens:**
- ✅ Roda 100% no browser do usuário
- ✅ Não precisa de servidor local
- ✅ Totalmente privado
- ❌ Modelos menores (menos qualidade)
- ❌ Consome RAM do browser

**Instalação:**

```bash
npm install @xenova/transformers
```

**Ativação:**
Descomente as linhas no arquivo `src/services/ai/unified.ts`

---

### **3. API Local Customizada 🛠️**

**Para quem quer controle total:**

```python
# server.py - Exemplo com FastAPI
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

@app.post("/chat")
async def chat(request: dict):
    async def generate():
        messages = request["messages"]
        # Sua lógica de AI aqui
        for word in ["Olá", "mundo", "do", "CVLetterAI!"]:
            yield f"data: {json.dumps({'content': word + ' '})}\n\n"
            await asyncio.sleep(0.1)
    
    return StreamingResponse(generate(), media_type="text/plain")

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Configuração:**
```env
AI_PROVIDER=local-api
OPENAI_BASE_URL=http://localhost:8000
```

---

## 🚀 **Implementação no CVLetterAI**

### **Arquivos Modificados:**

1. **`src/services/ai/ollama.ts`** - Cliente Ollama
2. **`src/services/ai/unified.ts`** - AI Unificado
3. **`src/services/ai/chat.ts`** - Chat atualizado
4. **`src/services/ai/transformers.ts`** - Transformers.js

### **Como Funciona:**

```typescript
// O sistema automaticamente detecta qual AI está disponível:
// 1º - Tenta Ollama (localhost:11434)
// 2º - Tenta LM Studio (localhost:1234) 
// 3º - Tenta OpenAI (se API_KEY configurada)
// 4º - Usa Transformers.js (browser)
// 5º - Mostra instruções de instalação
```

---

## 🔧 **Configuração Avançada**

### **Variáveis de Ambiente:**

```env
# .env.local

# Ollama (Recomendado)
AI_PROVIDER=ollama
OPENAI_BASE_URL=http://localhost:11434
AI_MODEL=llama3.2:3b

# LM Studio
# AI_PROVIDER=lmstudio
# OPENAI_BASE_URL=http://localhost:1234/v1
# AI_MODEL=local-model

# OpenAI (Pago)
# AI_PROVIDER=openai
# OPENAI_API_KEY=sua_chave_aqui
# AI_MODEL=gpt-4o-mini

# API Local
# AI_PROVIDER=local-api
# OPENAI_BASE_URL=http://localhost:8000
# AI_API_KEY=sua_chave_opcional
```

---

## 📊 **Comparação de Performance**

| Opção | Tamanho | RAM | CPU | Qualidade | Velocidade |
|-------|---------|-----|-----|-----------|------------|
| Ollama llama3.2:3b | 2GB | 4GB | Médio | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Ollama llama3.1:8b | 4.7GB | 8GB | Alto | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| LM Studio | 3-7GB | 6-12GB | Alto | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Transformers.js | 100MB | 1-2GB | Baixo | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| OpenAI API | 0MB | 0GB | 0 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 **Recomendação Final**

### **Para Desenvolvimento:**
1. **Ollama com llama3.2:3b** - Melhor custo-benefício
2. Fallback para Transformers.js se não conseguir instalar

### **Para Produção:**
1. **OpenAI API** - Máxima qualidade e confiabilidade
2. **Ollama em servidor dedicado** - Se privacidade é crítica

### **Para Demonstração:**
1. **Transformers.js** - Funciona em qualquer lugar, sem setup

---

## 🔧 **Próximos Passos**

1. Escolha uma opção acima
2. Instale seguindo as instruções
3. Configure o `.env.local`
4. Reinicie o servidor: `npm run dev`
5. Teste no chat do CVLetterAI

O sistema detectará automaticamente qual AI está disponível! 🚀