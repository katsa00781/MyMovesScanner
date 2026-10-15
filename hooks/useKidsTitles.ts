import { useCallback, useEffect, useRef, useState } from 'react';

import type { KidsAgeLimit } from '@/data/kidsAgeLimits';
import type { KidsTheme } from '@/data/kidsThemes';
import { discover } from '@/lib/api';
import { kidsDiscoverParams, kidsSeriesDiscoverParams } from '@/lib/kidsDiscover';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { KidsTitle } from '@/types/app';
import type { MediaType, Paged, TitleSummary } from '@/types/tmdb';

type Page = { titles: KidsTitle[]; hasMore: boolean };

// Poszter nélküli címek kimaradnak: a rács kártyái csak a posztert mutatják.
function toTitles(type: MediaType, items: TitleSummary[]) {
  return items.flatMap((item) => {
    const title = item.title ?? item.name;
    return title && item.poster_path
      ? [{ key: `${type}:${item.id}`, id: item.id, type, title, posterPath: item.poster_path, popularity: item.popularity }]
      : [];
  });
}

// Egy oldal: film (korhatár szerint) és animációs sorozat (korhatár nélkül) egy-egy `discover`-e,
// népszerűség szerint egyesítve. Ha az egyik lekérdezés elbukik, a másik eredménye megmarad.
async function fetchPage(ageLimit: KidsAgeLimit | null, theme: KidsTheme | undefined, page: number): Promise<Page> {
  const extra: Record<string, number> = theme ? { page, with_keywords: theme.keywordId } : { page };
  const [movies, series] = await Promise.allSettled([
    discover('movie', { ...kidsDiscoverParams(ageLimit), ...extra }),
    discover('tv', { ...kidsSeriesDiscoverParams(), ...extra }),
  ]);
  if (movies.status === 'rejected' && series.status === 'rejected') {
    throw new Error('A gyerek címek lekérdezése nem sikerült.');
  }
  const entries = [
    ...(movies.status === 'fulfilled' ? toTitles('movie', movies.value.results) : []),
    ...(series.status === 'fulfilled' ? toTitles('tv', series.value.results) : []),
  ].sort((a, b) => b.popularity - a.popularity);
  const more = (r: PromiseSettledResult<Paged<TitleSummary>>) =>
    r.status === 'fulfilled' && r.value.page < r.value.total_pages;
  return {
    titles: entries.map(({ popularity: _popularity, ...title }) => title),
    hasMore: more(movies) || more(series),
  };
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

// Gyerek sarok: a választott korhatár (DE FSK, D-007) és téma szerinti népszerű animációs /
// családi filmek és animációs sorozatok (D-044), végtelen görgetéssel. A mentett korhatár
// visszatöltését megvárja, hogy az alapértékkel ne induljon felesleges lekérdezés. `ageLimit` null:
// nincs korhatár-szűrés (a „Felnőtt tartalom elrejtése” ki van kapcsolva, D-049).
export function useKidsTitles(ageLimit: KidsAgeLimit | null, theme: KidsTheme | undefined) {
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
      .then(({ titles, hasMore }) => {
        if (cancelled) return;
        setState({ ...initial, key, titles, page: 1, hasMore });
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
      .then(({ titles, hasMore }) => {
        setState((s) => {
          const known = new Set(s.titles.map((t) => t.key));
          return {
            ...s,
            titles: [...s.titles, ...titles.filter((t) => !known.has(t.key))],
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
