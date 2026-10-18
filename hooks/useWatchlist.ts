import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getDetails } from '@/lib/api';
import { matchesSegment, pickAvailability, pickStatus } from '@/lib/watchlistStatus';
import { useProvidersStore } from '@/store/useProvidersStore';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import type { WatchlistAvailability, WatchlistItem, WatchlistStatus } from '@/types/app';

export type WatchlistEntry = { item: WatchlistItem; status?: WatchlistStatus };

const keyOf = (item: WatchlistItem) => `${item.type}:${item.id}`;

// A watchlist elemei a státuszukkal. A státuszhoz címenként egy `getDetails` kell (az Edge
// Function 7 napra cache-eli); az elemek a részletek előtt is látszanak, státusz nélkül. A
// `null` a sikertelen lekérést jelzi: az ilyen cím státusz nélkül marad, újrapróbálásra újra kéri.
export function useWatchlist() {
  const items = useWatchlistStore((state) => state.items);
  const hydrated = useWatchlistStore((state) => state.hasHydrated);
  const selectedProviderIds = useProvidersStore((state) => state.selectedProviderIds);
  const [availability, setAvailability] = useState<Record<string, WatchlistAvailability | null>>({});
  const [attempt, setAttempt] = useState(0);
  const requested = useRef(new Set<string>());

  useEffect(() => {
    const todo = items.filter((item) => !requested.current.has(keyOf(item)));
    todo.forEach((item) => {
      const key = keyOf(item);
      requested.current.add(key);
      getDetails(item.type, item.id)
        .then((details) => setAvailability((prev) => ({ ...prev, [key]: pickAvailability(details) })))
        .catch(() => setAvailability((prev) => ({ ...prev, [key]: null })));
    });
  }, [items, attempt]);

  const retry = useCallback(() => {
    setAvailability((prev) => {
      const next: Record<string, WatchlistAvailability | null> = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (value === null) requested.current.delete(key);
        else next[key] = value;
      });
      return next;
    });
    setAttempt((n) => n + 1);
  }, []);

  const entries = useMemo<WatchlistEntry[]>(() => {
    const today = new Date().toISOString().slice(0, 10);
    return items.map((item) => {
      const found = availability[keyOf(item)];
      return { item, status: found ? pickStatus(found, selectedProviderIds, today) : undefined };
    });
  }, [items, availability, selectedProviderIds]);

  const counts = useMemo(
    () => ({
      all: entries.length,
      available: entries.filter((entry) => matchesSegment(entry.status, 'available')).length,
      soon: entries.filter((entry) => matchesSegment(entry.status, 'soon')).length,
    }),
    [entries],
  );

  const answered = items.filter((item) => keyOf(item) in availability);
  // Betöltés: csak a mentett lista visszatöltéséig; a helyi lista a státuszok nélkül, net nélkül
  // is látszik. Hiba: ha minden státusz-lekérés elbukott (a lista ekkor is megmarad).
  const loading = !hydrated;
  const error =
    hydrated &&
    items.length > 0 &&
    answered.length === items.length &&
    answered.every((item) => availability[keyOf(item)] === null);

  return { entries, counts, isEmpty: hydrated && items.length === 0, loading, error, retry };
}
