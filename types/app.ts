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

export type OfferKind = 'stream' | 'rent' | 'buy';

/** „Hol nézhető” sor: egy szolgáltató egy módon (előfizetés / kölcsönzés / vásárlás). */
export type WatchOffer = {
  key: string;
  kind: OfferKind;
  provider: Provider;
  /** A kiválasztott előfizetéseim egyike. */
  mine: boolean;
};

/** „Lemezen” kártya: a legkorábbi fizikai megjelenés (HU, ennek híján DE). */
export type DiscRelease = {
  /** „Blu-ray”, „4K UHD” vagy „Blu-ray & 4K UHD” (D-014). */
  formats: string;
  /** ÉÉÉÉ-HH-NN. */
  date: string;
  region: 'HU' | 'DE';
};

/** „Szereplők és stáb” kör: a rendező, utána a főszereplők. */
export type CastMember = {
  key: string;
  name: string;
  /** Szerep (színésznél) vagy „Rendező”; lehet üres. */
  role: string;
  profilePath: string | null;
};

/** Az iPad „Névjegy” oszlop adatai; amit a TMDB nem ad, hiányzik. */
export type TitleFacts = { director?: string; language?: string; country?: string };

/** Az Adatlap adatai a részletekből (hero, meta, értékelés, leírás, hol nézhető, lemez, stáb). */
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
  offers: WatchOffer[];
  /** A TMDB „hol nézhető” oldala (JustWatch adat), a sorok „Megnyitás” gombjának célja. */
  watchLink?: string;
  disc?: DiscRelease;
  cast: CastMember[];
  facts: TitleFacts;
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

/** Gyerek sarok rács eleme: film vagy animációs sorozat (D-044). */
export type KidsTitle = {
  /** `${type}:${id}`, listakulcsnak. */
  key: string;
  id: number;
  type: MediaType;
  title: string;
  posterPath: string;
};

/** Keresési találat: film, sorozat vagy személy (`type: 'person'`). */
export type SearchResult = {
  /** `${type}:${id}`, listakulcsnak. */
  key: string;
  id: number;
  type: MediaType | 'person';
  /** A cím vagy a személy neve. */
  title: string;
  /** Poszter (cím) vagy profilkép (személy). */
  imagePath: string | null;
  /** Megjelenés éve; személynél nincs. */
  year?: string;
  /** Megjelenés napja (ÉÉÉÉ-HH-NN) és TMDB értékelés (0–10) a szűréshez; személynél nincs. */
  date?: string;
  rating?: number;
  /** Személynél a szakma magyarul („Színész”); címnél nincs. */
  role?: string;
};

/**
 * A találati sor: a találat és a részletekből később érkező adatok. A műfaj és a „hol nézhető”
 * chipek csak `details === 'ready'` után vannak; `failed` esetén a sor ezek nélkül marad.
 */
export type SearchRow = {
  result: SearchResult;
  details: 'loading' | 'ready' | 'failed';
  genre?: string;
  /** „A szolgáltatóidon”: a cím előfizetéssel nézhető valamelyik kiválasztott szolgáltatón. */
  onMyServices: boolean;
  /** Módonként legfeljebb egy szolgáltató (előfizetés, kölcsönzés, vásárlás). */
  chips: WatchOffer[];
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

/** Watchlist kártya státusza (07, 15 design): a felirat, és hogy „Elérhető most” (narancs, pipás). */
export type WatchlistStatus = { label: string; available: boolean };

/** Amit a Watchlist egy címről tud a részletekből; a státusz ebből számolódik (a szolgáltatóim szerint). */
export type WatchlistAvailability = {
  /** A HU előfizetéses (flatrate) szolgáltatók ID-i. */
  flatrateIds: number[];
  hasRent: boolean;
  hasBuy: boolean;
  /** A legkorábbi fizikai megjelenés (HU, ennek híján DE). */
  disc?: DiscRelease;
  /** A legkorábbi magyar mozis megjelenés, ÉÉÉÉ-HH-NN. */
  cinemaDate?: string;
  /** Film: `release_date`, sorozat: `first_air_date`; ÉÉÉÉ-HH-NN. */
  releaseDate?: string;
};

/** Böngészés rács eleme: egy cím a kiválasztott szolgáltatók egyikén (a badge a szolgáltató logója). */
export type BrowseTitle = {
  /** `${type}:${id}`, listakulcsnak. */
  key: string;
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  provider: Provider;
};
