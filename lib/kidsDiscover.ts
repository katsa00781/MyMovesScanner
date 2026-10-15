import type { KidsAgeLimit } from '@/data/kidsAgeLimits';
import { REGION } from '@/lib/api';

// Animáció, Családi (CLAUDE.md: film).
export const KIDS_GENRES = [16, 10751];

// A gyerek ajánlók közös `discover/movie` paraméterei (Főoldal „Gyerekeknek”, Gyerek sarok):
// korhatár szerint (DE FSK, D-007), népszerűség szerint, csak Magyarországon valahogy nézhető címek.
// `ageLimit` null: a „Felnőtt tartalom elrejtése” ki van kapcsolva, nincs korhatár-szűrés (D-049).
export function kidsDiscoverParams(ageLimit: KidsAgeLimit | null): Record<string, string | number | boolean> {
  const params = {
    sort_by: 'popularity.desc',
    with_genres: KIDS_GENRES.join('|'),
    watch_region: REGION,
    with_watch_monetization_types: 'flatrate|free|ads|rent|buy',
  };
  if (ageLimit === null) return params;
  return { ...params, certification_country: 'DE', 'certification.lte': ageLimit };
}

// Gyerek sorozatok a Gyerek sarokhoz (D-044): a `discover/tv` nem szűr korhatárra, ezért csak az
// animáció műfaj szűr (felhasználói döntés), a korhatár-chip a sorozatokra nem hat.
export function kidsSeriesDiscoverParams(): Record<string, string | number | boolean> {
  return {
    sort_by: 'popularity.desc',
    with_genres: 16,
    watch_region: REGION,
    with_watch_monetization_types: 'flatrate|free|ads|rent|buy',
  };
}
