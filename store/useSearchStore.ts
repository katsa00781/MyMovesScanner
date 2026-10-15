import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const MAX_RECENT = 10;

type SearchState = {
  /** A legutóbbi keresések, legújabb elöl; legfeljebb 10. */
  recentSearches: string[];
  /** Előre teszi a keresést (kis-nagybetűtől függetlenül nem duplázza). */
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      add: (query) => {
        const text = query.trim();
        if (!text) return;
        set((state) => ({
          recentSearches: [
            text,
            ...state.recentSearches.filter((item) => item.toLowerCase() !== text.toLowerCase()),
          ].slice(0, MAX_RECENT),
        }));
      },
      remove: (query) =>
        set((state) => ({ recentSearches: state.recentSearches.filter((item) => item !== query) })),
      clear: () => set({ recentSearches: [] }),
    }),
    { name: 'mms-search', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
