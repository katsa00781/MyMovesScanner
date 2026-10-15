import { useCallback, useEffect, useRef, useState } from 'react';

import type { KidsAgeLimit } from '@/data/kidsAgeLimits';
import type { KidsTheme } from '@/data/kidsThemes';
import { discover } from '@/lib/api';
import { kidsDiscoverParams } from '@/lib/kidsDiscover';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { KidsTitle } from '@/types/app';
import type { Paged, TitleSummary } from '@/types/tmdb';

function fetchPage(ageLimit: KidsAgeLimit, theme: KidsTheme | undefined, page: number) {
  const params = { ...kidsDiscoverParams(ageLimit), page };
  return discover('movie', theme ? { ...params, with_keywords: theme.keywordId } : params);
}

// Poszter nélküli címek kimaradnak: a rács kártyái csak a posztert mutatják.
function toTitles(items: TitleSummary[]): KidsTitle[] {
  return items.flatMap((item) =>
    item.title && item.poster_path
      ? [{ key: `movie:${item.id}`, id: item.id, title: item.title, posterPath: item.poster_path }]
      : [],
  );
}

type State = {
  /** Melyik szűrőhöz tartozik az eredmény; ha eltér a mostanitól, a lista még töltődik. */
  key: string | null;
  titles: KidsTitle[];
  page: number;
  hasMore: boolean;
  loadingMore: boolean;
  error: boolean;
};

const initial: State = { key: null, titles: [], page: 0, hasMore: false, loadingMore: false, error: false };

const hasMore = (result: Paged<TitleSummary>) => result.page < result.total_pages;

// Gyerek sarok: a választott korhatár (DE FSK, D-007) és téma szerinti népszerű animációs /
// családi filmek, végtelen görgetéssel. A mentett korhatár visszatöltését megvárja, hogy az
// alapértékkel ne induljon felesleges lekérdezés.
export function useKidsTitles(ageLimit: KidsAgeLimit, theme: KidsTheme | undefined) {
  const hydrated = useSettingsStore((state) => state.hasHydrated);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>(initial);
  const busy = useRef(false);

  const key = `${ageLimit}|${theme?.key ?? ''}|${attempt}`;
  const ready = state.key === key;

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    busy.current = false;
    fetchPage(ageLimit, theme, 1)
      .then((result) => {
        if (cancelled) return;
        setState({ ...initial, key, titles: toTitles(result.results), page: 1, hasMore: hasMore(result) });
      })
      .catch(() => {
        if (!cancelled) setState({ ...initial, key, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, ageLimit, theme, key]);

  // Görgetés a lista aljára: a következő oldal. Egy kérés fut egyszerre; hiba esetén a lista
  // marad, és a következő görgetés újra próbálja.
  const loadMore = useCallback(() => {
    if (busy.current || !ready || state.error || !state.hasMore) return;
    busy.current = true;
    setState((s) => ({ ...s, loadingMore: true }));
    fetchPage(ageLimit, theme, state.page + 1)
      .then((result) => {
        setState((s) => {
          const known = new Set(s.titles.map((t) => t.key));
          const added = toTitles(result.results).filter((t) => !known.has(t.key));
          return {
            ...s,
            titles: [...s.titles, ...added],
            page: s.page + 1,
            hasMore: hasMore(result),
            loadingMore: false,
          };
        });
      })
      .catch(() => setState((s) => ({ ...s, loadingMore: false })))
      .finally(() => {
        busy.current = false;
      });
  }, [state, ready, ageLimit, theme]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    titles: ready ? state.titles : [],
    loading: !ready,
    loadingMore: ready && state.loadingMore,
    error: ready && state.error,
    loadMore,
    retry,
  };
}
