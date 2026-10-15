import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Hiányzik az EXPO_PUBLIC_SUPABASE_URL vagy az EXPO_PUBLIC_SUPABASE_ANON_KEY (.env).');
}

// Nincs auth: csak az mms-tmdb Edge Function hívására használjuk.
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
