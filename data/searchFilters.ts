// Keresés szűrők; az első az alapértelmezett. A `endpoint` a TMDB search végpontja: a Filmek /
// Sorozatok / Személyek külön végpontot kér, hogy a szűrt lista is teljes oldalnyi találat legyen.
export type SearchFilter = 'all' | 'films' | 'series' | 'people';

export const searchFilters: readonly { key: SearchFilter; endpoint: 'multi' | 'movie' | 'tv' | 'person' }[] = [
  { key: 'all', endpoint: 'multi' },
  { key: 'films', endpoint: 'movie' },
  { key: 'series', endpoint: 'tv' },
  { key: 'people', endpoint: 'person' },
];
