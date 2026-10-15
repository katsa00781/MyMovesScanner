import type { TitleDetails } from '@/types/tmdb';

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
