import { useCallback, useEffect, useRef, useState } from 'react';

import type { BrowseGenre } from '@/data/browseGenres';
import type { BrowseSort } from '@/data/browseSorts';
import { discover, REGION } from '@/lib/api';
import type { BrowseTitle } from '@/types/app';
import type { MediaType, Provider, TitleSummary } from '@/types/tmdb';

// Ennyi kártya kerül egyszerre a rácsra (telefonon 12 sor, iPaden 6 sor: mindkét oszlopszámmal osztható).
const STEP = 36;

type Params = Record<string, string | number | boolean>;

const today = () => new Date().toISOString().slice(0, 10);
const dateOf = (item: TitleSummary) => item.release_date || item.first_air_date || '';

function discoverParams(
  type: MediaType,
  sort: BrowseSort,
  genreId: number | undefined,
  providerIds: string,
  page: number,
): Params {
  const dateKey = type === 'movie' ? 'primary_release_date' : 'first_air_date';
  const params: Params = {
    watch_region: REGION,
    with_watch_providers: providerIds,
    with_watch_monetization_types: 'flatrate',
    page,
  };
  if (genreId !== undefined) params.with_genres = genreId;
  if (sort === 'newest') {
    params.sort_by = `${dateKey}.desc`;
    params[`${dateKey}.lte`] = today(); // a jövőbeli megjelenések nélkül
  } else if (sort === 'popular') {
    params.sort_by = 'popularity.desc';
  } else {
    params.sort_by = 'vote_average.desc';
    params['vote_count.gte'] = 200; // néhány szavazatos címek ne kerüljenek előre
  }
  return params;
}

function compare(sort: BrowseSort) {
  return (a: TitleSummary, b: TitleSummary) => {
    if (sort === 'newest') return dateOf(b).localeCompare(dateOf(a));
    if (sort === 'popular') return b.popularity - a.popularity;
    return b.vote_average - a.vote_average;
  };
}

type PageResult = { titles: BrowseTitle[]; hasMore: boolean; total?: number };

// Egy „oldal”: szolgáltatónként és típusonként egy discover (így minden találat tudja a
// szolgáltatóját, amit a `discover` egyébként nem ad vissza), egyesítve, rendezve, ismétlődés
// nélkül. Az első oldalnál még egy-egy discover az összes szolgáltatóra (`|`) a pontos
// találatszámhoz. Ha az egyik lekérdezés elbukik, a többi eredménye megmarad.
async function fetchPage(
  providers: Provider[],
  genre: BrowseGenre,
  sort: BrowseSort,
  page: number,
): Promise<PageResult> {
  const types = (['movie', 'tv'] as const).filter((t) => genre.key === 'all' || genre[t] !== undefined);
  const allIds = providers.map((p) => p.provider_id).join('|');

  const streams = providers.flatMap((provider) =>
    types.map(async (type) => ({
      type,
      provider,
      result: await discover(type, discoverParams(type, sort, genre[type], String(provider.provider_id), page)),
    })),
  );
  const counts =
    page === 1 ? types.map((type) => discover(type, discoverParams(type, sort, genre[type], allIds, 1))) : [];

  const [streamResults, countResults] = await Promise.all([
    Promise.allSettled(streams),
    Promise.allSettled(counts),
  ]);
  const fulfilled = streamResults.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  if (fulfilled.length === 0) throw new Error('A címek lekérdezése nem sikerült.');

  const entries = fulfilled
    .flatMap(({ type, provider, result }) => result.results.map((item) => ({ item, type, provider })))
    .sort((a, b) => compare(sort)(a.item, b.item));

  const unique = new Map<string, BrowseTitle>();
  for (const { item, type, provider } of entries) {
    const key = `${type}:${item.id}`;
    const title = item.title ?? item.name;
    if (!title || !item.poster_path || unique.has(key)) continue;
    unique.set(key, { key, id: item.id, type, title, posterPath: item.poster_path, provider });
  }

  const totals = countResults.flatMap((r) => (r.status === 'fulfilled' ? [r.value.total_results] : []));
  return {
    titles: [...unique.values()],
    hasMore: fulfilled.some(({ result }) => result.page < result.total_pages),
    total: totals.length > 0 ? totals.reduce((sum, n) => sum + n, 0) : undefined,
  };
}

type State = {
  /** Melyik szűrőhöz tartozik az eredmény; ha eltér a mostanitól, a lista még töltődik. */
  key: string | null;
  /** Az eddig lekért címek; a rácson az első `visible` látszik. */
  pool: BrowseTitle[];
  visible: number;
  page: number;
  hasMore: boolean;
  total?: number;
  loadingMore: boolean;
  error: boolean;
};

const initial: State = {
  key: null,
  pool: [],
  visible: STEP,
  page: 0,
  hasMore: false,
  loadingMore: false,
  error: false,
};

const filterKey = (providers: Provider[], genre: BrowseGenre, sort: BrowseSort, attempt: number) =>
  `${providers.map((p) => p.provider_id).join(',')}|${genre.key}|${sort}|${attempt}`;

// Böngészés: a kiválasztott szolgáltatók címei műfaj és rendezés szerint, végtelen görgetéssel.
// A `providers` listát a hívó memoizálja (a lista azonossága indítja újra a lekérdezést).
export function useBrowseTitles(providers: Provider[], genre: BrowseGenre, sort: BrowseSort) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>(initial);
  const busy = useRef(false);

  const key = filterKey(providers, genre, sort, attempt);
  const ready = state.key === key;

  useEffect(() => {
    if (providers.length === 0) return;
    let cancelled = false;
    busy.current = false;
    const resultKey = filterKey(providers, genre, sort, attempt);
    fetchPage(providers, genre, sort, 1)
      .then(({ titles, hasMore, total }) => {
        if (cancelled) return;
        setState({ ...initial, key: resultKey, pool: titles, page: 1, hasMore, total });
      })
      .catch(() => {
        if (!cancelled) setState({ ...initial, key: resultKey, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [providers, genre, sort, attempt]);

  // Görgetés a lista aljára: előbb a már lekért címek közül jön újabb adag, ha elfogytak, a
  // következő oldal. Egy kérés fut egyszerre; hiba esetén a lista marad, és a következő
  // görgetés újra próbálja.
  const loadMore = useCallback(() => {
    if (busy.current || !ready || state.error) return;
    if (state.visible < state.pool.length) {
      setState((s) => ({ ...s, visible: s.visible + STEP }));
      return;
    }
    if (!state.hasMore) return;
    busy.current = true;
    setState((s) => ({ ...s, loadingMore: true }));
    fetchPage(providers, genre, sort, state.page + 1)
      .then(({ titles, hasMore }) => {
        setState((s) => {
          const known = new Set(s.pool.map((t) => t.key));
          return {
            ...s,
            pool: [...s.pool, ...titles.filter((t) => !known.has(t.key))],
            visible: s.visible + STEP,
            page: s.page + 1,
            hasMore,
            loadingMore: false,
          };
        });
      })
      .catch(() => setState((s) => ({ ...s, loadingMore: false })))
      .finally(() => {
        busy.current = false;
      });
  }, [state, ready, providers, genre, sort]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    titles: ready ? state.pool.slice(0, state.visible) : [],
    total: ready ? state.total : undefined,
    loading: providers.length > 0 && !ready,
    loadingMore: ready && state.loadingMore,
    error: ready && state.error,
    loadMore,
    retry,
  };
}
