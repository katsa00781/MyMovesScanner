import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Hiányzik az EXPO_PUBLIC_SUPABASE_URL vagy az EXPO_PUBLIC_SUPABASE_ANON_KEY (.env).');
}

// Az mms-tmdb és az mms-sync Edge Function hívására, valamint a Supabase Auth-ra (D-051).
// A munkamenetet a supabase-js tárolja AsyncStorage-ban; bejelentkezve a függvényhívások a
// felhasználó tokenjével mennek, egyébként az anon kulccsal.
export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    storageKey: 'mms-auth',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// React Native-on a tokenfrissítést csak előtérben futtatjuk.
AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
