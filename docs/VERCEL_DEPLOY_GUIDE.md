# 🚀 Guia de Deploy para Vercel

Este guia explica como fazer o deploy do CVLetterAI no Vercel.

## ✅ Pré-requisitos

1. ✅ Build local passando sem erros
2. ✅ Código commitado e pushed para o GitHub
3. ✅ Conta no Vercel conectada ao GitHub

## 🔧 Configuração no Vercel

### 1. Variáveis de Ambiente Obrigatórias

Configure estas variáveis no Vercel Dashboard:

```bash
# NextAuth (OBRIGATÓRIO)
NEXTAUTH_SECRET=sua_secret_key_super_secreta_aqui_123456789
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Database (OBRIGATÓRIO)
DATABASE_URL=postgresql://username:password@host:5432/database

# Stripe (OBRIGATÓRIO para pagamentos)
STRIPE_SECRET_KEY=sk_live_sua_chave
STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave
STRIPE_WEBHOOK_SECRET=whsec_sua_chave
```

### 2. Variáveis de AI (Opcional)

```bash
# Groq (FREE - Recomendado)
GROQ_API_KEY=gsk_sua_chave_aqui

# Hugging Face (FREE)
HUGGINGFACE_API_KEY=hf_sua_chave_aqui

# Cohere (FREE tier)
COHERE_API_KEY=sua_chave_cohere

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
```

### 3. Configurações do Projeto

No Vercel Dashboard:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Domínio Personalizado

1. Vá para Settings > Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções do Vercel

## 🗄️ Configuração do Banco de Dados

### Opção 1: Neon (Recomendado)

1. Crie conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a DATABASE_URL
4. Cole na variável de ambiente do Vercel

### Opção 2: Supabase

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá para Settings > Database
4. Copie a Connection String
5. Cole na variável de ambiente do Vercel

## 💳 Configuração do Stripe

1. Crie conta em [stripe.com](https://stripe.com)
2. Vá para Developers > API Keys
3. Copie as chaves públicas e secretas
4. Configure webhook endpoint: `https://seu-dominio.vercel.app/api/webhooks/stripe`

## 🔐 Configuração do Google OAuth

1. Siga o guia em `docs/GOOGLE_OAUTH_SETUP.md`
2. Configure as URIs autorizadas:
   - JavaScript origins: `https://seu-dominio.vercel.app`
   - Redirect URIs: `https://seu-dominio.vercel.app/api/auth/callback/google`

## 🚀 Deploy

### Deploy Automático

1. Conecte o repositório GitHub ao Vercel
2. A cada push na branch `main`, o deploy será automático
3. ✅ Deploy já configurado!

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## ✅ Verificação Pós-Deploy

1. **Health Check**: `https://seu-dominio.vercel.app/api/health`
2. **Auth Debug**: `https://seu-dominio.vercel.app/api/auth/debug`
3. **Teste de Login**: `https://seu-dominio.vercel.app/sign-in`
4. **Teste de AI**: `https://seu-dominio.vercel.app/chat`

## 🔍 Troubleshooting

### Build Errors

```bash
# Testar local
npm run build

# Verificar tipos
npx tsc --noEmit
```

### Runtime Errors

1. Verifique logs no Vercel Dashboard
2. Confirme variáveis de ambiente
3. Teste endpoints de debug

### Database Issues

1. Verifique conexão: `https://seu-dominio.vercel.app/api/health`
2. Execute migrations: `npx prisma db push`

## 📊 Monitoramento

- **Vercel Analytics**: Habilitado automaticamente
- **Error Tracking**: Logs no Vercel Dashboard
- **Performance**: Web Vitals no Vercel

## 🛡️ Segurança

- ✅ HTTPS automático via Vercel
- ✅ Headers de segurança configurados
- ✅ Rate limiting implementado
- ✅ CORS configurado
- ✅ NextAuth para autenticação

## 📝 Notas Importantes

1. **Environment Variables**: Sempre use variáveis de ambiente para secrets
2. **Database**: Configure Prisma corretamente para produção
3. **AI APIs**: Configure pelo menos uma API de AI gratuita
4. **Payments**: Teste Stripe em modo sandbox primeiro
5. **Domains**: Configure domínio personalizado para produção

🎉 **Deploy completo e pronto para produção!**