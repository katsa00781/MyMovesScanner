import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type ResultFilters } from '@/data/resultFilters';
import { searchFilters, type SearchFilter } from '@/data/searchFilters';
import { discover, getDetails, REGION, search } from '@/lib/api';
import { discoverFilterParams, filtersKey, matchesAvailability, matchesResultFilters } from '@/lib/resultFilters';
import { type CategorySelection, isEmptySelection, selectionKey, selectionParams } from '@/lib/searchCategories';
import { isOnMyServices, pickSearchChips, toSearchResults } from '@/lib/searchResults';
import { pickRegionOffers } from '@/lib/titleInfo';
import { useProvidersStore } from '@/store/useProvidersStore';
import type { SearchResult, SearchRow } from '@/types/app';
import type { MediaType, TitleSummary, WatchProviderRegion } from '@/types/tmdb';

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
const NO_IDS: number[] = [];

// A kiválasztott kategóriák találatai: film és/vagy sorozat `discover` (a szűrő szerint), népszerűség
// szerint egyesítve. Csak azokra a típusokra kérdez, ahol mindegyik kategóriának van szűrője. Ha az
// egyik elbukik, a másik eredménye megmarad; ha mind, a hiba tovább megy.
async function fetchCategory(
  selection: CategorySelection,
  filter: SearchFilter,
  filters: ResultFilters,
  myProviderIds: readonly number[],
): Promise<SearchResult[]> {
  const types: MediaType[] = filter === 'films' ? ['movie'] : filter === 'series' ? ['tv'] : ['movie', 'tv'];
  const requests = types.flatMap((type) => {
    const params = selectionParams(selection, type);
    if (!params) return [];
    const withFilters = { ...params, ...discoverFilterParams(filters, type, myProviderIds) };
    return [discover(type, withFilters).then((page) => ({ type, hits: page.results }))];
  });
  const settled = await Promise.allSettled(requests);
  if (requests.length > 0 && settled.every((item) => item.status === 'rejected')) {
    throw new Error('A kategória lekérdezése nem sikerült.');
  }
  const tagged: { type: MediaType; hit: TitleSummary }[] = settled.flatMap((item) =>
    item.status === 'fulfilled' ? item.value.hits.map((hit) => ({ type: item.value.type, hit })) : [],
  );
  return tagged
    .sort((a, b) => b.hit.popularity - a.hit.popularity)
    .flatMap(({ type, hit }) => toSearchResults([hit], type === 'movie' ? 'films' : 'series'));
}

// A szöveges keresés két oldala (40 találat): a szűrők (elérhetőség, értékelés, dátum) a találatok
// egy részét elrejtik, a második oldal pótolja. Az első oldal hibája hiba; a másodiké nem.
async function fetchTerm(
  endpoint: 'multi' | 'movie' | 'tv' | 'person',
  term: string,
  filter: SearchFilter,
): Promise<SearchResult[]> {
  const [first, second] = await Promise.allSettled([
    search(endpoint, term, 1),
    filter === 'people' ? Promise.reject(new Error('nincs második oldal')) : search(endpoint, term, 2),
  ]);
  if (first.status === 'rejected') throw first.reason;
  const hits = [...first.value.results, ...(second.status === 'fulfilled' ? second.value.results : [])];
  const unique = new Map(toSearchResults(hits, filter).map((result) => [result.key, result]));
  return [...unique.values()];
}

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
// A kiválasztott kategóriák (D-048, D-056) a szöveges keresést helyettesítik: `discover` találatok.
// A `selection` és a `filters` azonosságát a hívó memoizálja. A találati lista szűrői (D-057):
// kategória-keresésnél a TMDB `discover` szűr; szöveges keresésnél az értékelést és a dátumot a
// találatok adata, az elérhetőséget a címenként érkező magyar „hol nézhető” adat adja (a sor addig
// rejtett, amíg ez meg nem érkezik; ha nem sikerül, a sor látszik).
export function useSearch(
  query: string,
  filter: SearchFilter,
  selection: CategorySelection,
  filters: ResultFilters,
) {
  const selectedProviderIds = useProvidersStore((state) => state.selectedProviderIds);
  const typed = query.trim();
  const term = useDebounced(typed);
  // A találatok kulcsa: a kategóriák, vagy a keresett szöveg; ezzel dől el, hogy az érkezett lista a mostanihoz tartozik-e.
  const categories = !isEmptySelection(selection);
  const categoryKey = selectionKey(selection);
  // A kategória-keresés találatai a szűrőktől is függenek (a TMDB szűr), a szövegesé nem: ezért a
  // kérés csak ott kapja meg a szűrők értékét (különben szűrőváltásra a szöveges keresés is újraindulna).
  const requestAvailability = categories ? filters.availability : '';
  const requestRating = categories ? filters.minRating : 0;
  const requestSince = categories ? filters.sinceYears : 0;
  const requestProviderIds = categories ? selectedProviderIds : NO_IDS;
  const requestKey = categories
    ? `category:${categoryKey}|${filtersKey({ availability: requestAvailability, minRating: requestRating, sinceYears: requestSince })}`
    : typed;
  const active = categories || typed.length >= MIN_LENGTH;

  const [state, setState] = useState<SearchState>({ filter, term: '', results: [], error: false });
  const [attempt, setAttempt] = useState(0);
  const [info, setInfo] = useState<Record<string, TitleInfo | null>>({});
  const requested = useRef(new Set<string>());

  useEffect(() => {
    if (!categories && term.length < MIN_LENGTH) return;
    const endpoint = searchFilters.find((item) => item.key === filter)?.endpoint ?? 'multi';
    const key = categories ? requestKey : term;
    let cancelled = false;
    const request = categories
      ? fetchCategory(
          selection,
          filter,
          { availability: requestAvailability, minRating: requestRating, sinceYears: requestSince },
          requestProviderIds,
        )
      : fetchTerm(endpoint, term, filter);
    request
      .then((results) => {
        if (!cancelled) setState({ filter, term: key, results, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ filter, term: key, results: [], error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [
    term,
    filter,
    selection,
    categories,
    requestKey,
    requestAvailability,
    requestRating,
    requestSince,
    requestProviderIds,
    attempt,
  ]);

  // A szűrőváltás előtti találatok nem látszanak; a gépelés közbeniek igen, az új találatokig.
  const results = state.filter === filter ? state.results : NO_RESULTS;
  const settled = state.filter === filter && state.term === requestKey;

  // Szöveges keresésnél az értékelés és a dátum szűrője a találatok adatából jön; a részleteket
  // (műfaj, „hol nézhető”) csak a megmaradt címekre kérjük. Kategória-keresésnél a TMDB már szűrt.
  const candidates = useMemo(
    () => (categories ? results : results.filter((result) => matchesResultFilters(result, filters))),
    [results, categories, filters],
  );

  useEffect(() => {
    candidates.forEach(({ key, id, type }) => {
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
  }, [candidates]);

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

  // Elérhetőség szerinti szűrés csak szöveges keresésnél: addig, amíg egy cím magyar „hol nézhető”
  // adata nem érkezett meg, a sora rejtett (`pending`), hogy ne tűnjön el utólag.
  const needsRegion = !categories && filters.availability !== 'all';
  // A `hidden` az elérhetőség miatt rejtett címek száma: a képernyő jelzi, és egy koppintással mutatja.
  const { rows, pending, hidden } = useMemo(() => {
    const list: SearchRow[] = [];
    let waiting = false;
    let skipped = 0;
    for (const result of candidates) {
      const found = info[result.key];
      if (result.type === 'person') {
        list.push({ result, details: 'ready', onMyServices: false, chips: [] });
      } else if (found === undefined) {
        if (needsRegion) waiting = true;
        else list.push({ result, details: 'loading', onMyServices: false, chips: [] });
      } else if (found === null) {
        list.push({ result, details: 'failed', onMyServices: false, chips: [] });
      } else if (!needsRegion || matchesAvailability(found.region, filters, selectedProviderIds)) {
        const offers = pickRegionOffers(found.region, selectedProviderIds);
        list.push({
          result,
          details: 'ready',
          genre: found.genre,
          onMyServices: isOnMyServices(offers),
          chips: pickSearchChips(offers),
        });
      } else {
        skipped += 1;
      }
    }
    return { rows: list, pending: waiting, hidden: skipped };
  }, [candidates, info, needsRegion, filters, selectedProviderIds]);

  return {
    /** Van elég hosszú keresett szöveg; egyébként a képernyő a legutóbbiakat / súgót mutatja. */
    active,
    /** A késleltetett keresett szöveg (a „Találatok” fejléchez). */
    term,
    rows,
    /** Szöveges keresésnél az Elérhetőség szűrő miatt rejtett címek száma. */
    hidden,
    /** Az első találatokra (vagy a szűréshez kellő adatra) vár: nincs mit mutatni. */
    loading: active && ((!settled && results.length === 0) || (settled && rows.length === 0 && pending)),
    error: active && settled && state.error,
    empty: active && settled && !state.error && rows.length === 0 && !pending,
    retry,
  };
}
