import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables from Vite runtime
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Checks if Supabase credentials are configured with valid non-placeholder values
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your_supabase_anon')
  );
};

/**
 * Standard Supabase Client (Browser Anonymous Key)
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'spiher_supabase_auth_session',
      },
    })
  : null;

/**
 * Admin / Elevated Supabase Client (Optional Service Role Key)
 */
export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured() && supabaseServiceKey && !supabaseServiceKey.includes('your_supabase')
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: 'spiher_supabase_admin_session',
        },
      })
    : null;

export { supabaseUrl, supabaseAnonKey, supabaseServiceKey };
