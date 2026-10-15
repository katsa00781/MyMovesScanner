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

/** Az Adatlap tetejének adatai a részletekből (hero, meta, értékelés, leírás). */
export type TitlePage = {
  id: number;
  type: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  /** „2026 · 2 ó 08 p · Dráma, Kaland” (az ismeretlen részek nélkül). */
  meta: string;
  certification?: string;
  /** TMDB értékelés egy tizedessel („7.9”); nincs, ha a címet még senki nem értékelte. */
  rating?: string;
  trailerKey?: string;
  /** A kiválasztott szolgáltatóim közül az első, amelyiken előfizetéssel nézhető. */
  myProvider?: Provider;
};

/** Népszerű cím (Főoldal „Népszerű Magyarországon” rail); film vagy sorozat. */
export type TrendingTitle = {
  key: string;
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
};

/** Gyerek ajánló (Főoldal „Gyerekeknek” rail); csak film (a sorozatra nincs korhatár-szűrő). */
export type KidsPick = {
  key: string;
  id: number;
  title: string;
  backdropPath: string | null;
  /** „0+ éveseknek · Animáció”; üres, ha a részletek nem érkeztek meg. */
  caption: string;
};

/** Új Blu-ray megjelenés (Főoldal rail); csak film. */
export type BlurayTitle = {
  key: string;
  id: number;
  title: string;
  posterPath: string | null;
  /** A fizikai megjelenés napja, ÉÉÉÉ-HH-NN. */
  releaseDate: string;
  /** „4K UHD”, „Steelbook” vagy „Blu-ray” (D-014). */
  format: string;
};
