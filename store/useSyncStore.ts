import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SyncStatus = 'idle' | 'syncing' | 'error';

type SyncState = {
  /** Az utolsó szinkron eredménye (nem perzisztált). */
  status: SyncStatus;
  /** Van még el nem küldött helyi változás. */
  dirty: boolean;
  /** Az a fiók, amelyiknek az adata az eszközön van; `null`, ha még nem volt fiók (D-051). */
  lastUserId: string | null;
  /** Az AsyncStorage-ból visszatöltés után igaz; nem perzisztált. */
  hasHydrated: boolean;
};

export const useSyncStore = create<SyncState>()(
  persist(
    (): SyncState => ({
      status: 'idle',
      dirty: false,
      lastUserId: null,
      hasHydrated: false,
    }),
    {
      name: 'mms-sync',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ dirty: state.dirty, lastUserId: state.lastUserId }),
      // Hiba esetén is lefut, így a szinkron nem ragad be.
      onRehydrateStorage: () => () => useSyncStore.setState({ hasHydrated: true }),
    },
  ),
);
