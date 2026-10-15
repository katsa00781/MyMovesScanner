// Böngészés műfaj chipek sorrendben (03, 11 design). A TMDB filmes és sorozatos műfaj-azonosítói
// eltérnek (pl. Sci-Fi: 878 / 10765), ezért típusonként külön; ahol az egyik típusnál nincs
// megfelelő műfaj (Thriller, Horror, Romantikus), ott csak filmet kérünk (D-041).
export type GenreKey =
  | 'all'
  | 'drama'
  | 'comedy'
  | 'thriller'
  | 'scifi'
  | 'action'
  | 'crime'
  | 'animation'
  | 'horror'
  | 'documentary'
  | 'family'
  | 'romance';

export type BrowseGenre = { key: GenreKey; movie?: number; tv?: number };

export const browseGenres: readonly BrowseGenre[] = [
  { key: 'all' },
  { key: 'drama', movie: 18, tv: 18 },
  { key: 'comedy', movie: 35, tv: 35 },
  { key: 'thriller', movie: 53 },
  { key: 'scifi', movie: 878, tv: 10765 },
  { key: 'action', movie: 28, tv: 10759 },
  { key: 'crime', movie: 80, tv: 80 },
  { key: 'animation', movie: 16, tv: 16 },
  { key: 'horror', movie: 27 },
  { key: 'documentary', movie: 99, tv: 99 },
  { key: 'family', movie: 10751, tv: 10751 },
  { key: 'romance', movie: 10749 },
];
