import { useCallback, useEffect, useState } from 'react';

import { strings } from '@/constants/strings';
import type { KidsAgeLimit } from '@/data/kidsAgeLimits';
import { discover, getDetails } from '@/lib/api';
import { KIDS_GENRES, kidsDiscoverParams } from '@/lib/kidsDiscover';
import { pickCertification } from '@/lib/titleInfo';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { KidsPick } from '@/types/app';
import type { TitleDetails } from '@/types/tmdb';

const CANDIDATE_LIMIT = 8;

function genreName(details: TitleDetails): string | undefined {
  const kids = details.genres.find((genre) => KIDS_GENRES.includes(genre.id));
  return (kids ?? details.genres[0])?.name;
}

// Korhatár szerinti (DE FSK, D-007) népszerű animációs / családi filmek. A `discover` nem ad
// korhatárt és műfajnevet, ezért a jelöltekre `getDetails` fut (7 napra cache-elt).
async function fetchKidsPicks(ageLimit: KidsAgeLimit | null): Promise<KidsPick[]> {
  const page = await discover('movie', kidsDiscoverParams(ageLimit));
  const candidates = page.results
    .flatMap((item) =>
      item.title && item.backdrop_path
        ? [{ id: item.id, title: item.title, backdropPath: item.backdrop_path }]
        : [],
    )
    .slice(0, CANDIDATE_LIMIT);

  const settled = await Promise.allSettled(candidates.map((item) => getDetails('movie', item.id)));
  return candidates.map((item, index) => {
    const result = settled[index];
    const details = result.status === 'fulfilled' ? result.value : undefined;
    const certification = details ? pickCertification(details, ['DE']) : undefined;
    const caption = [
      certification === undefined ? undefined : strings.kids.ages(Number(certification)),
      details ? genreName(details) : undefined,
    ];
    return {
      key: `movie:${item.id}`,
      id: item.id,
      title: item.title,
      backdropPath: item.backdropPath,
      caption: caption.filter(Boolean).join(' · '),
    };
  });
}

type State = { titles: KidsPick[]; loading: boolean; error: boolean };

// „Gyerekeknek” a Főoldalra, a Beállítások / onboarding korhatára szerint (korhatár nélkül, ha a
// „Felnőtt tartalom elrejtése” ki van kapcsolva). A mentett beállítások visszatöltését megvárja,
// hogy az alapértékkel ne induljon felesleges lekérdezés.
export function useKidsPicks() {
  const savedAgeLimit = useSettingsStore((state) => state.kidsAgeLimit);
  const hideMature = useSettingsStore((state) => state.hideMature);
  const ageLimit = hideMature ? savedAgeLimit : null;
  const hydrated = useSettingsStore((state) => state.hasHydrated);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ titles: [], loading: true, error: false });

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    fetchKidsPicks(ageLimit)
      .then((titles) => {
        if (!cancelled) setState({ titles, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ titles: [], loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [ageLimit, hydrated, attempt]);

  const retry = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: false }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
