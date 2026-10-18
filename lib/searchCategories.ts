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

/**
 * A kiválasztott kategóriák (D-056): tetszőleges számú műfaj, amelyek „és” kapcsolatban vannak
 * (a TMDB `with_genres` vesszővel), és legfeljebb egy téma (kulcsszó-csoport, a csoporton belül
 * „vagy”). Több téma „és” kapcsolata egy `discover` hívásban nem fejezhető ki, ezért egy téma van.
 */
export type CategorySelection = { genres: readonly SearchCategory[]; theme?: SearchCategory };

export const noSelection: CategorySelection = { genres: [] };

/** Téma = kulcsszavas kategória; a többi műfaj. */
export const isTheme = (category: SearchCategory) => category.keywords !== undefined;

export const isEmptySelection = (selection: CategorySelection) =>
  selection.genres.length === 0 && !selection.theme;

/** Stabil azonosító a kiválasztáshoz (sorrendtől független); üres kiválasztásnál üres szöveg. */
export function selectionKey(selection: CategorySelection): string {
  const keys = selection.genres.map((genre) => genre.key).sort();
  return selection.theme ? [...keys, selection.theme.key].join('+') : keys.join('+');
}

/**
 * A kiválasztás `discover` paraméterei az adott típusra; `undefined`, ha nincs kiválasztás, vagy
 * valamelyik műfajnak nincs megfelelője a típuson (pl. a romantikus műfaj a TV-ben): ekkor a
 * típusra nincs találat, mert a találatnak mindegyik kategóriára illeszkednie kell.
 */
export function selectionParams(
  selection: CategorySelection,
  type: MediaType,
): Record<string, string | number> | undefined {
  if (isEmptySelection(selection)) return undefined;
  const genreIds = new Set<number>();
  for (const genre of selection.genres) {
    const ids = type === 'movie' ? genre.movieGenres : genre.tvGenres;
    if (!ids) return undefined;
    ids.forEach((id) => genreIds.add(id));
  }
  return {
    sort_by: 'popularity.desc',
    // A kevés szavazatú, ismeretlen címek kiszűrésére.
    'vote_count.gte': 30,
    ...(selection.theme?.keywords ? { with_keywords: selection.theme.keywords.join('|') } : {}),
    ...(genreIds.size > 0 ? { with_genres: [...genreIds].join(',') } : {}),
    // A sorozatok között a talk show-k és a hírműsorok (Hír 10763, Talk 10767) népszerűségük miatt
    // elöl lennének pl. a „vígjáték” kategóriában; kategóriára nem ezeket keresi senki.
    ...(type === 'tv' ? { without_genres: '10763,10767' } : {}),
  };
}
