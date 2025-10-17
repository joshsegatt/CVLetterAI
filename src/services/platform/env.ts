const requiredEnv = ['DATABASE_URL', 'STRIPE_SECRET_KEY'] as const;

type RequiredEnv = (typeof requiredEnv)[number];

const optionalEnv = [
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_SITE_URL',
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'OPENAI_BASE_URL',
  'STRIPE_PRICE_ONE_TIME',
  'STRIPE_PRICE_SUBSCRIPTION',
  'STRIPE_WEBHOOK_SECRET'
] as const;

type OptionalEnv = (typeof optionalEnv)[number];

function readEnv(key: RequiredEnv, optional = false) {
  const value = process.env[key];
  if (!value && !optional) {
    console.warn(`Missing environment variable: ${key}`);
  }
  return value;
}

function readOptionalEnv(key: OptionalEnv) {
  return process.env[key] ?? '';
}

export const platformEnv = {
  databaseUrl: readEnv('DATABASE_URL') ?? '',
  stripeSecret: readEnv('STRIPE_SECRET_KEY') ?? '',
  stripeWebhookSecret: readOptionalEnv('STRIPE_WEBHOOK_SECRET'),
  analyticsDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '',
  appName: readOptionalEnv('NEXT_PUBLIC_APP_NAME') || 'CVLetterAI',
  openaiApiKey: readOptionalEnv('OPENAI_API_KEY'),
  openaiModel: readOptionalEnv('OPENAI_MODEL') || 'gpt-4.1-mini',
  openaiBaseUrl: readOptionalEnv('OPENAI_BASE_URL') || 'https://api.openai.com/v1',
  siteUrl: readOptionalEnv('NEXT_PUBLIC_SITE_URL') || 'http://localhost:3000',
  stripePriceOneTime: readOptionalEnv('STRIPE_PRICE_ONE_TIME'),
  stripePriceSubscription: readOptionalEnv('STRIPE_PRICE_SUBSCRIPTION')
};

export function assertEnv() {
  requiredEnv.forEach((key) => readEnv(key));
}
