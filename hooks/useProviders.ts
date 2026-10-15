import { useCallback, useEffect, useState } from 'react';

import { getProviders, REGION } from '@/lib/api';
import type { Provider } from '@/types/tmdb';

// Film és sorozat szolgáltatólistája egyesítve, a TMDB régiós sorrendjében.
function mergeProviders(...lists: Provider[][]): Provider[] {
  const byId = new Map<number, Provider>();
  for (const provider of lists.flat()) {
    if (provider.logo_path && !byId.has(provider.provider_id)) {
      byId.set(provider.provider_id, provider);
    }
  }
  const priority = (p: Provider) => p.display_priorities?.[REGION] ?? p.display_priority;
  return [...byId.values()].sort(
    (a, b) => priority(a) - priority(b) || a.provider_name.localeCompare(b.provider_name),
  );
}

type State = { providers: Provider[]; loading: boolean; error: boolean };

export function useProviders() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ providers: [], loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProviders('movie'), getProviders('tv')])
      .then(([movie, tv]) => {
        if (cancelled) return;
        setState({ providers: mergeProviders(movie.results, tv.results), loading: false, error: false });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ providers: [], loading: false, error: true });
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
