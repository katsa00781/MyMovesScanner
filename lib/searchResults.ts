import { strings } from '@/constants/strings';
import type { SearchFilter } from '@/data/searchFilters';
import type { OfferKind, SearchResult, WatchOffer } from '@/types/app';
import type { MediaType, SearchHit } from '@/types/tmdb';

const KINDS: readonly OfferKind[] = ['stream', 'rent', 'buy'];

/** A TMDB `known_for_department` magyarul; ismeretlen szakmánál az eredeti név. */
function personRole(department: string | undefined): string | undefined {
  if (!department) return undefined;
  return strings.search.departments[department as keyof typeof strings.search.departments] ?? department;
}

/**
 * A TMDB találatai app-típusra. A `search/multi` találatai `media_type`-ot hordoznak, a szűrt
 * végpontoké nem: ott a szűrő mondja meg a típust. A cím nélküli találatot eldobja.
 */
export function toSearchResults(hits: SearchHit[], filter: SearchFilter): SearchResult[] {
  return hits.flatMap((hit): SearchResult[] => {
    if ('profile_path' in hit) {
      return [
        {
          key: `person:${hit.id}`,
          id: hit.id,
          type: 'person',
          title: hit.name,
          imagePath: hit.profile_path,
          role: personRole(hit.known_for_department),
        },
      ];
    }
    const title = hit.title ?? hit.name;
    if (!title) return [];
    const type: MediaType =
      filter === 'films' ? 'movie' : filter === 'series' ? 'tv' : hit.media_type === 'tv' ? 'tv' : 'movie';
    return [
      {
        key: `${type}:${hit.id}`,
        id: hit.id,
        type,
        title,
        imagePath: hit.poster_path,
        year: (hit.release_date || hit.first_air_date)?.slice(0, 4) || undefined,
        date: hit.release_date || hit.first_air_date || undefined,
        rating: hit.vote_average,
      },
    ];
  });
}

/** A sor chipjei: módonként egy szolgáltató, előfizetésnél a saját előfizetésem előnyben (a design legfeljebb 3-at mutat). */
export function pickSearchChips(offers: WatchOffer[]): WatchOffer[] {
  return KINDS.flatMap((kind) => {
    const ofKind = offers.filter((offer) => offer.kind === kind);
    const pick = ofKind.find((offer) => offer.mine) ?? ofKind[0];
    return pick ? [pick] : [];
  });
}

/** Előfizetéssel nézhető valamelyik kiválasztott szolgáltatón. */
export function isOnMyServices(offers: WatchOffer[]): boolean {
  return offers.some((offer) => offer.kind === 'stream' && offer.mine);
}
