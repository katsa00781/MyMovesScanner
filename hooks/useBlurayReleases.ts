import { useCallback, useEffect, useState } from 'react';

import { discover, getDetails } from '@/lib/api';
import type { BlurayTitle } from '@/types/app';
import type { ReleaseDate, TitleDetails } from '@/types/tmdb';

const CANDIDATE_LIMIT = 12;
const WINDOW_DAYS = 60;
const PHYSICAL = 5;

type BlurayRegion = 'HU' | 'DE';

function isoDay(offsetDays: number): string {
  const day = new Date();
  day.setDate(day.getDate() + offsetDays);
  return day.toISOString().slice(0, 10);
}

// A TMDB release `note` mezőjéből (D-014): „4K Ultra HD Steelbook / Blu-ray / DVD” → „4K UHD”.
function formatFromNote(note: string): string {
  const text = note.toLowerCase();
  if (text.includes('4k') || text.includes('uhd')) return '4K UHD';
  if (text.includes('steelbook')) return 'Steelbook';
  return 'Blu-ray';
}

// Van magyar megjelenési bejegyzése (bármilyen típus, pl. mozi)? A DE ágon csak az ilyen címek
// kellenek: ami nálunk nem jelent meg, azt nem mutatjuk (D-037).
function hasHungarianRelease(details: TitleDetails): boolean {
  return (details.release_dates?.results ?? []).some((entry) => entry.iso_3166_1 === 'HU');
}

function physicalRelease(details: TitleDetails, region: BlurayRegion, from: string, to: string) {
  const releases: ReleaseDate[] =
    details.release_dates?.results.find((entry) => entry.iso_3166_1 === region)?.release_dates ??
    [];
  const physical = releases.filter((release) => release.type === PHYSICAL);
  const inWindow = physical.find((release) => {
    const day = release.release_date.slice(0, 10);
    return day >= from && day <= to;
  });
  return inWindow ?? physical[0];
}

// A dátum szerinti sorrend a designt követi: a mostani és közelgő megjelenések növekvő
// sorrendben elöl (az utolsó hét óta), a régebbiek utánuk, csökkenőben.
function byRelevance(titles: BlurayTitle[]): BlurayTitle[] {
  const cutoff = isoDay(-7);
  const recent = titles
    .filter((title) => title.releaseDate >= cutoff)
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  const older = titles
    .filter((title) => title.releaseDate < cutoff)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  return [...recent, ...older];
}

async function fetchRegion(region: BlurayRegion): Promise<BlurayTitle[]> {
  const from = isoDay(-WINDOW_DAYS);
  const to = isoDay(WINDOW_DAYS);
  const page = await discover('movie', {
    with_release_type: PHYSICAL,
    region,
    'release_date.gte': from,
    'release_date.lte': to,
  });
  const candidates = page.results.filter((item) => item.poster_path).slice(0, CANDIDATE_LIMIT);

  // A fizikai megjelenés dátuma és formátuma csak az adatlapban van (7 napra cache-elt).
  const settled = await Promise.allSettled(candidates.map((item) => getDetails('movie', item.id)));
  const titles: BlurayTitle[] = [];
  settled.forEach((result, index) => {
    if (result.status !== 'fulfilled') return;
    const release = physicalRelease(result.value, region, from, to);
    const item = candidates[index];
    if (!release || !item.title) return;
    if (region === 'DE' && !hasHungarianRelease(result.value)) return;
    titles.push({
      key: `movie:${item.id}`,
      id: item.id,
      title: item.title,
      posterPath: item.poster_path,
      releaseDate: release.release_date.slice(0, 10),
      format: formatFromNote(release.note),
    });
  });
  return byRelevance(titles);
}

type State = { titles: BlurayTitle[]; region: BlurayRegion; loading: boolean; error: boolean };

// Új Blu-ray megjelenések: HU, ha nincs adat, DE (D-006); a `region` jelzi, melyik jött.
export function useBlurayReleases() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({
    titles: [],
    region: 'HU',
    loading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let region: BlurayRegion = 'HU';
      let titles = await fetchRegion(region);
      if (titles.length === 0) {
        region = 'DE';
        titles = await fetchRegion(region);
      }
      return { titles, region };
    })()
      .then(({ titles, region }) => {
        if (!cancelled) setState({ titles, region, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ titles: [], region: 'HU', loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: false }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
