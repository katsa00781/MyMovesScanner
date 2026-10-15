// Típusos hívások az mms-tmdb Edge Functionre.
// A whitelist tükre: supabase/functions/mms-tmdb/index.ts (ROUTES). Új végpont
// előbb ott, utána itt.
import { supabase } from '@/lib/supabase';
import type {
  MediaType,
  Paged,
  ProviderList,
  TitleDetails,
  TitleSummary,
} from '@/types/tmdb';

/** A v1 egyetlen régiója (TMDB `watch_region`). */
export const REGION = 'HU';

type Params = Record<string, string | number | boolean>;

async function tmdb<T>(path: string, params: Params = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('mms-tmdb', {
    body: { path, params },
  });
  if (error || data === null) {
    throw new Error(error?.message ?? 'Üres válasz az mms-tmdb függvénytől.');
  }
  return data;
}

export function getProviders(type: MediaType) {
  return tmdb<ProviderList>(`watch/providers/${type}`, { watch_region: REGION });
}

export function discover(type: MediaType, params: Params = {}) {
  return tmdb<Paged<TitleSummary>>(`discover/${type}`, params);
}

export function getTrending(type: MediaType, window: 'day' | 'week' = 'week') {
  return tmdb<Paged<TitleSummary>>(`trending/${type}/${window}`);
}

export function search(kind: 'multi' | MediaType | 'person', query: string, page = 1) {
  return tmdb<Paged<TitleSummary>>(`search/${kind}`, { query, page });
}

export function getDetails(type: MediaType, id: number) {
  return tmdb<TitleDetails>(`${type}/${id}`, {
    append_to_response: 'watch/providers,release_dates,videos,credits',
    // A `language=hu-HU` mellett a TMDB csak magyar nyelvű videót adna (jellemzően nincs).
    include_video_language: 'hu,en,null',
  });
}
