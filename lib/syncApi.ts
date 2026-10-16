// Típusos hívások az mms-sync Edge Functionre (D-051). Bejelentkezett munkamenet kell hozzá:
// a függvény a felhasználót a tokenből azonosítja. A dokumentum alakja tükör:
// supabase/functions/mms-sync/index.ts (SyncData).
import type { KidsAgeLimit } from '@/data/kidsAgeLimits';
import { supabase } from '@/lib/supabase';
import type { WatchlistItem } from '@/types/app';

/** A szinkronizált állapot: egy dokumentum felhasználónként. */
export type SyncData = {
  v: 1;
  providerIds: number[];
  onboardingDone: boolean;
  kidsAgeLimit: KidsAgeLimit;
  hideMature: boolean;
  watchlist: WatchlistItem[];
};

async function call<T>(body: { action: 'get' } | { action: 'put'; data: SyncData }): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('mms-sync', { body });
  if (error || data === null) {
    throw new Error(error?.message ?? 'Üres válasz az mms-sync függvénytől.');
  }
  return data;
}

/** A felhasználó mentett dokumentuma; `null`, ha még nincs. */
export async function fetchUserData(): Promise<SyncData | null> {
  const result = await call<{ data: SyncData | null }>({ action: 'get' });
  return result.data?.v === 1 ? result.data : null;
}

export async function saveUserData(data: SyncData): Promise<void> {
  await call<{ ok: true }>({ action: 'put', data });
}
