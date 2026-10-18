import { defaultResultFilters, type ResultFilters } from '@/data/resultFilters';
import { REGION } from '@/lib/api';
import type { SearchResult } from '@/types/app';
import type { MediaType, WatchProviderRegion } from '@/types/tmdb';

/**
 * A választott elérhetőség érvényes-e a mostani szolgáltatóimmal (a Beállításokban módosítható):
 * „A szolgáltatóimon” szolgáltató nélkül, vagy egy már nem kiválasztott szolgáltató az alapértékre
 * (Magyarországon nézhető) esik vissza.
 */
export function resolveFilters(filters: ResultFilters, myProviderIds: readonly number[]): ResultFilters {
  const { availability } = filters;
  const valid =
    availability === 'hu' ||
    availability === 'all' ||
    (availability === 'mine' && myProviderIds.length > 0) ||
    (availability.startsWith('provider:') &&
      myProviderIds.includes(Number(availability.slice('provider:'.length))));
  return valid ? filters : { ...filters, availability: defaultResultFilters.availability };
}

/** A szűrő napja ÉÉÉÉ-HH-NN: ennyi évvel ezelőtt. */
export function sinceDate(years: number): string {
  const day = new Date();
  day.setFullYear(day.getFullYear() - years);
  return day.toISOString().slice(0, 10);
}

/** Stabil azonosító a szűrőkhöz (a találatok kulcsához). */
export const filtersKey = (filters: ResultFilters) =>
  `${filters.availability}|${filters.minRating}|${filters.sinceYears}`;

/** A szűrők eltérnek az alapértéktől (a „Nincs találat” üzenethez). */
export const isNarrowed = (filters: ResultFilters) =>
  filters.availability !== 'hu' || filters.minRating > 0 || filters.sinceYears > 0;

/**
 * A kategória-keresés (`discover`) szűrő-paraméterei: a TMDB szűr, így a lista nem fogy el a
 * szűrés után. Elérhetőség: Magyarországon előfizetéssel, kölcsönözve vagy megvásárolva (mint a
 * sorok chipjei), vagy a kiválasztott szolgáltatókon előfizetéssel.
 */
export function discoverFilterParams(
  filters: ResultFilters,
  type: MediaType,
  myProviderIds: readonly number[],
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters.availability === 'hu') {
    params.watch_region = REGION;
    params.with_watch_monetization_types = 'flatrate|rent|buy';
  } else if (filters.availability === 'mine' || filters.availability.startsWith('provider:')) {
    params.watch_region = REGION;
    params.with_watch_monetization_types = 'flatrate';
    params.with_watch_providers =
      filters.availability === 'mine' ? myProviderIds.join('|') : filters.availability.slice('provider:'.length);
  }
  if (filters.minRating > 0) {
    params['vote_average.gte'] = filters.minRating;
    // Kevés szavazatú, ezért megbízhatatlan magas értékelések kiszűrésére.
    params['vote_count.gte'] = 100;
  }
  if (filters.sinceYears > 0) {
    params[type === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte'] = sinceDate(filters.sinceYears);
  }
  return params;
}

/** Értékelés és megjelenés szerinti szűrés a szöveges keresés találataira (a személy mindig átmegy). */
export function matchesResultFilters(result: SearchResult, filters: ResultFilters): boolean {
  if (result.type === 'person') return true;
  if (filters.minRating > 0 && (result.rating ?? 0) < filters.minRating) return false;
  if (filters.sinceYears > 0 && (!result.date || result.date < sinceDate(filters.sinceYears))) return false;
  return true;
}

/** Elérhetőség szerinti szűrés a címhez kapott magyar „hol nézhető” adatból. */
export function matchesAvailability(
  region: WatchProviderRegion | undefined,
  filters: ResultFilters,
  myProviderIds: readonly number[],
): boolean {
  const flatrate = (region?.flatrate ?? []).map((provider) => provider.provider_id);
  if (filters.availability === 'all') return true;
  if (filters.availability === 'mine') return flatrate.some((id) => myProviderIds.includes(id));
  if (filters.availability.startsWith('provider:')) {
    return flatrate.includes(Number(filters.availability.slice('provider:'.length)));
  }
  return flatrate.length > 0 || (region?.rent ?? []).length > 0 || (region?.buy ?? []).length > 0;
}
