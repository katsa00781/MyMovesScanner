import type { MediaType, Provider } from '@/types/tmdb';

export type WatchlistItem = {
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: number;
};

/** Új cím a kiválasztott szolgáltatók egyikén (Főoldal hero + rail). */
export type NewTitle = {
  /** `${type}:${id}`, listakulcsnak. */
  key: string;
  id: number;
  type: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  /** ÉÉÉÉ-HH-NN, mindig megvan. */
  releaseDate: string;
  provider: Provider;
};

/** A hero egy lapja: a cím a részletekből kiegészítve (a részletek később is megérkezhetnek). */
export type HeroItem = {
  title: NewTitle;
  /** „Dráma · 2026 · 2 ó 08 p”; a részletek előtt csak az év. */
  meta: string;
  certification?: string;
  trailerKey?: string;
  watchlisted: boolean;
};
