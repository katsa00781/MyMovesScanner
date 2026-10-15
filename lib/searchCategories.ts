import { searchCategories, type SearchCategory } from '@/data/searchCategories';
import type { MediaType } from '@/types/tmdb';

// Ékezet- és kisbetű-független összehasonlításhoz (ő, ű is: az NFD a kettős ékezetet is leválasztja).
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * A begépelt szövegre illeszkedő kategóriák, a lista sorrendjében. Egy szó illeszkedik, ha valamelyik
 * szótővel kezdődik („cápás”, „katasztrófafilm”), vagy gépelés közben a szótő az elejére illik
 * (legalább 4 betűtől: „katasz”).
 */
export function matchCategories(query: string): SearchCategory[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return searchCategories.filter((category) =>
    words.some((word) =>
      category.stems.some((stem) => word.startsWith(stem) || (word.length >= 4 && stem.startsWith(word))),
    ),
  );
}

/** A kategória `discover` paraméterei az adott típusra; `undefined`, ha a típusra nincs szűrője. */
export function categoryParams(
  category: SearchCategory,
  type: MediaType,
): Record<string, string | number> | undefined {
  const genres = type === 'movie' ? category.movieGenres : category.tvGenres;
  if (!category.keywords && !genres) return undefined;
  return {
    sort_by: 'popularity.desc',
    // A kevés szavazatú, ismeretlen címek kiszűrésére.
    'vote_count.gte': 30,
    ...(category.keywords ? { with_keywords: category.keywords.join('|') } : {}),
    ...(genres ? { with_genres: genres.join('|') } : {}),
  };
}
