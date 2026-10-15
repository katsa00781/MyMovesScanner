import { useCallback, useEffect, useMemo, useState } from 'react';

import { getDetails } from '@/lib/api';
import { formatRuntime } from '@/lib/format';
import { pickCertification, pickMyProvider, pickTrailerKey, runtimeMinutes } from '@/lib/titleInfo';
import { useProvidersStore } from '@/store/useProvidersStore';
import type { TitlePage } from '@/types/app';
import type { MediaType, TitleDetails } from '@/types/tmdb';

const META_GENRES = 2;

function toTitlePage(
  details: TitleDetails,
  type: MediaType,
  selectedProviderIds: number[],
): TitlePage {
  const minutes = runtimeMinutes(details);
  const meta = [
    (details.release_date || details.first_air_date)?.slice(0, 4),
    minutes ? formatRuntime(minutes) : undefined,
    details.genres
      .slice(0, META_GENRES)
      .map((genre) => genre.name)
      .join(', '),
  ]
    .filter(Boolean)
    .join(' · ');
  return {
    id: details.id,
    type,
    title: details.title ?? details.name ?? '',
    overview: details.overview,
    posterPath: details.poster_path,
    backdropPath: details.backdrop_path,
    meta,
    certification: pickCertification(details),
    rating: details.vote_average > 0 ? details.vote_average.toFixed(1) : undefined,
    trailerKey: pickTrailerKey(details),
    myProvider: pickMyProvider(details, selectedProviderIds),
  };
}

type State = { details?: TitleDetails; loading: boolean; error: boolean };

// Az Adatlap adata: egy `getDetails` hívás (az Edge Function 7 napra cache-eli).
export function useTitleDetails(type: MediaType, id: number) {
  const selectedProviderIds = useProvidersStore((state) => state.selectedProviderIds);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    getDetails(type, id)
      .then((details) => {
        if (!cancelled) setState({ details, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [type, id, attempt]);

  const retry = useCallback(() => {
    setState({ loading: true, error: false });
    setAttempt((n) => n + 1);
  }, []);

  const title = useMemo(
    () => (state.details ? toTitlePage(state.details, type, selectedProviderIds) : undefined),
    [state.details, type, selectedProviderIds],
  );
  return { title, loading: state.loading, error: state.error, retry };
}
