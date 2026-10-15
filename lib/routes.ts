import type { MediaType } from '@/types/tmdb';

/** Az Adatlap útvonala (`app/title/[type]/[id].tsx`). */
export function titleHref(type: MediaType, id: number) {
  return `/title/${type}/${id}` as const;
}
