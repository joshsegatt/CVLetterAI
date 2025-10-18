# Configuração do Google OAuth

Este guia explica como configurar a autenticação com Google para o CVLetterAI.

## 1. Criar um Projeto no Google Cloud Console

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google+ API** e **Google Identity API**

## 2. Configurar OAuth 2.0

1. No menu lateral, vá para **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
3. Selecione **Web application**
4. Configure os campos:

### Nome da Aplicação
```
CVLetterAI Local Development
```

### Authorized JavaScript Origins
```
http://localhost:3000
```

### Authorized Redirect URIs
```
http://localhost:3000/api/auth/callback/google
```

## 3. Obter as Credenciais

Após criar, você receberá:
- **Client ID**: Começará com algo como `123456789-abc...googleusercontent.com`
- **Client Secret**: Uma string aleatória como `GOCSPX-abc123...`

## 4. Configurar Variáveis de Ambiente

Abra o arquivo `.env.local` e substitua:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_google_client_secret_aqui
```

Por suas credenciais reais:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefgh.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-sua_secret_aqui
```

## 5. Configurar Tela de Consentimento OAuth

1. Vá para **OAuth consent screen**
2. Selecione **External** para desenvolvimento
3. Preencha as informações obrigatórias:
   - **App name**: CVLetterAI
   - **User support email**: Seu email
   - **Developer contact information**: Seu email
4. Adicione os escopos necessários:
   - `email`
   - `profile`
   - `openid`

## 6. Adicionar Usuários de Teste (Desenvolvimento)

Durante o desenvolvimento, adicione seus emails de teste em **Test users**.

## 7. Reiniciar o Servidor

Após configurar as variáveis:

```bash
npm run dev
```

## 8. Testar a Autenticação

1. Vá para http://localhost:3000/sign-in
2. Clique em "Continue with Google"
3. Faça login com sua conta Google
4. Aceite as permissões
5. Você deve ser redirecionado para o dashboard

## Problemas Comuns

### Erro: "redirect_uri_mismatch"
- Verifique se a URI de redirecionamento está correta
- Deve ser exatamente: `http://localhost:3000/api/auth/callback/google`

### Erro: "invalid_client"
- Verifique se o Client ID e Secret estão corretos
- Certifique-se de que não há espaços extras nas variáveis

### Erro: "access_denied"
- Certifique-se de que o usuário está na lista de usuários de teste
- Verifique se os escopos estão configurados corretamente

## Debug

Para debugar problemas de OAuth, visite:
- http://localhost:3000/api/auth/debug

Este endpoint mostra o status das configurações de autenticação.

## Produção

Para produção, você precisará:
1. Verificar o domínio da aplicação
2. Atualizar as URIs autorizadas para seu domínio
3. Publicar a aplicação OAuth (remover o modo de teste)