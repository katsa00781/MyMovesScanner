import type { KidsAgeLimit } from '@/data/kidsAgeLimits';
import { REGION } from '@/lib/api';

// Animáció, Családi (CLAUDE.md: film). A sorozat (10762) kimarad: a `discover/tv` nem szűr korhatárra (D-036).
export const KIDS_GENRES = [16, 10751];

// A gyerek ajánlók közös `discover/movie` paraméterei (Főoldal „Gyerekeknek”, Gyerek sarok):
// korhatár szerint (DE FSK, D-007), népszerűség szerint, csak Magyarországon valahogy nézhető címek.
export function kidsDiscoverParams(ageLimit: KidsAgeLimit): Record<string, string | number | boolean> {
  return {
    sort_by: 'popularity.desc',
    with_genres: KIDS_GENRES.join('|'),
    certification_country: 'DE',
    'certification.lte': ageLimit,
    watch_region: REGION,
    with_watch_monetization_types: 'flatrate|free|ads|rent|buy',
  };
}
