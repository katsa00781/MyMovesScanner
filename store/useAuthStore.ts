import { create } from 'zustand';

export type AuthUser = { id: string; email: string };

type AuthState = {
  /** A bejelentkezett felhasználó; fiók nélkül (vagy kijelentkezve) `null`. */
  user: AuthUser | null;
  /** A mentett munkamenet betöltése után igaz. */
  hasHydrated: boolean;
};

// Nem perzisztált: a munkamenetet a supabase-js tárolja AsyncStorage-ban (lib/supabase.ts), ez
// csak a felület és a szinkron tükre. Feltöltés: lib/auth.ts `startAuthListener`.
export const useAuthStore = create<AuthState>()(() => ({
  user: null,
  hasHydrated: false,
}));
