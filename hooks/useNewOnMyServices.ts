import { useCallback, useEffect, useState } from 'react';

import { discover, REGION } from '@/lib/api';
import { useMyProviders } from '@/hooks/useMyProviders';
import type { NewTitle } from '@/types/app';
import type { MediaType, Provider, TitleSummary } from '@/types/tmdb';

const TITLE_LIMIT = 20;

function toNewTitle(item: TitleSummary, type: MediaType, provider: Provider): NewTitle[] {
  const title = item.title ?? item.name;
  const releaseDate = item.release_date || item.first_air_date;
  if (!title || !releaseDate || !item.poster_path) return [];
  return [
    {
      key: `${type}:${item.id}`,
      id: item.id,
      type,
      title,
      overview: item.overview,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      releaseDate,
      provider,
    },
  ];
}

// Szolgáltatónként és típusonként egy discover (előfizetéses, HU, dátum szerint csökkenő, a
// jövőbeli megjelenések nélkül), így minden találat tudja a szolgáltatóját; a `discover` ezt
// egyébként nem adja vissza. Az eredmény egyesítve, dátum szerint rendezve, ismétlődés nélkül.
async function fetchNewTitles(providers: Provider[]): Promise<NewTitle[]> {
  const today = new Date().toISOString().slice(0, 10);
  const requests = providers.flatMap((provider) =>
    (['movie', 'tv'] as const).map(async (type) => {
      const dateKey = type === 'movie' ? 'primary_release_date' : 'first_air_date';
      const page = await discover(type, {
        watch_region: REGION,
        with_watch_providers: provider.provider_id,
        with_watch_monetization_types: 'flatrate',
        sort_by: `${dateKey}.desc`,
        [`${dateKey}.lte`]: today,
      });
      return page.results.flatMap((item) => toNewTitle(item, type, provider));
    }),
  );

  const settled = await Promise.allSettled(requests);
  const lists = settled.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
  if (lists.length === 0) throw new Error('Az új címek lekérdezése nem sikerült.');

  const sorted = lists.flat().sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  const unique = new Map<string, NewTitle>();
  for (const title of sorted) {
    if (!unique.has(title.key)) unique.set(title.key, title);
  }
  return [...unique.values()].slice(0, TITLE_LIMIT);
}

type State = { titles: NewTitle[]; loading: boolean; error: boolean };

// „Új a szolgáltatóimon” a Főoldal herojához és railjéhez.
export function useNewOnMyServices() {
  const { providers, loading: providersLoading, error: providersError, retry: retryProviders } =
    useMyProviders();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ titles: [], loading: true, error: false });

  useEffect(() => {
    if (providers.length === 0) return;
    let cancelled = false;
    fetchNewTitles(providers)
      .then((titles) => {
        if (!cancelled) setState({ titles, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ titles: [], loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [providers, attempt]);

  const retry = useCallback(() => {
    if (providersError) {
      retryProviders();
      return;
    }
    setState((current) => ({ ...current, loading: true, error: false }));
    setAttempt((n) => n + 1);
  }, [providersError, retryProviders]);

  // `hasServices`: van kiválasztott szolgáltató (nélküle nincs mit lekérdezni, üres állapot).
  const hasServices = providers.length > 0;
  if (providersLoading) return { titles: [], loading: true, error: false, hasServices, retry };
  if (providersError) return { titles: [], loading: false, error: true, hasServices, retry };
  if (!hasServices) return { titles: [], loading: false, error: false, hasServices, retry };
  return { ...state, hasServices, retry };
}
