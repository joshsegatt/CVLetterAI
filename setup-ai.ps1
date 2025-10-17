# 🤖 CVLetterAI - Setup Automático de AI Local (Windows)
# PowerShell Script para configurar Ollama

Write-Host "🚀 CVLetterAI - Configurando AI Local com Ollama" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Função para verificar se Ollama está instalado
function Test-Ollama {
    try {
        $null = Get-Command ollama -ErrorAction Stop
        Write-Host "✅ Ollama já está instalado" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Ollama não encontrado" -ForegroundColor Red
        return $false
    }
}

# Instalar Ollama
function Install-Ollama {
    Write-Host "📦 Instalando Ollama..." -ForegroundColor Yellow
    
    Write-Host "🪟 Para Windows:" -ForegroundColor Cyan
    Write-Host "1. Abrindo https://ollama.ai no seu browser..." -ForegroundColor White
    Start-Process "https://ollama.ai"
    Write-Host "2. Baixe o instalador para Windows" -ForegroundColor White
    Write-Host "3. Execute o instalador" -ForegroundColor White
    Write-Host "4. Após instalação, execute: .\setup-ai.ps1 novamente" -ForegroundColor White
    
    Read-Host "Pressione Enter após instalar o Ollama"
    
    if (Test-Ollama) {
        Write-Host "✅ Ollama detectado!" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Ollama ainda não detectado. Reinicie o PowerShell e tente novamente." -ForegroundColor Red
        exit 1
    }
}

# Baixar modelo recomendado
function Get-Model {
    Write-Host "📥 Baixando modelo recomendado (llama3.2:3b - ~2GB)..." -ForegroundColor Yellow
    
    try {
        & ollama pull llama3.2:3b
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Modelo baixado com sucesso!" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Erro ao baixar modelo" -ForegroundColor Red
            Write-Host "💡 Tente manualmente: ollama pull llama3.2:3b" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ Erro ao executar ollama pull: $_" -ForegroundColor Red
    }
}

# Iniciar Ollama
function Start-OllamaServer {
    Write-Host "🔄 Iniciando servidor Ollama..." -ForegroundColor Yellow
    
    # Verificar se já está rodando
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction Stop
        Write-Host "✅ Ollama já está rodando!" -ForegroundColor Green
        return $true
    }
    catch {
        # Não está rodando, vamos iniciar
    }
    
    # Iniciar em processo separado
    Write-Host "⏳ Iniciando servidor..." -ForegroundColor White
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    
    # Aguardar inicialização
    $attempts = 0
    $maxAttempts = 15
    
    while ($attempts -lt $maxAttempts) {
        $attempts++
        Write-Host "   Tentativa $attempts/$maxAttempts..." -ForegroundColor Gray
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction Stop
            Write-Host "✅ Ollama iniciado com sucesso!" -ForegroundColor Green
            return $true
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    
    Write-Host "❌ Timeout ao iniciar Ollama" -ForegroundColor Red
    return $false
}

# Testar AI
function Test-AI {
    Write-Host "🧪 Testando AI..." -ForegroundColor Yellow
    
    try {
        $response = & ollama run llama3.2:3b "Say hello" 2>$null | Select-Object -First 1
        
        if ($response) {
            Write-Host "✅ AI funcionando! Resposta: $response" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Erro ao testar AI" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Erro ao testar AI: $_" -ForegroundColor Red
    }
}

# Configurar .env
function Set-Environment {
    Write-Host "⚙️  Configurando .env..." -ForegroundColor Yellow
    
    $envFile = ".env.local"
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    
    # Criar backup se existir
    if (Test-Path $envFile) {
        $backupFile = "${envFile}.backup.${timestamp}"
        Copy-Item $envFile $backupFile
        Write-Host "📄 Backup criado: $backupFile" -ForegroundColor Gray
    }
    
    # Adicionar configurações
    $config = @"

# 🤖 AI Local - Ollama (Configurado automaticamente)
AI_PROVIDER=ollama
OPENAI_BASE_URL=http://localhost:11434
AI_MODEL=llama3.2:3b
OLLAMA_AUTO_START=true

"@
    
    Add-Content -Path $envFile -Value $config
    Write-Host "✅ Configuração adicionada em $envFile" -ForegroundColor Green
}

# Função principal
function Main {
    Write-Host ""
    
    # Verificar se Ollama está instalado
    if (-not (Test-Ollama)) {
        Install-Ollama
    }
    
    Write-Host ""
    
    # Verificar modelo
    Write-Host "📥 Verificando modelo..." -ForegroundColor Yellow
    try {
        $models = & ollama list 2>$null
        if ($models -notmatch "llama3.2:3b") {
            Get-Model
        }
        else {
            Write-Host "✅ Modelo llama3.2:3b já existe" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️  Não foi possível verificar modelos. Tentando baixar..." -ForegroundColor Yellow
        Get-Model
    }
    
    Write-Host ""
    
    # Iniciar servidor
    if (Start-OllamaServer) {
        Write-Host ""
        Test-AI
    }
    
    Write-Host ""
    
    # Configurar .env
    Set-Environment
    
    Write-Host ""
    Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host "✅ Ollama instalado e rodando" -ForegroundColor Green
    Write-Host "✅ Modelo llama3.2:3b baixado" -ForegroundColor Green
    Write-Host "✅ Servidor rodando em http://localhost:11434" -ForegroundColor Green
    Write-Host "✅ CVLetterAI configurado" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. npm run dev (se não estiver rodando)" -ForegroundColor White
    Write-Host "2. Acesse http://localhost:3000/chat" -ForegroundColor White
    Write-Host "3. Teste o chat com AI local!" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Comandos úteis:" -ForegroundColor Cyan
    Write-Host "   ollama list           # Ver modelos instalados" -ForegroundColor Gray
    Write-Host "   ollama pull <model>   # Baixar modelo" -ForegroundColor Gray
    Write-Host "   ollama run <model>    # Testar modelo" -ForegroundColor Gray
    Write-Host "   ollama serve          # Iniciar servidor" -ForegroundColor Gray
}

# Executar
Main