# 🚀 Guia de Deploy no Vercel - CVLetterAI

## 🔧 Configurações Necessárias no Vercel

### 1. Variáveis de Ambiente Obrigatórias

Configure estas variáveis no painel do Vercel:

```bash
# NextAuth (OBRIGATÓRIO)
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=sua_chave_secreta_super_segura_min_32_caracteres

# Database (OBRIGATÓRIO)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Google OAuth (Para login com Google)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# GitHub OAuth (Para login com GitHub) 
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret

# AI API (Configure pelo menos uma)
GROQ_API_KEY=gsk_sua_chave_groq
```

### 2. 🔴 Problemas Comuns no Google OAuth no Vercel

#### Problema: "redirect_uri_mismatch"
**Solução:**
1. Vá no [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services > Credentials
3. Edite seu OAuth 2.0 Client ID
4. Em "Authorized redirect URIs", adicione:
   ```
   https://seu-dominio.vercel.app/api/auth/callback/google
   ```

#### Problema: "invalid_client"
**Solução:**
- Verifique se o GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos
- Confirme se estão configurados no Vercel (não apenas localmente)

#### Problema: "Configuration Error"
**Solução:**
- Verifique se NEXTAUTH_URL aponta para o domínio correto do Vercel
- Confirme se NEXTAUTH_SECRET tem pelo menos 32 caracteres

### 3. 📋 Checklist de Deploy

- [ ] ✅ Build local funcionando (`npm run build`)
- [ ] ✅ Todas as variáveis de ambiente configuradas no Vercel
- [ ] ✅ Google OAuth redirect URI configurado
- [ ] ✅ GitHub OAuth redirect URI configurado (se usando)
- [ ] ✅ Banco de dados PostgreSQL funcionando
- [ ] ✅ Pelo menos uma API de AI configurada
- [ ] ✅ NEXTAUTH_URL com domínio correto do Vercel

### 4. 🔍 Como Testar

1. **Deploy no Vercel:**
   ```bash
   git push origin main
   ```

2. **Teste o login:**
   - Acesse `https://seu-dominio.vercel.app/sign-in`
   - Teste cada método de login
   - Verifique se redireciona corretamente

3. **Verifique os logs:**
   - Vá no painel do Vercel > Functions
   - Verifique se há erros nos logs

### 5. 🆘 Soluções Rápidas

#### Se o Google OAuth não funcionar:
1. Desabilite temporariamente adicionando ao arquivo de auth:
   ```javascript
   // Comente o GoogleProvider no NextAuth config
   ```

2. Use apenas email/senha ou GitHub até resolver

#### Se houver erro de banco:
1. Use Neon.tech (gratuito) para PostgreSQL
2. Configure DATABASE_URL no Vercel
3. Execute `npx prisma db push` para criar tabelas

### 6. 📱 URLs Importantes

- **Painel Vercel:** https://vercel.com/dashboard
- **Google Cloud Console:** https://console.cloud.google.com
- **GitHub OAuth Apps:** https://github.com/settings/developers
- **Neon Database:** https://neon.tech

### 7. 🔄 Comandos Úteis

```bash
# Build local
npm run build

# Deploy manual
npx vercel --prod

# Verificar variáveis
npx vercel env ls

# Ver logs
npx vercel logs
```

---

## 🚨 Nota Importante

O projeto funciona perfeitamente em local e o problema está apenas na configuração do Google OAuth no Vercel. Você pode:

1. **Opção 1:** Corrigir o Google OAuth (seguir passos acima)
2. **Opção 2:** Desabilitar Google temporariamente e usar só GitHub/Email
3. **Opção 3:** Fazer deploy e depois configurar OAuth gradualmente

O sistema de múltiplos logins permite que você desabilite provedores específicos sem quebrar o sistema!