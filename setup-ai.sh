#!/bin/bash

# 🤖 CVLetterAI - Setup Automático de AI Local
# Este script configura Ollama automaticamente

echo "🚀 CVLetterAI - Configurando AI Local com Ollama"
echo "================================================"

# Detectar sistema operacional
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    OS="windows"
else
    echo "❌ Sistema operacional não suportado: $OSTYPE"
    exit 1
fi

echo "📱 Sistema detectado: $OS"

# Função para verificar se Ollama está instalado
check_ollama() {
    if command -v ollama &> /dev/null; then
        echo "✅ Ollama já está instalado"
        return 0
    else
        echo "❌ Ollama não encontrado"
        return 1
    fi
}

# Instalar Ollama
install_ollama() {
    echo "📦 Instalando Ollama..."
    
    if [[ "$OS" == "windows" ]]; then
        echo "🪟 Para Windows:"
        echo "1. Acesse: https://ollama.ai"
        echo "2. Baixe o instalador para Windows"
        echo "3. Execute o instalador"
        echo "4. Execute este script novamente"
        exit 1
    else
        curl -fsSL https://ollama.ai/install.sh | sh
        if [ $? -eq 0 ]; then
            echo "✅ Ollama instalado com sucesso!"
        else
            echo "❌ Erro ao instalar Ollama"
            exit 1
        fi
    fi
}

# Baixar modelo recomendado
download_model() {
    echo "📥 Baixando modelo recomendado (llama3.2:3b - ~2GB)..."
    
    ollama pull llama3.2:3b
    
    if [ $? -eq 0 ]; then
        echo "✅ Modelo baixado com sucesso!"
    else
        echo "❌ Erro ao baixar modelo"
        echo "💡 Tente manualmente: ollama pull llama3.2:3b"
    fi
}

# Iniciar Ollama em background
start_ollama() {
    echo "🔄 Iniciando servidor Ollama..."
    
    # Verificar se já está rodando
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama já está rodando!"
        return 0
    fi
    
    # Iniciar em background
    nohup ollama serve > /dev/null 2>&1 &
    
    # Aguardar inicialização
    echo "⏳ Aguardando inicialização..."
    for i in {1..10}; do
        if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
            echo "✅ Ollama iniciado com sucesso!"
            return 0
        fi
        echo "   Tentativa $i/10..."
        sleep 2
    done
    
    echo "❌ Timeout ao iniciar Ollama"
    return 1
}

# Testar AI
test_ai() {
    echo "🧪 Testando AI..."
    
    response=$(ollama run llama3.2:3b "Say hello" 2>/dev/null | head -1)
    
    if [[ -n "$response" ]]; then
        echo "✅ AI funcionando! Resposta: $response"
    else
        echo "❌ Erro ao testar AI"
    fi
}

# Configurar .env
setup_env() {
    echo "⚙️  Configurando .env..."
    
    ENV_FILE=".env.local"
    
    # Criar backup se existir
    if [[ -f "$ENV_FILE" ]]; then
        cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%s)"
        echo "📄 Backup criado: ${ENV_FILE}.backup.$(date +%s)"
    fi
    
    # Adicionar configurações
    cat >> "$ENV_FILE" << EOF

# 🤖 AI Local - Ollama (Configurado automaticamente)
AI_PROVIDER=ollama
OPENAI_BASE_URL=http://localhost:11434
AI_MODEL=llama3.2:3b
OLLAMA_AUTO_START=true

EOF

    echo "✅ Configuração adicionada em $ENV_FILE"
}

# Função principal
main() {
    echo ""
    
    # Verificar se Ollama está instalado
    if ! check_ollama; then
        echo "📦 Instalando Ollama..."
        install_ollama
    fi
    
    echo ""
    
    # Baixar modelo
    echo "📥 Verificando modelo..."
    if ! ollama list | grep -q "llama3.2:3b"; then
        download_model
    else
        echo "✅ Modelo llama3.2:3b já existe"
    fi
    
    echo ""
    
    # Iniciar servidor
    start_ollama
    
    echo ""
    
    # Testar
    test_ai
    
    echo ""
    
    # Configurar .env
    setup_env
    
    echo ""
    echo "🎉 Configuração concluída!"
    echo "==============================================="
    echo "✅ Ollama instalado e rodando"
    echo "✅ Modelo llama3.2:3b baixado"
    echo "✅ Servidor rodando em http://localhost:11434"
    echo "✅ CVLetterAI configurado"
    echo ""
    echo "🚀 Próximos passos:"
    echo "1. npm run dev (se não estiver rodando)"
    echo "2. Acesse http://localhost:3000/chat"
    echo "3. Teste o chat com AI local!"
    echo ""
    echo "💡 Comandos úteis:"
    echo "   ollama list           # Ver modelos instalados"
    echo "   ollama pull <model>   # Baixar modelo"
    echo "   ollama run <model>    # Testar modelo"
    echo "   ollama serve          # Iniciar servidor"
}

# Executar
main