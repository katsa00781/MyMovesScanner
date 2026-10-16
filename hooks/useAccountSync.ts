import { useEffect } from 'react';

import { startSync } from '@/lib/sync';
import { useAuthStore } from '@/store/useAuthStore';
import { useProvidersStore } from '@/store/useProvidersStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSyncStore } from '@/store/useSyncStore';
import { useWatchlistStore } from '@/store/useWatchlistStore';

/**
 * Bejelentkezve szinkronban tartja a helyi store-okat a fiókkal (D-051). Megvárja, hogy minden
 * érintett store visszatöltődjön, különben az üres alapértékek felülírnák a szervert.
 */
export function useAccountSync() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const ready = [
    useProvidersStore((state) => state.hasHydrated),
    useSettingsStore((state) => state.hasHydrated),
    useWatchlistStore((state) => state.hasHydrated),
    useSyncStore((state) => state.hasHydrated),
  ].every(Boolean);

  useEffect(() => {
    if (!userId || !ready) return;
    return startSync(userId);
  }, [userId, ready]);
}
