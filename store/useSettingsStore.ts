import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { KidsAgeLimit } from '@/data/kidsAgeLimits';

type SettingsState = {
  kidsAgeLimit: KidsAgeLimit;
  /** Ha igaz, a Gyerek sarok a korhatár fölötti címeket elrejti (D-049). */
  hideMature: boolean;
  /** Az AsyncStorage-ból visszatöltés után igaz; nem perzisztált. */
  hasHydrated: boolean;
  setKidsAgeLimit: (limit: KidsAgeLimit) => void;
  setHideMature: (hide: boolean) => void;
};

// A régió (HU) és a nyelv (hu-HU) v1-ben nem választható, ezért nincs a store-ban (D-049).
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      kidsAgeLimit: 6,
      hideMature: true,
      hasHydrated: false,
      setKidsAgeLimit: (limit) => set({ kidsAgeLimit: limit }),
      setHideMature: (hide) => set({ hideMature: hide }),
    }),
    {
      name: 'mms-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ kidsAgeLimit: state.kidsAgeLimit, hideMature: state.hideMature }),
      // Hiba esetén is lefut, így a korhatárra váró lekérdezések nem ragadnak be.
      onRehydrateStorage: () => () => useSettingsStore.setState({ hasHydrated: true }),
    },
  ),
);
