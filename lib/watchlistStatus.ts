import { strings } from '@/constants/strings';
import { REGION } from '@/lib/api';
import { formatMonth, formatShortDate } from '@/lib/format';
import { pickDisc } from '@/lib/titleInfo';
import type { WatchlistAvailability, WatchlistStatus } from '@/types/app';
import type { TitleDetails } from '@/types/tmdb';

/** TMDB release típusok: mozi (korlátozott), mozi. */
const THEATRICAL = [2, 3];
/** Ennyi napig számít a mozis cím „Moziban”-nak a megjelenés után. */
const CINEMA_DAYS = 60;

export type WatchlistSegment = 'all' | 'available' | 'soon';

/** A részletekből azt gyűjti ki, amiből a státusz számolható (a nagy válasz nem marad a memóriában). */
export function pickAvailability(details: TitleDetails): WatchlistAvailability {
  const region = details['watch/providers']?.results[REGION];
  const cinemaDate = (
    details.release_dates?.results.find((entry) => entry.iso_3166_1 === REGION)?.release_dates ?? []
  )
    .filter((release) => THEATRICAL.includes(release.type))
    .map((release) => release.release_date.slice(0, 10))
    .sort()[0];
  return {
    flatrateIds: (region?.flatrate ?? []).map((provider) => provider.provider_id),
    hasRent: (region?.rent ?? []).length > 0,
    hasBuy: (region?.buy ?? []).length > 0,
    disc: pickDisc(details),
    cinemaDate,
    releaseDate: details.release_date || details.first_air_date || undefined,
  };
}

function daysBefore(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00`);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

/**
 * A kártya státusza (D-040), a fontosság sorrendjében: Elérhető most (a kiválasztott
 * szolgáltatóim egyikén előfizetéssel; ha nincs kiválasztva, bármelyiken) → közelgő Blu-ray →
 * csak kölcsönzés / vásárlás → Moziban → Streaming <év> (még meg nem jelent cím). Ha egyik sem,
 * nincs státusz.
 */
export function pickStatus(
  availability: WatchlistAvailability,
  selectedProviderIds: number[],
  today: string,
): WatchlistStatus | undefined {
  const { flatrateIds, hasRent, hasBuy, disc, cinemaDate, releaseDate } = availability;
  const available =
    selectedProviderIds.length > 0
      ? flatrateIds.some((id) => selectedProviderIds.includes(id))
      : flatrateIds.length > 0;
  if (available) return { label: strings.watchlist.availableNow, available: true };

  if (disc && disc.date >= today) {
    return {
      label: `${strings.watchlist.bluray} · ${formatShortDate(disc.date)}`,
      available: false,
    };
  }
  if (hasRent) return { label: strings.watchlist.rentOnly, available: false };
  if (hasBuy) return { label: strings.watchlist.buyOnly, available: false };
  if (cinemaDate && cinemaDate >= daysBefore(today, CINEMA_DAYS)) {
    return { label: `${strings.watchlist.cinema} · ${formatMonth(cinemaDate)}`, available: false };
  }
  if (releaseDate && releaseDate > today) {
    return { label: strings.watchlist.streaming(releaseDate.slice(0, 4)), available: false };
  }
  return undefined;
}

/** „Elérhető most”: az elérhetők; „Hamarosan”: minden más, ami kapott státuszt (a design szerint a kölcsönzés is). */
export function matchesSegment(status: WatchlistStatus | undefined, segment: WatchlistSegment) {
  if (segment === 'all') return true;
  if (segment === 'available') return status?.available === true;
  return status !== undefined && !status.available;
}
