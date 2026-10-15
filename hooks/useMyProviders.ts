import { useMemo } from 'react';

import { useProviders } from '@/hooks/useProviders';
import { useProvidersStore } from '@/store/useProvidersStore';
import type { Provider } from '@/types/tmdb';

// A kiválasztott szolgáltatók a TMDB adataival (név, logó), a `useProviders` sorrendjében.
export function useMyProviders() {
  const selectedIds = useProvidersStore((state) => state.selectedProviderIds);
  const { providers, loading, error, retry } = useProviders();

  const mine = useMemo<Provider[]>(
    () => providers.filter((provider) => selectedIds.includes(provider.provider_id)),
    [providers, selectedIds],
  );

  return { providers: mine, loading, error, retry };
}
