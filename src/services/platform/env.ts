const requiredEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
] as const;

type RequiredEnv = (typeof requiredEnv)[number];

const optionalEnv = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'OPENAI_BASE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'STRIPE_PRICE_ONE_TIME',
  'STRIPE_PRICE_SUBSCRIPTION'
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
  supabaseUrl: readEnv('NEXT_PUBLIC_SUPABASE_URL') ?? '',
  supabaseAnonKey: readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? '',
  supabaseServiceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  stripeSecret: readEnv('STRIPE_SECRET_KEY') ?? '',
  stripeWebhookSecret: readEnv('STRIPE_WEBHOOK_SECRET') ?? '',
  analyticsDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '',
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
