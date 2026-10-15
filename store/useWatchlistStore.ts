import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WatchlistItem } from '@/types/app';

type WatchlistState = {
  items: WatchlistItem[];
  /** Az AsyncStorage-ból visszatöltés után igaz; nem perzisztált. */
  hasHydrated: boolean;
  /** Hozzáadja, ha még nincs a listán, egyébként eltávolítja. */
  toggle: (item: Omit<WatchlistItem, 'addedAt'>) => void;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.type === item.type && i.id === item.id);
          return {
            items: exists
              ? state.items.filter((i) => !(i.type === item.type && i.id === item.id))
              : [{ ...item, addedAt: Date.now() }, ...state.items],
          };
        }),
    }),
    {
      name: 'mms-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
      // Hiba esetén is lefut, így a Watchlist nem ragad a betöltésnél.
      onRehydrateStorage: () => () => useWatchlistStore.setState({ hasHydrated: true }),
    },
  ),
);
