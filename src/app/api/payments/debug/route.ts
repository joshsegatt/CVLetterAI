import { NextResponse } from 'next/server';
import { platformEnv } from '../../../../services/platform/env';

export const runtime = 'nodejs';

export async function GET() {
  // Só permite em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 404 });
  }

  const debug = {
    stripe: {
      secretKey: platformEnv.stripeSecret ? '✅ Configurado' : '❌ Faltando STRIPE_SECRET_KEY',
      webhookSecret: platformEnv.stripeWebhookSecret ? '✅ Configurado' : '⚠️ STRIPE_WEBHOOK_SECRET não definido',
      priceOneTime: platformEnv.stripePriceOneTime ? '✅ Configurado' : '❌ Faltando STRIPE_PRICE_ONE_TIME',
      priceSubscription: platformEnv.stripePriceSubscription ? '✅ Configurado' : '❌ Faltando STRIPE_PRICE_SUBSCRIPTION',
    },
    site: {
      siteUrl: platformEnv.siteUrl,
    },
    recommendations: [] as string[]
  };

  // Adicionar recomendações baseadas nos problemas encontrados
  if (!platformEnv.stripeSecret) {
    debug.recommendations.push('Configure STRIPE_SECRET_KEY com sua chave secreta do Stripe');
  }
  
  if (!platformEnv.stripePriceOneTime) {
    debug.recommendations.push('Configure STRIPE_PRICE_ONE_TIME com o ID do preço do plano Pro');
  }
  
  if (!platformEnv.stripePriceSubscription) {
    debug.recommendations.push('Configure STRIPE_PRICE_SUBSCRIPTION com o ID do preço do plano Enterprise');
  }

  if (!platformEnv.stripeWebhookSecret) {
    debug.recommendations.push('Configure STRIPE_WEBHOOK_SECRET para processar webhooks do Stripe');
  }

  return NextResponse.json(debug, { status: 200 });
}