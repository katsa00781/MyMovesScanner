// A Keresés találati listájának szűrői (D-057). Az `availability` értéke: 'hu' (Magyarországon
// nézhető), 'mine' (a kiválasztott szolgáltatóimon), 'all' (minden találat) vagy `provider:<id>`.
export type ResultFilters = {
  availability: string;
  /** Legalább ennyi TMDB értékelés; 0 = bármilyen. */
  minRating: number;
  /** Ennyi éven belül megjelent; 0 = bármikor. */
  sinceYears: number;
};

export const defaultResultFilters: ResultFilters = { availability: 'hu', minRating: 0, sinceYears: 0 };

/** Nincs szűrés (a Személyek szűrőnél). */
export const noResultFilters: ResultFilters = { availability: 'all', minRating: 0, sinceYears: 0 };

export const ratingOptions = [0, 6, 7, 8] as const;
export const sinceOptions = [0, 1, 3, 5, 10] as const;

export const providerAvailability = (providerId: number) => `provider:${providerId}`;
