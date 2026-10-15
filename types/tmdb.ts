// TMDB válasz- és app-típusok. Csak azt típusosítjuk, amit használunk.

export type MediaType = 'movie' | 'tv';

export type Paged<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
  /** Régiónként (országkód) a TMDB saját sorrendje, kisebb = előrébb. */
  display_priorities?: Record<string, number>;
};

export type ProviderList = { results: Provider[] };

// Film és sorozat közös lista-elem (discover, search, trending).
// Filmnél title/release_date, sorozatnál name/first_air_date.
export type TitleSummary = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: MediaType | 'person';
};

export type WatchProviderRegion = {
  link?: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
};

export type ReleaseDate = {
  type: number;
  release_date: string;
  certification: string;
  note: string;
};

export type TitleDetails = TitleSummary & {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  original_language: string;
  production_countries?: { iso_3166_1: string; name: string }[];
  'watch/providers': { results: Record<string, WatchProviderRegion> };
  release_dates?: {
    results: { iso_3166_1: string; release_dates: ReleaseDate[] }[];
  };
  videos: { results: { key: string; site: string; type: string; iso_639_1: string }[] };
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
};
