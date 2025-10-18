# 💳 Configuração do Sistema de Pagamentos Stripe

## ❌ **Problema Atual**
Os pagamentos não estão funcionando porque faltam configurações do Stripe no arquivo de ambiente.

## ✅ **Solução Completa**

### 1. **Criar Conta no Stripe** (se não tiver)
- Acesse: https://stripe.com/
- Crie uma conta gratuita
- Acesse o Dashboard

### 2. **Obter Chaves da API**
No Dashboard do Stripe:
- Vá em **Developers > API Keys**
- Copie suas chaves (use **Test keys** para desenvolvimento):
  - **Publishable key** (pk_test_...)
  - **Secret key** (sk_test_...)

### 3. **Criar Produtos e Preços**
No Dashboard do Stripe:
- Vá em **Products > Add product**

**Produto 1: Pro Plan (One-time)**
- Nome: `CVLetterAI Pro`
- Preço: `£5.99`
- Tipo: `One time`
- Copie o **Price ID** (price_...)

**Produto 2: Enterprise Plan (Subscription)**
- Nome: `CVLetterAI Enterprise`
- Preço: `£12.99`
- Tipo: `Recurring monthly`
- Copie o **Price ID** (price_...)

### 4. **Configurar Webhooks** (Opcional)
- Vá em **Developers > Webhooks**
- Add endpoint: `https://seu-dominio.com/api/webhooks/stripe`
- Eventos: `checkout.session.completed`, `invoice.payment_succeeded`
- Copie o **Webhook Secret** (whsec_...)

### 5. **Atualizar Arquivo .env**
```bash
# Stripe - Chaves da API
STRIPE_PUBLIC_KEY="pk_test_sua_chave_publica_aqui"
STRIPE_SECRET_KEY="sk_test_sua_chave_secreta_aqui"

# Stripe - IDs dos Preços (OBRIGATÓRIO!)
STRIPE_PRICE_ONE_TIME="price_seu_id_pro_aqui"
STRIPE_PRICE_SUBSCRIPTION="price_seu_id_enterprise_aqui"

# Stripe - Webhook (Opcional)
STRIPE_WEBHOOK_SECRET="whsec_seu_webhook_secret_aqui"

# Site URL (Importante para redirects)
NEXT_PUBLIC_SITE_URL="https://seu-dominio.vercel.app"
```

### 6. **Testar Localmente**
```bash
# Verificar configuração
curl http://localhost:3000/api/payments/debug

# Testar pagamento
# Vá em http://localhost:3000/pricing e teste um plano
```

### 7. **Configurar no Vercel**
No dashboard da Vercel:
- Vá em **Settings > Environment Variables**
- Adicione todas as variáveis acima
- Redeploy o projeto

## 🧪 **Cartões de Teste Stripe**
Para testar pagamentos em modo desenvolvimento:
- **Sucesso**: 4242 4242 4242 4242
- **Falha**: 4000 0000 0000 0002
- **CVC**: Qualquer 3 dígitos
- **Data**: Qualquer data futura

## 🔍 **Diagnóstico de Problemas**

### Erro: "Pro plan payment not configured"
```bash
# Falta configurar:
STRIPE_PRICE_ONE_TIME="price_1234567890abcdef"
```

### Erro: "Enterprise plan payment not configured"
```bash
# Falta configurar:
STRIPE_PRICE_SUBSCRIPTION="price_1234567890abcdef"
```

### Erro: "Stripe secret key is not configured"
```bash
# Falta configurar:
STRIPE_SECRET_KEY="sk_test_1234567890abcdef"
```

## ✅ **Verificar se Funciona**
1. Acesse `/pricing`
2. Clique em "Unlock Pro Features" 
3. Deve redirecionar para checkout do Stripe
4. Use cartão de teste: 4242 4242 4242 4242
5. Após pagamento, deve voltar para `/pricing?purchase=success`

## 🚨 **Importante**
- **NUNCA** commite as chaves do Stripe no código
- Use **Test keys** para desenvolvimento
- Use **Live keys** apenas em produção
- Configure webhooks para processar pagamentos automaticamente

## 🆘 **Precisa de Ajuda?**
1. Verifique o endpoint: `GET /api/payments/debug` (só funciona em desenvolvimento)
2. Veja os logs do console do navegador
3. Veja os logs da Vercel
4. Verifique o Dashboard do Stripe para transações