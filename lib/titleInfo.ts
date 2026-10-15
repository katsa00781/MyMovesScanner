import { strings } from '@/constants/strings';
import { providerSearchLinks } from '@/data/providerSearchLinks';
import { REGION } from '@/lib/api';
import { displayName } from '@/lib/format';
import type { CastMember, DiscRelease, TitleFacts, WatchOffer } from '@/types/app';
import type { MediaType, Provider, TitleDetails, WatchProviderRegion } from '@/types/tmdb';

/** TMDB release típus: fizikai (Blu-ray, DVD). */
export const PHYSICAL = 5;

const CAST_LIMIT = 11;

export function trailerUrl(key: string): string {
  return `https://www.youtube.com/watch?v=${key}`;
}

/** A TMDB oldala, megosztáshoz (a TMDB nem ad saját megosztási linket). */
export function tmdbUrl(type: MediaType, id: number): string {
  return `https://www.themoviedb.org/${type}/${id}`;
}

/** A kiválasztott szolgáltatóim közül az első, amelyiken a cím előfizetéssel nézhető (HU). */
// A szolgáltató keresőoldala a cím nevével; `undefined`, ha a szolgáltatóhoz nincs link (D-042).
export function providerSearchUrl(providerName: string, title: string): string | undefined {
  const link = providerSearchLinks[providerName.toLowerCase()];
  return link?.(encodeURIComponent(title));
}

export function pickMyProvider(
  details: TitleDetails,
  selectedProviderIds: number[],
): Provider | undefined {
  const flatrate = details['watch/providers']?.results[REGION]?.flatrate ?? [];
  return flatrate.find((provider) => selectedProviderIds.includes(provider.provider_id));
}

/** YouTube előzetes kulcsa: előzetes híján teaser; magyar nyelvű előnyben, utána bármely. */
export function pickTrailerKey(details: TitleDetails): string | undefined {
  const videos = details.videos.results.filter((video) => video.site === 'YouTube');
  const trailers = videos.filter((video) => video.type === 'Trailer');
  const pool = trailers.length > 0 ? trailers : videos.filter((video) => video.type === 'Teaser');
  return (pool.find((video) => video.iso_639_1 === 'hu') ?? pool[0])?.key;
}

/**
 * Korhatár számként: HU, ennek híján a német FSK (D-007); a gyerek ajánlók csak a DE-t kérik,
 * mert a szűrésük is azon alapul. Sorozatnál nincs `release_dates`.
 */
export function pickCertification(
  details: TitleDetails,
  countryCodes: string[] = ['HU', 'DE'],
): string | undefined {
  const countries = details.release_dates?.results ?? [];
  for (const code of countryCodes) {
    const certification = countries
      .find((country) => country.iso_3166_1 === code)
      ?.release_dates.map((release) => release.certification)
      .find((value) => /^\d+$/.test(value));
    if (certification) return certification;
  }
  return undefined;
}

export function runtimeMinutes(details: TitleDetails): number | undefined {
  return details.runtime || details.episode_run_time?.[0] || undefined;
}

/** A szolgáltatók módonként (előfizetés, kölcsönzés, vásárlás), a TMDB sorrendjében (HU). */
export function pickOffers(details: TitleDetails, selectedProviderIds: number[]): WatchOffer[] {
  return pickRegionOffers(details['watch/providers']?.results[REGION], selectedProviderIds);
}

/** A `pickOffers` a régió „hol nézhető” adatából (a Keresés csak ezt tárolja a részletekből). */
export function pickRegionOffers(
  region: WatchProviderRegion | undefined,
  selectedProviderIds: number[],
): WatchOffer[] {
  const groups = [
    ['stream', region?.flatrate],
    ['rent', region?.rent],
    ['buy', region?.buy],
  ] as const;
  return groups.flatMap(([kind, providers]) =>
    (providers ?? []).map((provider) => ({
      key: `${kind}:${provider.provider_id}`,
      kind,
      provider,
      mine: selectedProviderIds.includes(provider.provider_id),
    })),
  );
}

// A TMDB release `note` mezőjéből (D-014): „4K Ultra HD Steelbook / Blu-ray / DVD” → „4K UHD”.
export function formatFromNote(note: string): string {
  const text = note.toLowerCase();
  if (text.includes('4k') || text.includes('uhd')) return '4K UHD';
  if (text.includes('steelbook')) return 'Steelbook';
  return 'Blu-ray';
}

const FORMAT_ORDER = ['Blu-ray', '4K UHD', 'Steelbook'];

/** A legkorábbi fizikai megjelenés: HU, ennek híján DE (D-006); a formátumok a régió összes kiadásából. */
export function pickDisc(details: TitleDetails): DiscRelease | undefined {
  for (const region of ['HU', 'DE'] as const) {
    const releases = (
      details.release_dates?.results.find((entry) => entry.iso_3166_1 === region)?.release_dates ??
      []
    )
      .filter((release) => release.type === PHYSICAL)
      .sort((a, b) => a.release_date.localeCompare(b.release_date));
    if (releases.length > 0) {
      const found = releases.map((release) => formatFromNote(release.note));
      return {
        region,
        date: releases[0].release_date.slice(0, 10),
        formats: FORMAT_ORDER.filter((format) => found.includes(format)).join(' & '),
      };
    }
  }
  return undefined;
}

/** A rendező (ha van), utána a főszereplők a TMDB sorrendjében. */
export function pickCast(details: TitleDetails): CastMember[] {
  const director = details.credits.crew.find((person) => person.job === 'Director');
  const members: CastMember[] = details.credits.cast.slice(0, CAST_LIMIT).map((person) => ({
    key: `cast:${person.id}`,
    name: person.name,
    role: person.character,
    profilePath: person.profile_path,
  }));
  if (director) {
    members.unshift({
      key: `director:${director.id}`,
      name: director.name,
      role: strings.title.director,
      profilePath: director.profile_path,
    });
  }
  return members;
}

/** Az iPad „Névjegy” oszlop: rendező, nyelv, ország (a nyelv és az ország magyar neve, ha az Intl tudja). */
export function pickFacts(details: TitleDetails): TitleFacts {
  const directors = details.credits.crew
    .filter((person) => person.job === 'Director')
    .map((person) => person.name);
  const languages = (details.spoken_languages ?? []).map((language) =>
    displayName('language', language.iso_639_1, language.english_name),
  );
  const countries = (details.production_countries ?? []).map((country) =>
    displayName('region', country.iso_3166_1, country.name),
  );
  return {
    director: directors.slice(0, 2).join(', ') || undefined,
    language:
      languages.slice(0, 3).join(', ') ||
      displayName('language', details.original_language, details.original_language),
    country: countries.slice(0, 3).join(', ') || undefined,
  };
}
