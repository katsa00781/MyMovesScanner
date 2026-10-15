import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WatchlistItem } from '@/types/app';

type WatchlistState = {
  items: WatchlistItem[];
  /** Hozzáadja, ha még nincs a listán, egyébként eltávolítja. */
  toggle: (item: Omit<WatchlistItem, 'addedAt'>) => void;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
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
    },
  ),
);
