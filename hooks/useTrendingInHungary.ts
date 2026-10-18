import { useCallback, useEffect, useState } from 'react';

import { discover, REGION } from '@/lib/api';
import type { TrendingTitle } from '@/types/app';
import type { MediaType } from '@/types/tmdb';

const TITLE_LIMIT = 9;

// A TMDB trending csak globális, ezért (D-015) népszerűség szerinti discover, filmre és sorozatra
// külön (D-058). A `watch_region` csak monetizációs típussal együtt szűr: így csak az olyan címek
// jönnek, amelyek Magyarországon valamilyen módon nézhetők.
async function fetchTrending(type: MediaType): Promise<TrendingTitle[]> {
  const { results } = await discover(type, {
    sort_by: 'popularity.desc',
    watch_region: REGION,
    with_watch_monetization_types: 'flatrate|free|ads|rent|buy',
    ...(type === 'movie' ? { region: REGION } : {}),
  });
  return results
    .flatMap((item) => {
      const title = item.title ?? item.name;
      if (!title || !item.poster_path) return [];
      return [{ key: `${type}:${item.id}`, id: item.id, type, title, posterPath: item.poster_path }];
    })
    .slice(0, TITLE_LIMIT);
}

type State = { titles: TrendingTitle[]; loading: boolean; error: boolean };

// „Népszerű filmek / sorozatok Magyarországon” a Főoldalra.
export function useTrendingInHungary(type: MediaType) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ titles: [], loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    fetchTrending(type)
      .then((titles) => {
        if (!cancelled) setState({ titles, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ titles: [], loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [type, attempt]);

  const retry = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: false }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
