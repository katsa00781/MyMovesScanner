import { useEffect, useMemo, useState } from 'react';

import { getDetails } from '@/lib/api';
import { formatRuntime } from '@/lib/format';
import { pickCertification, pickTrailerKey, runtimeMinutes } from '@/lib/titleInfo';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import type { HeroItem, NewTitle } from '@/types/app';
import type { TitleDetails } from '@/types/tmdb';

const HERO_COUNT = 5;

// A hero az új címek első néhány, hátteres darabja. A meta (műfaj, hossz), a korhatár és az
// előzetes az adatlapból jön; ha az egyik lekérés elbukik, a lap azok nélkül is megjelenik.
export function useHeroItems(titles: NewTitle[]): HeroItem[] {
  const heroTitles = useMemo(
    () => titles.filter((title) => title.backdropPath).slice(0, HERO_COUNT),
    [titles],
  );
  const [details, setDetails] = useState<Record<string, TitleDetails>>({});
  const watchlist = useWatchlistStore((state) => state.items);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled(heroTitles.map((title) => getDetails(title.type, title.id))).then(
      (results) => {
        if (cancelled) return;
        const next: Record<string, TitleDetails> = {};
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') next[heroTitles[index].key] = result.value;
        });
        setDetails(next);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [heroTitles]);

  return heroTitles.map((title) => {
    const detail = details[title.key];
    const minutes = detail ? runtimeMinutes(detail) : undefined;
    const meta = [
      detail?.genres[0]?.name,
      title.releaseDate.slice(0, 4),
      minutes ? formatRuntime(minutes) : undefined,
    ]
      .filter(Boolean)
      .join(' · ');
    return {
      title,
      meta,
      certification: detail ? pickCertification(detail) : undefined,
      trailerKey: detail ? pickTrailerKey(detail) : undefined,
      watchlisted: watchlist.some((item) => item.type === title.type && item.id === title.id),
    };
  });
}
