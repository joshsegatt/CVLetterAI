import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { platformEnv } from '@/services/platform/env';

export type Database = Record<string, unknown>;

let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    if (!platformEnv.supabaseUrl || !platformEnv.supabaseAnonKey) {
      throw new Error('Supabase client is not configured. Check NEXT_PUBLIC_SUPABASE env values.');
    }
    browserClient = createClient<Database>(
      platformEnv.supabaseUrl,
      platformEnv.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
  }
  return browserClient;
}

export function getSupabaseServiceRoleClient() {
  if (!platformEnv.supabaseUrl || !platformEnv.supabaseServiceRoleKey) {
    throw new Error('Supabase service client missing configuration.');
  }
  return createClient<Database>(platformEnv.supabaseUrl, platformEnv.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}
