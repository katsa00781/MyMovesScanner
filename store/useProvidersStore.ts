import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ProvidersState = {
  selectedProviderIds: number[];
  onboardingDone: boolean;
  /** Az AsyncStorage-ból visszatöltés után igaz; nem perzisztált. */
  hasHydrated: boolean;
  /** Elmenti a választást, és lezárja az onboardingot. */
  saveProviders: (ids: number[]) => void;
};

export const useProvidersStore = create<ProvidersState>()(
  persist(
    (set) => ({
      selectedProviderIds: [],
      onboardingDone: false,
      hasHydrated: false,
      saveProviders: (ids) => set({ selectedProviderIds: ids, onboardingDone: true }),
    }),
    {
      name: 'mms-providers',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedProviderIds: state.selectedProviderIds,
        onboardingDone: state.onboardingDone,
      }),
      // Hiba esetén is lefut, így az app nem ragad a betöltésnél.
      onRehydrateStorage: () => () => useProvidersStore.setState({ hasHydrated: true }),
    },
  ),
);
