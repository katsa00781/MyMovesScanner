import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { searchFilters, type SearchFilter } from '@/data/searchFilters';
import { getDetails, REGION, search } from '@/lib/api';
import { isOnMyServices, pickSearchChips, toSearchResults } from '@/lib/searchResults';
import { pickRegionOffers } from '@/lib/titleInfo';
import { useProvidersStore } from '@/store/useProvidersStore';
import type { SearchResult, SearchRow } from '@/types/app';
import type { WatchProviderRegion } from '@/types/tmdb';

/** Ennyi karaktertől keres; az egy betű túl sok, hasznavehetetlen találatot adna. */
const MIN_LENGTH = 2;
const DEBOUNCE_MS = 350;

/** Amit a találati sor a cím részleteiből tárol: a műfaj és a HU „hol nézhető” adat. */
type TitleInfo = { genre?: string; region?: WatchProviderRegion };

type SearchState = {
  filter: SearchFilter;
  /** A keresett szöveg, amelyre a találatok érkeztek. */
  term: string;
  results: SearchResult[];
  error: boolean;
};

const NO_RESULTS: SearchResult[] = [];

function useDebounced(value: string): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value]);
  return debounced;
}

// A Keresés adata: a begépelt szöveg (késleltetve) egy `search` hívás a szűrőnek megfelelő
// végponton, oldalanként az első oldal. A műfajhoz és a „hol nézhető” chipekhez címenként egy
// `getDetails` kell (az Edge Function 7 napra cache-eli): a sorok ezek előtt is látszanak, a
// részletek a képernyő élete alatt megmaradnak. A `null` a sikertelen lekérést jelzi.
export function useSearch(query: string, filter: SearchFilter) {
  const selectedProviderIds = useProvidersStore((state) => state.selectedProviderIds);
  const typed = query.trim();
  const term = useDebounced(typed);
  const active = typed.length >= MIN_LENGTH;

  const [state, setState] = useState<SearchState>({ filter, term: '', results: [], error: false });
  const [attempt, setAttempt] = useState(0);
  const [info, setInfo] = useState<Record<string, TitleInfo | null>>({});
  const requested = useRef(new Set<string>());

  useEffect(() => {
    if (term.length < MIN_LENGTH) return;
    const endpoint = searchFilters.find((item) => item.key === filter)?.endpoint ?? 'multi';
    let cancelled = false;
    search(endpoint, term)
      .then((page) => {
        if (!cancelled) {
          setState({ filter, term, results: toSearchResults(page.results, filter), error: false });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ filter, term, results: [], error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [term, filter, attempt]);

  // A szűrőváltás előtti találatok nem látszanak; a gépelés közbeniek igen, az új találatokig.
  const results = state.filter === filter ? state.results : NO_RESULTS;
  const settled = state.filter === filter && state.term === typed;

  useEffect(() => {
    results.forEach(({ key, id, type }) => {
      if (type === 'person' || requested.current.has(key)) return;
      requested.current.add(key);
      getDetails(type, id)
        .then((details) =>
          setInfo((prev) => ({
            ...prev,
            [key]: { genre: details.genres?.[0]?.name, region: details['watch/providers']?.results[REGION] },
          })),
        )
        .catch(() => setInfo((prev) => ({ ...prev, [key]: null })));
    });
  }, [results]);

  const retry = useCallback(() => {
    setInfo((prev) => {
      const next: Record<string, TitleInfo | null> = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (value === null) requested.current.delete(key);
        else next[key] = value;
      });
      return next;
    });
    setState((prev) => ({ ...prev, term: '', error: false }));
    setAttempt((n) => n + 1);
  }, []);

  const rows = useMemo<SearchRow[]>(
    () =>
      results.map((result) => {
        const found = info[result.key];
        if (result.type === 'person') {
          return { result, details: 'ready', onMyServices: false, chips: [] };
        }
        if (found === undefined) return { result, details: 'loading', onMyServices: false, chips: [] };
        if (found === null) return { result, details: 'failed', onMyServices: false, chips: [] };
        const offers = pickRegionOffers(found.region, selectedProviderIds);
        return {
          result,
          details: 'ready',
          genre: found.genre,
          onMyServices: isOnMyServices(offers),
          chips: pickSearchChips(offers),
        };
      }),
    [results, info, selectedProviderIds],
  );

  return {
    /** Van elég hosszú keresett szöveg; egyébként a képernyő a legutóbbiakat / súgót mutatja. */
    active,
    /** A késleltetett keresett szöveg (a „Találatok” fejléchez). */
    term,
    rows,
    /** Az első találatokra vár: nincs mit mutatni. */
    loading: active && !settled && results.length === 0,
    error: active && settled && state.error,
    empty: active && settled && !state.error && results.length === 0,
    retry,
  };
}
