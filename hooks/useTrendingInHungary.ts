import { useCallback, useEffect, useState } from 'react';

import { discover, REGION } from '@/lib/api';
import type { TrendingTitle } from '@/types/app';
import type { MediaType, TitleSummary } from '@/types/tmdb';

const TITLE_LIMIT = 9;

type Ranked = { title: TrendingTitle; popularity: number };

function toRanked(item: TitleSummary, type: MediaType): Ranked[] {
  const title = item.title ?? item.name;
  if (!title || !item.poster_path) return [];
  return [
    {
      title: { key: `${type}:${item.id}`, id: item.id, type, title, posterPath: item.poster_path },
      popularity: item.popularity,
    },
  ];
}

// A TMDB trending csak globális, ezért (D-015) népszerűség szerinti discover, film és sorozat
// egyesítve. A `watch_region` csak monetizációs típussal együtt szűr: így csak az olyan címek
// jönnek, amelyek Magyarországon valamilyen módon nézhetők.
async function fetchTrending(): Promise<TrendingTitle[]> {
  const params = {
    sort_by: 'popularity.desc',
    watch_region: REGION,
    with_watch_monetization_types: 'flatrate|free|ads|rent|buy',
  };
  const [movies, series] = await Promise.allSettled([
    discover('movie', { ...params, region: REGION }),
    discover('tv', params),
  ]);
  if (movies.status === 'rejected' && series.status === 'rejected') {
    throw new Error('A népszerű címek lekérdezése nem sikerült.');
  }

  const ranked = [
    ...(movies.status === 'fulfilled' ? movies.value.results.flatMap((i) => toRanked(i, 'movie')) : []),
    ...(series.status === 'fulfilled' ? series.value.results.flatMap((i) => toRanked(i, 'tv')) : []),
  ];
  return ranked
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, TITLE_LIMIT)
    .map((entry) => entry.title);
}

type State = { titles: TrendingTitle[]; loading: boolean; error: boolean };

// „Népszerű Magyarországon” a Főoldalra.
export function useTrendingInHungary() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ titles: [], loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    fetchTrending()
      .then((titles) => {
        if (!cancelled) setState({ titles, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ titles: [], loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: false }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
