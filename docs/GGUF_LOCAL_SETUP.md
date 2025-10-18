# 🧠 Guia: Modelo GGUF Local + Web Search Híbrido

## 🎯 **O que você terá:**
- ✅ **Modelo local GGUF** rodando offline (privacidade total)
- ✅ **Web search automático** quando precisar de dados atuais
- ✅ **Sistema híbrido inteligente** que decide quando usar cada um
- ✅ **Sem dependência de APIs** externas (opcional)

---

## 📥 **1. Instalar Ollama (Gerenciador de Modelos GGUF)**

### Windows:
```powershell
# Baixar e instalar Ollama
winget install Ollama.Ollama
# ou baixe de: https://ollama.com/download
```

### Verificar instalação:
```powershell
ollama --version
```

---

## 🤖 **2. Baixar Modelo GGUF Recomendado**

### Modelos recomendados (em ordem de qualidade):

#### **Opção 1: Llama 3.2 (Melhor custo-benefício)**
```powershell
ollama pull llama3.2:latest
# Tamanho: ~2GB
# Qualidade: Excelente para chat
# RAM necessária: 4GB
```

#### **Opção 2: Llama 3.1 8B (Mais inteligente)**
```powershell
ollama pull llama3.1:8b
# Tamanho: ~4.7GB  
# Qualidade: Superior
# RAM necessária: 6GB
```

#### **Opção 3: Qwen 2.5 (Rápido e eficiente)**
```powershell
ollama pull qwen2.5:7b
# Tamanho: ~4.1GB
# Qualidade: Muito boa
# RAM necessária: 5GB
```

#### **Opção 4: Gemma 2 (Google, compacto)**
```powershell
ollama pull gemma2:2b
# Tamanho: ~1.6GB
# Qualidade: Boa para máquinas fracas
# RAM necessária: 3GB
```

---

## ⚙️ **3. Configurar o Sistema Híbrido**

O sistema já está configurado para:

### **Funcionamento Automático:**
```typescript
// 1. Usuário pergunta sobre CV
"Como fazer um CV para área de TI?"
→ Usa modelo LOCAL (offline, privado)

// 2. Usuário pergunta sobre salários atuais
"Qual salário de desenvolvedor em 2025?"
→ Ativa WEB SEARCH + modelo local (híbrido)

// 3. Usuário pergunta sobre empresa específica
"Como é trabalhar na Microsoft?"
→ Ativa WEB SEARCH para dados atuais
```

### **Triggers automáticos para Web Search:**
- Palavras como: "atual", "2025", "recente", "salário", "mercado"
- Perguntas sobre empresas específicas
- Informações que mudam com o tempo
- Dados de localização específica

---

## 🚀 **4. Testar o Sistema**

### **Iniciar Ollama:**
```powershell
# Ollama já inicia automaticamente, mas se precisar:
ollama serve
```

### **Testar modelo local:**
```powershell
ollama run llama3.2:latest
# Digite: "Olá, você está funcionando?"
# Ctrl+D para sair
```

### **Testar no CVLetterAI:**
1. Acesse: `http://localhost:3000/chat`
2. Teste offline: "Como estruturar um CV?"
3. Teste híbrido: "Salários de dev em 2025"

---

## 📊 **5. Verificar Status do Sistema**

O sistema mostra automaticamente:
- 🧠 **Offline**: Modelo local respondeu
- 🌐 **Híbrido**: Local + pesquisa web
- 🔍 **Web Search**: Só pesquisa (se local falhar)

---

## 🎛️ **6. Configurações Avançadas**

### **Ajustar desempenho do modelo:**
```powershell
# Para máquinas mais potentes
ollama run llama3.1:8b --gpu

# Para máquinas mais fracas  
ollama run gemma2:2b --num-thread 4
```

### **Variáveis de ambiente (opcional):**
```bash
# .env.local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest
HYBRID_AI_ENABLED=true
WEB_SEARCH_ENABLED=true
```

---

## 💡 **Vantagens do Sistema Híbrido:**

### **Privacidade Total:**
- ✅ **Dados sensíveis** ficam no seu computador
- ✅ **Sem envio** para servidores externos
- ✅ **Funciona offline** completamente

### **Inteligência Atual:**
- ✅ **Informações atuais** via web search
- ✅ **Dados de mercado** em tempo real
- ✅ **Salários atualizados** por região

### **Performance:**
- ✅ **Resposta rápida** (local é mais rápido)
- ✅ **Sem limites** de API
- ✅ **Custo zero** de operação

---

## 🔧 **Solução de Problemas**

### **Ollama não inicia:**
```powershell
# Reinstalar
ollama uninstall
winget install Ollama.Ollama
```

### **Modelo não baixa:**
```powershell
# Verificar espaço em disco (precisa de 5-10GB)
# Verificar internet
ollama pull llama3.2:latest --verbose
```

### **Sistema híbrido não funciona:**
```powershell
# Testar Ollama diretamente
curl http://localhost:11434/api/tags

# Verificar logs do Next.js
npm run dev
```

---

## 📈 **Modelos por Tipo de Máquina:**

### **Computador Fraco (4GB RAM):**
```powershell
ollama pull gemma2:2b
# Funciona bem, responde rápido
```

### **Computador Médio (8GB RAM):**
```powershell
ollama pull llama3.2:latest
# Melhor opção custo-benefício
```

### **Computador Potente (16GB+ RAM):**
```powershell
ollama pull llama3.1:8b
ollama pull qwen2.5:14b
# Máxima qualidade
```

---

## 🎯 **Resultado Final**

Você terá um sistema que:
- 🏠 **Roda em casa** (sem depender de APIs)
- 🧠 **Inteligente** (qualidade próxima ao GPT-3.5)
- 🌐 **Conectado** (busca dados atuais quando precisa)
- 💰 **Gratuito** (zero custo operacional)
- 🔒 **Privado** (dados não saem do seu PC)

**Tempo total de configuração: 15-30 minutos** ⏱️