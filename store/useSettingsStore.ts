import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { KidsAgeLimit } from '@/data/kidsAgeLimits';

type SettingsState = {
  kidsAgeLimit: KidsAgeLimit;
  setKidsAgeLimit: (limit: KidsAgeLimit) => void;
};

// Egyelőre csak a Gyerek korhatár; a régió, nyelv és hideMature a Beállítások feladattal jön.
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      kidsAgeLimit: 6,
      setKidsAgeLimit: (limit) => set({ kidsAgeLimit: limit }),
    }),
    {
      name: 'mms-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
